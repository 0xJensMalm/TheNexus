import React from 'react';
import styled from 'styled-components';
import theme from '../../theme';

// Styled button with terminal aesthetics
const StyledButton = styled.button`
  cursor: pointer;
  padding: ${props => props.size === 'small' ? 
    `${theme.spacing.xs} ${theme.spacing.sm}` : 
    `${theme.spacing.sm} ${theme.spacing.lg}`};
  background-color: ${theme.colors.background.terminal};
  color: ${props => props.variant === 'danger' ? 
    theme.colors.text.error : 
    props.variant === 'success' ? 
    theme.colors.text.success : 
    theme.colors.text.accent};
  border: 1px solid ${props => props.variant === 'danger' ? 
    theme.colors.text.error : 
    props.variant === 'success' ? 
    theme.colors.text.success : 
    theme.colors.text.accent};
  font-family: ${theme.fonts.primary};
  font-size: ${props => props.size === 'small' ? 
    theme.fonts.sizes.sm : 
    theme.fonts.sizes.md};
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all ${theme.animations.durations.fast} ${theme.animations.easings.default};
  position: relative;
  overflow: hidden;
  outline: none;
  
  &:hover, &:focus {
    background-color: ${props => props.variant === 'danger' ? 
      'rgba(224, 108, 117, 0.1)' : 
      props.variant === 'success' ? 
      'rgba(152, 195, 121, 0.1)' : 
      'rgba(230, 192, 123, 0.1)'};
    box-shadow: 0 0 10px ${props => props.variant === 'danger' ? 
      'rgba(224, 108, 117, 0.3)' : 
      props.variant === 'success' ? 
      'rgba(152, 195, 121, 0.3)' : 
      'rgba(230, 192, 123, 0.3)'};
  }
  
  &:active {
    transform: translateY(1px);
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    background-color: ${theme.colors.background.terminal};
    border-color: ${theme.colors.border.primary};
    color: ${theme.colors.text.secondary};
    box-shadow: none;
    transform: none;
  }
  
  &::before {
    content: ">";
    margin-right: ${theme.spacing.xs};
    color: ${props => props.variant === 'danger' ? 
      theme.colors.text.error : 
      props.variant === 'success' ? 
      theme.colors.text.success : 
      theme.colors.text.info};
  }
`;

/**
 * TerminalButton component
 * 
 * A styled button component with retro terminal aesthetics
 * 
 * @param {Object} props - Component props
 * @param {string} props.variant - Button variant ('default', 'success', 'danger')
 * @param {string} props.size - Button size ('default', 'small')
 * @param {boolean} props.disabled - Whether the button is disabled
 * @param {function} props.onClick - Click handler function
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Additional inline styles
 * @param {React.ReactNode} props.children - Button content
 */
const TerminalButton = ({
  variant = 'default',
  size = 'default',
  disabled = false,
  onClick,
  className,
  style,
  children,
  ...rest
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      disabled={disabled}
      onClick={onClick}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </StyledButton>
  );
};

export default TerminalButton;
