// components/left-section.tsx
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Upload, FileUp, File } from 'lucide-react';
import { ModeToggle } from './mode-toggle';
import PDFViewer from './pdf-viewer';

interface LeftSectionProps {
  // You can add props here as needed
}

const LeftSection: React.FC<LeftSectionProps> = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setUploadedFile(file);
      console.log("File uploaded:", file.name);
      // Process the PDF file
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "application/pdf") {
      setUploadedFile(file);
      console.log("File dropped:", file.name);
      // Process the PDF file
    }
  };

  return (
    <section className="w-1/2 h-screen bg-background border-r">
      {uploadedFile ? (
        <PDFViewer file={uploadedFile} onClose={() => setUploadedFile(null)} />
      ) : (
        <div className="h-full flex flex-col justify-between p-6">
          {/* Main content area */}
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            {/* PDF Chat Header */}
            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold mb-4 tracking-tight">
                Chat with any <span className="bg-purple-600 text-white px-3 py-1 rounded-lg">PDF</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                Join millions of <span className="text-amber-500 font-medium">students, researchers and professionals</span> to instantly answer questions and understand research with AI
              </p>
            </div>
            
            {/* PDF Upload Area */}
            <div className="w-full max-w-xl mt-6">
              <div 
                className={cn(
                  "border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center bg-background/50 transition-all duration-200",
                  isDragging ? "border-purple-500 bg-purple-50 dark:bg-purple-950/20" : "border-purple-200 dark:border-purple-800/40"
                )}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="mb-4 relative">
                  <div className="w-16 h-20 bg-white dark:bg-gray-800 rounded-md border shadow-sm flex items-center justify-center">
                    <File className="h-8 w-8 text-purple-500" />
                    <div className="absolute -bottom-2 -right-2 bg-black text-white rounded-full p-1.5">
                      <Upload className="h-4 w-4" />
                    </div>
                  </div>
                </div>
                <p className="text-xl mb-6 text-center font-medium">Click to upload, or drag PDF here</p>
                
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg px-8 py-3 flex items-center shadow-sm transition-colors">
                    <FileUp className="mr-2 h-5 w-5" />
                    Upload PDF
                  </div>
                  <input 
                    id="file-upload" 
                    type="file" 
                    className="hidden" 
                    accept="application/pdf" 
                    onChange={handleFileUpload} 
                  />
                </label>
              </div>
            </div>
          </div>
          
          {/* Mode toggle at bottom */}
          <div className="flex justify-end mt-4">
            <ModeToggle />
          </div>
        </div>
      )}
    </section>
  );
};

export default LeftSection;