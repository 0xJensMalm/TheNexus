# The Nexus - Shared Components

This directory contains shared components that implement the retro terminal styling across the application. These components provide a consistent look and feel while reducing code duplication.

## Theme System

The application uses a centralized theme system defined in `/src/theme.js`. This file contains all color variables, spacing, typography, and other styling constants used throughout the application.

## Available Components

### CRTEffects

Provides retro CRT screen effects including:
- Scan lines
- Screen flicker
- CRT glow

```jsx
import { CRTEffects } from './components/shared';

// In your component:
<CRTEffects 
  showScanLine={true} 
  showFlicker={true} 
  showGlow={true} 
/>
```

### TerminalContainer

A styled container that provides a terminal-like appearance for content with an optional title.

```jsx
import { TerminalContainer } from './components/shared';

// In your component:
<TerminalContainer title="SYSTEM STATUS">
  <p>Content goes here...</p>
</TerminalContainer>
```

### TerminalButton

A styled button component with retro terminal aesthetics.

```jsx
import { TerminalButton } from './components/shared';

// In your component:
<TerminalButton 
  variant="default" // or "success", "danger"
  size="default" // or "small"
  onClick={handleClick}
>
  EXECUTE
</TerminalButton>
```

### TerminalInput

A styled input component with retro terminal aesthetics.

```jsx
import { TerminalInput } from './components/shared';

// In your component:
<TerminalInput
  value={inputValue}
  onChange={handleInputChange}
  placeholder="Enter command..."
  prompt=">"
  error={hasError}
  errorMessage="Invalid command"
/>
```

## Usage Guidelines

1. Always import components from the index file:
   ```jsx
   import { ComponentName } from './components/shared';
   ```

2. Use the theme variables for any custom styling:
   ```jsx
   import theme from '../theme';
   
   const CustomElement = styled.div`
     color: ${theme.colors.text.accent};
     padding: ${theme.spacing.md};
   `;
   ```

3. When creating new components, follow the existing pattern and add them to the index file.
