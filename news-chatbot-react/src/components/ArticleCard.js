import React from 'react';
import styled from 'styled-components';
import { FiExternalLink, FiCalendar, FiUser } from 'react-icons/fi';

const Card = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const TitleLink = styled.a`
  color: #0078d7;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  
  &:hover {
    text-decoration: underline;
  }
  
  svg {
    margin-left: 5px;
    font-size: 0.9rem;
  }
`;

const Description = styled.p`
  color: #444;
  margin: 10px 0;
  line-height: 1.5;
  font-size: 0.95rem;
`;

const ImageContainer = styled.div`
  margin-top: 12px;
  width: 100%;
  height: 180px;
  overflow: hidden;
  border-radius: 6px;
`;

const ArticleImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  color: #666;
  font-size: 0.85rem;
  flex-wrap: wrap;
  gap: 12px;
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 4px;
  }
`;

const SourceLabel = styled.span`
  background-color: #f0f0f0;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
`;

const ArticleCard = ({ article }) => {
  if (!article) return null;
  
  const {
    title,
    description,
    url,
    urlToImage,
    publishedAt,
    source,
    author
  } = article;
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  // Fallback image
  const imageSrc = urlToImage || 'https://via.placeholder.com/800x400?text=No+Image+Available';
  
  return (
    <Card>
      <TitleLink href={url} target="_blank" rel="noopener noreferrer">
        {title} <FiExternalLink />
      </TitleLink>
      
      {description && <Description>{description}</Description>}
      
      <MetaInfo>
        {source && source.name && (
          <MetaItem><SourceLabel>{source.name}</SourceLabel></MetaItem>
        )}
        
        {publishedAt && (
          <MetaItem><FiCalendar /> {formatDate(publishedAt)}</MetaItem>
        )}
        
        {author && (
          <MetaItem><FiUser /> {author}</MetaItem>
        )}
      </MetaInfo>
      
      {imageSrc && (
        <ImageContainer>
          <ArticleImage src={imageSrc} alt={title} onError={(e) => {
            e.target.src = 'https://via.placeholder.com/800x400?text=Image+Not+Available';
          }} />
        </ImageContainer>
      )}
    </Card>
  );
};

export default ArticleCard; 