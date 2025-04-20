// SplitLayout.tsx
import React, { useState } from 'react';
import LeftSection from './left-section';
import RightSection from './right-section';

// Define Message interface (moved from right-section.tsx)
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface SplitLayoutProps {
  // You can add props here as needed
}

const SplitLayout: React.FC<SplitLayoutProps> = () => {
  // Lifted state from left-section.tsx to be shared
  const [pdfData, setPdfData] = useState<any>(null); // Store PDF text data
  
  // Lifted messages state from right-section.tsx
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I can help answer questions about your PDF. What would you like to know?',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);

  // Function to reset chat when PDF is closed
  const resetChat = () => {
    setMessages([{
      id: '1',
      text: 'Please upload a PDF first to start chatting!',
      sender: 'ai',
      timestamp: new Date(),
    }]);
  };

  return (
    <div className="flex w-full h-screen">
      <LeftSection 
        pdfData={pdfData} 
        setPdfData={setPdfData}
        resetChat={resetChat} 
      />
      <RightSection 
        pdfData={pdfData} 
        messages={messages}
        setMessages={setMessages}
      />
    </div>
  );
};

export default SplitLayout;