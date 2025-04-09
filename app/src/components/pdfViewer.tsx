import React from 'react';

interface PDFViewerProps {
  selectedFile: {
    path: string;
    name?: string;
  } | null;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ selectedFile }) => {
  if (!selectedFile?.path) {
    return (
      <div className="flex items-center justify-center h-full w-full p-4">
        <p className="text-muted-foreground">No PDF selected</p>
      </div>
    );
  }

  // Encode the PDF URL to ensure it works with Google Docs viewer
  const encodedUrl = encodeURIComponent(selectedFile.path);
  const googleDocsViewerUrl = `https://docs.google.com/viewer?url=${encodedUrl}&embedded=true`;

  return (
    <div className="w-full h-full">
      <iframe
        src={googleDocsViewerUrl}
        className="w-full h-full border-none"
        style={{ height: "100%" }}
        title={selectedFile.name || "PDF Document"}
        allowFullScreen
      />
    </div>
  );
};

export default PDFViewer;