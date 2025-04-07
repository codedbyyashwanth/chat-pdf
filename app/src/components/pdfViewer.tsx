import { useRef, useState, useEffect } from "react";
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Printer,
  MoreVertical,
  ZoomIn,
  ZoomOut,
  AlertCircle
} from 'lucide-react';
import { useTheme } from 'next-themes';

interface PdfViewerProps {
  selectedFile: {
    path: string;
    name?: string;
  } | null;
}

const PDFViewer = ({ selectedFile }: PdfViewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(5); // Default page count
  const { theme } = useTheme();
  
  // Reset error when file changes
  useEffect(() => {
    if (selectedFile?.path) {
      setError(null);
      setCurrentPage(1); // Reset to first page when file changes
    }
  }, [selectedFile]);

  // Apply custom styling to hide the toolbar in the iframe
  useEffect(() => {
    if (iframeRef.current) {
      const injectCSS = () => {
        try {
          const iframe = iframeRef.current;
          if (!iframe || !iframe.contentWindow || !iframe.contentDocument) return;
          
          // Create style element
          const style = iframe.contentDocument.createElement('style');
          style.textContent = `
            #toolbar { display: none !important; }
            #toolbarContainer { display: none !important; }
            #toolbarViewer { display: none !important; }
            .toolbar { display: none !important; }
            .outerContainer .visibleLargeView { display: none !important; }
            .findbar, .secondaryToolbar { display: none !important; }
            #viewerContainer { top: 0 !important; }
            #viewerContainer.toolbarVisible { top: 0 !important; }
          `;
          
          // Append style to iframe document
          iframe.contentDocument.head.appendChild(style);
        } catch (e) {
          console.error('Failed to inject CSS into iframe:', e);
        }
      };

      // Try to set the iframe's onload event
      iframeRef.current.onload = injectCSS;
      
      // Also try to inject CSS after a short timeout
      const timeoutId = setTimeout(injectCSS, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [selectedFile]);
  
  // Zoom functions
  const handleZoomIn = () => {
    setZoom(prevZoom => Math.min(prevZoom + 0.2, 3.0));
  };
  
  const handleZoomOut = () => {
    setZoom(prevZoom => Math.max(prevZoom - 0.2, 0.5));
  };
  
  // Download function
  const handleDownload = () => {
    if (selectedFile?.path) {
      window.open(selectedFile.path, '_blank');
    }
  };
  
  // Print function
  const handlePrint = () => {
    if (selectedFile?.path && iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.print();
    } else if (selectedFile?.path) {
      const printWindow = window.open(selectedFile.path, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    }
  };
  
  // Navigation functions 
  // (Note: These would need to be implemented with messaging to the iframe's PDF.js instance for full functionality)
  const nextPage = () => {
    if (currentPage < numPages) {
      setCurrentPage(currentPage + 1);
      
      // Try to navigate the PDF inside the iframe
      try {
        if (iframeRef.current && iframeRef.current.contentWindow) {
          const win = iframeRef.current.contentWindow as any;
          if (win.PDFViewerApplication) {
            win.PDFViewerApplication.page = currentPage + 1;
          }
        }
      } catch (e) {
        console.error('Failed to navigate PDF page:', e);
      }
    }
  };
  
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      
      // Try to navigate the PDF inside the iframe
      try {
        if (iframeRef.current && iframeRef.current.contentWindow) {
          const win = iframeRef.current.contentWindow as any;
          if (win.PDFViewerApplication) {
            win.PDFViewerApplication.page = currentPage - 1;
          }
        }
      } catch (e) {
        console.error('Failed to navigate PDF page:', e);
      }
    }
  };
  
  // Create a URL with parameters to hide UI elements
  const getPdfUrl = (url: string) => {
    try {
      const pdfUrl = new URL(url);
      // Add parameters to hide UI elements if viewing with PDF.js
      pdfUrl.hash = '#view=FitH&toolbar=0&navpanes=0&scrollbar=0';
      return pdfUrl.toString();
    } catch (e) {
      // If URL parsing fails, just return the original
      return `${url}#view=FitH&toolbar=0&navpanes=0&scrollbar=0`;
    }
  };
  
  // Error handling component
  const ErrorDisplay = () => (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto">
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading PDF</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
      
      <p className="text-sm text-muted-foreground mb-4 text-center">
        This is likely due to CORS restrictions or browser security settings when accessing PDFs.
      </p>
      
      <div className="flex space-x-2">
        <Button 
          onClick={() => window.open(selectedFile?.path, '_blank')} 
          variant="default"
        >
          Open in New Tab
        </Button>
      </div>
    </div>
  );
  
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
            disabled={currentPage <= 1 || !selectedFile?.path || !!error}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <span className="text-sm font-medium mx-2 text-foreground">
            {currentPage} / {numPages || 1}
          </span>
          
          <Button
            variant="ghost"
            size="icon" 
            onClick={nextPage}
            disabled={currentPage >= numPages || !selectedFile?.path || !!error}
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
            disabled={zoom <= 0.5 || !selectedFile?.path || !!error}
            className="h-8 w-8"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-foreground"
            disabled={!selectedFile?.path || !!error}
          >
            {Math.round(zoom * 100)}%
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomIn}
            disabled={zoom >= 3.0 || !selectedFile?.path || !!error}
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
            disabled={!selectedFile?.path}
            onClick={handleDownload}
          >
            <Download className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            disabled={!selectedFile?.path}
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
      <div 
        className="flex-1 bg-muted overflow-auto w-full p-4" 
        ref={containerRef}
        style={{ 
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'flex-start'
        }}
      >
        {!selectedFile?.path ? (
          <div className="flex items-center justify-center h-full w-full">
            <div className="text-muted-foreground">No PDF selected</div>
          </div>
        ) : error ? (
          <ErrorDisplay />
        ) : (
          <div
            style={{ 
              transform: `scale(${zoom})`, 
              transformOrigin: 'top center',
              transition: 'transform 0.2s ease-in-out',
              width: '100%',
              height: '100%',
              backgroundColor: theme === 'dark' ? '#2d333b' : 'white'
            }}
          >
            <iframe
              ref={iframeRef}
              src={getPdfUrl(selectedFile.path)}
              className="w-full h-full border-0"
              style={{ 
                minHeight: '80vh',
                backgroundColor: theme === 'dark' ? '#2d333b' : 'white'
              }}
              title="PDF Viewer"
              sandbox="allow-same-origin allow-scripts allow-forms"
              onError={(e) => {
                console.error('Iframe error:', e);
                setError("Failed to load PDF. Try opening in a new tab.");
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFViewer;