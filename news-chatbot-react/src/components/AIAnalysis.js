import React, { useState } from 'react';
import styled from 'styled-components';
import { FiCpu, FiBarChart2, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { generateNewsAnalysis, generateNewsTrends } from '../services/groqService';

const AnalysisContainer = styled.div`
  margin: 15px 0;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f9f9f9;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
`;

const AnalysisHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background-color: #f0f7ff;
  border-bottom: ${props => props.isOpen ? '1px solid #e0e0e0' : 'none'};
  cursor: pointer;
  
  &:hover {
    background-color: #e6f2ff;
  }
`;

const HeaderTitle = styled.div`
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #0078d7;
  
  svg {
    margin-right: 8px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  background-color: ${props => props.active ? '#0078d7' : '#fff'};
  color: ${props => props.active ? '#fff' : '#0078d7'};
  border: 1px solid #0078d7;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.active ? '#006bc7' : '#f0f7ff'};
  }
  
  svg {
    margin-right: 6px;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const AnalysisContent = styled.div`
  padding: ${props => props.isOpen ? '15px' : '0'};
  max-height: ${props => props.isOpen ? '500px' : '0'};
  overflow: hidden;
  transition: all 0.3s ease-in-out;
`;

const AnalysisText = styled.div`
  line-height: 1.6;
  color: #333;
  white-space: pre-wrap;
`;

const LoadingIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  color: #666;
  
  .spinner {
    margin-right: 10px;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }
`;

const AIAnalysis = ({ articles, userQuery }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeButton, setActiveButton] = useState(null);
  
  const handleAnalyzeClick = async () => {
    if (articles.length === 0) return;
    
    setIsOpen(true);
    setIsLoading(true);
    setActiveButton('analyze');
    
    try {
      const analysisText = await generateNewsAnalysis(userQuery, articles);
      setAnalysis(analysisText);
    } catch (error) {
      console.error("Error analyzing news:", error);
      setAnalysis("Sorry, I couldn't analyze these articles right now. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTrendsClick = async () => {
    if (articles.length === 0) return;
    
    setIsOpen(true);
    setIsLoading(true);
    setActiveButton('trends');
    
    try {
      const trendsText = await generateNewsTrends(articles);
      setAnalysis(trendsText);
    } catch (error) {
      console.error("Error finding trends:", error);
      setAnalysis("Sorry, I couldn't identify trends in these articles right now. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleOpen = () => {
    if (!analysis) {
      // If no analysis yet, run analysis
      handleAnalyzeClick();
    } else {
      // Otherwise just toggle the panel
      setIsOpen(!isOpen);
    }
  };
  
  // Don't render anything if there are no articles
  if (!articles || articles.length === 0) {
    return null;
  }
  
  return (
    <AnalysisContainer>
      <AnalysisHeader isOpen={isOpen} onClick={toggleOpen}>
        <HeaderTitle>
          <FiCpu /> AI-Powered News Analysis
        </HeaderTitle>
        <ButtonGroup>
          <ActionButton 
            active={activeButton === 'analyze'}
            onClick={(e) => {
              e.stopPropagation();
              handleAnalyzeClick();
            }}
            disabled={isLoading}
          >
            <FiCpu /> Analyze
          </ActionButton>
          <ActionButton 
            active={activeButton === 'trends'}
            onClick={(e) => {
              e.stopPropagation();
              handleTrendsClick();
            }}
            disabled={isLoading}
          >
            <FiBarChart2 /> Find Trends
          </ActionButton>
          {isOpen ? <FiChevronUp /> : <FiChevronDown />}
        </ButtonGroup>
      </AnalysisHeader>
      
      <AnalysisContent isOpen={isOpen}>
        {isLoading ? (
          <LoadingIndicator>
            <FiCpu className="spinner" />
            Analyzing with DeepSeek LLama AI...
          </LoadingIndicator>
        ) : (
          <AnalysisText>{analysis}</AnalysisText>
        )}
      </AnalysisContent>
    </AnalysisContainer>
  );
};

export default AIAnalysis; 