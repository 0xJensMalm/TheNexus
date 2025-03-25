# The Nexus

The Nexus is an interactive web application that connects players to a central AI intelligence. Players can interact with the Nexus through terminal interfaces while visualizing their connections in a 3D space.

## Features

- **Module 1: Setup and Game Hosting**
  - Create or join game sessions
  - Support for 2-3 players per session

- **Module 2: Main Display**
  - 3D visualization of the Nexus (central brain) and player nodes
  - Interactive orbiting nodes representing each player
  - Real-time visual feedback of active players

- **Module 3: Terminal UI**
  - Individual terminal interfaces for each player
  - Turn-based interaction with the Nexus
  - Message history and visual indication of active player

- **Module 4: LLM Infrastructure**
  - Integration with OpenAI API
  - Dynamic prompt selection for varied gameplay
  - Message parsing for targeted player interactions

## Project Structure

```
/the-nexus
├── /client                  # React frontend
│   ├── /src
│   │   ├── /components      # React components
│   │   │   ├── Setup.js     # Session setup component
│   │   │   ├── GameSession.js # Main game component
│   │   │   ├── NexusVisualization.js # 3D visualization
│   │   │   └── TerminalUI.js # Terminal interface
│   │   ├── App.js           # Main React component
│   │   └── index.js         # Entry point
│   └── package.json         # Frontend dependencies
├── /server                  # Node.js backend
│   ├── /src
│   │   ├── /services        # Business logic
│   │   │   └── llmService.js # OpenAI integration
│   │   ├── /utils           # Utility functions
│   │   │   └── responseParser.js # LLM response parser
│   │   └── index.js         # Server entry point
│   ├── .env.example         # Environment variables template
│   └── package.json         # Backend dependencies
└── README.md                # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn
- OpenAI API key (for LLM functionality)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd the-nexus
   ```

2. Install dependencies for both client and server:
   ```
   # Install client dependencies
   cd client
   npm install

   # Install server dependencies
   cd ../server
   npm install
   ```

3. Set up environment variables:
   ```
   # In the server directory
   cp .env.example .env
   ```
   Then edit the `.env` file to add your OpenAI API key.

### Running the Application

1. Start the server:
   ```
   # In the server directory
   npm run dev
   ```

2. Start the client:
   ```
   # In the client directory
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Current Limitations

- The application currently mocks multiplayer functionality for local testing
- In the future, real-time multiplayer will be implemented
- Database integration is planned for future versions

## Future Enhancements

- Real-time multiplayer with Socket.io
- Database integration for persistent sessions
- Enhanced 3D visualizations and effects
- More sophisticated LLM prompts and game mechanics
- User authentication and profiles
