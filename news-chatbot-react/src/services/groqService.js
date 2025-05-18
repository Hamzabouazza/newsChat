import { Groq } from 'groq-sdk';

// Initialize Groq client with API key from environment variables
// and enable browser usage with the dangerouslyAllowBrowser flag
const groq = new Groq({
  apiKey: process.env.REACT_APP_GROQ_API_KEY,
  dangerouslyAllowBrowser: true, // Required for browser environments
});

// Model to use
const model = "deepseek-r1-distill-llama-70b";

/**
 * Generate AI analysis of news articles based on user query
 * @param {string} userQuery - The user's original search query
 * @param {Array} articles - Array of news articles
 * @returns {Promise<string>} - AI-generated analysis
 */
export const generateNewsAnalysis = async (userQuery, articles) => {
  try {
    // Create context from articles
    const context = articles.map(article => 
      `Title: ${article.title}\nDescription: ${article.description}\nSource: ${article.source.name}\n`
    ).join('\n');

    // Set up system prompt
    const systemPrompt = 
      "You are a helpful AI assistant that analyzes news articles and provides insights. " +
      "Your task is to analyze the provided news articles and give a thoughtful response to the user's query. " +
      "Focus on identifying key facts, different perspectives, and potential biases in the coverage. " +
      "Be concise yet comprehensive, and provide a balanced view of the topic.";
    
    // Call Groq API
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: systemPrompt 
        },
        { 
          role: "user", 
          content: `User query: ${userQuery}\n\nNews articles to analyze:\n${context}\n\nProvide a thoughtful analysis of these articles in relation to the query.` 
        }
      ],
      model: model,
      temperature: 0.5,
      max_tokens: 500,
    });

    return chatCompletion.choices[0]?.message?.content || "Unable to generate analysis.";
  } catch (error) {
    console.error("Error generating news analysis:", error);
    return "I couldn't analyze these articles right now. Please try again later.";
  }
};

/**
 * Generate trending topics or themes from the news articles
 * @param {Array} articles - Array of news articles
 * @returns {Promise<string>} - AI-generated trends analysis
 */
export const generateNewsTrends = async (articles) => {
  try {
    // Create context from articles
    const context = articles.map(article => 
      `Title: ${article.title}\nDescription: ${article.description}\nSource: ${article.source.name}\n`
    ).join('\n');

    // Call Groq API
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: "You are a helpful AI assistant that analyzes news articles to identify trends and themes." 
        },
        { 
          role: "user", 
          content: `Analyze these news articles and identify the main trends, themes, or narrative patterns:\n\n${context}\n\nProvide 3-5 key trends or patterns you observe in these articles. Be concise and insightful.` 
        }
      ],
      model: model,
      temperature: 0.5,
      max_tokens: 300,
    });

    return chatCompletion.choices[0]?.message?.content || "Unable to identify trends.";
  } catch (error) {
    console.error("Error generating news trends:", error);
    return "I couldn't analyze trends right now. Please try again later.";
  }
}; 