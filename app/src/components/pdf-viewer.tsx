import React from 'react';
import { X, Download, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PDFViewerProps {
  file: File;
  onClose: () => void;
  isMobileView?: boolean;
  onSwitchToChat?: () => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ 
  file, 
  onClose, 
  isMobileView,
  onSwitchToChat
}) => {
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

  return (
    <div className="flex flex-col h-full w-full">
      {/* Custom header - Simple and clean */}
      <div className="flex items-center justify-between py-2 md:py-3 px-3 md:px-4 border-b bg-white dark:bg-gray-800">
        <div className="flex items-center gap-2 md:gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
            className="rounded-full h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
          <span className="font-medium text-xs md:text-sm truncate max-w-[150px] md:max-w-[250px]">{file.name}</span>
        </div>
        
        <div className="flex items-center gap-2">
          {isMobileView && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 rounded-full flex items-center gap-1 text-purple-600"
              onClick={onSwitchToChat}
            >
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline text-xs">Chat</span>
            </Button>
          )}
          
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs md:text-sm font-normal h-8">
            <Download className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Download</span>
          </Button>
        </div>
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
    </div>
  );
};

export default PDFViewer;