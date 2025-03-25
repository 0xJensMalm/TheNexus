import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import Setup from './components/Setup';
import GameSession from './components/GameSession';
import './App.css';

// Server configuration
export const SERVER_URL = 'http://localhost:5001'; // Updated server port

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #0a0a1a;
  color: #e0e0ff;
`;

function App() {
  const [sessionData, setSessionData] = useState(null);

  return (
    <Router>
      <AppContainer>
        <Routes>
          <Route path="/" element={<Setup setSessionData={setSessionData} />} />
          <Route 
            path="/game" 
            element={
              sessionData ? 
                <GameSession sessionData={sessionData} /> : 
                <Navigate to="/" replace />
            } 
          />
        </Routes>
      </AppContainer>
    </Router>
  );
}

export default App;
