import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Setup from './components/Setup';
import GameSession from './components/GameSession';
import theme from './theme';
import './App.css';

// Server configuration
export const SERVER_URL = 'http://localhost:5001'; // Updated server port

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${theme.colors.background.primary};
  color: ${theme.colors.text.primary};
  position: relative;
  overflow: hidden;
`;

const ContentContainer = styled.div`
  position: relative;
  z-index: 3;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  padding: ${theme.spacing.lg};
  text-align: center;
  border-bottom: 1px solid ${theme.colors.border.primary};
  position: relative;
  
  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: ${theme.colors.gradients.header};
  }
`;

const Title = styled.h1`
  margin: 0;
  font-size: ${theme.fonts.sizes.xxl};
  letter-spacing: 2px;
  position: relative;
  display: inline-block;
  
  &::before {
    content: ">";
    color: ${theme.colors.text.info};
    margin-right: 0.5rem;
    animation: cursor-blink 1s infinite;
  }
`;

const Footer = styled.footer`
  padding: ${theme.spacing.md};
  text-align: center;
  font-size: ${theme.fonts.sizes.sm};
  color: ${theme.colors.text.secondary};
  border-top: 1px solid ${theme.colors.border.primary};
`;

const StatusBar = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  font-size: ${theme.fonts.sizes.xs};
  color: ${theme.colors.text.secondary};
  z-index: 4;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
`;

const StatusDot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${theme.colors.text.success};
`;

function App() {
  const [sessionId, setSessionId] = useState(null);
  
  const handleSessionCreated = (id) => {
    setSessionId(id);
    // We can use this sessionId for analytics or other purposes
  };

  return (
    <Router>
      <AppContainer>
        <ContentContainer>
          <Header>
            <Title>THE NEXUS</Title>
          </Header>
          
          <Routes>
            <Route 
              path="/" 
              element={<Setup onSessionCreated={handleSessionCreated} />} 
            />
            <Route 
              path="/session/:id" 
              element={<GameSession sessionId={sessionId} />} 
            />
          </Routes>
          
          <Footer>
            NEXUS SYSTEM v1.0 • {new Date().getFullYear()} • TERMINAL MODE
            <StatusBar>
              <StatusDot /> SYSTEM ONLINE
            </StatusBar>
          </Footer>
        </ContentContainer>
      </AppContainer>
    </Router>
  );
}

export default App;
