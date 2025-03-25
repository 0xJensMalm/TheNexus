require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { handleLLMRequest } = require('./services/llmService');
const { parseResponse } = require('./utils/responseParser');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Store active sessions
const activeSessions = new Map();

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Handle user joining or creating a session
  socket.on('join_session', ({ username, sessionId, isHost }) => {
    if (isHost) {
      // Create a new session
      const newSessionId = uuidv4();
      activeSessions.set(newSessionId, {
        id: newSessionId,
        host: { id: socket.id, username },
        players: [{ id: socket.id, username }],
        state: 'waiting', // waiting, active, completed
        nexusData: null,
        messages: []
      });
      
      socket.join(newSessionId);
      socket.emit('session_joined', { 
        sessionId: newSessionId, 
        players: [{ id: socket.id, username }],
        isHost: true
      });
      
      console.log(`New session created: ${newSessionId} by ${username}`);
    } else if (sessionId && activeSessions.has(sessionId)) {
      // Join existing session
      const session = activeSessions.get(sessionId);
      
      // Check if session is full (max 3 players)
      if (session.players.length >= 3) {
        socket.emit('error', { message: 'Session is full' });
        return;
      }
      
      // Add player to session
      session.players.push({ id: socket.id, username });
      activeSessions.set(sessionId, session);
      
      socket.join(sessionId);
      socket.emit('session_joined', { 
        sessionId, 
        players: session.players,
        isHost: false
      });
      
      // Notify other players in the session
      socket.to(sessionId).emit('player_joined', { 
        id: socket.id, 
        username 
      });
      
      console.log(`${username} joined session: ${sessionId}`);
    } else {
      socket.emit('error', { message: 'Session not found' });
    }
  });

  // Handle player input to Nexus
  socket.on('player_input', async ({ sessionId, input }) => {
    if (!activeSessions.has(sessionId)) {
      socket.emit('error', { message: 'Session not found' });
      return;
    }

    const session = activeSessions.get(sessionId);
    const player = session.players.find(p => p.id === socket.id);
    
    if (!player) {
      socket.emit('error', { message: 'Player not found in session' });
      return;
    }

    // Add message to session history
    session.messages.push({
      from: player.username,
      content: input,
      timestamp: new Date()
    });

    // For now, we'll mock the LLM response
    // In the future, this will call the OpenAI API
    try {
      // This is where we would call the LLM service
      // const llmResponse = await handleLLMRequest(session);
      
      // For now, mock a response
      const mockResponse = {
        type: 'question',
        content: `Response to "${input}" from the Nexus. What's your next move?`,
        target: 'all' // or could be specific player IDs
      };
      
      // Parse the response (in the future, this would parse the LLM output)
      // const parsedResponse = parseResponse(llmResponse);
      
      // Add Nexus response to session history
      session.messages.push({
        from: 'Nexus',
        content: mockResponse.content,
        timestamp: new Date(),
        type: mockResponse.type
      });
      
      // Update session
      activeSessions.set(sessionId, session);
      
      // Broadcast the response to all players in the session
      io.to(sessionId).emit('nexus_response', mockResponse);
      
    } catch (error) {
      console.error('Error processing Nexus response:', error);
      socket.emit('error', { message: 'Error processing your input' });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    
    // Find and update any sessions this player was part of
    activeSessions.forEach((session, sessionId) => {
      const playerIndex = session.players.findIndex(p => p.id === socket.id);
      
      if (playerIndex !== -1) {
        // Remove player from session
        const player = session.players[playerIndex];
        session.players.splice(playerIndex, 1);
        
        // If session is empty, remove it
        if (session.players.length === 0) {
          activeSessions.delete(sessionId);
          console.log(`Session ${sessionId} removed (no players left)`);
        } else {
          // If host left, assign a new host
          if (session.host.id === socket.id && session.players.length > 0) {
            session.host = session.players[0];
          }
          
          // Update session
          activeSessions.set(sessionId, session);
          
          // Notify remaining players
          io.to(sessionId).emit('player_left', { 
            id: socket.id, 
            username: player.username,
            newHost: session.host.id === session.players[0].id ? session.players[0].username : null
          });
        }
      }
    });
  });
});

// API Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/api/sessions', (req, res) => {
  const sessions = Array.from(activeSessions.values()).map(session => ({
    id: session.id,
    playerCount: session.players.length,
    state: session.state
  }));
  
  res.status(200).json({ sessions });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
