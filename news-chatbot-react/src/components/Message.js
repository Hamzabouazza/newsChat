import React from 'react';
import styled, { keyframes } from 'styled-components';

const MessageContainer = styled.div`
  display: flex;
  flex-direction: ${props => props.$type === 'user' ? 'row-reverse' : 'row'};
  align-items: flex-start;
  margin-bottom: 10px;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => props.$type === 'user' ? '#0078d7' : '#7B68EE'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: ${props => props.$type === 'user' ? '0 0 0 10px' : '0 10px 0 0'};
  font-weight: bold;
`;

const Content = styled.div`
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 18px;
  background-color: ${props => props.$type === 'user' ? '#dcf8c6' : '#f0f0f0'};
  ${props => props.$error && 'background-color: #ffebee;'}
  color: ${props => props.$error ? '#d32f2f' : '#333'};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  white-space: pre-wrap;
  line-height: 1.5;
`;

const loadingAnimation = keyframes`
  0%, 80%, 100% { opacity: 0.2; }
  40% { opacity: 1; }
`;

const LoadingDots = styled.div`
  display: inline-flex;
  align-items: center;

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #666;
    margin: 0 2px;
    animation: ${loadingAnimation} 1.4s infinite ease-in-out both;
  }

  .dot:nth-child(1) {
    animation-delay: -0.32s;
  }

  .dot:nth-child(2) {
    animation-delay: -0.16s;
  }
`;

const Message = ({ message }) => {
  const { type, content, error, isLoading } = message;

  const getInitials = () => {
    return type === 'user' ? 'You' : 'AI';
  };

  return (
    <MessageContainer $type={type}>
      <Avatar $type={type}>{getInitials()}</Avatar>
      <Content $type={type} $error={error}>
        {content}
        {isLoading && (
          <LoadingDots>
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </LoadingDots>
        )}
      </Content>
    </MessageContainer>
  );
};

export default Message; 