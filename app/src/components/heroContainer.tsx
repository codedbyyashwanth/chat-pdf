import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router';
import { convertPdfToText } from "@/services/pdf-text";

export function HeroSection() {
    const navigate = useNavigate();

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type === 'application/pdf') {
            try {
                const textData = await convertPdfToText(file);
                const data = {
                    text: textData,
                    fileName: file.name
                };
                navigate("/chat-pdf", { state: data });
            } catch (error) {
                console.error("Error processing PDF:", error);
                // Handle error appropriately
            }
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center px-4">
            <div className="flex max-w-3xl flex-col items-center text-center">
                {/* Main Title */}
                <h1 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Transform Your Documents with Ease
                </h1>

                {/* Description Paragraph */}
                <p className="mb-8 text-sm text-muted-foreground sm:text-base md:mb-12 md:text-lg">
                Securely upload your documents and experience seamless conversion in
                just a few clicks. Our platform supports multiple formats and ensures
                fast processing.
                </p>

                {/* Upload Button */}
                <div className="relative">
                <Button asChild size="lg" className="px-8 py-6 text-base">
                    <label htmlFor="file-upload" className="cursor-pointer">
                    Upload Document
                    <input
                        id="file-upload"
                        type="file"
                        className="sr-only"
                        onChange={handleFileUpload}
                        aria-labelledby="file-upload-label"
                    />
                    </label>
                </Button>
                </div>
            </div>
        </div>
    );
}