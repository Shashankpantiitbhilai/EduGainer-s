import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Button, Container, Box, Grid, Card } from "@mui/material";
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
  BookOnline,
  Class,
  Store,
  AutoStories,
  DesktopMac,
  SupportAgent,
} from "@mui/icons-material";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import { motion } from "framer-motion";
import { AdminContext } from "../App";
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
  const { IsUserLoggedIn } = useContext(AdminContext);

  const libraryFacilities = [
    { icon: <WatchLater />, text: "24/7 Accessibility" },
    { icon: <AcUnitIcon />, text: "Climate Control (Fans, AC, Heater)" },
    { icon: <Wifi />, text: "High-Speed WiFi" },
    { icon: <Weekend />, text: "Comfortable Seating" },
    { icon: <PowerSettingsNew />, text: "Individual Power Stations" },
    { icon: <MenuBook />, text: "Extensive Study Materials" },
  ];

  const classesOffered = [
    { icon: <School />, text: "NEET & JEE Preparation" },
    { icon: <MenuBook />, text: "Board Exams Excellence" },
    { icon: <EmojiEvents />, text: "SSC CGL Mastery" },
    { icon: <Flag />, text: "Uttarakhand LT Exam" },
    { icon: <Psychology />, text: "Group C Government Exams" },
    { icon: <LocalLibrary />, text: "General Competitive Exams" },
  ];

  const handleClick = async () => {
    if (IsUserLoggedIn?.role === "admin") {
      navigate("/admin_Library");
    } else {
      navigate("/library");
    }
  };

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

      {/* Responsive Map Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: 6,
          px: { xs: 2, md: 0 }, // Add padding on smaller screens
        }}
      >
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6859.271406693189!2d78.42992424145729!3d30.72864022085043!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3908ed08d3bdd33f%3A0xc82a9e75e23749e4!2sEduGainer&#39;s%20Classes%20%26%20Library!5e0!3m2!1sen!2sin!4v1724170083231!5m2!1sen!2sin"
          width="50%" // Make the map responsive
          height="450"
          style={{
            border: 0,
            borderRadius: "12px", // Optional: Add border-radius for a smoother look
          }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
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
            At EduGainer's, we don't just prepare you for exams; we sculpt
            future leaders. Dive into our meticulously crafted courses designed
            to transform your aspirations into achievements.
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

      {/* EduGainer's Approach Section */}
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
          EduGainer's Approach: The Pillars of Success
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
          Our philosophy is simple: to empower every student with the knowledge,
          skills, and confidence to excel in their academic and professional
          lives.
        </Typography>
        <Grid container spacing={4}>
          {[
            { icon: <BookOnline />, text: "Comprehensive Resources" },
            { icon: <Class />, text: "Interactive Classes" },
            { icon: <Store />, text: "In-House Library" },
            { icon: <AutoStories />, text: "Exclusive Study Materials" },
            { icon: <DesktopMac />, text: "Modern Learning Tools" },
            { icon: <SupportAgent />, text: "Personalized Guidance" },
          ].map((approach, index) => (
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
                  {approach.icon}
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: colors.text,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  {approach.text}
                </Typography>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer */}
      <Footer />
    </Box>
  );
}

export default Home;
