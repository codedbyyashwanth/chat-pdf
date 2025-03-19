import pdfToText from "react-pdftotext";

export const convertPdfToText = (file: File) => {
    return pdfToText(file)
        .then(async (text) => {
            try {
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

                const data = await response.json();
                return data; // Return the data here
            } catch (err) {
                console.error(err);
                throw err; // Re-throw the error to handle it outside
            }
        })
        .catch((error) => {
            console.error("Failed to extract text from pdf", error);
            throw error; // Re-throw the error to handle it outside
        });
};