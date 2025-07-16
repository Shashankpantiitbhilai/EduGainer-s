import React, { useState, useEffect } from 'react';
import { Box, Typography, keyframes } from '@mui/material';
import { styled } from '@mui/material/styles';

// Keyframe animations
const flipPages = keyframes`
  0% { transform: rotateY(0deg); }
  25% { transform: rotateY(-15deg); }
  50% { transform: rotateY(0deg); }
  75% { transform: rotateY(15deg); }
  100% { transform: rotateY(0deg); }
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-8px); }
  60% { transform: translateY(-4px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
`;

const sparkle = keyframes`
  0% { transform: scale(0) rotate(0deg); opacity: 0; }
  50% { transform: scale(1) rotate(180deg); opacity: 1; }
  100% { transform: scale(0) rotate(360deg); opacity: 0; }
`;

// Styled components
const AnimationContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
  padding: '16px',
  minHeight: '60px',
}));

const BookIcon = styled(Box)(({ theme }) => ({
  fontSize: '24px',
  animation: `${flipPages} 2s ease-in-out infinite`,
  transformStyle: 'preserve-3d',
  filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))',
}));

const MagnifyingGlass = styled(Box)(({ theme }) => ({
  fontSize: '20px',
  animation: `${bounce} 1.5s ease-in-out infinite`,
  transformOrigin: 'center',
}));

const SparkleIcon = styled(Box)(({ theme }) => ({
  fontSize: '18px',
  animation: `${sparkle} 1s ease-in-out infinite`,
  position: 'relative',
}));

const AnimatedText = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  color: theme.palette.text.secondary,
  animation: `${pulse} 2s ease-in-out infinite`,
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
}));

const TypingDots = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '3px',
  '& span': {
    width: '6px',
    height: '6px',
    backgroundColor: theme.palette.primary.main,
    borderRadius: '50%',
    display: 'inline-block',
    animation: `${bounce} 1.4s ease-in-out infinite both`,
    '&:nth-of-type(1)': { animationDelay: '0s' },
    '&:nth-of-type(2)': { animationDelay: '0.2s' },
    '&:nth-of-type(3)': { animationDelay: '0.4s' },
  },
}));

const ResearchingAnimation = ({ isComplete = false }) => {
  const [currentPhase, setCurrentPhase] = useState(0);

  const phases = [
    { icon: '📖', text: 'Researching', component: BookIcon },
    { icon: '🔍', text: 'Analyzing', component: MagnifyingGlass },
  ];

  const completePhase = { icon: '✨', text: 'Ready', component: SparkleIcon };

  useEffect(() => {
    if (!isComplete) {
      const interval = setInterval(() => {
        setCurrentPhase((prev) => (prev + 1) % phases.length);
      }, 2000); // Change phase every 2 seconds

      return () => clearInterval(interval);
    }
  }, [isComplete, phases.length]);

  const currentData = isComplete ? completePhase : phases[currentPhase];

  const CurrentIconComponent = currentData.component;

  return (
    <AnimationContainer>
      <CurrentIconComponent>
        {currentData.icon}
      </CurrentIconComponent>
      
      <AnimatedText variant="body2">
        {currentData.text}
        {!isComplete && (
          <TypingDots>
            <span />
            <span />
            <span />
          </TypingDots>
        )}
      </AnimatedText>
    </AnimationContainer>
  );
};

export default ResearchingAnimation;
