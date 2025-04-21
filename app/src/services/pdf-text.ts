import pdfToText from "react-pdftotext";

export const convertPdfToText = async (file: File) => {
    try {
        console.log("Starting PDF extraction for file:", file.name);
        
        // Extract text from PDF
        const text = await pdfToText(file);
        console.log(`Extracted ${text.length} characters from PDF`);
        
        // If no text was extracted, throw an error
        if (!text || text.trim().length === 0) {
            throw new Error("No text content could be extracted from the PDF");
        }
        
        // Log a sample of the extracted text for debugging
        console.log("Sample text:", text.substring(0, 100));
        
        // Create a document ID based on the file name
        const documentId = file.name.replace(/\s+/g, '-').toLowerCase();
        
        // Store the text with the document ID
        const response = await fetch(`${import.meta.env.VITE_URL}/embeddings`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                text: text,
                chunkId: documentId
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("PDF successfully processed with ID:", result.id);
        
        return result;
    } catch (error) {
        console.error("Failed to process PDF:", error);
        throw error;
    }
};