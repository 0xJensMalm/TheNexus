// This service will handle interactions with the OpenAI API
require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');

// Initialize OpenAI configuration
// In production, you would use process.env.OPENAI_API_KEY
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// Sample prompts for the Nexus
const SAMPLE_PROMPTS = [
  `You are the Nexus, a central intelligence in a game with multiple players. 
   Ask each player a question in turn, then respond to their answers with follow-up questions.
   Tag your messages with [QUESTION:player_id] to indicate who should answer.
   Start by introducing yourself and asking each player a unique question.`,
  
  `You are the Nexus, a mysterious AI entity. You're running a collaborative puzzle game.
   Present the players with a scenario and give each one a piece of information.
   They must share and combine their information to solve the puzzle.
   Tag information for specific players with [FOR:player_id].
   Tag questions with [QUESTION:player_id] or [QUESTION:all].`,
  
  `You are the Nexus, the master of a word association game.
   Give each player a starting word, then they must respond with a related word.
   You will connect their words into a story.
   Tag your prompts with [WORD:player_id] for new words and [STORY] for the ongoing narrative.`
];

/**
 * Handles LLM requests for the Nexus
 * @param {Object} session - The current game session
 * @returns {Promise<string>} - The LLM response
 */
async function handleLLMRequest(session) {
  try {
    // If this is the first message, select a random prompt
    if (!session.nexusData) {
      session.nexusData = {
        promptTemplate: SAMPLE_PROMPTS[Math.floor(Math.random() * SAMPLE_PROMPTS.length)],
        gameState: 'starting'
      };
    }

    // Construct the messages array for the API
    const messages = [
      { role: 'system', content: session.nexusData.promptTemplate },
      // Add conversation history
      ...session.messages.map(msg => ({
        role: msg.from === 'Nexus' ? 'assistant' : 'user',
        content: `${msg.from}: ${msg.content}`
      }))
    ];

    // In a real implementation, you would call the OpenAI API
    if (!process.env.OPENAI_API_KEY) {
      console.warn('OpenAI API key not found. Using mock response.');
      return mockLLMResponse(session);
    }

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: messages,
      temperature: 0.7,
      max_tokens: 300,
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw new Error('Failed to get response from LLM');
  }
}

/**
 * Generates a mock LLM response for testing
 * @param {Object} session - The current game session
 * @returns {string} - A mock response
 */
function mockLLMResponse(session) {
  const playerNames = session.players.map(p => p.username);
  const gameStates = ['intro', 'question', 'response', 'challenge', 'conclusion'];
  
  // If nexusData doesn't have a gameState, initialize it
  if (!session.nexusData.gameState) {
    session.nexusData.gameState = 'intro';
  }
  
  // Get the last message
  const lastMessage = session.messages[session.messages.length - 1];
  const isFromPlayer = lastMessage && lastMessage.from !== 'Nexus';
  
  // Advance game state if the last message was from a player
  if (isFromPlayer) {
    const currentStateIndex = gameStates.indexOf(session.nexusData.gameState);
    const nextStateIndex = (currentStateIndex + 1) % gameStates.length;
    session.nexusData.gameState = gameStates[nextStateIndex];
  }
  
  // Generate response based on game state
  switch (session.nexusData.gameState) {
    case 'intro':
      return `[SYSTEM] Welcome to the Nexus! I'll be your guide through this experience.
              [QUESTION:${playerNames[0]}] ${playerNames[0]}, what brings you to the Nexus today?`;
    
    case 'question':
      const randomPlayer = playerNames[Math.floor(Math.random() * playerNames.length)];
      return `[QUESTION:${randomPlayer}] Interesting perspective, ${randomPlayer}. If you could connect to any knowledge source, what would it be?`;
    
    case 'response':
      return `[SYSTEM] I sense your curiosity. The Nexus is analyzing your inputs.
              [QUESTION:all] All of you, what pattern do you see forming in our conversation?`;
    
    case 'challenge':
      return `[CHALLENGE] Now, I have a task for all of you. Each of you has a piece of the puzzle.
              [FOR:${playerNames[0]}] Your piece is "beginning".
              [FOR:${playerNames[1]}] Your piece is "middle".
              ${playerNames.length > 2 ? `[FOR:${playerNames[2]}] Your piece is "end".` : ''}
              [QUESTION:all] How do these pieces fit together?`;
    
    case 'conclusion':
      return `[SYSTEM] Excellent work! You've demonstrated how multiple perspectives can create a unified understanding.
              [QUESTION:all] Would you like to continue our exploration or try a different challenge?`;
    
    default:
      return `[QUESTION:all] What are your thoughts on our discussion so far?`;
  }
}

module.exports = {
  handleLLMRequest
};
