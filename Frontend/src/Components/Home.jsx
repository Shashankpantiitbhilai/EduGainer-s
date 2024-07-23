import React,{useContext} from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Button,
  Container,
  Box,
  Grid,
  Card,
 
} from "@mui/material";

import {
  ArrowForward,
  Wifi,
  PowerSettingsNew,
  Weekend,
  WatchLater,
  MenuBook,
  School,
  EmojiEvents,
  Psychology,
  LocalLibrary,
  Flag,
} from "@mui/icons-material";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import { motion } from "framer-motion";
import Footer from "./footer";
const colors = {
  primary: "#006400", // Dark Green
  secondary: "#FFA500", // Orange
  text: "#333333",
  background: "#F0F8FF", // Light Sky Blue
  white: "#FFFFFF",
  accent: "#4CAF50", // Light Green
};

const StyledCard = motion(Card);

function Home() {
  const navigate = useNavigate();
    const libraryFacilities = [
    { icon: <WatchLater />, text: "24/7 Accessibility" },
    { icon: <AcUnitIcon />, text: "Climate Control (Fans, AC, Heater)" },
    { icon: <Wifi />, text: "High-Speed WiFi" },
    { icon: <Weekend />, text: "Comfortable Seating" },
    { icon: <PowerSettingsNew />, text: "Individual Power Stations" },
    { icon: <MenuBook />, text: "Extensive Study Materials" },
  ];
  const handleClick = async () => {
  
     navigate("/library")
    
  };
  const classesOffered = [
    { icon: <School />, text: "NEET & JEE Preparation" },
    { icon: <MenuBook />, text: "Board Exams Excellence" },
    { icon: <EmojiEvents />, text: "SSC CGL Mastery" },
    { icon: <Flag />, text: "Uttarakhand LT Exam" },
    { icon: <Psychology />, text: "Group C Government Exams" },
    { icon: <LocalLibrary />, text: "General Competitive Exams" },
  ];

  return (
    <Box sx={{ backgroundColor: colors.background }}>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundColor: colors.primary,
          color: colors.white,
          py: 12,
          borderBottom: `8px solid ${colors.secondary}`,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "3rem", md: "4.5rem" },
              fontWeight: "bold",
              mb: 2,
              textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            Ignite Your Potential with EduGainer's
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "1.5rem", md: "2rem" },
              mb: 4,
              fontWeight: "300",
            }}
          >
            Where Curiosity, Dedication, and Perseverance Shape Your Future
          </Typography>
          <Button
          onClick={handleClick}
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            sx={{
              backgroundColor: colors.secondary,
              color: colors.white,
              "&:hover": { backgroundColor: colors.accent },
              fontSize: "1.2rem",
              py: 1.5,
              px: 4,

              borderRadius: "50px",
            }}
          >
            Begin Your Journey
          </Button>
        </Container>
      </Box>

      {/* Library Facilities Section */}
      <Container maxWidth="lg" sx={{ py: 12 }}>
        <Typography
          variant="h2"
          sx={{
            color: colors.primary,
            fontWeight: "bold",
            mb: 4,
            textAlign: "center",
            fontSize: { xs: "2.5rem", md: "3.5rem" },
          }}
        >
          EduGainer's 24/7 Learning Oasis
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: colors.text,
            fontSize: "1.2rem",
            mb: 6,
            textAlign: "center",
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          Step into a world where learning never sleeps. Our state-of-the-art
          library is your personal sanctuary for success, open round the clock
          to fuel your aspirations.
        </Typography>
        <Grid container spacing={4}>
          {libraryFacilities.map((facility, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <StyledCard
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  p: 3,
                  backgroundColor: colors.white,
                  boxShadow: 3,
                  borderRadius: "15px",
                  transition: "all 0.3s ease-in-out",
                }}
              >
                <Box sx={{ color: colors.secondary, fontSize: 64, mb: 2 }}>
                  {facility.icon}
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: colors.text,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  {facility.text}
                </Typography>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Classes Offered Section */}
      <Box
        sx={{
          backgroundColor: colors.primary,
          color: colors.white,
          py: 12,
          borderTop: `8px solid ${colors.secondary}`,
          borderBottom: `8px solid ${colors.secondary}`,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              fontWeight: "bold",
              mb: 4,
              textAlign: "center",
              fontSize: { xs: "2.5rem", md: "3.5rem" },
            }}
          >
            Forge Your Path to Excellence
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: "1.2rem",
              mb: 6,
              textAlign: "center",
              maxWidth: "800px",
              margin: "0 auto",
            }}
          >
            At EduGainer's, we don't just prepare you for exams; we sculpt future
            leaders. Dive into our meticulously crafted courses designed to
            transform your aspirations into achievements.
          </Typography>
          <Grid container spacing={4}>
            {classesOffered.map((course, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <StyledCard
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    p: 3,
                    backgroundColor: colors.white,
                    borderRadius: "15px",
                    transition: "all 0.3s ease-in-out",
                  }}
                >
                  <Box sx={{ color: colors.secondary, fontSize: 64, mb: 2 }}>
                    {course.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      color: colors.primary,
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {course.text}
                  </Typography>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* EduGainer's's Approach Section */}
      <Container maxWidth="lg" sx={{ py: 12 }}>
        <Typography
          variant="h2"
          sx={{
            color: colors.primary,
            fontWeight: "bold",
            mb: 4,
            textAlign: "center",
            fontSize: { xs: "2.5rem", md: "3.5rem" },
          }}
        >
          The EduGainer's Edge: Where Dreams Take Flight
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: colors.text,
              fontSize: "1.2rem",
              lineHeight: 1.8,
              textAlign: "center",
            }}
          >
            Embark on a transformative journey with EduGainer's, where every class
            is a stepping stone to greatness. Our dynamic approach blends
            cutting-edge pedagogy with personalized mentoring, creating an
            electrifying learning environment that ignites your potential.
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: colors.text,
              fontSize: "1.2rem",
              lineHeight: 1.8,
              textAlign: "center",
            }}
          >
            From cracking the code of JEE and NEET to conquering board exams and
            government recruitments like SSC CGL and Uttarakhand LT, we're your
            steadfast companion in every academic endeavor. Our expert faculty
            doesn't just teach; they inspire, challenge, and nurture your
            intellect, paving the way for unparalleled success.
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: colors.text,
              fontSize: "1.2rem",
              lineHeight: 1.8,
              textAlign: "center",
            }}
          >
           
          </Typography>
        
        </Box>
      </Container>
      <Footer/>
    </Box>
  );
}

export default Home;
