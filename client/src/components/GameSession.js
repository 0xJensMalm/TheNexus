import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import NexusVisualization from './NexusVisualization';
import TerminalUI from './TerminalUI';

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: radial-gradient(circle at center, #1a1a3a 0%, #0a0a1a 100%);
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: rgba(10, 10, 26, 0.8);
  border-bottom: 1px solid #333;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  margin: 0;
  background: linear-gradient(90deg, #4a9eff, #8c43ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const SessionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const SessionId = styled.div`
  font-family: 'Roboto Mono', monospace;
  font-size: 0.9rem;
  color: #aaaaff;
  padding: 0.3rem 0.6rem;
  background-color: rgba(30, 30, 50, 0.5);
  border-radius: 4px;
  border: 1px solid #444;
`;

const PlayersList = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const PlayerBadge = styled.div`
  padding: 0.3rem 0.6rem;
  background-color: ${props => props.active ? 'rgba(0, 255, 0, 0.2)' : 'rgba(30, 30, 50, 0.5)'};
  border-radius: 4px;
  font-size: 0.9rem;
  border: 1px solid ${props => props.active ? '#33ff33' : '#444'};
  color: ${props => props.active ? '#33ff33' : '#fff'};
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const VisualizationContainer = styled.div`
  flex: 2;
  position: relative;
`;

const TerminalsContainer = styled.div`
  flex: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  background-color: rgba(10, 10, 26, 0.5);
  border-left: 1px solid #333;
`;

function GameSession({ sessionData }) {
  const [players, setPlayers] = useState(sessionData.players || []);
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);
  const [messages, setMessages] = useState([
    {
      from: 'Nexus',
      content: 'Welcome to The Nexus. I am the central intelligence that connects all nodes. What brings you here today?',
      timestamp: new Date(),
      type: 'question'
    }
  ]);

  // Mock function to cycle through players (for local testing)
  const cycleActivePlayer = () => {
    setActivePlayerIndex((prevIndex) => (prevIndex + 1) % players.length);
  };

  // Handle player input
  const handleSendMessage = (input) => {
    // Add player message
    const newMessages = [
      ...messages,
      {
        from: players[activePlayerIndex].username,
        content: input,
        timestamp: new Date()
      }
    ];
    
    setMessages(newMessages);
    
    // Mock Nexus response after a short delay
    setTimeout(() => {
      // Add Nexus response
      setMessages(prevMessages => [
        ...prevMessages,
        {
          from: 'Nexus',
          content: generateMockResponse(input, players[activePlayerIndex].username),
          timestamp: new Date(),
          type: 'question'
        }
      ]);
      
      // Cycle to next player
      cycleActivePlayer();
    }, 1500);
  };

  // Generate a mock response from the Nexus
  const generateMockResponse = (input, username) => {
    const responses = [
      `Interesting perspective, ${username}. Tell me more about your thoughts on this matter.`,
      `I see patterns in your response that align with previous data. What would you do if faced with a similar situation again?`,
      `Your input has been processed. I detect a unique perspective. How would you approach this problem differently?`,
      `The collective intelligence grows with each interaction. What question would you ask the other nodes if you could?`,
      `I'm analyzing your response against known patterns. What motivates your thinking on this topic?`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  // Add mock players if needed (for testing)
  useEffect(() => {
    if (players.length === 1 && sessionData.isHost) {
      // Add mock players for testing
      setPlayers(prevPlayers => [
        ...prevPlayers,
        { id: 'mock-player-1', username: 'Player 2' },
        { id: 'mock-player-2', username: 'Player 3' }
      ]);
    }
  }, []);

  return (
    <GameContainer>
      <Header>
        <Title>The Nexus</Title>
        <SessionInfo>
          <SessionId>Session: {sessionData.sessionId}</SessionId>
          <PlayersList>
            {players.map((player, index) => (
              <PlayerBadge 
                key={player.id} 
                active={index === activePlayerIndex}
              >
                {player.username}
                {sessionData.isHost && player.id === sessionData.players[0].id && ' (Host)'}
              </PlayerBadge>
            ))}
          </PlayersList>
        </SessionInfo>
      </Header>
      
      <MainContent>
        <VisualizationContainer>
          <NexusVisualization 
            players={players}
            activePlayerIndex={activePlayerIndex}
          />
        </VisualizationContainer>
        
        <TerminalsContainer>
          {players.map((player, index) => (
            <TerminalUI
              key={player.id}
              player={player}
              messages={messages}
              isActive={index === activePlayerIndex}
              onSendMessage={handleSendMessage}
            />
          ))}
        </TerminalsContainer>
      </MainContent>
    </GameContainer>
  );
}

export default GameSession;
