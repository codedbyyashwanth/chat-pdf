import express from 'express';
import bodyParser from 'body-parser';
import { config } from 'dotenv';
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import cors from "cors";


config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

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
        const { text } = req.body;
        
        // Generate OpenAI embedding
        const embedding = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: text,
        });
        
        // Store in Pinecone
        const vectorData = {
            id: Date.now().toString(),
            values: embedding.data[0].embedding,
            metadata: { text }
        };
        
        await pineconeIndex.upsert([vectorData]);
        
        res.status(201).json({
            success: true,
            id: vectorData.id
        });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Question answering endpoint
app.post('/api/ask', async (req, res) => {
    try {
        const { question } = req.body;

        if (!question || typeof question !== 'string') {
            return res.status(400).json({ error: "Valid question string is required" });
        }

        // Generate question embedding
        const questionEmbedding = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: question,
        });

        // Query Pinecone for similar vectors
        const queryResult = await pineconeIndex.query({
            vector: questionEmbedding.data[0].embedding,
            topK: 5,
            includeMetadata: true,
        });

        // Extract and format context
        const context = queryResult.matches
            .filter(match => match.score >= 0.3) // Filter by confidence score
            .map(match => match.metadata.text)
            .join('\n\n');

        if (!context) {
            return res.status(404).json({ 
                error: "No relevant context found",
                question
            });
        }

        // Generate answer using OpenAI
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{
                role: "system",
                content: `Answer the question with atleast 1 sentence or maximum of 2 sentences. 
                Context: ${context}`
            }, {
                role: "user",
                content: question
            }],
            temperature: 0.7,
            max_tokens: 500
        });

        res.json({
            question,
            answer: completion.choices[0].message.content
        });

    } catch (error) {
        console.error('Error in /api/ask:', error);
        res.status(500).json({ 
            error: "Failed to process question",
            details: error.message 
        });
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});