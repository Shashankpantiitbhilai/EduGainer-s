import React, { useState, useEffect } from "react";
import { Box, Typography, LinearProgress, Container } from "@mui/material";
import {
  Book as BookIcon,
  School as SchoolIcon,
  Lightbulb as LightbulbIcon,
} from "@mui/icons-material";

const LoadingAnimation = () => (
  <Box sx={{ display: "flex", justifyContent: "center", mt: 5, gap: 4 }}>
    {[BookIcon, SchoolIcon, LightbulbIcon].map((Icon, index) => (
      <Icon
        key={index}
        sx={{
          fontSize: 48,
          color: index % 2 === 0 ? "warning.main" : "success.main",
          animation: "bounce 1s infinite",
          animationDelay: `${index * 0.2}s`,
          "@keyframes bounce": {
            "0%, 100%": {
              transform: "translateY(0)",
            },
            "50%": {
              transform: "translateY(-20px)",
            },
          },
        }}
      />
    ))}
  </Box>
);

const ProgressBar = ({ progress }) => (
  <Box sx={{ width: "100%", maxWidth: 500, mt: 5 }}>
    <LinearProgress
      variant="determinate"
      value={progress}
      color="success"
      sx={{ height: 10, borderRadius: 5 }} // Increased thickness of the progress bar
    />
  </Box>
);

export default function EdugainersLoadingPage() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress((prevProgress) => {
        if (prevProgress === 100) {
          return 0;
        }
        const increment = Math.floor(Math.random() * 10) + 1;
        return Math.min(prevProgress + increment, 100);
      });
    }, 200);

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
      }}
    >
      <Typography
        variant="h3"
        component="h1"
        sx={{ fontWeight: "bold", color: "success.light", mb: 2 }}
      >
        Welcome to EduGainer's
      </Typography>
      <Typography
        variant="h6"
        sx={{ color: "warning.dark", fontWeight: "medium", mb: 4 }}
      >
        Curiosity · Dedication · Perseverance
      </Typography>
      <LoadingAnimation />
      <ProgressBar progress={progress} />
      <Typography
        variant="h6"
        sx={{ mt: 4, color: "success.dark", fontWeight: "medium" }}
      >
        Loading: {progress}%
      </Typography>
    </Container>
  );
}
