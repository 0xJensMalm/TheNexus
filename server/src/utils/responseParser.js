/**
 * Parses LLM responses to extract structured data
 * This allows the Nexus to tag messages for specific players or actions
 * 
 * @param {string} response - Raw response from the LLM
 * @returns {Object} - Parsed response with type, content, and target information
 */
function parseResponse(response) {
  // Default structure
  const parsed = {
    type: 'message',
    content: response,
    target: 'all'
  };

  // Check for question tags: [QUESTION:player_id] or [QUESTION:all]
  const questionMatch = response.match(/\[QUESTION:(.*?)\](.*)/);
  if (questionMatch) {
    parsed.type = 'question';
    parsed.target = questionMatch[1].trim();
    parsed.content = questionMatch[2].trim();
    return parsed;
  }

  // Check for system messages: [SYSTEM]
  const systemMatch = response.match(/\[SYSTEM\](.*)/);
  if (systemMatch) {
    parsed.type = 'system';
    parsed.content = systemMatch[1].trim();
    return parsed;
  }

  // Check for player-specific information: [FOR:player_id]
  const forMatch = response.match(/\[FOR:(.*?)\](.*)/);
  if (forMatch) {
    parsed.type = 'information';
    parsed.target = forMatch[1].trim();
    parsed.content = forMatch[2].trim();
    return parsed;
  }

  // Check for challenge: [CHALLENGE]
  const challengeMatch = response.match(/\[CHALLENGE\](.*)/);
  if (challengeMatch) {
    parsed.type = 'challenge';
    parsed.content = challengeMatch[1].trim();
    return parsed;
  }

  // Check for word game tags: [WORD:player_id]
  const wordMatch = response.match(/\[WORD:(.*?)\](.*)/);
  if (wordMatch) {
    parsed.type = 'word';
    parsed.target = wordMatch[1].trim();
    parsed.content = wordMatch[2].trim();
    return parsed;
  }

  // Check for story segments: [STORY]
  const storyMatch = response.match(/\[STORY\](.*)/);
  if (storyMatch) {
    parsed.type = 'story';
    parsed.content = storyMatch[1].trim();
    return parsed;
  }

  // If multiple tags exist in one response, split and process each part
  if (response.includes('[') && response.includes(']')) {
    const parts = [];
    const lines = response.split('\n');
    
    let currentPart = null;
    
    for (const line of lines) {
      // Check if this line starts a new tagged section
      const tagMatch = line.match(/\[(.*?):(.*?)\](.*)/);
      const simpleTagMatch = line.match(/\[(.*?)\](.*)/);
      
      if (tagMatch) {
        // If we were building a part, push it
        if (currentPart) {
          parts.push(currentPart);
        }
        
        // Start a new part
        currentPart = {
          type: tagMatch[1].toLowerCase(),
          target: tagMatch[2].trim(),
          content: tagMatch[3].trim()
        };
      } else if (simpleTagMatch) {
        // Simple tag without a target
        if (currentPart) {
          parts.push(currentPart);
        }
        
        currentPart = {
          type: simpleTagMatch[1].toLowerCase(),
          target: 'all',
          content: simpleTagMatch[2].trim()
        };
      } else if (currentPart) {
        // Continue building the current part
        currentPart.content += ' ' + line.trim();
      } else {
        // Untagged content at the beginning
        if (!currentPart) {
          currentPart = {
            type: 'message',
            target: 'all',
            content: line.trim()
          };
        }
      }
    }
    
    // Don't forget the last part
    if (currentPart) {
      parts.push(currentPart);
    }
    
    // If we found multiple parts, return them
    if (parts.length > 0) {
      return {
        type: 'multi',
        parts: parts
      };
    }
  }

  // Default case - just return the cleaned content
  return parsed;
}

module.exports = {
  parseResponse
};
