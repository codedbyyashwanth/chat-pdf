import { useRef, useState, useEffect } from "react";
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
import { useTheme } from 'next-themes';

interface PdfViewerProps {
  selectedFile: {
    path: string;
    name?: string;
  } | null;
}

const PDFViewer = ({ selectedFile }: PdfViewerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  
  // Handle file loading
  useEffect(() => {
    if (!selectedFile?.path) {
      setNumPages(0);
      return;
    }
    
    setLoading(true);
    setCurrentPage(1);
    
    // Reset loading state when iframe loads
    const handleIframeLoad = () => {
      setLoading(false);
      // In a real implementation, you might try to get numPages
      // but it's difficult without a PDF library
      setNumPages(1);
    };
    
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener("load", handleIframeLoad);
      return () => {
        iframe.removeEventListener("load", handleIframeLoad);
      };
    }
  }, [selectedFile]);

  // Basic navigation functions (limited without PDF.js)
  const nextPage = () => {
    // Note: In iframe mode, these don't actually change pages
    // Would need scripting inside iframe or a PDF library
    if (currentPage < numPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  // Zoom functions
  const handleZoomIn = () => {
    setZoom(prevZoom => Math.min(prevZoom + 0.2, 3.0));
  };
  
  const handleZoomOut = () => {
    setZoom(prevZoom => Math.max(prevZoom - 0.2, 0.5));
  };
  
  // Download and print functions
  const handleDownload = () => {
    if (selectedFile?.path) {
      const link = document.createElement('a');
      link.href = selectedFile.path;
      link.download = selectedFile.name || 'download.pdf';
      link.click();
    }
  };
  
  const handlePrint = () => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.print();
    }
  };
  
  return (
    <div className="flex flex-col h-full w-full">
      {/* Navigation bar */}
      <div className="w-full flex items-center justify-between px-4 py-2 border-b bg-background">
        {/* Left side: Navigation */}
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={prevPage}
            disabled={currentPage <= 1 || loading || !selectedFile?.path}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <span className="text-sm font-medium mx-2 text-foreground">
            {currentPage} / {numPages || '-'}
          </span>
          
          <Button
            variant="ghost"
            size="icon" 
            onClick={nextPage}
            disabled={currentPage >= numPages || loading || !selectedFile?.path}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Center: Zoom */}
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomOut}
            disabled={zoom <= 0.5 || loading || !selectedFile?.path}
            className="h-8 w-8"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-foreground"
            disabled={loading || !selectedFile?.path}
          >
            {Math.round(zoom * 100)}%
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomIn}
            disabled={zoom >= 3.0 || loading || !selectedFile?.path}
            className="h-8 w-8"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>

        {/* Right side: Actions */}
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            disabled={loading || !selectedFile?.path}
            onClick={handleDownload}
          >
            <Download className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            disabled={loading || !selectedFile?.path}
            onClick={handlePrint}
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
      <div className="flex-1 bg-muted overflow-auto w-full p-4" ref={containerRef}>
        <div className="flex justify-center min-h-full">
          {!selectedFile?.path ? (
            <div className="flex items-center justify-center h-full w-full">
              <div className="text-muted-foreground">No PDF selected</div>
            </div>
          ) : (
            <div 
              className="shadow-md bg-background" 
              style={{ 
                transform: `scale(${zoom})`, 
                transformOrigin: 'top center',
                transition: 'transform 0.2s ease-in-out',
                height: 'auto',
                width: '100%',
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                  <div className="text-muted-foreground">Loading PDF...</div>
                </div>
              )}
              <iframe
                ref={iframeRef}
                src={selectedFile?.path}
                className="border-none w-full"
                style={{ 
                  minHeight: '80vh',
                  backgroundColor: theme === 'dark' ? '#2d333b' : 'white'
                }}
                title="PDF Viewer"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;