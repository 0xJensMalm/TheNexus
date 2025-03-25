import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { SERVER_URL } from '../App';
import theme from '../theme';

const SetupContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const SetupCard = styled.div`
  background-color: ${theme.colors.background.secondary};
  border: 1px solid ${theme.colors.border.primary};
  padding: 2.5rem;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  position: relative;
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: ${theme.colors.gradients.header};
  }
`;

const TerminalHeader = styled.div`
  background-color: ${theme.colors.background.tertiary};
  margin: -2.5rem -2.5rem 1.5rem -2.5rem;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid ${theme.colors.border.primary};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TerminalTitle = styled.div`
  color: ${theme.colors.text.accent};
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const TerminalControls = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const TerminalControl = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.color};
`;

const TerminalContent = styled.div`
  margin-bottom: 2rem;
  font-family: ${theme.fonts.primary};
  color: ${theme.colors.text.primary};
  line-height: 1.6;
`;

const TerminalLine = styled.div`
  margin-bottom: 0.5rem;
  display: flex;
`;

const TerminalPrompt = styled.span`
  color: ${theme.colors.text.info};
  margin-right: 0.5rem;
`;

const TerminalOutput = styled.div`
  margin-bottom: 1rem;
  color: ${props => props.color || theme.colors.text.primary};
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid ${theme.colors.border.primary};
  background-color: ${theme.colors.background.tertiary};
  color: ${theme.colors.text.primary};
  font-family: ${theme.fonts.primary};
  margin-bottom: 1.5rem;
  width: 100%;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${theme.colors.text.accent};
    box-shadow: 0 0 5px rgba(230, 192, 123, 0.3);
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
  font-weight: 600;
  transition: all 0.2s ease;
  background-color: ${props => props.primary ? theme.colors.background.tertiary : 'transparent'};
  color: ${props => props.primary ? theme.colors.text.accent : theme.colors.text.secondary};
  border: 1px solid ${props => props.primary ? theme.colors.text.accent : theme.colors.border.primary};
  outline: none;
  font-family: ${theme.fonts.primary};
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;

  &:hover {
    background-color: ${props => props.primary ? '#3a3a50' : '#222'};
    box-shadow: ${props => props.primary ? '0 0 10px rgba(230, 192, 123, 0.3)' : 'none'};
  }

  &:disabled {
    background-color: ${theme.colors.background.tertiary};
    border-color: ${theme.colors.border.primary};
    color: ${theme.colors.text.secondary};
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const SessionIdInput = styled.div`
  margin-top: 1.5rem;
  display: ${props => props.show ? 'block' : 'none'};
`;

const ErrorMessage = styled.div`
  color: ${theme.colors.text.error};
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-left: 3px solid ${theme.colors.text.error};
  background-color: rgba(224, 108, 117, 0.1);
`;

const PlayerCountSelector = styled.div`
  margin-top: 1.5rem;
  display: ${props => props.show ? 'block' : 'none'};
`;

const PlayerCountButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const PlayerCountButton = styled.button`
  flex: 1;
  padding: 0.5rem;
  background-color: ${props => props.selected ? '#3a3a50' : '#2a2a40'};
  color: ${props => props.selected ? theme.colors.text.accent : theme.colors.text.primary};
  border: 1px solid ${props => props.selected ? theme.colors.text.accent : theme.colors.border.primary};
  font-family: ${theme.fonts.primary};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.selected ? '#3a3a50' : '#222'};
  }
`;

const Subtitle = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.2rem;
  color: ${theme.colors.text.primary};
  font-weight: 400;
  letter-spacing: 1px;
`;

function Setup({ onSessionCreated }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [joinMode, setJoinMode] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [playerCount, setPlayerCount] = useState(2);

  const handleSubmit = async () => {
    if (!username) {
      setError('ERROR: Username required');
      return;
    }

    if (joinMode && !sessionId) {
      setError('ERROR: Session ID required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // For now, we'll mock the session creation/joining
      // In a real implementation, this would connect to the server
      
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock session data
      const newSessionId = joinMode ? 
        sessionId : 
        'session-' + Math.random().toString(36).substring(2, 9);
      
      // Set the session ID and navigate to the session
      onSessionCreated(newSessionId);
      
      // Pass player count as a URL parameter when creating a new session
      if (!joinMode) {
        navigate(`/session/${newSessionId}?players=${playerCount}`);
      } else {
        navigate(`/session/${newSessionId}`);
      }
    } catch (err) {
      setError(`ERROR: ${err.message || 'Failed to connect to Nexus'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SetupContainer>
      <SetupCard>
        <TerminalHeader>
          <TerminalTitle>Nexus Connection Terminal</TerminalTitle>
          <TerminalControls>
            <TerminalControl color="#e06c75" />
            <TerminalControl color="#e5c07b" />
            <TerminalControl color="#98c379" />
          </TerminalControls>
        </TerminalHeader>
        
        <TerminalContent>
          <TerminalLine>
            <TerminalPrompt>nexus:~$</TerminalPrompt>
            <span>initialize_connection</span>
          </TerminalLine>
          
          <TerminalOutput color="#98c379">
            Initializing connection to Nexus central intelligence...
            Connection established.
            Authentication required.
          </TerminalOutput>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </TerminalContent>
        
        <TerminalLine>
          <TerminalPrompt>nexus:~$</TerminalPrompt>
          <span>set_username</span>
        </TerminalLine>
        
        <Input
          type="text"
          placeholder="Enter your identifier"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          spellCheck="false"
        />
        
        <ButtonGroup>
          <Button 
            primary={!joinMode} 
            onClick={() => setJoinMode(false)}
          >
            Create Node
          </Button>
          <Button 
            primary={joinMode} 
            onClick={() => setJoinMode(true)}
          >
            Join Node
          </Button>
        </ButtonGroup>
        
        <PlayerCountSelector show={!joinMode}>
          <TerminalLine style={{ marginTop: '1rem' }}>
            <TerminalPrompt>nexus:~$</TerminalPrompt>
            <span>set_player_count</span>
          </TerminalLine>
          
          <TerminalOutput>
            Select the number of players for this Nexus session:
          </TerminalOutput>
          
          <PlayerCountButtons>
            <PlayerCountButton 
              selected={playerCount === 2} 
              onClick={() => setPlayerCount(2)}
            >
              2 Players
            </PlayerCountButton>
            <PlayerCountButton 
              selected={playerCount === 3} 
              onClick={() => setPlayerCount(3)}
            >
              3 Players
            </PlayerCountButton>
          </PlayerCountButtons>
        </PlayerCountSelector>
        
        <SessionIdInput show={joinMode}>
          <TerminalLine style={{ marginTop: '1rem' }}>
            <TerminalPrompt>nexus:~$</TerminalPrompt>
            <span>connect_to_id</span>
          </TerminalLine>
          
          <Input
            type="text"
            placeholder="Enter Node ID"
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
            spellCheck="false"
          />
        </SessionIdInput>
        
        <Button 
          primary 
          onClick={handleSubmit}
          style={{ width: '100%', marginTop: '1rem' }}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : joinMode ? 'Connect' : 'Initialize'}
        </Button>
      </SetupCard>
    </SetupContainer>
  );
}

export default Setup;
