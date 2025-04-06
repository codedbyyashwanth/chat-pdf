import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Printer,
  MoreVertical,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

const PDFViewer = ({ selectedFile }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(5); // Example value
  const [zoom, setZoom] = useState(100);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading
    if (selectedFile?.path) {
      setLoading(false);
    }
  }, [selectedFile]);

  const handleZoomIn = () => {
    setZoom(prevZoom => Math.min(prevZoom + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom(prevZoom => Math.max(prevZoom - 10, 50));
  };

  const goToNextPage = () => {
    if (currentPage < numPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Navigation bar - styled to match screenshot */}
      <div className="w-full flex items-center justify-between px-4 py-2 border-b">
        {/* Left side: Navigation */}
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrevPage}
            disabled={currentPage <= 1}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <span className="text-sm font-medium mx-2">
            {currentPage} / {numPages}
          </span>
          
          <Button
            variant="ghost"
            size="icon" 
            onClick={goToNextPage}
            disabled={currentPage >= numPages}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Center: Zoom */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
          >
            {zoom}%
          </Button>
        </div>

        {/* Right side: Actions */}
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
          >
            <Download className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
          >
            <Printer className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* PDF content area */}
      <div className="flex-1 bg-muted overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-muted-foreground">Loading PDF...</div>
          </div>
        ) : (
          <div className="flex justify-center p-4 min-h-full">
            {/* PDF content with dark/light mode support */}
            <div 
              className="bg-background shadow-md"
              style={{ 
                transform: `scale(${zoom/100})`, 
                transformOrigin: 'top center',
                maxWidth: '100%'
              }}
            >
              {/* PDF page mockup */}
              <div className="relative">
                <img 
                  src="/api/placeholder/800/1100" 
                  alt="PDF page" 
                  className="w-full h-auto"
                />
                {selectedFile && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-6 bg-background/80 rounded-md">
                      <p className="text-foreground">
                        {selectedFile.path || "Document name"}
                      </p>
                      <p className="text-muted-foreground text-sm mt-2">
                        Page {currentPage} of {numPages}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFViewer;