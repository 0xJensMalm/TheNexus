import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import theme from '../theme';

const TerminalContainer = styled.div`
  background-color: ${theme.colors.background.secondary};
  border: 1px solid ${theme.colors.border.primary};
  padding: 0;
  font-family: ${theme.fonts.primary};
  color: ${theme.colors.text.primary};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  height: 300px; /* Reduced height since status screen was removed */
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: repeating-linear-gradient(
      transparent 0px,
      rgba(0, 0, 0, 0.05) 1px,
      transparent 2px
    );
    pointer-events: none;
    z-index: 1;
  }
`;

const TerminalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: ${theme.colors.background.tertiary};
  border-bottom: 1px solid ${theme.colors.border.primary};
`;

const TerminalTitle = styled.div`
  font-weight: 500;
  font-size: ${theme.fonts.sizes.sm};
  color: ${theme.colors.text.accent};
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const TerminalStatus = styled.div`
  font-size: ${theme.fonts.sizes.xs};
  color: ${props => props.active ? theme.colors.text.success : theme.colors.text.secondary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &::before {
    content: "";
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${props => props.active ? theme.colors.text.success : theme.colors.text.secondary};
  }
`;

const TerminalOutput = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  position: relative;
  z-index: 2;

  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${theme.colors.background.secondary};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.border.primary};
    border-radius: 3px;
  }
`;

const MessageContainer = styled.div`
  margin-bottom: 1rem;
  line-height: 1.5;
`;

const SystemMessage = styled.div`
  color: ${theme.colors.text.info};
  font-style: italic;
  opacity: 0.8;
  border-left: 2px solid ${theme.colors.text.info};
  padding-left: 0.5rem;
  margin: 0.5rem 0;
`;

const NexusMessage = styled.div`
  color: ${theme.colors.text.success};
`;

const PlayerMessage = styled.div`
  color: ${props => props.isCurrentPlayer ? theme.colors.text.accent : theme.colors.text.purple};
`;

const MessageSender = styled.span`
  font-weight: bold;
  margin-right: 0.5rem;
  opacity: 0.9;
`;

const MessageContent = styled.div`
  margin-top: 0.2rem;
  margin-left: 0.5rem;
  word-break: break-word;
`;

const TerminalInputContainer = styled.div`
  display: flex;
  align-items: center;
  border-top: 1px solid ${theme.colors.border.primary};
  padding: 0.75rem 1rem;
  background-color: ${theme.colors.background.tertiary};
  position: relative;
  z-index: 2;
`;

const TerminalPrompt = styled.div`
  color: ${props => props.active ? theme.colors.text.info : theme.colors.text.secondary};
  margin-right: 0.5rem;
  font-weight: 600;
`;

const InputField = styled.input`
  flex: 1;
  background-color: transparent;
  border: none;
  color: ${props => props.disabled ? theme.colors.text.secondary : theme.colors.text.primary};
  font-family: ${theme.fonts.primary};
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
  }
  
  &::placeholder {
    color: ${theme.colors.border.primary};
  }
`;

const Timestamp = styled.span`
  font-size: ${theme.fonts.sizes.xs};
  color: ${theme.colors.text.secondary};
  margin-left: 0.5rem;
`;

function TerminalUI({ 
  player, 
  messages = [], 
  isActive = false, 
  onSendMessage 
}) {
  const [input, setInput] = useState('');
  const outputRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [messages]);
  
  // Update the time displayed in the status screen
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && isActive) {
      onSendMessage(input);
      setInput('');
    }
  };
  
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <TerminalContainer>
      <TerminalHeader>
        <TerminalTitle>Node: {player.username}</TerminalTitle>
        <TerminalStatus active={isActive}>
          {isActive ? 'ACTIVE' : 'STANDBY'}
        </TerminalStatus>
      </TerminalHeader>
      
      <TerminalOutput ref={outputRef}>
        <SystemMessage>
          --- Nexus connection established ---
        </SystemMessage>
        
        {messages.map((msg, index) => (
          <MessageContainer key={index}>
            {msg.type === 'system' ? (
              <SystemMessage>{msg.content}</SystemMessage>
            ) : msg.from === 'Nexus' ? (
              <NexusMessage>
                <MessageSender>NEXUS<Timestamp>{formatTime(msg.timestamp)}</Timestamp></MessageSender>
                <MessageContent>{msg.content}</MessageContent>
              </NexusMessage>
            ) : (
              <PlayerMessage isCurrentPlayer={msg.from === player.username}>
                <MessageSender>{msg.from}<Timestamp>{formatTime(msg.timestamp)}</Timestamp></MessageSender>
                <MessageContent>{msg.content}</MessageContent>
              </PlayerMessage>
            )}
          </MessageContainer>
        ))}
      </TerminalOutput>
      
      <form onSubmit={handleSubmit}>
        <TerminalInputContainer>
          <TerminalPrompt active={isActive}>{isActive ? '>' : '#'}</TerminalPrompt>
          <InputField
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isActive ? "Enter command..." : "Terminal locked"}
            disabled={!isActive}
            spellCheck="false"
          />
        </TerminalInputContainer>
      </form>
    </TerminalContainer>
  );
}

export default TerminalUI;
