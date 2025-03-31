import pdfToText from "react-pdftotext";

export const convertPdfToText = async (file: File) => {
    try {
        const text = await pdfToText(file);
        const response = await fetch("http://localhost:3000/api/embeddings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to process PDF:", error);
        throw error;
    }
};