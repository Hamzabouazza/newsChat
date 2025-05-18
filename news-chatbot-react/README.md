# News Chatbot with DeepSeek LLama

This is a React-based chatbot application that allows users to search for news articles and receive AI-powered analysis using the DeepSeek-R1-Distill-LLama-70B model via Groq's API.

## Features

- Search for news articles using natural language queries
- View detailed article cards with images and descriptions
- AI-powered analysis of news articles using DeepSeek LLama
- Trend identification and insights from news content
- Modern, responsive user interface

## Setup

### Prerequisites

- Node.js (v14 or later)
- NPM or Yarn
- A Groq API key ([Get one here](https://console.groq.com/))

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd news-chatbot-react
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Groq API key:
```
REACT_APP_GROQ_API_KEY=your_groq_api_key_here
```

4. Start the development server:
```bash
npm start
```

5. Make sure the backend server is running (follows instructions in the main README)

## Usage

1. Type a query about news in the chat input
2. View the search results displayed as article cards
3. Use the AI Analysis panel to get insights about the articles:
   - "Analyze Articles" provides detailed analysis of the news content
   - "Find Trends" identifies patterns and trends across articles

## Technology Stack

- React for the frontend
- Styled-components for styling
- Groq SDK for AI model integration
- DeepSeek-R1-Distill-LLama-70B for AI-powered analysis
- FastAPI backend for News API integration

## Notes

- This application requires both the frontend and backend services to be running
- You must replace the placeholder API key in the `.env` file with your actual Groq API key
- For production deployment, ensure all environment variables are properly set

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
