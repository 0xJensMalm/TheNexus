// theme.js - Centralized styling for The Nexus application
// This file contains all color variables, styling constants, and theme-related utilities

const theme = {
  // Color palette
  colors: {
    // Base colors
    background: {
      primary: '#1a1a2e',
      secondary: '#16213e',
      tertiary: '#0d1117',
      terminal: '#2a2a40'
    },
    text: {
      primary: '#e0e0e0',
      secondary: '#777',
      accent: '#e6c07b',
      success: '#98c379',
      info: '#61afef',
      warning: '#e5c07b',
      error: '#e06c75',
      purple: '#c678dd'
    },
    border: {
      primary: '#444',
      light: '#555',
      accent: '#e6c07b',
      info: '#61afef',
      success: '#98c379'
    },
    gradients: {
      header: 'linear-gradient(90deg, transparent, #e6c07b, transparent)',
      accent: 'linear-gradient(90deg, #e6c07b, #61afef)'
    }
  },
  
  // Typography
  fonts: {
    primary: "'IBM Plex Mono', 'Courier New', monospace",
    sizes: {
      xs: '0.7rem',
      sm: '0.8rem',
      md: '1rem',
      lg: '1.2rem',
      xl: '1.5rem',
      xxl: '2.5rem'
    },
    weights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    lineHeights: {
      tight: 1.2,
      normal: 1.6,
      loose: 1.8
    }
  },
  
  // Spacing
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '2.5rem'
  },
  
  // Animations
  animations: {
    durations: {
      fast: '0.2s',
      normal: '0.3s',
      slow: '0.5s',
      verySlow: '1s'
    },
    easings: {
      default: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
      linear: 'linear'
    }
  },
  
  // Media queries
  breakpoints: {
    xs: '480px',
    sm: '768px',
    md: '992px',
    lg: '1200px'
  },
  
  // Shadows
  shadows: {
    sm: '0 2px 8px rgba(0, 0, 0, 0.15)',
    md: '0 4px 16px rgba(0, 0, 0, 0.2)',
    lg: '0 8px 32px rgba(0, 0, 0, 0.3)'
  },
  
  // Z-index layers
  zIndex: {
    base: 1,
    content: 3,
    header: 10,
    overlay: 50,
    modal: 100,
    toast: 1000
  }
};

export default theme;
