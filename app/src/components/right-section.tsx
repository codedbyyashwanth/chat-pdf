// components/right-section.tsx
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, PaperclipIcon } from 'lucide-react';

interface RightSectionProps {
  // You can add props here as needed
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const RightSection: React.FC<RightSectionProps> = () => {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I can help answer questions about your PDF. What would you like to know?',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = React.useState('');
  
  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages([...messages, newMessage]);
    setInputValue('');
    
    // Simulate AI response (would be replaced with actual logic)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'I\'m analyzing the PDF to find an answer to your question...',
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <section className="w-1/2 h-screen flex flex-col bg-background">
      {/* Fixed Header */}
      <div className="border-b p-4 flex items-center">
        <h2 className="text-xl font-semibold text-foreground">Chat with PDF</h2>
      </div>
      
      {/* Scrollable Content Area */}
      <ScrollArea className="flex-grow py-4 px-4">
        <div className="space-y-4">
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
      
      {/* Fixed Footer with Input */}
      <div className="border-t p-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="rounded-full">
            <PaperclipIcon className="h-4 w-4" />
          </Button>
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask a question about your PDF..."
            className="flex-1 py-5"
          />
          <Button 
            onClick={handleSendMessage} 
            size="icon" 
            className="rounded-full bg-purple-600 hover:bg-purple-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default RightSection;