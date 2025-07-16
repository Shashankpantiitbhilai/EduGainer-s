import React, { useState, useEffect } from "react";
import { Box, Typography, Container, useTheme, keyframes, styled } from "@mui/material";
import { School as SchoolIcon } from "@mui/icons-material";

// Simple, smooth animations
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
`;

// Simple loader components
const LoaderContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '2rem',
});

const Spinner = styled(Box)(({ theme }) => ({
  width: 60,
  height: 60,
  border: `4px solid ${theme.palette.grey[200]}`,
  borderTop: `4px solid ${theme.palette.primary.main}`,
  borderRadius: '50%',
  animation: `${spin} 1s linear infinite`,
}));

const ProgressBar = styled(Box)(({ theme }) => ({
  width: 300,
  height: 4,
  backgroundColor: theme.palette.grey[200],
  borderRadius: 2,
  overflow: 'hidden',
  position: 'relative',
}));

const ProgressFill = styled(Box)(({ progress, theme }) => ({
  height: '100%',
  width: `${progress}%`,
  backgroundColor: theme.palette.primary.main,
  borderRadius: 2,
  transition: 'width 0.3s ease',
}));

export default function EdugainersLoadingPage() {
  const [progress, setProgress] = useState(0);
  const theme = useTheme();

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + Math.random() * 3 + 1;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <Container
      maxWidth={false}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
      }}
    >
      <LoaderContainer>
        {/* Logo/Icon */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            marginBottom: 3,
            animation: `${fadeIn} 0.6s ease-out`,
          }}
        >
          <SchoolIcon 
            sx={{ 
              fontSize: 48, 
              color: theme.palette.primary.main 
            }} 
          />
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              color: theme.palette.primary.main,
            }}
          >
            EduGainer's
          </Typography>
        </Box>

        {/* Loading Spinner */}
        <Spinner />

        {/* Progress Bar */}
        <ProgressBar>
          <ProgressFill progress={Math.min(progress, 100)} />
        </ProgressBar>

        {/* Loading Text */}
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
            animation: `${pulse} 2s ease-in-out infinite`,
            textAlign: 'center',
          }}
        >
          {progress < 30 && 'Loading...'}
          {progress >= 30 && progress < 70 && 'Setting up...'}
          {progress >= 70 && progress < 100 && 'Almost ready...'}
          {progress >= 100 && 'Ready!'}
        </Typography>

        {/* Progress Percentage */}
        <Typography
          variant="h6"
          sx={{
            color: theme.palette.primary.main,
            fontWeight: 'bold',
          }}
        >
          {Math.round(progress)}%
        </Typography>
      </LoaderContainer>
    </Container>
  );
}
