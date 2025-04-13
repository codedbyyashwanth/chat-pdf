// components/pdf-viewer.tsx
import React, { useState } from 'react';
import { X, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PDFViewerProps {
  file: File;
  onClose: () => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ file, onClose }) => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(10); // Default to 10 pages
  
  // Create a URL for the file
  const fileUrl = React.useMemo(() => {
    // Add parameters to hide toolbar across different browsers
    return URL.createObjectURL(file) + '#toolbar=0&navpanes=0&scrollbar=0';
  }, [file]);
  
  // Cleanup URL when component unmounts
  React.useEffect(() => {
    return () => {
      URL.revokeObjectURL(fileUrl.split('#')[0]);
    };
  }, [fileUrl]);

//   const handleNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const handlePrevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Custom header - Simple and clean */}
      <div className="flex items-center justify-between py-3 px-4 border-b bg-white dark:bg-gray-800">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
            className="rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
          <span className="font-medium text-sm">{file.name}</span>
        </div>
        <Button variant="ghost" size="sm" className="gap-1.5 text-sm font-normal">
          <Download className="h-4 w-4" />
          Download
        </Button>
      </div>
      
      {/* PDF Display - Full size */}
      <div className="flex-1 relative bg-gray-100 dark:bg-gray-900 overflow-hidden">
        <style>{`
          /* CSS to hide PDF viewer UI elements */
          iframe {
            border: none;
          }
          
          /* Target common PDF viewer toolbar selectors */
          iframe::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 40px; /* Approximate height of most PDF toolbars */
            background: transparent;
            z-index: 9999;
            pointer-events: none;
          }
        `}</style>
        <iframe
          src={fileUrl}
          className="absolute inset-0 w-full h-full"
          title="PDF Viewer"
          allowFullScreen={true}
        />
      </div>
      
      {/* Custom footer with page controls */}
      {/* <div className="flex items-center justify-center py-2 px-4 border-t bg-white dark:bg-gray-800">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="mx-3 text-sm">
            Page {currentPage} of {totalPages}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div> */}
    </div>
  );
};

export default PDFViewer;