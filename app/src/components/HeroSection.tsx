import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export const HeroContainer = () => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        // Handle file upload logic here
        console.log(acceptedFiles);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
        "application/pdf": [".pdf"],
        },
    });

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] py-12 px-4">
            <div className="max-w-2xl mx-auto text-center space-y-6">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Chat with any <span className="text-blue-500">PDF</span>
                </h1>
                <p className="text-xl text-muted-foreground">
                Join millions of students, researchers and professionals to instantly
                answer questions and understand research with AI
                </p>

                <Card
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 cursor-pointer transition-colors
                    ${
                    isDragActive
                        ? "border-primary bg-primary/10"
                        : "hover:border-primary/30"
                    }`}
                >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-4">
                    <FileText className="h-10 w-10 text-muted-foreground" />
                    <div className="text-center">
                    <Button variant="ghost" className="text-md">
                        Click to upload
                    </Button>
                    <span className="text-muted-foreground">, or drag PDF here</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                    PDF files up to 10MB
                    </p>
                </div>
                </Card>
            </div>
        </div>
    );
};