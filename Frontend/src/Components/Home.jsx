import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Button, Container, Box, Grid, Card } from "@mui/material";
import {
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
  Celebration,
} from "@mui/icons-material";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import { motion } from "framer-motion";
import { AdminContext } from "../App";
import Footer from "./footer";
import teacher from "../images/teacherday.jpg";
import { toast,ToastContainer } from "react-toastify";
const colors = {
  primary: "#006400",
  secondary: "#FFA500",
  text: "#333333",
  background: "#F0F8FF",
  white: "#FFFFFF",
  accent: "#4CAF50",
  teacherDay: "#FFD700", // Dark Sea Green, a softer green that complements the primary color
};

const StyledCard = motion(Card);

function Home() {
  const navigate = useNavigate();
  const { IsUserLoggedIn } = useContext(AdminContext);

  const libraryFacilities = [
    { icon: <WatchLater />, text: "24/7 Accessibility" },
    { icon: <AcUnitIcon />, text: "Temperature Control (Fans, AC, Heater)" },
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
const handleViewClick = async () => {
  if (IsUserLoggedIn) {
     window.open("https://forms.gle/b1NoQfeWCvxvXwdp7", "_blank")
  } else {
    toast.error("You Need to Login to fill this form")
  }
};
  return (
    <Box sx={{ backgroundColor: colors.background }}>
      {/* Enhanced Teacher's Day Themed Hero Section */}
      <ToastContainer/>
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          background: `linear-gradient(135deg, ${colors.teacherDay}, ${colors.accent})`,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src={teacher}
                alt="Teacher's Day"
                sx={{
                  width: "100%",
                  maxHeight: "90vh",
                  objectFit: "cover",
                  borderRadius: "15px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                  transform: "scale(1.05)",
                  transition: "transform 0.5s ease",
                  "&:hover": { transform: "scale(1.1)" },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  textAlign: "left",
                  color: colors.text,
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <Typography
                    variant="h1"
                    sx={{
                      fontSize: { xs: "3rem", md: "4rem" },
                      fontWeight: "bold",
                      mb: 2,
                      color: colors.primary,
                      fontFamily: "'Dancing Script', cursive",
                    }}
                  >
                    Happy Teacher's Day!
                  </Typography>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <Typography
                    variant="h2"
                    sx={{
                      fontSize: { xs: "1.8rem", md: "2.5rem" },
                      mb: 4,
                      fontWeight: "300",
                      color: colors.white,
                    }}
                  >
                    Celebrating the Heroes Who Shape Our Future
                  </Typography>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: "1.2rem",
                      mb: 4,
                      color: colors.text,
                    }}
                  >
                    Join EduGainer's in honoring our dedicated educators with
                    special events and heartfelt tributes. This Teacher's Day,
                    let's come together to show our appreciation for those who
                    inspire, guide, and nurture our potential.
                  </Typography>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <Button
                    onClick={() =>
                     {handleViewClick()}
                    }
                    variant="contained"
                    size="large"
                    endIcon={<Celebration />}
                    sx={{
                      backgroundColor: colors.primary,
                      color: colors.white,
                      "&:hover": { backgroundColor: colors.accent },
                      fontSize: "1.2rem",
                      py: 1.5,
                      px: 4,
                      borderRadius: "50px",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                      transition: "all 0.3s ease",
                    }}
                  >
                    Fill The Form
                  </Button>
                </motion.div>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          py: 4,
          px: { xs: 2, md: 4 },
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: "100%",
            paddingTop: "56.25%", // Adjust aspect ratio if necessary
            overflow: "hidden",
            borderRadius: "12px",
            boxShadow: 3,
          }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6859.271406693189!2d78.42992424145729!3d30.72864022085043!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3908ed08d3bdd33f%3A0xc82a9e75e23749e4!2sEduGainer&#39;s%20Classes%20%26%20Library!5e0!3m2!1sen!2sin!4v1724170083231!5m2!1sen!2sin"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: 0,
              borderRadius: "12px",
            }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </Box>
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
            Embark on a transformative journey with EduGainer's, where every
            class is a stepping stone to greatness. Our dynamic approach blends
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
        </Box>
      </Container>

      {/* EduGainer's Library Section */}
      <Box
        sx={{ backgroundColor: colors.primary, color: colors.white, py: 12 }}
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
            EduGainer's Library
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
            Our state-of-the-art library is a haven for knowledge seekers. With
            an extensive collection of books, digital resources, and a serene
            environment, it's the perfect place to immerse yourself in learning.
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={4}>
              <StyledCard
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                sx={{
                  height: "100%",
                  p: 3,
                  backgroundColor: colors.white,
                  color: colors.text,
                  borderRadius: "15px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <BookOnline
                  sx={{ fontSize: 64, color: colors.secondary, mb: 2 }}
                />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", textAlign: "center" }}
                >
                  Vast Collection
                </Typography>
                <Typography sx={{ textAlign: "center" }}>
                  Access to thousands of books, journals, and online resources
                  covering a wide range of subjects.
                </Typography>
              </StyledCard>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StyledCard
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                sx={{
                  height: "100%",
                  p: 3,
                  backgroundColor: colors.white,
                  color: colors.text,
                  borderRadius: "15px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <AutoStories
                  sx={{ fontSize: 64, color: colors.secondary, mb: 2 }}
                />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", textAlign: "center" }}
                >
                  Quiet Study Areas
                </Typography>
                <Typography sx={{ textAlign: "center" }}>
                  Dedicated spaces for focused individual study and group
                  collaboration.
                </Typography>
              </StyledCard>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StyledCard
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                sx={{
                  height: "100%",
                  p: 3,
                  backgroundColor: colors.white,
                  color: colors.text,
                  borderRadius: "15px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <DesktopMac
                  sx={{ fontSize: 64, color: colors.secondary, mb: 2 }}
                />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", textAlign: "center" }}
                >
                  Digital Resources
                </Typography>
                <Typography sx={{ textAlign: "center" }}>
                  Access to online databases, e-books, and research materials to
                  support your studies.
                </Typography>
              </StyledCard>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* EduGainer's Classes Section */}
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
          EduGainer's Classes
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
          Our classes are designed to provide comprehensive preparation for
          various competitive exams. Led by expert faculty, we ensure that every
          student receives personalized attention and guidance.
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <StyledCard
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              sx={{
                height: "100%",
                p: 3,
                backgroundColor: colors.white,
                color: colors.text,
                borderRadius: "15px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Class sx={{ fontSize: 64, color: colors.secondary, mb: 2 }} />
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", textAlign: "center" }}
              >
                Expert Faculty
              </Typography>
              <Typography sx={{ textAlign: "center" }}>
                Learn from experienced educators who are passionate about
                helping students succeed.
              </Typography>
            </StyledCard>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StyledCard
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              sx={{
                height: "100%",
                p: 3,
                backgroundColor: colors.white,
                color: colors.text,
                borderRadius: "15px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <MenuBook sx={{ fontSize: 64, color: colors.secondary, mb: 2 }} />
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", textAlign: "center" }}
              >
                Comprehensive Curriculum
              </Typography>
              <Typography sx={{ textAlign: "center" }}>
                Meticulously designed courses covering all aspects of
                competitive exams.
              </Typography>
            </StyledCard>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StyledCard
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              sx={{
                height: "100%",
                p: 3,
                backgroundColor: colors.white,
                color: colors.text,
                borderRadius: "15px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <SupportAgent
                sx={{ fontSize: 64, color: colors.secondary, mb: 2 }}
              />
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", textAlign: "center" }}
              >
                Personalized Guidance
              </Typography>
              <Typography sx={{ textAlign: "center" }}>
                One-on-one mentoring sessions to address individual learning
                needs and goals.
              </Typography>
            </StyledCard>
          </Grid>
        </Grid>
      </Container>

      {/* MeriStaionary by EduGainer's Section */}
      <Box
        sx={{ backgroundColor: colors.primary, color: colors.white, py: 12 }}
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
            MeriStaionary by EduGainer's
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
            MeriStaionary is your one-stop shop for all academic needs. We
            provide high-quality stationery, textbooks, and study materials to
            support your learning journey.
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={4}>
              <StyledCard
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                sx={{
                  height: "100%",
                  p: 3,
                  backgroundColor: colors.white,
                  color: colors.text,
                  borderRadius: "15px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Store sx={{ fontSize: 64, color: colors.secondary, mb: 2 }} />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", textAlign: "center" }}
                >
                  Wide Range of Products
                </Typography>
                <Typography sx={{ textAlign: "center" }}>
                  From pens and notebooks to specialized textbooks, find
                  everything you need for your studies.
                </Typography>
              </StyledCard>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StyledCard
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                sx={{
                  height: "100%",
                  p: 3,
                  backgroundColor: colors.white,
                  color: colors.text,
                  borderRadius: "15px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <LocalLibrary
                  sx={{ fontSize: 64, color: colors.secondary, mb: 2 }}
                />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", textAlign: "center" }}
                >
                  Exam-Specific Materials
                </Typography>
                <Typography sx={{ textAlign: "center" }}>
                  Curated study materials and practice tests tailored for
                  various competitive exams.
                </Typography>
              </StyledCard>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StyledCard
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                sx={{
                  height: "100%",
                  p: 3,
                  backgroundColor: colors.white,
                  color: colors.text,
                  borderRadius: "15px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <SupportAgent
                  sx={{ fontSize: 64, color: colors.secondary, mb: 2 }}
                />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", textAlign: "center" }}
                >
                  Expert Recommendations
                </Typography>
                <Typography sx={{ textAlign: "center" }}>
                  Get personalized advice on the best study materials for your
                  specific needs and goals.
                </Typography>
              </StyledCard>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}

export default Home;
