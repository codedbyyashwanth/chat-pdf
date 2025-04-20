// components/right-section.tsx
import React, { useState, useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, PaperclipIcon, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Message } from './SplitLayout'; // Import from SplitLayout

interface RightSectionProps {
  pdfData: any;
  messages: Message[]; // Now passed as a prop
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>; // Function to update messages
}

const RightSection: React.FC<RightSectionProps> = ({ pdfData, messages, setMessages }) => {
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
      const response = await fetch('http://localhost:3000/api/ask', {
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

  // Update welcome message based on PDF state
  useEffect(() => {
    if (!pdfData && messages.length === 1 && messages[0].id === '1' && 
        messages[0].text !== 'Please upload a PDF first to start chatting!') {
      setMessages([{
        id: '1',
        text: 'Please upload a PDF first to start chatting!',
        sender: 'ai',
        timestamp: new Date(),
      }]);
    } else if (pdfData && messages.length === 1 && 
               messages[0].text === 'Please upload a PDF first to start chatting!') {
      setMessages([{
        id: '1',
        text: `Great! Your PDF has been uploaded and processed. What would you like to know about it?`,
        sender: 'ai',
        timestamp: new Date(),
      }]);
    }
  }, [pdfData, messages, setMessages]);
  
  // Log pdfData for debugging
  useEffect(() => {
    if (pdfData) {
      console.log('PDF Data in right section:', pdfData);
    }
  }, [pdfData]);

  return (
    <section className="w-1/2 h-screen flex flex-col bg-background">
      {/* Fixed Header */}
      <div className="border-b p-4 flex items-center justify-between">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold text-foreground">Chat with PDF</h2>
          {pdfData && (
            <div className="ml-2 px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded-full">
              PDF Loaded
            </div>
          )}
        </div>
        
        {/* Error Alert - moved to header to not disrupt chat flow */}
        {errorAlert && (
          <div className="max-w-xs">
            <Alert variant="destructive" className="py-1 px-2 flex items-center gap-2 text-xs">
              <AlertCircle className="h-3 w-3 flex-shrink-0" />
              <AlertDescription className="text-xs">{errorAlert}</AlertDescription>
            </Alert>
          </div>
        )}
      </div>
      
      {/* Scrollable Content Area */}
      <ScrollArea className="flex-grow py-4 px-4">
        <div className="space-y-4" ref={messagesContainerRef}>
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.sender === 'user' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-muted text-foreground'
                }`}
              >
                <p>{message.text}</p>
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
        <div className="px-4 py-2 border-t">
          <p className="text-xs text-muted-foreground mb-2">Try asking questions like:</p>
          <div className="flex flex-wrap gap-2">
            {["What is this document about?", "Summarize the main points", "Who is mentioned in this document?"].map((suggestion) => (
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
      <div className="border-t p-4">
        <div className="flex items-center gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={pdfData ? "Ask a question about your PDF..." : "Upload a PDF first to start asking questions"}
            className="flex-1 py-5"
            disabled={isLoading || !pdfData}
          />
          <Button 
            onClick={handleSendMessage} 
            size="icon" 
            className={`rounded-full ${
              isLoading || !pdfData
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-purple-600 hover:bg-purple-700 dark:text-white'
            }`}
            disabled={isLoading || !pdfData}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default RightSection;