import React from 'react';
import styled from 'styled-components';
import theme from '../../theme';

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: ${theme.spacing.sm};
  position: relative;
`;

const Prompt = styled.span`
  color: ${theme.colors.text.info};
  margin-right: ${theme.spacing.xs};
  font-family: ${theme.fonts.primary};
  user-select: none;
`;

const StyledInput = styled.input`
  background-color: transparent;
  border: none;
  border-bottom: 1px solid ${props => props.error ? 
    theme.colors.text.error : 
    theme.colors.border.primary};
  color: ${props => props.error ? 
    theme.colors.text.error : 
    theme.colors.text.primary};
  font-family: ${theme.fonts.primary};
  font-size: ${theme.fonts.sizes.md};
  padding: ${theme.spacing.xs} 0;
  flex: 1;
  outline: none;
  transition: border-color ${theme.animations.durations.fast} ${theme.animations.easings.default};
  
  &:focus {
    border-color: ${props => props.error ? 
      theme.colors.text.error : 
      theme.colors.text.accent};
    box-shadow: 0 1px 0 0 ${props => props.error ? 
      'rgba(224, 108, 117, 0.3)' : 
      'rgba(230, 192, 123, 0.3)'};
  }
  
  &::placeholder {
    color: ${theme.colors.text.secondary};
    opacity: 0.6;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    border-color: ${theme.colors.border.primary};
  }
`;

const ErrorMessage = styled.div`
  color: ${theme.colors.text.error};
  font-size: ${theme.fonts.sizes.sm};
  margin-top: ${theme.spacing.xs};
  font-family: ${theme.fonts.primary};
`;

const Cursor = styled.span`
  display: ${props => props.active ? 'inline-block' : 'none'};
  width: 8px;
  height: 16px;
  background-color: ${theme.colors.text.accent};
  margin-left: 2px;
  animation: cursor-blink 1s infinite;
  vertical-align: middle;
  
  @keyframes cursor-blink {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
`;

/**
 * TerminalInput component
 * 
 * A styled input component with retro terminal aesthetics
 * 
 * @param {Object} props - Component props
 * @param {string} props.value - Input value
 * @param {function} props.onChange - Change handler function
 * @param {string} props.placeholder - Input placeholder
 * @param {string} props.prompt - Custom prompt character/text (default: '>')
 * @param {boolean} props.error - Whether the input has an error
 * @param {string} props.errorMessage - Error message to display
 * @param {boolean} props.disabled - Whether the input is disabled
 * @param {boolean} props.showCursor - Whether to show the blinking cursor
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Additional inline styles
 */
const TerminalInput = ({
  value,
  onChange,
  placeholder,
  prompt = '>',
  error,
  errorMessage,
  disabled,
  showCursor = true,
  className,
  style,
  ...rest
}) => {
  return (
    <div className={className} style={style}>
      <InputContainer>
        <Prompt>{prompt}</Prompt>
        <StyledInput
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          error={error}
          disabled={disabled}
          {...rest}
        />
        <Cursor active={showCursor && !disabled} />
      </InputContainer>
      {error && errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </div>
  );
};

export default TerminalInput;
