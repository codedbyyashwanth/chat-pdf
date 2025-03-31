import { useLocation } from "react-router";

type TextData = {
    success: boolean;
    id: string;
    text: string;
};

type Params = {
    text: TextData;
    fileName: string;
};

const ChatPDF = () => {
    const location = useLocation();
    const values = location.state as Params;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 text-foreground">File: {values.fileName}</h1>
            <div className="bg-card text-card-foreground rounded-lg shadow p-4 border">
                <h2 className="text-xl font-semibold mb-2 text-foreground">Extracted Text:</h2>
                <div className="whitespace-pre-wrap text-foreground/90">
                    {values.text.text}
                </div>
            </div>
        </div>
    );
};

export default ChatPDF;