/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Upload, FileUp, File, Loader, AlertCircle, X, MessageSquare } from 'lucide-react';
import { ModeToggle } from './mode-toggle';
import PDFViewer from './pdf-viewer';
import { convertPdfToText } from '@/services/pdf-text';
import { Button } from '@/components/ui/button';

interface LeftSectionProps {
  pdfData: any;
  setPdfData: React.Dispatch<React.SetStateAction<any>>;
  className?: string;
  onSwitchToChat?: () => void;
  isMobileView?: boolean;
}

const LeftSection: React.FC<LeftSectionProps> = ({ 
  pdfData, 
  setPdfData, 
  className, 
  onSwitchToChat,
  isMobileView 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Unified function to process PDF files from both upload methods
  const processPdfFile = async (file: File) => {
    setUploadedFile(file);
    
    // Clear any previous errors
    setError(null);
    
    // Start loading state
    setIsLoading(true);
    
    try {
      // Convert PDF to text
      const result = await convertPdfToText(file);
      
      if (!result) {
        throw new Error("Failed to extract data from PDF");
      }
      
      setPdfData(result);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to process PDF");
      // Set uploaded file to null since processing failed
      setUploadedFile(null);
    } finally {
      // End loading state regardless of success or failure
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      processPdfFile(file);
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
      processPdfFile(file);
    }
  };

  return (
    <section className={cn("bg-background border-r relative", className)}>
      {/* Mobile chat button - only show when PDF is loaded */}
      {isMobileView && uploadedFile && pdfData && (
        <Button 
          className="absolute top-4 right-4 z-20 rounded-full bg-purple-600 hover:bg-purple-700 shadow-md"
          size="icon"
          onClick={onSwitchToChat}
        >
          <MessageSquare className="h-4 w-4" />
        </Button>
      )}
      
      {/* Loading overlay - shows when isLoading is true */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="flex flex-col items-center">
            <div className="animate-spin">
              <Loader className="h-12 w-12 text-purple-600" />
            </div>
            <p className="mt-4 text-lg font-medium">Extracting data to chat with PDF...</p>
          </div>
        </div>
      )}
      
      {/* Error popup - shows when there's an error */}
      {error && (
        <div className="absolute inset-x-0 top-4 flex justify-center z-20 px-4">
          <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg border border-red-200 dark:border-red-900 shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-5 duration-300">
            <div className="p-4 bg-red-50 dark:bg-red-950/50 border-b border-red-100 dark:border-red-900/50 flex items-start gap-3">
              <div className="bg-red-100 dark:bg-red-900/50 p-2 rounded-full flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-red-700 dark:text-red-400">Error Processing PDF</h3>
                <p className="text-red-600 dark:text-red-300 text-sm mt-1">{error}</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" 
                onClick={() => setError(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 flex flex-col gap-3">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                This could be due to network issues or the file may be corrupted.
              </p>
              <div className="flex gap-2 justify-end">
                <Button 
                  variant="default"
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-sm"
                  onClick={() => setError(null)}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {uploadedFile ? (
        <PDFViewer 
          file={uploadedFile} 
          onClose={() => {
            setUploadedFile(null);
            setPdfData(null); // Clear PDF data when closing viewer
          }} 
          isMobileView={isMobileView}
          onSwitchToChat={onSwitchToChat}
        />
      ) : (
        <div className="h-full flex flex-col justify-between p-4 md:p-6">
          {/* Main content area */}
          <div className="flex-1 flex flex-col items-center justify-center px-2 md:px-4">
            {/* PDF Chat Header */}
            <div className="text-center mb-6 md:mb-8">
              <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 tracking-tight">
                Chat with any <span className="bg-purple-600 text-white px-3 py-1 rounded-lg">PDF</span>
              </h1>
              <p className="text-base md:text-lg text-muted-foreground max-w-lg">
                Join millions of <span className="text-amber-500 font-medium">students, researchers and professionals</span> to instantly answer questions and understand research with AI
              </p>
            </div>
            
            {/* PDF Upload Area */}
            <div className="w-full max-w-xl mt-4 md:mt-6">
              <div 
                className={cn(
                  "border-2 border-dashed rounded-xl p-6 md:p-10 flex flex-col items-center justify-center bg-background/50 transition-all duration-200",
                  isDragging ? "border-purple-500 bg-purple-50 dark:bg-purple-950/20" : "border-purple-200 dark:border-purple-800/40"
                )}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="mb-4 relative">
                  <div className="w-12 h-16 md:w-16 md:h-20 bg-white dark:bg-gray-800 rounded-md border shadow-sm flex items-center justify-center">
                    <File className="h-6 w-6 md:h-8 md:w-8 text-purple-500" />
                    <div className="absolute -bottom-2 -right-2 bg-black text-white rounded-full p-1.5">
                      <Upload className="h-3 w-3 md:h-4 md:w-4" />
                    </div>
                  </div>
                </div>
                <p className="text-lg md:text-xl mb-4 md:mb-6 text-center font-medium">Click to upload, or drag PDF here</p>
                
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg px-6 md:px-8 py-2 md:py-3 flex items-center shadow-sm transition-colors">
                    <FileUp className="mr-2 h-4 w-4 md:h-5 md:w-5" />
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