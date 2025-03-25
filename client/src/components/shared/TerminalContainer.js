import React from 'react';
import styled from 'styled-components';
import theme from '../../theme';

// Terminal container with retro styling
const Container = styled.div`
  background-color: ${theme.colors.background.tertiary};
  border: 1px solid ${theme.colors.border.primary};
  padding: ${theme.spacing.md};
  font-family: ${theme.fonts.primary};
  color: ${theme.colors.text.success};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: "${props => props.title || 'NEXUS TERMINAL'}";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background-color: ${theme.colors.background.terminal};
    color: ${theme.colors.text.accent};
    padding: ${theme.spacing.xs} ${theme.spacing.md};
    font-size: ${theme.fonts.sizes.sm};
    border-bottom: 1px solid ${theme.colors.border.primary};
  }
  
  // Scanlines effect inside the terminal
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.15),
      rgba(0, 0, 0, 0.15) 1px,
      transparent 1px,
      transparent 2px
    );
    pointer-events: none;
    z-index: 1;
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 2;
  margin-top: ${props => props.hasTitle ? '2rem' : '0'};
`;

/**
 * TerminalContainer component
 * 
 * A reusable styled container that provides a terminal-like appearance
 * for content with optional title and custom styling.
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Title to display in the terminal header
 * @param {React.ReactNode} props.children - Content to display inside the terminal
 * @param {string} props.className - Additional CSS classes to apply
 * @param {Object} props.style - Additional inline styles to apply
 */
const TerminalContainer = ({ 
  title, 
  children, 
  className, 
  style 
}) => {
  return (
    <Container title={title} className={className} style={style}>
      <Content hasTitle={!!title}>
        {children}
      </Content>
    </Container>
  );
};

export default TerminalContainer;
