import React from 'react';
import styled from 'styled-components';

// Styled components for CRT effects
const ScanLine = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(
    to bottom,
    rgba(230, 192, 123, 0),
    rgba(230, 192, 123, 0.3),
    rgba(230, 192, 123, 0)
  );
  animation: scan-line 8s linear infinite;
  pointer-events: none;
  z-index: 100;

  @keyframes scan-line {
    0% {
      transform: translateY(-100%);
    }
    100% {
      transform: translateY(100vh);
    }
  }
`;

const CRTEffect = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 99;
  background: 
    linear-gradient(
      rgba(18, 16, 16, 0) 50%, 
      rgba(0, 0, 0, 0.1) 50%
    ),
    linear-gradient(
      90deg,
      rgba(255, 0, 0, 0.03),
      rgba(0, 255, 0, 0.02),
      rgba(0, 0, 255, 0.03)
    );
  background-size: 100% 2px, 3px 100%;
  animation: flicker 0.3s infinite;

  @keyframes flicker {
    0% {
      opacity: 0.97;
    }
    5% {
      opacity: 0.95;
    }
    10% {
      opacity: 0.97;
    }
    15% {
      opacity: 0.94;
    }
    20% {
      opacity: 0.98;
    }
    50% {
      opacity: 0.95;
    }
    80% {
      opacity: 0.96;
    }
    100% {
      opacity: 0.97;
    }
  }
`;

const ScreenGlow = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    circle at center,
    rgba(26, 26, 46, 0.4) 0%,
    rgba(26, 26, 46, 0.8) 70%,
    rgba(26, 26, 46, 1) 100%
  );
  pointer-events: none;
  z-index: 98;
`;

/**
 * CRTEffects component
 * 
 * Provides retro terminal CRT screen effects including:
 * - Scan lines
 * - Screen flicker
 * - CRT glow
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.showScanLine - Whether to show the scan line effect
 * @param {boolean} props.showFlicker - Whether to show the flicker effect
 * @param {boolean} props.showGlow - Whether to show the screen glow effect
 */
const CRTEffects = ({ 
  showScanLine = true, 
  showFlicker = true, 
  showGlow = true 
}) => {
  return (
    <>
      {showScanLine && <ScanLine />}
      {showFlicker && <CRTEffect />}
      {showGlow && <ScreenGlow />}
    </>
  );
};

export default CRTEffects;
