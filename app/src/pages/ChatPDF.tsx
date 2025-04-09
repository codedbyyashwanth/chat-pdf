// src/pages/ChatPDF.tsx
import React, { useState } from 'react';
import { 
  ResizableHandle, 
  ResizablePanel, 
  ResizablePanelGroup 
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChatUI } from '@/components/ChatUI';
import { FileText, FolderPlus, Plus, Settings } from 'lucide-react';
import PDFViewer from '@/components/pdfViewer';
import { ModeToggle } from '@/components/mode-toggle';

interface PDFFile {
  id: string;
  title: string;
  path: string;
}

export default function ChatPDF() {
  const [selectedFile, setSelectedFile] = useState<PDFFile | null>(null);
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([
    { id: '1', title: 'enrollment.pdf', path: '/pdfs/enrollment.pdf' },
    { id: '2', title: 'CV.pdf', path: '/pdfs/cv.pdf' },
    { id: '3', title: 'Khokhar et al. 2010 - Surface EMG pattern r...', path: '/pdfs/khokhar.pdf' },
  ]);

  const handleFileSelect = (file: PDFFile) => {
    setSelectedFile(file);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex items-center p-2 border-b flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-blue-500 text-white p-1 rounded">
            <FileText size={20} />
          </div>
          <a href="/" className="text-xl font-bold">
                Chat
                <span className="text-blue-500">PDF</span>
            </a>
        </div>
        <div className="ml-auto">
          <ModeToggle />
          <Button variant="ghost" size="icon">
            <Settings size={20} />
          </Button>
        </div>
      </div>

      <ResizablePanelGroup 
        direction="horizontal" 
        className="flex-1 h-[calc(100vh-2.5rem)] "
      >
        {/* First Column - PDF List */}
        <ResizablePanel defaultSize={20} minSize={15}>
          <div className="flex flex-col h-full border-r">
            <div className="p-2 border-b flex-shrink-0">
              <Button className="w-full justify-start" variant="outline">
                <Plus size={16} className="mr-2" /> New Chat
              </Button>
              
              <Button className="w-full justify-start mt-2" variant="outline">
                <FolderPlus size={16} className="mr-2" /> New Folder
              </Button>
            </div>
            
            <ScrollArea className="flex-1 h-0">
              <div className="p-2">
                {pdfFiles.map((file) => (
                  <div 
                    key={file.id}
                    className={`flex items-center p-2 rounded-md mb-1 cursor-pointer ${
                      selectedFile?.id === file.id 
                        ? 'bg-gray-800 text-white' 
                        : 'hover:bg-gray-700'
                    }`}
                    onClick={() => handleFileSelect(file)}
                  >
                    <FileText size={16} className="mr-2" />
                    <span className="truncate text-sm">{file.title}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="p-4 border-t flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="bg-purple-600 text-white p-1 rounded-full">
                  <span className="text-xs px-1">A</span>
                </div>
                <div className="text-sm">EN</div>
              </div>
              
              <Button className="w-full justify-start mt-4" variant="outline">
                <span className="mr-2">🎓</span> AI Scholar
              </Button>
              
              <Button className="w-full justify-start mt-2" variant="outline">
                <span className="mr-2">⏱️</span> Download Windows App
              </Button>
            </div>
          </div>
        </ResizablePanel>
        
        <ResizableHandle />
        
        {/* Second Column - PDF Viewer */}
        <ResizablePanel defaultSize={50}>
          <div className="flex flex-col h-full">
            <div className="flex items-center p-2 border-b flex-shrink-0">
              {selectedFile && (
                <>
                  <span className="text-sm">{selectedFile.title}</span>
                  <div className="ml-auto flex items-center gap-2">
                    <span className="text-xs text-gray-500">1 / 2</span>
                    <Button variant="ghost" size="sm">Chat</Button>
                  </div>
                </>
              )}
            </div>
            
            <div className="flex-1 bg-gray-100 flex items-center justify-center overflow-hidden">
              {selectedFile ? (
                <PDFViewer selectedFile={{ path: selectedFile.path }} />
              ) : (
                <PDFViewer selectedFile={{ path: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }} />
              )}
            </div>
          </div>
        </ResizablePanel>
        
        <ResizableHandle />
        
        {/* Third Column - Chat UI */}
        <ResizablePanel defaultSize={30}>
          <div className="h-full overflow-hidden">
            <ChatUI />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}