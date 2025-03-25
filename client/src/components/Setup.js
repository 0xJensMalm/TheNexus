import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const SetupContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: radial-gradient(circle at center, #1a1a3a 0%, #0a0a1a 100%);
`;

const SetupCard = styled.div`
  background-color: rgba(20, 20, 40, 0.8);
  border-radius: 12px;
  padding: 2.5rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(100, 100, 255, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  background: linear-gradient(90deg, #4a9eff, #8c43ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 0 10px rgba(138, 43, 226, 0.3);
`;

const Subtitle = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.2rem;
  color: #a0a0ff;
`;

const Input = styled.input`
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid #444;
  background-color: rgba(30, 30, 50, 0.8);
  color: #e0e0ff;
  font-family: 'Roboto Mono', monospace;
  margin-bottom: 1.5rem;
  width: 100%;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #6c00ff;
    box-shadow: 0 0 5px rgba(108, 0, 255, 0.5);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  flex: 1;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 600;
  transition: all 0.2s ease;
  background-color: ${props => props.primary ? '#4a00e0' : 'transparent'};
  color: white;
  border: 2px solid ${props => props.primary ? '#6c00ff' : '#444'};
  outline: none;
  font-family: 'Orbitron', 'Roboto', sans-serif;
  cursor: pointer;

  &:hover {
    background-color: ${props => props.primary ? '#6c00ff' : '#333'};
    box-shadow: ${props => props.primary ? '0 0 15px rgba(108, 0, 255, 0.5)' : 'none'};
  }

  &:disabled {
    background-color: #333;
    border-color: #444;
    color: #888;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const SessionIdInput = styled.div`
  margin-top: 1.5rem;
  display: ${props => props.show ? 'block' : 'none'};
`;

const ErrorMessage = styled.div`
  color: #ff5555;
  margin-bottom: 1rem;
  text-align: center;
`;

function Setup({ setSessionData }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [joinMode, setJoinMode] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!username) {
      setError('Please enter your username');
      return;
    }

    if (joinMode && !sessionId) {
      setError('Please enter a session ID');
      return;
    }

    // For now, we'll mock the session creation/joining
    // In a real implementation, this would connect to the server
    
    // Mock session data
    const mockSessionData = {
      sessionId: joinMode ? sessionId : 'session-' + Math.random().toString(36).substring(2, 9),
      username,
      isHost: !joinMode,
      players: [
        { id: 'player-1', username: username }
      ]
    };
    
    // If joining, add some mock players
    if (joinMode) {
      mockSessionData.players.push(
        { id: 'player-2', username: 'Player 2' }
      );
    }
    
    // Set the session data and navigate to the game
    setSessionData(mockSessionData);
    navigate('/game');
  };

  return (
    <SetupContainer>
      <SetupCard>
        <Title>The Nexus</Title>
        <Subtitle>Connect to the collective intelligence</Subtitle>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        
        <ButtonGroup>
          <Button 
            primary={!joinMode} 
            onClick={() => setJoinMode(false)}
          >
            Host Session
          </Button>
          <Button 
            primary={joinMode} 
            onClick={() => setJoinMode(true)}
          >
            Join Session
          </Button>
        </ButtonGroup>
        
        <SessionIdInput show={joinMode}>
          <Input
            type="text"
            placeholder="Enter Session ID"
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
          />
        </SessionIdInput>
        
        <Button 
          primary 
          onClick={handleSubmit}
          style={{ width: '100%', marginTop: '1rem' }}
        >
          {joinMode ? 'Join' : 'Create'} Session
        </Button>
      </SetupCard>
    </SetupContainer>
  );
}

export default Setup;
