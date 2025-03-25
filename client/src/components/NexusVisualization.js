import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';
import styled from 'styled-components';

const CanvasContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: transparent;
`;

// Brain/Nexus component
function Brain() {
  const brainRef = useRef();
  
  useFrame(() => {
    if (brainRef.current) {
      brainRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={brainRef}>
      <Sphere args={[1, 32, 32]}>
        <meshStandardMaterial 
          color="#4a00e0" 
          emissive="#2a0080"
          roughness={0.4}
          metalness={0.8}
          wireframe={true}
        />
      </Sphere>
      <Sphere args={[0.9, 32, 32]}>
        <meshStandardMaterial 
          color="#6c00ff" 
          emissive="#4a00e0"
          transparent={true}
          opacity={0.6}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
      <pointLight position={[0, 0, 0]} intensity={2} color="#6c00ff" />
    </group>
  );
}

// Player node component
function PlayerNode({ index, totalPlayers, player, active }) {
  const nodeRef = useRef();
  const orbitRadius = 3;
  const orbitSpeed = 0.001 * (index + 1);
  const startAngle = (index / totalPlayers) * Math.PI * 2;
  
  useFrame(({ clock }) => {
    if (nodeRef.current) {
      const angle = startAngle + clock.getElapsedTime() * orbitSpeed;
      nodeRef.current.position.x = Math.cos(angle) * orbitRadius;
      nodeRef.current.position.z = Math.sin(angle) * orbitRadius;
      nodeRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={nodeRef}>
      <Sphere args={[0.4, 24, 24]}>
        <meshStandardMaterial 
          color={active ? "#33ff33" : "#3366ff"} 
          emissive={active ? "#00ff00" : "#0033cc"}
          roughness={0.3}
          metalness={0.7}
        />
      </Sphere>
      <pointLight position={[0, 0, 0]} intensity={0.8} color={active ? "#33ff33" : "#3366ff"} />
      <Html position={[0, 0.7, 0]}>
        <PlayerLabel>{player.username}</PlayerLabel>
      </Html>
    </group>
  );
}

// Connection lines between Nexus and player nodes
function ConnectionLines({ players, activePlayer }) {
  const linesRef = useRef();
  
  useFrame(({ scene }) => {
    if (linesRef.current) {
      // Find the brain and player nodes in the scene
      const brain = scene.getObjectByName('brain');
      const playerNodes = players.map((_, i) => 
        scene.getObjectByName(`player-${i}`)
      );
      
      // Update line positions
      if (brain && playerNodes.every(node => node)) {
        const brainPosition = new THREE.Vector3();
        brain.getWorldPosition(brainPosition);
        
        playerNodes.forEach((node, i) => {
          const nodePosition = new THREE.Vector3();
          node.getWorldPosition(nodePosition);
          
          const lineGeometry = new THREE.BufferGeometry().setFromPoints([
            brainPosition,
            nodePosition
          ]);
          
          const line = linesRef.current.children[i];
          line.geometry.dispose();
          line.geometry = lineGeometry;
        });
      }
    }
  });

  return (
    <group ref={linesRef}>
      {players.map((player, i) => (
        <line key={i}>
          <bufferGeometry />
          <lineBasicMaterial 
            color={activePlayer === i ? "#33ff33" : "#3366ff"} 
            linewidth={1} 
            opacity={0.7} 
            transparent 
          />
        </line>
      ))}
    </group>
  );
}

const PlayerLabel = styled.div`
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  font-family: 'Orbitron', sans-serif;
`;

function NexusVisualization({ players, activePlayerIndex }) {
  return (
    <CanvasContainer>
      <Canvas camera={{ position: [0, 2, 7], fov: 60 }}>
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 5]} intensity={0.5} />
        
        {/* Main Nexus/Brain */}
        <Brain name="brain" />
        
        {/* Player Nodes */}
        {players.map((player, i) => (
          <PlayerNode 
            key={i}
            name={`player-${i}`}
            index={i} 
            totalPlayers={players.length} 
            player={player}
            active={i === activePlayerIndex}
          />
        ))}
        
        {/* Connection Lines */}
        <ConnectionLines 
          players={players} 
          activePlayer={activePlayerIndex} 
        />
        
        {/* Controls */}
        <OrbitControls 
          enableZoom={true}
          enablePan={false}
          minDistance={4}
          maxDistance={10}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
    </CanvasContainer>
  );
}

export default NexusVisualization;
