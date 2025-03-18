import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import getAiResponse from '../services/aiToolsService';
import chatbotIcon from '../assets/chatbot.png';

interface Message {
  text: string;
  isBot: boolean;
}

export function Chatbot() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "👋 Hi there! I'm your AI assistant. How can I help you today?", isBot: true }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message to chat
    setMessages(prev => [...prev, { text: inputMessage, isBot: false }]);
    const userMessage = `Please provide a concise and helpful response to: ${inputMessage}. Keep the response short and use markdown formatting where appropriate.`;
    setInputMessage('');
    setIsTyping(true);

    try {
      // Get AI response
      const response = await getAiResponse(userMessage);
      setMessages(prev => [...prev, {
        text: response,
        isBot: true
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        text: "Sorry, I encountered an error. Please try again.",
        isBot: true
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="text-white px-4 py-3 rounded-full shadow-lg  bg-[hsl(214_32%_85%)] transition-colors"
        >
          <img src={chatbotIcon} alt="Chat" className="w-8 h-10" />
        </button>
      )}

      {isChatOpen && (
        <div className="bg-white dark:bg-inherit rounded-xl shadow-2xl w-[450px] h-[580px] p-1 flex flex-col transform transition-all duration-300 ease-in-out">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-xl flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src={chatbotIcon} alt="Chat" className="w-6 h-8 text-white animate-pulse" />
                <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-400 rounded-full"></div>
              </div>
              <div>
                <h3 className="font-semibold text-lg">AI Assistant</h3>
                <p className="text-xs text-blue-100">Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="hover:bg-blue-700/50 p-2 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} items-end gap-2`}
              >
                {message.isBot && (
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                    <img src={chatbotIcon} alt="Bot" className="w-4 h-6 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.isBot
                      ? 'bg-white text-gray-800 shadow-sm dark:bg-gray-700 dark:text-white'
                      : 'bg-blue-600 text-white dark:bg-blue-700 dark:text-white'
                  } ${message.isBot ? 'rounded-bl-none' : 'rounded-br-none'}`}
                >
                  {message.isBot ? (
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown
                        components={{
                          p: ({children}) => <p className="m-0 text-gray-800 dark:text-white">{children}</p>,
                          a: ({href, children}) => (
                            <a href={href} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                              {children}
                            </a>
                          ),
                          ul: ({children}) => <ul className="list-disc list-inside my-1">{children}</ul>,
                          ol: ({children}) => <ol className="list-decimal list-inside my-1">{children}</ol>,
                          code: ({children}) => <code className="bg-gray-100 rounded px-1">{children}</code>
                        }}
                      >
                        {message.text}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    message.text
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-2 text-gray-500">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                  <img src={chatbotIcon} alt="Bot" className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white dark:bg-gray-700 p-3 rounded-2xl rounded-bl-none shadow-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 dark:border-gray-800 dark:bg-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-3 border dark:text-gray-900 border-gray-200 dark:border-gray-800 rounded-full focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="bg-blue-700 text-white dark:text-gray-900 p-3 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}