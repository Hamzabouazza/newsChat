import React, { useState } from 'react';
import styled from 'styled-components';
import { FiMail, FiCheck, FiX } from 'react-icons/fi';
import axios from 'axios';

// API URL - same as used in Chatbot component
const API_URL = 'http://localhost:8000';

const SubscriptionContainer = styled.div`
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  margin: 15px 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SubscriptionHeader = styled.h3`
  font-size: 1rem;
  margin: 0 0 10px 0;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SubscriptionForm = styled.form`
  display: flex;
  gap: 10px;
`;

const EmailInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: #0078d7;
  }
`;

const SubscribeButton = styled.button`
  background-color: #0078d7;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 15px;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 5px;
  
  &:hover {
    background-color: #0066b8;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ConfirmationMessage = styled.div`
  margin-top: 10px;
  font-size: 0.9rem;
  color: ${props => props.$isError ? '#d32f2f' : '#2e7d32'};
  display: flex;
  align-items: center;
  gap: 5px;
`;

const NewsletterSubscription = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset states
    setError(null);
    setSubscribed(false);
    
    // Validate email
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    
    try {
      // Call the backend API to subscribe
      const response = await axios.post(`${API_URL}/subscribe`, { email });
      
      if (response.data.success) {
        setSubscribed(true);
        setEmail('');
      } else {
        throw new Error(response.data.message || 'Subscription failed');
      }
    } catch (err) {
      console.error('Subscription error:', err);
      setError(err.response?.data?.detail || 'Failed to subscribe. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SubscriptionContainer>
      <SubscriptionHeader>
        <FiMail /> Stay updated with our news digest
      </SubscriptionHeader>
      
      {!subscribed ? (
        <>
          <SubscriptionForm onSubmit={handleSubmit}>
            <EmailInput 
              type="email" 
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <SubscribeButton type="submit" disabled={loading}>
              {loading ? 'Subscribing...' : 'Subscribe'}
            </SubscribeButton>
          </SubscriptionForm>
          
          {error && (
            <ConfirmationMessage $isError>
              <FiX /> {error}
            </ConfirmationMessage>
          )}
        </>
      ) : (
        <ConfirmationMessage>
          <FiCheck /> Thanks for subscribing! We'll send you daily news updates.
        </ConfirmationMessage>
      )}
    </SubscriptionContainer>
  );
};

export default NewsletterSubscription; 