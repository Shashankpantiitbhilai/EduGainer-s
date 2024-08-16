import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  LinearProgress,
  CircularProgress,
  Fade,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2ecc71", // Green
      dark: "darkgreen", // Dark Green
    },
    secondary: {
      main: "#e67e22", // Orange
    },
    background: {
      default: "#ffffff",
    },
  },
});

const LoadingAnimation = () => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0);
  const tagline = ["Curiosity", "Dedication", "Perseverance"];

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setLoadingProgress((prev) => (prev < 100 ? prev + 1 : 0));
    }, 50);

    const taglineTimer = setInterval(() => {
      setCurrentTaglineIndex((prev) => (prev + 1) % tagline.length);
    }, 3000);

    return () => {
      clearInterval(progressTimer);
      clearInterval(taglineTimer);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        sx={{ backgroundColor: "background.default" }}
      >
        <Box position="relative" mb={4}>
          <Typography
            variant="h1"
            component="h1"
            sx={{
              color: "primary.dark",
              fontWeight: "bold",
              fontSize: "4rem",
              textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
              mb: 2,
            }}
          >
            EduGainer's
          </Typography>
          <CircularProgress
            size={150}
            thickness={5}
            variant="determinate"
            value={loadingProgress}
            sx={{
              color: "primary.main",
              position: "absolute",
              top: "100%",
              left: "50%",
              marginTop: "20px",
              marginLeft: "-75px",
            }}
          />
        </Box>
        <Box height="60px" mb={4}>
          <Fade in={true} timeout={1000}>
            <Typography
              variant="h4"
              sx={{
                color: "secondary.main",
                fontWeight: "medium",
                textAlign: "center",
              }}
            >
              {tagline[currentTaglineIndex]}
            </Typography>
          </Fade>
        </Box>
        <Box width="100%" maxWidth={400} position="relative" mb={2}>
          <LinearProgress
            variant="determinate"
            value={loadingProgress}
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: "primary.light",
              "& .MuiLinearProgress-bar": {
                borderRadius: 5,
                backgroundColor: "secondary.main",
              },
            }}
          />
          <Typography
            variant="h6"
            sx={{
              color: "primary.dark",
              position: "absolute",
              top: "-30px",
              left: "50%",
              transform: "translateX(-50%)",
              fontWeight: "bold",
            }}
          >
            {`${Math.round(loadingProgress)}%`}
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default LoadingAnimation;
