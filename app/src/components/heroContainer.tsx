import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router';

export function HeroSection() {
    const navigate = useNavigate();

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type === 'application/pdf') {
            const url = URL.createObjectURL(file);
            const dta = {
                link: url
            }
            navigate("/chat-pdf", {state: dta})
        // Handle file upload logic here
            // console.log("File selected:", files[0]);

            // pdfToText(files[0])
            //     .then(
            //         async (text) => {
            //             try {
            //                 const response = await fetch("http://localhost:3000/api/embeddings", {
            //                   method: "POST",
            //                   headers: {
            //                     "Content-Type": "application/json",
            //                   },
            //                   body: JSON.stringify({ text }),
            //                 });
                      
            //                 if (!response.ok) {
            //                   throw new Error(`HTTP error! status: ${response.status}`);
            //                 }
                      
            //                 const data = await response.json();
            //                 console.log(data)
            //               } catch (err: unknown) {
            //                 console.log(err)
            //               }
            //         })
            //     .catch((error) => console.error("Failed to extract text from pdf", error));
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