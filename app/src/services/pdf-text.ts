import pdfToText from "react-pdftotext";

export const convertPdfToText = async (file: File) => {
    try {
        
        // Extract text from PDF
        const text = await pdfToText(file);
        
        // If no text was extracted, throw an error
        if (!text || text.trim().length === 0) {
            throw new Error("No text content could be extracted from the PDF");
        }
        
        // Create a document ID based on the file name
        const documentId = file.name.replace(/\s+/g, '-').toLowerCase();
        
        // Store the text with the document ID
        const response = await fetch(`${import.meta.env.VITE_URL}/api/embeddings`, {
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
        
        return result;
    } catch (error) {
        console.error("Failed to process PDF:", error);
        throw error;
    }
};