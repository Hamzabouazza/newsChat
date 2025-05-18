import React from 'react';
import './App.css';
import Chatbot from './components/Chatbot';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>News Chatbot</h1>
        <p>Ask me about any news topic!</p>
      </header>
      <main>
        <Chatbot />
      </main>
      <footer>
        <p>Powered by News API</p>
        <div className="footer-links">
          <a href="https://newsapi.org" target="_blank" rel="noopener noreferrer">NewsAPI.org</a>
          <span> | </span>
          <a href="http://localhost:8000/static/newsletter.html" target="_blank" rel="noopener noreferrer">Subscribe to Newsletter</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
