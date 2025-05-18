import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { FiSend, FiRefreshCw } from 'react-icons/fi';
import Message from './Message';
import ArticleCard from './ArticleCard';
import AIAnalysis from './AIAnalysis';
import NewsletterSubscription from './NewsletterSubscription';

// API URL - replace with your FastAPI endpoint
const API_URL = 'http://localhost:8000';

const ChatbotContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: 0 auto;
  height: 70vh;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: white;
  overflow: hidden;
`;

const ChatHeader = styled.div`
  background-color: #0078d7;
  color: white;
  padding: 15px;
  text-align: center;
  font-weight: bold;
  font-size: 1.2rem;
`;

const ChatMessages = styled.div`
  padding: 15px;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ChatInputContainer = styled.div`
  display: flex;
  padding: 15px;
  border-top: 1px solid #e0e0e0;
  background-color: #f9f9f9;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: #0078d7;
  }
`;

const SendButton = styled.button`
  background-color: #0078d7;
  color: white;
  border: none;
  border-radius: 4px;
  margin-left: 10px;
  padding: 0 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  &:hover {
    background-color: #0066b8;
  }
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: "Hello! I'm your news assistant. How can I help you today?",
      articles: []
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // New state to track if we should show the subscription prompt
  const [showSubscription, setShowSubscription] = useState(false);

  // Scroll to bottom of chat when new messages are added
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSendMessage = async () => {
    if (input.trim() === '') return;
    
    // Add user message
    const userMessage = { type: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    
    // Clear input and show loading indicator
    setInput('');
    setIsLoading(true);
    
    try {
      // Add loading message
      setMessages(prev => [...prev, { type: 'bot', content: 'Searching for news...', isLoading: true }]);
      
      // Call API with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      try {
        const response = await axios.post(`${API_URL}/chat`, {
          query: userMessage.content
        }, {
          signal: controller.signal,
          timeout: 10000
        });
        
        clearTimeout(timeoutId);
        
        // Remove loading message and add actual response
        setMessages(prev => {
          const filtered = prev.filter(msg => !msg.isLoading);
          return [...filtered, {
            type: 'bot',
            content: response.data.answer,
            articles: response.data.articles,
            userQuery: userMessage.content // Save the user query for AI analysis
          }];
        });
        
        // After the second successful query, show subscription
        // Count the number of non-loading bot messages to determine when to show subscription
        const botMessagesCount = messages.filter(msg => 
          msg.type === 'bot' && !msg.isLoading && msg.articles && msg.articles.length > 0
        ).length;
        
        if (botMessagesCount === 1 && !showSubscription) {
          setShowSubscription(true);
        }
      } catch (err) {
        clearTimeout(timeoutId);
        throw err;
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      
      // Determine the error message based on error type
      let errorMessage = "I'm sorry, I couldn't find any news right now. Please try again later.";
      
      if (error.name === 'AbortError' || error.code === 'ECONNABORTED' || error.message.includes('Network Error')) {
        errorMessage = "I couldn't connect to the news service. Please check your internet connection or try again later.";
      } else if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorMessage = `Error ${error.response.status}: ${error.response.data.detail || 'Something went wrong'}`;
      }
      
      // Remove loading message and add error message
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isLoading);
        return [...filtered, {
          type: 'bot',
          content: errorMessage,
          error: true
        }];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <ChatbotContainer>
      <ChatHeader>News Assistant</ChatHeader>
      <ChatMessages>
        {messages.map((msg, index) => (
          <div key={index}>
            <Message message={msg} />
            {msg.articles && msg.articles.length > 0 && (
              <>
                <div style={{ marginTop: '10px' }}>
                  {msg.articles.map((article, i) => (
                    <ArticleCard key={i} article={article} />
                  ))}
                </div>
                <AIAnalysis articles={msg.articles} userQuery={msg.userQuery} />
              </>
            )}
            
            {/* Show subscription form after the second successful query */}
            {showSubscription && index === messages.length - 1 && msg.type === 'bot' && msg.articles && msg.articles.length > 0 && (
              <NewsletterSubscription />
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </ChatMessages>
      <ChatInputContainer>
        <ChatInput
          type="text"
          placeholder="Ask me about news..."
          value={input}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        <SendButton onClick={handleSendMessage} disabled={isLoading || input.trim() === ''}>
          {isLoading ? <FiRefreshCw className="spin" /> : <FiSend />}
        </SendButton>
      </ChatInputContainer>
    </ChatbotContainer>
  );
};

export default Chatbot; 