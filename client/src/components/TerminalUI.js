import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const TerminalContainer = styled.div`
  background-color: #0c0c14;
  border-radius: 8px;
  padding: 1rem;
  font-family: 'Roboto Mono', monospace;
  color: #33ff33;
  border: 1px solid #333;
  height: 300px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const TerminalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #333;
  margin-bottom: 0.5rem;
`;

const TerminalTitle = styled.div`
  font-weight: bold;
  color: #aaaaff;
`;

const TerminalStatus = styled.div`
  font-size: 0.8rem;
  color: ${props => props.active ? '#33ff33' : '#aaa'};
`;

const TerminalOutput = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 0.5rem;
  margin-bottom: 0.5rem;

  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #0c0c14;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #333;
    border-radius: 3px;
  }
`;

const MessageContainer = styled.div`
  margin-bottom: 0.8rem;
`;

const SystemMessage = styled.div`
  color: #aaaaff;
  font-style: italic;
`;

const NexusMessage = styled.div`
  color: #33ff33;
`;

const PlayerMessage = styled.div`
  color: ${props => props.isCurrentPlayer ? '#ffcc00' : '#ff66aa'};
`;

const MessageSender = styled.span`
  font-weight: bold;
  margin-right: 0.5rem;
`;

const TerminalInputContainer = styled.div`
  display: flex;
  align-items: center;
  border-top: 1px solid #333;
  padding-top: 0.5rem;
`;

const TerminalPrompt = styled.div`
  color: #33ff33;
  margin-right: 0.5rem;
`;

const InputField = styled.input`
  flex: 1;
  background-color: transparent;
  border: none;
  color: #33ff33;
  font-family: 'Roboto Mono', monospace;
  
  &:focus {
    outline: none;
  }
`;

function TerminalUI({ 
  player, 
  messages = [], 
  isActive = false, 
  onSendMessage 
}) {
  const [input, setInput] = useState('');
  const outputRef = useRef(null);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [messages]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && isActive) {
      onSendMessage(input);
      setInput('');
    }
  };
  
  return (
    <TerminalContainer>
      <TerminalHeader>
        <TerminalTitle>Terminal: {player.username}</TerminalTitle>
        <TerminalStatus active={isActive}>
          {isActive ? 'ACTIVE' : 'STANDBY'}
        </TerminalStatus>
      </TerminalHeader>
      
      <TerminalOutput ref={outputRef}>
        <SystemMessage>
          --- Connection established with The Nexus ---
        </SystemMessage>
        
        {messages.map((msg, index) => (
          <MessageContainer key={index}>
            {msg.type === 'system' ? (
              <SystemMessage>{msg.content}</SystemMessage>
            ) : msg.from === 'Nexus' ? (
              <NexusMessage>
                <MessageSender>Nexus:</MessageSender>
                {msg.content}
              </NexusMessage>
            ) : (
              <PlayerMessage isCurrentPlayer={msg.from === player.username}>
                <MessageSender>{msg.from}:</MessageSender>
                {msg.content}
              </PlayerMessage>
            )}
          </MessageContainer>
        ))}
      </TerminalOutput>
      
      <form onSubmit={handleSubmit}>
        <TerminalInputContainer>
          <TerminalPrompt>{isActive ? '>' : '#'}</TerminalPrompt>
          <InputField
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isActive ? "Enter your response..." : "Waiting for your turn..."}
            disabled={!isActive}
          />
        </TerminalInputContainer>
      </form>
    </TerminalContainer>
  );
}

export default TerminalUI;
