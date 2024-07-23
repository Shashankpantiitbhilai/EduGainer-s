import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import ScienceIcon from "@mui/icons-material/Science";
import PsychologyAltIcon from "@mui/icons-material/PsychologyAlt";
import BiotechIcon from "@mui/icons-material/Biotech";
const LoadingAnimation = () => {
  const [currentSubject, setCurrentSubject] = useState("physics");
  const [loadingProgress, setLoadingProgress] = useState(0);

  const subjects = {
    physics: { icon: ScienceIcon },
    chemistry: { icon: BiotechIcon },
    math: { icon:PsychologyAltIcon },
  };

  const SubjectIcon = subjects[currentSubject].icon;

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev < 100) {
          return prev + 1;
        } else {
          clearInterval(progressTimer);
          return 100;
        }
      });
    }, 50);

    const subjectTimer = setInterval(() => {
      setCurrentSubject((prevSubject) => {
        const subjectKeys = Object.keys(subjects);
        const nextSubjectIndex =
          (subjectKeys.indexOf(prevSubject) + 1) % subjectKeys.length;
        return subjectKeys[nextSubjectIndex];
      });
    }, 3000); // Change subject every 3 seconds

    return () => {
      clearInterval(progressTimer);
      clearInterval(subjectTimer);
    };
  }, []);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh" // Tailwind yellow-300 equivalent
    >
      <Box position="relative" mb={4}>
        <SubjectIcon
          sx={{
            color: "#166534",
            width: 96,
            height: 96,
            animation: "bounce 1s infinite",
          }}
        />
        <CircularProgress
          size={80}
          thickness={4}
          sx={{
            color: "#166534",
            position: "absolute",
            top: "50%",
            left: "50%",
            marginTop: -5,
            marginLeft: -5,
          }}
        />
      </Box>
      <Typography
        variant="h3"
        component="h1"
        color="#166534"
        fontWeight="bold"
        mb={2}
      >
        EduGainer's
      </Typography>
      <Typography variant="h6" color="#166534" fontWeight="medium" mb={4}>
        Curiosity  Dedication  Perseverance
      </Typography>
      <Box width="100%" maxWidth={300} position="relative" mb={2}>
        <LinearProgress
          variant="determinate"
          value={loadingProgress}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: "rgba(22, 101, 52, 0.2)",
            "& .MuiLinearProgress-bar": {
              borderRadius: 4,
              backgroundColor: "#166534",
            },
          }}
        />
        <Typography
          variant="body2"
          color="#166534"
          position="absolute"
          top="-24px"
          left="50%"
          style={{ transform: "translateX(-50%)" }}
        >
          {`${Math.round(loadingProgress)}%`}
        </Typography>
      </Box>
    </Box>
  );
};

export default LoadingAnimation;
