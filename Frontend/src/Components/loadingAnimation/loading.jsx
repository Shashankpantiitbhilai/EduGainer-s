import React, { useState, useEffect } from "react";
import { Box, Typography, LinearProgress, Container, useTheme, keyframes, styled, alpha } from "@mui/material";
import {
  Book as BookIcon,
  School as SchoolIcon,
  Lightbulb as LightbulbIcon,
  AutoStories as AutoStoriesIcon,
} from "@mui/icons-material";
import { designTokens, glassMorphism } from '../../theme/enterpriseTheme';

// Enhanced animations for enterprise theme
const float = keyframes`
  0%, 100% { 
    transform: translateY(0px) rotate(0deg) scale(1);
  }
  25% { 
    transform: translateY(-20px) rotate(5deg) scale(1.05);
  }
  50% { 
    transform: translateY(-10px) rotate(0deg) scale(1.1);
  }
  75% { 
    transform: translateY(-15px) rotate(-3deg) scale(1.05);
  }
`;

const shimmer = keyframes`
  0% { 
    transform: translateX(-100%);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% { 
    transform: translateX(100%);
    opacity: 0;
  }
`;

const pulse = keyframes`
  0%, 100% { 
    opacity: 1; 
    transform: scale(1);
  }
  50% { 
    opacity: 0.8; 
    transform: scale(1.1);
  }
`;

const breathe = keyframes`
  0%, 100% { 
    transform: scale(1);
    filter: brightness(1);
  }
  50% { 
    transform: scale(1.03);
    filter: brightness(1.1);
  }
`;

const slideInFromBottom = keyframes`
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const progressGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 5px rgba(25, 118, 210, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(25, 118, 210, 0.6), 0 0 30px rgba(25, 118, 210, 0.4);
  }
`;

// Styled components for enterprise loading
const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: theme.spacing(3),
  marginTop: theme.spacing(6),
  marginBottom: theme.spacing(4),
}));

const AnimatedIcon = styled(Box)(({ theme, delay = 0 }) => ({
  width: 80,
  height: 80,
  borderRadius: designTokens.borderRadius.xl,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark}, ${theme.palette.secondary.main})`,
  color: theme.palette.primar,
  animation: `${float} 4s ease-in-out infinite, ${breathe} 2s ease-in-out infinite`,
  animationDelay: `${delay}s, ${delay + 0.5}s`,
  boxShadow: `
    0 8px 32px ${alpha(theme.palette.primary.main, 0.4)},
    0 4px 16px ${alpha(theme.palette.primary.main, 0.3)},
    inset 0 1px 0 ${alpha(theme.palette.common.white, 0.2)}
  `,
  position: 'relative',
  overflow: 'hidden',
  ...glassMorphism(0.1),
  cursor: 'pointer',
  transition: `all ${designTokens.animation.duration.normal} ${designTokens.animation.easing.default}`,
  '&:hover': {
    transform: 'scale(1.1) translateY(-5px)',
    boxShadow: `
      0 12px 48px ${alpha(theme.palette.primary.main, 0.5)},
      0 8px 24px ${alpha(theme.palette.primary.main, 0.4)}
    `,
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.common.white, 0.5)}, transparent)`,
    animation: `${shimmer} 3s infinite`,
    animationDelay: `${delay}s`,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 2,
    left: 2,
    right: 2,
    bottom: 2,
    borderRadius: 'inherit',
    border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
    pointerEvents: 'none',
  },
}));

const EnterpriseProgressBar = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: 600,
  marginTop: theme.spacing(8),
  padding: theme.spacing(0, 2),
  position: 'relative',
  animation: `${slideInFromBottom} 1s ease-out 0.5s backwards`,
}));

const ProgressContainer = styled(Box)(({ theme }) => ({
  height: 16,
  borderRadius: designTokens.borderRadius.xl,
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  overflow: 'hidden',
  position: 'relative',
  border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  ...glassMorphism(0.05),
  animation: `${progressGlow} 2s ease-in-out infinite`,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.common.white, 0.1)}, transparent)`,
    animation: `${shimmer} 2s infinite`,
  },
}));

const ProgressFill = styled(Box)(({ theme, progress }) => ({
  height: '100%',
  width: `${progress}%`,
  background: `linear-gradient(90deg, 
    ${theme.palette.primary.main}, 
    ${theme.palette.primary.light}, 
    ${theme.palette.secondary.main}, 
    ${theme.palette.secondary.light}
  )`,
  borderRadius: 'inherit',
  transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  boxShadow: `
    0 0 10px ${alpha(theme.palette.primary.main, 0.5)},
    inset 0 1px 0 ${alpha(theme.palette.common.white, 0.3)}
  `,
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.common.white, 0.4)}, transparent)`,
    animation: `${shimmer} 2s infinite`,
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    width: 20,
    height: '100%',
    background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.common.white, 0.6)})`,
    borderRadius: 'inherit',
    animation: progress > 0 ? `${pulse} 1s ease-in-out infinite` : 'none',
  },
}));

const LoadingAnimation = () => {
  const theme = useTheme();
  const icons = [
    { Icon: BookIcon, delay: 0, title: "Books" },
    { Icon: SchoolIcon, delay: 0.3, title: "School" },
    { Icon: LightbulbIcon, delay: 0.6, title: "Ideas" },
    { Icon: AutoStoriesIcon, delay: 0.9, title: "Stories" },
  ];

  return (
    <LoadingContainer>
      {icons.map(({ Icon, delay, title }, index) => (
        <AnimatedIcon key={index} delay={delay} title={title}>
          <Icon sx={{ fontSize: 40 }} />
        </AnimatedIcon>
      ))}
    </LoadingContainer>
  );
};

const ProgressBar = ({ progress }) => {
  const theme = useTheme();
  
  return (
    <EnterpriseProgressBar>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing(3) }}>
        <Typography 
          variant="body1" 
          sx={{ 
            fontWeight: designTokens.typography.fontWeight.bold,
            color: theme.palette.text.primary,
            fontSize: { xs: "1rem", sm: "1.1rem" },
          }}
        >
          Loading Experience...
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: designTokens.typography.fontWeight.bold,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: `${pulse} 2s ease-in-out infinite`,
            fontSize: { xs: "1.2rem", sm: "1.5rem" },
          }}
        >
          {progress}%
        </Typography>
      </Box>
      <ProgressContainer>
        <ProgressFill progress={progress} />
      </ProgressContainer>
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: theme.spacing(2) }}>
        <Typography 
          variant="caption" 
          sx={{ 
            color: theme.palette.text.secondary,
            fontWeight: designTokens.typography.fontWeight.medium,
            textAlign: 'center',
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
          }}
        >
          {progress < 25 && "Initializing..."}
          {progress >= 25 && progress < 50 && "Loading Resources..."}
          {progress >= 50 && progress < 75 && "Setting up Environment..."}
          {progress >= 75 && progress < 100 && "Almost Ready..."}
          {progress === 100 && "Complete!"}
        </Typography>
      </Box>
    </EnterpriseProgressBar>
  );
};

export default function EdugainersLoadingPage() {
  const [progress, setProgress] = useState(0);
  const theme = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress((prevProgress) => {
        if (prevProgress === 100) {
          return 0;
        }
        // More dynamic progress increment
        const baseIncrement = Math.floor(Math.random() * 5) + 1;
        const speedMultiplier = prevProgress < 20 ? 2 : prevProgress < 80 ? 1.5 : 0.8;
        const increment = Math.floor(baseIncrement * speedMultiplier);
        return Math.min(prevProgress + increment, 100);
      });
    }, 120); // Slightly faster updates

    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <Container
      maxWidth={false}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: `linear-gradient(135deg, 
          ${theme.palette.background.default} 0%, 
          ${alpha(theme.palette.primary.main, 0.05)} 30%,
          ${alpha(theme.palette.secondary.main, 0.03)} 70%,
          ${theme.palette.background.default} 100%
        )`,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, ${alpha(theme.palette.secondary.main, 0.1)} 0%, transparent 50%)
          `,
          pointerEvents: 'none',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(45deg, transparent 30%, ${alpha(theme.palette.common.white, 0.02)} 50%, transparent 70%)`,
          pointerEvents: 'none',
          animation: `${shimmer} 8s infinite`,
        },
      }}
    >
      {/* Welcome Title */}
      <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', marginBottom: theme.spacing(6) }}>
        <Typography
          variant="h3"
          component="h3"
          sx={{
            fontWeight: designTokens.typography.fontWeight.bold,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, ${theme.palette.primary.dark})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: theme.spacing(3),
            fontSize: { xs: "2.5rem", sm: "4rem", md: "5rem", lg: "6rem" },
            textAlign: "center",
            animation: `${breathe} 4s ease-in-out infinite, ${slideInFromBottom} 1s ease-out`,
            textShadow: `0 0 30px ${alpha(theme.palette.primary.main, 0.3)}`,
            letterSpacing: '-0.02em',
          }}
        >
          Welcome to EduGainer's
        </Typography>
        
        <Typography
          variant="h4"
          sx={{
            color: theme.palette.text.secondary,
            fontWeight: designTokens.typography.fontWeight.medium,
            fontSize: { xs: "1.2rem", sm: "1.5rem", md: "2rem" },
            textAlign: "center",
            opacity: 0.9,
            letterSpacing: '0.5px',
            animation: `${slideInFromBottom} 1s ease-out 0.3s backwards`,
            marginBottom: theme.spacing(2),
          }}
        >
         Curiosity · Dedication · Perseverance
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
            fontWeight: designTokens.typography.fontWeight.regular,
            fontSize: { xs: "1rem", sm: "1.1rem" },
            textAlign: "center",
            opacity: 0.7,
            animation: `${slideInFromBottom} 1s ease-out 0.6s backwards`,
            maxWidth: 600,
            margin: '0 auto',
          }}
        >
          Experience the future of education with our comprehensive learning platform
        </Typography>
      </Box>

      {/* Enhanced Loading Animation */}
      <LoadingAnimation />
      
      {/* Enhanced Progress Bar */}
      <ProgressBar progress={progress} />
      
      {/* Loading Status */}
      <Typography
        variant="h5"
        sx={{
          marginTop: theme.spacing(6),
          color: theme.palette.text.primary,
          fontWeight: designTokens.typography.fontWeight.medium,
          textAlign: "center",
          fontSize: { xs: "1.1rem", sm: "1.3rem" },
          position: 'relative',
          zIndex: 1,
          animation: `${slideInFromBottom} 1s ease-out 1s backwards, ${pulse} 3s ease-in-out 2s infinite`,
        }}
      >
        {progress < 25 && 'Preparing your learning experience...'}
        {progress >= 25 && progress < 50 && 'Loading educational resources...'}
        {progress >= 50 && progress < 75 && 'Setting up your environment...'}
        {progress >= 75 && progress < 100 && 'Almost ready to explore!'}
        {progress === 100 && '🎉 Ready to begin your journey!'}
      </Typography>
    </Container>
  );
}
