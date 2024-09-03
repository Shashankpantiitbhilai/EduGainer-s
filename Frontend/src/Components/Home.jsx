import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Typography,
  Button,
  Container,
  Box,
  Grid,
  Card,
  Step,
  StepLabel,
  Stepper,
} from "@mui/material";
import {
  Login,
  Celebration,
  WatchLater,
  AcUnit as AcUnitIcon,
  Wifi,
  PowerSettingsNew,
  Weekend,
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
import { motion } from "framer-motion";
import { AdminContext } from "../App";
import Footer from "./footer";
import { toast, ToastContainer } from "react-toastify";
import { getAllEvents } from "../services/Admin_services/admin_event";

const colors = {
  primary: "#006400",
  secondary: "#FFA500",
  text: "#333333",
  background: "#F0F8FF",
  white: "#FFFFFF",
  accent: "#4CAF50",
  teacherDay: "#FFD700",
  blue: "blue",
};

const StyledCard = motion(Card);
const steps = [
  { label: "Login", icon: <Login />, link: "/login" },
  { label: "Fill Form", icon: <Celebration /> },
];
const AnimatedText = motion(Typography);
function Home() {
  const navigate = useNavigate();
  const { IsUserLoggedIn } = useContext(AdminContext);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsData = await getAllEvents();
        const currentDate = new Date().toISOString().split("T")[0];

        // Filter out past events and events without a valid endDate
        const currentEvents = eventsData.filter((event) => {
          if (!event.endDate || typeof event.endDate !== "string") {
            console.warn("Event with invalid or missing endDate:", event);
            return false;
          }

          return event.endDate.split("T")[0] >= currentDate;
        });

        setEvents(currentEvents);
        if (events) {
          console.log(events.length, "ee");
        } else {
          console.log("no");
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        toast.error("Failed to load events");
      }
    };
    fetchEvents();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString || typeof dateString !== "string") {
      return "Date not available";
    }
    const [year, month, day] = dateString.split("T")[0].split("-");
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${months[parseInt(month, 10) - 1]} ${parseInt(day, 10)}, ${year}`;
  };

  const handleViewClick = async (url) => {
    if (IsUserLoggedIn) {
      window.open(url, "_blank");
    } else {
      toast.error("You Need to Login to fill this form");
    }
  };

  const navigationLinks = [
    { name: "Library", link: "/library" },
    { name: "Classes", link: "/classes" },
    { name: "Resources", link: "/resources" },
    { name: "MeriStationary", link: "/stationary/home" },
    { name: "Query", link: "/chat/home" },
    { name: "Feedback", link: "/feedback" },
    { name: "Privacy Policy", link: "/Policies" },
  ];
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
  return (
    <Box sx={{ backgroundColor: colors.background }}>
      <ToastContainer />

      {/* Navigation Links */}
      <Box sx={{ backgroundColor: colors.primary, py: 2, marginTop: 7 }}>
        <Container maxWidth="lg">
          <Grid container spacing={2} justifyContent="center">
            {navigationLinks.map((link, index) => (
              <Grid item key={index}>
                <Button
                  variant="text"
                  color="inherit"
                  onClick={() => navigate(link.link)}
                  sx={{
                    color: colors.white,
                    "&:hover": {
                      backgroundColor: colors.secondary,
                      color: colors.primary,
                    },
                  }}
                >
                  {link.name}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box
        sx={{
          backgroundColor: colors.primary,
          py: 12,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {events.length !== 0 ? (
          <Container maxWidth="lg">
            <Typography
              variant="h2"
              sx={{
                color: colors.white,
                fontWeight: "bold",
                mb: 6,
                textAlign: "center",
                fontSize: { xs: "2.5rem", md: "3.5rem" },
              }}
            >
              Upcoming Events
            </Typography>
            <Grid container spacing={4}>
              {events.map((event, index) => (
                <Grid item xs={12} key={index} sx={{ mb: 4 }}>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    whileInView={{
                      opacity: 1,
                      scale: 1,
                      transition: { duration: 0.5 },
                    }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    viewport={{ once: true }} // Ensures animation only runs once when in view
                  >
                    <Card
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        width: "100%",
                        height: "auto",
                        overflow: "hidden",
                        boxShadow: 3,
                        borderRadius: 2,
                        backgroundColor: colors.background,
                        position: "relative", // Ensure the border is positioned correctly
                        border: "2px solid transparent", // Initial border
                        "&:hover": {
                          border: `2px solid ${colors.secondary}`, // Border on hover
                          boxShadow: 6, // Increased shadow for more emphasis
                        },
                        transition: "border 0.3s ease, box-shadow 0.3s ease", // Smooth transition for border and shadow
                      }}
                    >
                      <Box
                        sx={{
                          flex: "1 1 50%",
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={event.image?.url || "/placeholder-image.jpg"}
                          alt={event.title || "Event"}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "8px 0 0 8px",
                          }}
                        />
                      </Box>
                      <Box
                        sx={{
                          flex: "1 1 50%",
                          p: 3,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box>
                          <Typography
                            variant="h5"
                            sx={{
                              color: colors.primary,
                              fontWeight: "bold",
                              mb: 2,
                            }}
                          >
                            {event.title || "Untitled Event"}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: colors.text, mb: 2 }}
                          >
                            {event.description || "No description available"}
                          </Typography>
                          <AnimatedText
                            variant="body2"
                            sx={{ color: "red", mb: 3 }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, scale: [1, 1.1, 1] }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              repeatType: "reverse",
                            }}
                          >
                            Deadline: {formatDate(event.endDate)}
                          </AnimatedText>
                        </Box>
                        {event.googleFormLink && (
                          <div>
                            <Box sx={{ width: "100%", mb: 4 }}>
                              <Stepper activeStep={0} alternativeLabel>
                                {steps.map((step, index) => (
                                  <Step key={step.label}>
                                    <StepLabel
                                      StepIconComponent={() => (
                                        <Box
                                          sx={{
                                            backgroundColor:
                                              index === 0
                                                ? colors.accent
                                                : "orange",
                                            borderRadius: "50%",
                                            p: 1,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                          }}
                                        >
                                          {step.icon}
                                        </Box>
                                      )}
                                    >
                                      <Typography
                                        variant="body2"
                                        color="text.secondary"
                                      >
                                        {step.label}
                                      </Typography>
                                    </StepLabel>
                                  </Step>
                                ))}
                              </Stepper>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                gap: 2,
                              }}
                            >
                              {!IsUserLoggedIn && (
                                <Button
                                  component={Link}
                                  to="/login"
                                  variant="outlined"
                                  size="large"
                                  startIcon={<Login />}
                                  sx={{
                                    color: "orange",

                                    fontSize: "1rem",
                                    py: 1.5,
                                    px: 3,
                                    borderRadius: "50px",
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                      backgroundColor: "orange",
                                      color: "orange",
                                    },
                                  }}
                                >
                                  Login First
                                </Button>
                              )}
                              {event.googleFormLink && (
                                <Button
                                  onClick={() =>
                                    handleViewClick(event.googleFormLink)
                                  }
                                  variant="contained"
                                  size="large"
                                  endIcon={<Celebration />}
                                  sx={{
                                    backgroundImage: `linear-gradient(270deg, #00FFFF, ${colors.accent}, #fd5c63)`,
                                    backgroundSize: "600% 600%",
                                    color: colors.white,
                                    animation:
                                      "gradientAnimation 5s ease infinite",
                                    fontSize: "1rem",
                                    py: 1.5,
                                    px: 3,
                                    borderRadius: "50px",
                                    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                      boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
                                    },
                                  }}
                                >
                                  Fill The Form
                                </Button>
                              )}
                            </Box>
                          </div>
                        )}
                      </Box>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Container>
        ) : (
          <Container maxWidth="lg">
            <Typography
              variant="h4"
              sx={{
                color: colors.white,
                textAlign: "center",
                mb: 4,
              }}
            >
              Preparing Lucid Track for Education Gainers
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: colors.white,
                textAlign: "center",
              }}
            >
              We are here to encourage learning and help learners. EduGainers is
              the best platform to enhance your knowledge and skills.
            </Typography>
          </Container>
        )}
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
