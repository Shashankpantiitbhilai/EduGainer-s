import React, { useState, useEffect } from "react";
import { Box, Typography, LinearProgress } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ScienceIcon from "@mui/icons-material/Science";
import BrushIcon from "@mui/icons-material/Brush";
import ExtensionIcon from "@mui/icons-material/Extension";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import SchoolIcon from "@mui/icons-material/School";
import FunctionsIcon from "@mui/icons-material/Functions";
import ChemistryIcon from "@mui/icons-material/Science";
import StationeryIcon from "@mui/icons-material/Edit";
import LibraryIcon from "@mui/icons-material/LocalLibrary";
import imageURL from "../../images/logo.jpg"; // Replace with your image URL

const theme = createTheme({
  palette: {
    primary: {
      main: "#2ecc71", // Green
    },
    secondary: {
      main: "#e67e22", // Orange
    },
    background: {
      default: "#f0f4f8", // Light blue-gray
    },
  },
});

const MovingObject = ({
  children,
  initialPosition,
  duration,
  delay,
  curve,
}) => {
  return (
    <Box
      sx={{
        position: "absolute",
        ...initialPosition,
        animation: `move${curve} ${duration}s infinite ${delay}s`,
        "@keyframes moveCircular": {
          "0%": { transform: "rotate(0deg) translateX(150px) rotate(0deg)" },
          "100%": {
            transform: "rotate(360deg) translateX(150px) rotate(-360deg)",
          },
        },
        "@keyframes moveSinusoidal": {
          "0%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(100px)" },
          "100%": { transform: "translateY(0px)" },
        },
        "@keyframes moveSpiral": {
          "0%": { transform: "rotate(0deg) translateX(0px) translateY(0px)" },
          "100%": {
            transform: "rotate(720deg) translateX(100px) translateY(100px)",
          },
        },
      }}
    >
      {children}
    </Box>
  );
};

const LearningAnimation = () => {
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingProgress((oldProgress) => {
        if (oldProgress === 100) {
          oldProgress = 0;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          bgcolor: "background.default",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* EduGainer's Logo Image */}
        <Box
          component="img"
          src={imageURL}
          alt="EduGainer Logo"
          sx={{
            width: 200,
            height: 200,
            borderRadius: "50%",
            border: "5px solid green",

            mb: 2, // Add margin bottom to separate from the progress bar
          }}
        />
        {/* Progress Bar */}
        <Box sx={{ width: "90%", marginBottom: 2 }}>
          <LinearProgress
            variant="determinate"
            value={loadingProgress}
            sx={{
              height: 10,
              borderRadius: 5,
              "& .MuiLinearProgress-bar": {
                borderRadius: 5,
              },
            }}
          />
        </Box>
        {/* Loading Text */}
        <Typography
          variant="h6"
          sx={{ marginBottom: 4, color: theme.palette.secondary.main }}
        >
          {loadingProgress === 100
            ? "Let's start learning!"
            : "Loading your adventure..."}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.primary.main,
            textAlign: "center",
            fontSize: "40px",
          }}
        >
          Curiosity Dedication Perseverance
        </Typography>
        {/* Icons and Animation */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: 400,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <RocketLaunchIcon
            sx={{
              fontSize: 100,
              color: theme.palette.secondary.main,
              transform: "rotate(-45deg)",
              position: "absolute",
              curve: "line",
              zIndex: 2,
              animation: "pulse 2s infinite",
              "@keyframes pulse": {
                "0%": { transform: "rotate(-45deg) scale(1)" },
                "50%": { transform: "rotate(-45deg) scale(1.1)" },
                "100%": { transform: "rotate(-45deg) scale(1)" },
              },
            }}
          />
          <MovingObject
            initialPosition={{ top: "10%", left: "15%" }}
            duration={10}
            delay={0}
            curve="Circular"
          >
            <MenuBookIcon sx={{ fontSize: 72, color: "#e74c3c" }} />
          </MovingObject>
          <MovingObject
            initialPosition={{ top: "10%", left: "70%" }}
            duration={8}
            delay={1}
            curve="Sinusoidal"
          >
            <ScienceIcon sx={{ fontSize: 72, color: "#8e44ad" }} />
          </MovingObject>
          <MovingObject
            initialPosition={{ top: "80%", left: "15%" }}
            duration={12}
            delay={2}
            curve="Spiral"
          >
            <BrushIcon sx={{ fontSize: 72, color: "#3498db" }} />
          </MovingObject>
          <MovingObject
            initialPosition={{ top: "80%", left: "70%" }}
            duration={9}
            delay={3}
            curve="Circular"
          >
            <ExtensionIcon sx={{ fontSize: 72, color: "#f39c12" }} />
          </MovingObject>
          <MovingObject
            initialPosition={{ top: "40%", left: "5%" }}
            duration={11}
            delay={4}
            curve="Sinusoidal"
          >
            <EmojiObjectsIcon sx={{ fontSize: 72, color: "#2ecc71" }} />
          </MovingObject>
          <MovingObject
            initialPosition={{ top: "40%", left: "80%" }}
            duration={13}
            delay={5}
            curve="Spiral"
          >
            <SchoolIcon sx={{ fontSize: 72, color: "#e67e22" }} />
          </MovingObject>
          <MovingObject
            initialPosition={{ top: "30%", left: "35%" }}
            duration={14}
            delay={6}
            curve="Circular"
          >
            <FunctionsIcon sx={{ fontSize: 72, color: "#1abc9c" }} />
          </MovingObject>
          <MovingObject
            initialPosition={{ top: "30%", left: "50%" }}
            duration={15}
            delay={7}
            curve="Sinusoidal"
          >
            <ChemistryIcon
              sx={{ fontSize: 72, color: "#c0392b", margin: 10 }}
            />
          </MovingObject>
          <MovingObject
            initialPosition={{ top: "50%", left: "20%" }}
            duration={16}
            delay={8}
            curve="Spiral"
          >
            <StationeryIcon sx={{ fontSize: 72, color: "#16a085" }} />
          </MovingObject>
          <MovingObject
            initialPosition={{ top: "50%", left: "60%" }}
            duration={17}
            delay={9}
            curve="Circular"
          >
            <LibraryIcon sx={{ fontSize: 72, color: "#d35400" }} />
          </MovingObject>
        </Box>{" "}
        <Typography align="center" sx={{ mt: 4, maxWidth: 600 }}>
          Discover our extensive EduGainer's library classes and stationery
          services! Access a wide range of books, online resources,courses, and
          study materials. Enjoy our stationery shop for all your academic
          needs.
        </Typography>
      </Box>
    </ThemeProvider>
  );
};

export default LearningAnimation;
