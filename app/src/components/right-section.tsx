/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, AlertCircle, FileText } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

interface RightSectionProps {
  pdfData: any;
  className?: string;
  onSwitchToPdf?: () => void;
  isMobileView?: boolean;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const RightSection: React.FC<RightSectionProps> = ({ 
  pdfData, 
  className, 
  onSwitchToPdf,
  isMobileView 
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I can help answer questions about your PDF. What would you like to know?',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorAlert, setErrorAlert] = useState<string | null>(null);
  
  // Add ref for the container div inside ScrollArea
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      // Try to find the scrollable viewport inside the ScrollArea
      const scrollViewport = container.closest('[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      } else {
        // Fallback: try to scroll the container itself
        container.scrollTop = container.scrollHeight;
      }
    }
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (inputValue.trim() === '' || isLoading) return;
    setErrorAlert(null); // Clear any previous error
    
    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages([...messages, newMessage]);
    setInputValue('');
    setIsLoading(true);
    
    // Add loading message
    const loadingMessageId = (Date.now() + 1).toString();
    const loadingMessage: Message = {
      id: loadingMessageId,
      text: 'I\'m analyzing the PDF to find an answer to your question...',
      sender: 'ai',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, loadingMessage]);
    
    try {
      // Check if we have PDF data
      if (!pdfData) {
        throw new Error('No PDF has been uploaded yet.');
      }
      
      // Extract document ID from pdfData - check if it's an object with an id property or just a string
      const documentID = typeof pdfData === 'object' && pdfData.id ? pdfData.id : pdfData;
      console.log('Using document ID:', documentID);
      
      // Call the ask API with document ID
      const response = await fetch(`${import.meta.env.VITE_URL}/api/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          question: newMessage.text, 
          documentID: documentID
        }),
      });
      
      // Handle response
      if (response.status === 404) {
        // First, update the message
        setMessages(prev => 
          prev.map(msg => 
            msg.id === loadingMessageId
              ? {
                  ...msg,
                  id: (Date.now() + 2).toString(),
                  text: "Sorry, I couldn't find relevant information in the PDF to answer your question. Try asking something else.",
                  timestamp: new Date(),
                }
              : msg
          )
        );
        
        // Then set the error alert
        setErrorAlert('No relevant information found in the PDF. Try rephrasing your question or ask about a different topic.');
      } else if (!response.ok) {
        throw new Error(`Server error (${response.status}). Please try again later.`);
      } else {
        // Successful response
        const data = await response.json();
        
        // Replace the loading message with the actual response
        setMessages(prev => 
          prev.map(msg => 
            msg.id === loadingMessageId
              ? {
                  ...msg,
                  id: (Date.now() + 2).toString(),
                  text: data.answer,
                  timestamp: new Date(),
                }
              : msg
          )
        );
      }
    } catch (error) {
      console.error('Error asking question:', error);
      
      // Replace the loading message with an error message
      setMessages(prev => 
        prev.map(msg => 
          msg.id === loadingMessageId
            ? {
                ...msg,
                id: (Date.now() + 2).toString(),
                text: error instanceof Error 
                  ? `Sorry, ${error.message}` 
                  : 'Sorry, I encountered an error while trying to answer your question. Make sure you\'ve uploaded a PDF.',
                timestamp: new Date(),
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false); // Always unblock the input when done
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Show different message when no PDF is uploaded
  useEffect(() => {
    if (!pdfData && messages.length === 1 && messages[0].id === '1') {
      setMessages([{
        id: '1',
        text: 'Please upload a PDF first to start chatting!',
        sender: 'ai',
        timestamp: new Date(),
      }]);
    } else if (pdfData && messages.length === 1 && messages[0].text === 'Please upload a PDF first to start chatting!') {
      setMessages([{
        id: '1',
        text: `Great! Your PDF has been uploaded and processed. What would you like to know about it?`,
        sender: 'ai',
        timestamp: new Date(),
      }]);
    }
  }, [pdfData]);
  
  // Log pdfData for debugging
  useEffect(() => {
    if (pdfData) {
      console.log('PDF Data in right section:', pdfData);
    }
  }, [pdfData]);

  return (
    <section className={cn("flex flex-col bg-background", className)}>
      {/* Fixed Header */}
      <div className="border-b p-3 md:p-4 flex items-center justify-between">
        <div className="flex items-center">
          <h2 className="text-lg md:text-xl font-semibold text-foreground">Chat with PDF</h2>
          {pdfData && (
            <div className="ml-2 px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded-full">
              PDF Loaded
            </div>
          )}
        </div>
        
        {/* Mobile view PDF button */}
        {isMobileView && pdfData && (
          <Button 
            variant="outline" 
            size="sm" 
            className="mr-2 flex items-center gap-1"
            onClick={onSwitchToPdf}
          >
            <FileText className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">View PDF</span>
          </Button>
        )}
        
        {/* Error Alert - moved to header to not disrupt chat flow */}
        {errorAlert && (
          <div className="max-w-xs">
            <Alert variant="destructive" className="py-1 px-2 flex items-center gap-2 text-xs">
              <AlertCircle className="h-3 w-3 flex-shrink-0" />
              <AlertDescription className="text-xs truncate">{errorAlert}</AlertDescription>
            </Alert>
          </div>
        )}
      </div>
      
      {/* Scrollable Content Area */}
      <ScrollArea className="flex-grow py-3 md:py-4 px-3 md:px-4">
        <div className="space-y-3 md:space-y-4" ref={messagesContainerRef}>
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] md:max-w-[80%] p-2 md:p-3 rounded-lg ${
                  message.sender === 'user' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-muted text-foreground'
                }`}
              >
                <p className="text-sm md:text-base">{message.text}</p>
                <div className={`text-xs mt-1 ${
                  message.sender === 'user' 
                    ? 'text-purple-200' 
                    : 'text-muted-foreground'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      {/* Helpful suggestions */}
      {pdfData && !isLoading && messages.length > 1 && (
        <div className="px-3 md:px-4 py-2 border-t">
          <p className="text-xs text-muted-foreground mb-2">Try asking questions like:</p>
          <div className="flex flex-wrap gap-2">
            {["What is this document about?", "Summarize the main points", "Who is mentioned?"].map((suggestion) => (
              <Button 
                key={suggestion}
                variant="outline" 
                size="sm" 
                className="text-xs py-1 h-auto"
                onClick={() => {
                  setInputValue(suggestion);
                }}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      {/* Fixed Footer with Input */}
      <div className="border-t p-3 md:p-4">
        <div className="flex items-center gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={pdfData ? "Ask a question about your PDF..." : "Upload a PDF first to start asking questions"}
            className="flex-1 py-2 md:py-5 text-sm md:text-base"
            disabled={isLoading || !pdfData}
          />
          <Button 
            onClick={handleSendMessage} 
            size="icon" 
            className={`rounded-full h-8 w-8 md:h-10 md:w-10 ${
              isLoading || !pdfData
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
            disabled={isLoading || !pdfData}
          >
            <Send className="h-3 w-3 md:h-4 md:w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default RightSection;