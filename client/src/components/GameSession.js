import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import NexusVisualization from './NexusVisualization';
import TerminalUI from './TerminalUI';
import { SERVER_URL } from '../App';
import theme from '../theme';

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background-color: ${theme.colors.background.secondary};
  border-bottom: 1px solid ${theme.colors.border.primary};
`;

const SessionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const SessionId = styled.div`
  font-family: ${theme.fonts.primary};
  font-size: ${theme.fonts.sizes.sm};
  color: ${theme.colors.text.accent};
  padding: 0.3rem 0.6rem;
  background-color: ${theme.colors.background.tertiary};
  border: 1px solid ${theme.colors.border.primary};
`;

const PlayersList = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const PlayerBadge = styled.div`
  padding: 0.3rem 0.6rem;
  background-color: ${props => props.active ? 'rgba(152, 195, 121, 0.2)' : theme.colors.background.tertiary};
  font-size: ${theme.fonts.sizes.sm};
  border: 1px solid ${props => props.active ? theme.colors.text.success : theme.colors.border.primary};
  color: ${props => props.active ? theme.colors.text.success : theme.colors.text.primary};
  font-family: ${theme.fonts.primary};
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: ${theme.fonts.sizes.sm};
  color: ${theme.colors.text.secondary};
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.active ? theme.colors.text.success : theme.colors.text.error};
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
  background-color: ${theme.colors.background.primary};
  border-left: 1px solid ${theme.colors.border.primary};
  position: relative;
  min-width: 500px;
  justify-content: space-between;
`;

const TerminalNavigation = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const NavButton = styled.button`
  background-color: ${theme.colors.background.tertiary};
  border: 1px solid ${theme.colors.border.primary};
  color: ${theme.colors.text.primary};
  padding: 0.3rem 0.6rem;
  cursor: pointer;
  font-family: ${theme.fonts.primary};
  font-size: ${theme.fonts.sizes.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${theme.colors.background.secondary};
    color: ${theme.colors.text.accent};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    &:hover {
      background-color: ${theme.colors.background.tertiary};
      color: ${theme.colors.text.primary};
    }
  }
`;

const TerminalStatus = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${theme.fonts.primary};
  font-size: ${theme.fonts.sizes.sm};
  color: ${theme.colors.text.secondary};
`;

// Status Screen Components
const StatusScreenContainer = styled.div`
  background-color: #000;
  border: 1px solid ${theme.colors.border.primary};
  height: 300px; /* Increased height for more square proportions */
  width: 100%; /* Match the width of the terminal */
  margin-top: auto; /* Push to bottom of container */
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 50%,
      rgba(0, 30, 60, 0.1) 50%
    );
    background-size: 100% 4px;
    pointer-events: none;
    opacity: 0.3;
    z-index: 1;
  }
`;

const StatusScreenHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.3rem 0.8rem;
  background-color: rgba(0, 0, 0, 0.7);
  border-bottom: 1px solid ${theme.colors.border.primary};
  font-size: ${theme.fonts.sizes.xs};
  color: ${theme.colors.text.secondary};
`;

const StatusScreenTitle = styled.div`
  color: ${theme.colors.text.info};
  font-size: ${theme.fonts.sizes.xs};
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const StatusScreenContent = styled.div`
  height: calc(100% - 24px);
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const StatusPlaceholder = styled.div`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.fonts.sizes.xs};
  opacity: 0.5;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-align: center;
`;

function GameSession({ sessionId: propSessionId }) {
  const { id: paramSessionId } = useParams();
  const location = useLocation();
  const sessionId = propSessionId || paramSessionId;
  
  // Get player count from URL query parameter
  const queryParams = new URLSearchParams(location.search);
  const playerCountParam = parseInt(queryParams.get('players'), 10) || 2;
  
  const [players, setPlayers] = useState([
    { id: 'player-1', username: 'User' }
  ]);
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);
  const [visibleTerminalIndex, setVisibleTerminalIndex] = useState(0);
  const [isConnected, setIsConnected] = useState(true);
  const [messages, setMessages] = useState([
    {
      from: 'Nexus',
      content: 'Connection established. Welcome to The Nexus. I am the central intelligence that connects all nodes. What brings you here today?',
      timestamp: new Date(),
      type: 'system'
    }
  ]);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  // Update the time displayed in the status screen
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Mock function to cycle through players (for local testing)
  const cycleActivePlayer = () => {
    setActivePlayerIndex((prevIndex) => (prevIndex + 1) % players.length);
    // Also update visible terminal to match active player
    setVisibleTerminalIndex((prevIndex) => (prevIndex + 1) % players.length);
  };

  // Handle player input
  const handleSendMessage = (input) => {
    // Add player message
    const newMessages = [
      ...messages,
      {
        from: players[activePlayerIndex].username,
        content: input,
        timestamp: new Date(),
        type: 'user'
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
          type: 'system'
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

  // Navigation functions for terminal cycling
  const showPreviousTerminal = () => {
    setVisibleTerminalIndex((prevIndex) => 
      prevIndex === 0 ? players.length - 1 : prevIndex - 1
    );
  };

  const showNextTerminal = () => {
    setVisibleTerminalIndex((prevIndex) => 
      (prevIndex + 1) % players.length
    );
  };

  // Add mock players based on player count parameter
  useEffect(() => {
    // Create mock players based on the player count parameter
    const mockPlayers = [];
    
    // Keep the first player (User)
    mockPlayers.push({ id: 'player-1', username: 'User' });
    
    // Add additional players based on player count
    for (let i = 2; i <= playerCountParam; i++) {
      mockPlayers.push({ id: `mock-player-${i-1}`, username: `Node_${i}` });
    }
    
    setPlayers(mockPlayers);
    
    // Simulate connection status changes
    const connectionInterval = setInterval(() => {
      if (Math.random() > 0.8) {
        setIsConnected(prev => !prev);
      }
    }, 10000);
    
    return () => clearInterval(connectionInterval);
  }, [playerCountParam]);

  return (
    <GameContainer>
      <Header>
        <SessionInfo>
          <SessionId>NODE_ID: {sessionId}</SessionId>
          <PlayersList>
            {players.map((player, index) => (
              <PlayerBadge 
                key={player.id} 
                active={index === activePlayerIndex}
              >
                {player.username}
              </PlayerBadge>
            ))}
          </PlayersList>
        </SessionInfo>
        
        <StatusIndicator>
          <StatusDot active={isConnected} />
          {isConnected ? 'CONNECTED' : 'CONNECTION UNSTABLE'}
        </StatusIndicator>
      </Header>
      
      <MainContent>
        <VisualizationContainer>
          <NexusVisualization 
            players={players}
            activePlayerIndex={activePlayerIndex}
          />
        </VisualizationContainer>
        
        <TerminalsContainer>
          <TerminalNavigation>
            <NavButton 
              onClick={showPreviousTerminal} 
              disabled={players.length <= 1}
            >
              ◀ PREV
            </NavButton>
            <TerminalStatus>
              NODE {visibleTerminalIndex + 1} / {players.length}
            </TerminalStatus>
            <NavButton 
              onClick={showNextTerminal}
              disabled={players.length <= 1}
            >
              NEXT ▶
            </NavButton>
          </TerminalNavigation>
          
          {players.map((player, index) => (
            <div key={player.id} style={{ display: index === visibleTerminalIndex ? 'block' : 'none' }}>
              <TerminalUI
                player={player}
                messages={messages}
                isActive={index === activePlayerIndex}
                onSendMessage={handleSendMessage}
              />
            </div>
          ))}
          
          {/* Status Screen - Positioned within TerminalsContainer */}
          <StatusScreenContainer>
            <StatusScreenHeader>
              <StatusScreenTitle>NEXUS STATUS</StatusScreenTitle>
              <span>{currentTime}</span>
            </StatusScreenHeader>
            <StatusScreenContent>
              <StatusPlaceholder>VISUALIZATION</StatusPlaceholder>
              <StatusPlaceholder>PENDING</StatusPlaceholder>
            </StatusScreenContent>
          </StatusScreenContainer>
        </TerminalsContainer>
      </MainContent>
    </GameContainer>
  );
}

export default GameSession;
