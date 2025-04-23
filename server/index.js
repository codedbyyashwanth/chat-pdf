import express from 'express';
import bodyParser from 'body-parser';
import { config } from 'dotenv';
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import cors from "cors";


config();

const app = express();
// app.use(cors());
app.use(cors({
    origin: ['http://localhost:5173', 'https://your-production-frontend-domain.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
app.use(bodyParser.json({ limit: '50mb' })); // Increased limit for larger PDFs

// Initialize clients
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

const indexName = 'text-embeddings';
let pineconeIndex;

async function initializePinecone() {
    try {
        const indexList = await pinecone.listIndexes();
        const existingIndexes = indexList.indexes?.map(i => i.name) || [];

        if (!existingIndexes.includes(indexName)) {
            await pinecone.createIndex({
                name: indexName,
                dimension: 1536,
                metric: 'cosine',
                spec: {
                    serverless: {
                        cloud: 'aws',
                        region: 'us-east-1'
                    }
                }
            });

            console.log('Waiting for index initialization...');
            await new Promise(resolve => setTimeout(resolve, 30000));
        }

        pineconeIndex = pinecone.Index(indexName);
        console.log('Index ready');
        
    } catch (error) {
        console.error('Pinecone error:', error);
        process.exit(1);
    }
}

initializePinecone();

// Embedding endpoint
app.post('/api/embeddings', async (req, res) => {
    try {
        const { text, chunkId } = req.body;
        
        if (!text) {
            return res.status(400).json({ error: "Text content is required" });
        }
        
        console.log(`Processing text chunk (${text.length} chars)${chunkId ? ` with ID ${chunkId}` : ''}`);
        
        // Generate OpenAI embedding
        const embedding = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: text,
        });
        
        // Generate a unique ID or use the provided chunkId
        const id = chunkId || Date.now().toString();
        
        // Store in Pinecone
        const vectorData = {
            id: id,
            values: embedding.data[0].embedding,
            metadata: { text }
        };
        
        await pineconeIndex.upsert([vectorData]);
        console.log(`Successfully stored embedding with ID: ${id}`);
        
        res.status(201).json({
            success: true,
            id: id,
            text: text.length > 100 ? text.substring(0, 100) + '...' : text
        });
        
    } catch (error) {
        console.error('Error in /api/embeddings:', error);
        res.status(500).json({ error: error.message });
    }
});

// Question answering endpoint
app.post('/api/ask', async (req, res) => {
    try {
        const { question, documentID } = req.body;

        console.log(`Received question: "${question}" for document ID: ${documentID}`);

        if (!question || typeof question !== 'string') {
            return res.status(400).json({ error: "Valid question string is required" });
        }

        if (!documentID) {
            return res.status(400).json({ error: "Document ID is required" });
        }

        // Generate question embedding
        const questionEmbedding = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: question,
        });

        console.log("Generated embedding for question");

        // Query Pinecone for similar vectors - don't filter by ID initially to debug
        const queryResult = await pineconeIndex.query({
            vector: questionEmbedding.data[0].embedding,
            // Remove the filter to see if there are any documents at all
            topK: 5, // Increased from 1 to 5 to get more context
            includeMetadata: true,
        });

        console.log(`Query results without ID filter: ${queryResult.matches.length} matches`);
        
        // List all available documents for debugging
        if (queryResult.matches.length > 0) {
            console.log("Available documents:");
            queryResult.matches.forEach((match, i) => {
                console.log(`${i+1}. ID: ${match.id}, Score: ${match.score}`);
            });
            
            // Now try to find the exact document ID
            const exactMatch = queryResult.matches.find(match => match.id === documentID);
            if (exactMatch) {
                console.log(`Found exact match for document ID: ${documentID}`);
                
                // Generate answer using OpenAI
                const completion = await openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [{
                        role: "system",
                        content: `You are a precise, context-driven assistant. 
                        - You must answer using only the provided “Context” block—do not draw on any outside knowledge. 
                        - If the user's question uses different wording than the context, mentally paraphrase or expand synonyms to find the matching passage. 
                        - If the answer cannot be found in the context, reply: “I'm sorry, I don't know.” 
                        - Keep your answer as concise as possible.
                        
                        Context: ${exactMatch.metadata.text}`
                    }, {
                        role: "user",
                        content: question
                    }],
                    temperature: 0.7,
                    max_tokens: 500
                });

                return res.json({
                    question,
                    answer: completion.choices[0].message.content
                });
            } else {
                console.log(`Document ID ${documentID} not found in available documents`);
                
                // Try the best match regardless of ID
                const bestMatch = queryResult.matches[0];
                if (bestMatch.score >= 0.5) { // Only use if it's a good match
                    console.log(`Using best available match (score: ${bestMatch.score})`);
                    
                    const completion = await openai.chat.completions.create({
                        model: "gpt-3.5-turbo",
                        messages: [{
                            role: "system",
                            content: `Answer the question based on the provided context. Keep your answer concise.
                            
                            Context: ${bestMatch.metadata.text}`
                        }, {
                            role: "user",
                            content: question
                        }],
                        temperature: 0.7,
                        max_tokens: 500
                    });

                    return res.json({
                        question,
                        answer: completion.choices[0].message.content
                    });
                }
            }
        }

        // If we reach here, no suitable matches were found
        return res.status(404).json({ 
            error: "No relevant context found",
            question
        });

    } catch (error) {
        console.error('Error in /api/ask:', error);
        res.status(500).json({ 
            error: "Failed to process question",
            details: error.message 
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});