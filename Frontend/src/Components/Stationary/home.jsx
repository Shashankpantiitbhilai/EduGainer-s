import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Container,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  useTheme,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CallIcon from "@mui/icons-material/Call";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Footer from "../footer";
// Create a motion-enabled Card component
const StyledCard = motion(Card);

// Product data with real images
const products = [
  {
    name: "Pens",
    image:
      "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  },
  {
    name: "Notebooks",
    image:
      "https://images.unsplash.com/photo-1531346878377-a5be20888e57?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80",
  },
  {
    name: "Study Books",
    image:
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80",
  },
  {
    name: "Competitive Exam Books",
    image:
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1973&q=80",
  },
  {
    name: "NCERT Books",
    image:
      "https://images.unsplash.com/photo-1588580000645-4562a6d2c839?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  },
  {
    name: "Library Supplies",
    image:
      "https://images.unsplash.com/photo-1568667256549-094345857637?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  },
];

// Enhanced VideoAnimation component
const VideoAnimation = () => {
  const theme = useTheme();
  const videoFiles = ["stationary.mp4"];
  const [currentVideo, setCurrentVideo] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideo((prev) => (prev + 1) % videoFiles.length);
    }, 1500); // Change video every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: { xs: "40vh", sm: "50vh", md: "60vh" },
        overflow: "hidden",
      }}
    >
      <AnimatePresence initial={false}>
        <motion.video
          key={videoFiles[currentVideo]}
          src={`/videos/${videoFiles[currentVideo]}`}
          autoPlay
          muted
          loop
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </AnimatePresence>
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Typography
            variant="h2"
            sx={{
              color: theme.palette.common.white,
              textAlign: "center",
              fontWeight: "bold",
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
              fontSize: { xs: "2rem", sm: "3rem", md: "4rem" },
            }}
          >
            Quality Stationery for Every Need
          </Typography>
        </motion.div>
      </Box>
    </Box>
  );
};

// Enhanced Home component
function Home() {
  const theme = useTheme();

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/qr/2C3KLXY6PXWRF1", "_blank");
  };

  return (
    <Box sx={{ backgroundColor: theme.palette.background.default }}>
      <VideoAnimation />

      <Box
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          py: { xs: 4, sm: 6 },
          borderBottom: `8px solid ${theme.palette.secondary.main}`,
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2rem", sm: "3rem", md: "4rem" },
                fontWeight: "bold",
                mb: 2,
                textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
              }}
              align="center"
            >
              Welcome to MeriStationary by EduGainer's
            </Typography>
          </motion.div>
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Typography
              variant="h4"
              sx={{
                fontSize: { xs: "1rem", sm: "1.2rem", md: "1.8rem" },
                mb: 4,
                fontWeight: "300",
              }}
              align="center"
            >
              Your Premier Destination for Quality Stationery in Uttarkashi
            </Typography>
          </motion.div>
          <Box display="flex" justifyContent="center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleWhatsAppClick}
                variant="contained"
                size="large"
                startIcon={<WhatsAppIcon />}
                sx={{
                  backgroundColor: theme.palette.secondary.main,
                  color: theme.palette.secondary.contrastText,
                  "&:hover": { backgroundColor: theme.palette.secondary.dark },
                  fontSize: { xs: "0.9rem", sm: "1rem", md: "1.2rem" },
                  py: 1.5,
                  px: 4,
                  borderRadius: "50px",
                }}
              >
                Join Our WhatsApp Group
              </Button>
            </motion.div>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h5"
            sx={{
              color: theme.palette.text.primary,
              fontWeight: "bold",
              textAlign: "center",
              fontSize: { xs: "1.2rem", sm: "1.5rem", md: "2rem" },
              mb: 4,
            }}
          >
            Wanna buy study-related stuff? Don't worry, we have everything at
            affordable prices!
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: "bold",
              textAlign: "center",
              fontSize: { xs: "1rem", sm: "1.2rem", md: "1.5rem" },
            }}
          >
            Shop with us and experience the best deals on high-quality
            stationery!
          </Typography>
        </motion.div>
      </Container>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h2"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: "bold",
              mb: 4,
              textAlign: "center",
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
            }}
          >
            Explore Our Product Range
          </Typography>
        </motion.div>
        <Grid container spacing={4}>
          {products.map((product, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <StyledCard
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: theme.palette.background.paper,
                    boxShadow: 3,
                    borderRadius: "15px",
                    overflow: "hidden",
                    transition: "all 0.3s ease-in-out",
                  }}
                >
                  <CardMedia
                    component="img"
                    image={product.image}
                    alt={product.name}
                    sx={{
                      height: 200,
                      objectFit: "cover",
                    }}
                  />
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{
                        color: theme.palette.text.primary,
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      {product.name}
                    </Typography>
                  </CardContent>
                </StyledCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          py: 8,
          borderTop: `8px solid ${theme.palette.secondary.main}`,
          borderBottom: `8px solid ${theme.palette.secondary.main}`,
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h2"
              sx={{
                fontWeight: "bold",
                mb: 4,
                textAlign: "center",
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
              }}
            >
              Why Shop at MeriStationary?
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
                mb: 6,
                textAlign: "center",
                maxWidth: "800px",
                margin: "0 auto",
              }}
            >
              At MeriStationary, we offer an extensive selection of high-quality
              stationery items at unbeatable prices. Our commitment to quality
              and customer satisfaction sets us apart from the competition.
              Discover the difference with our exceptional service and diverse
              product range. Whether you're preparing for exams or stocking up
              your office, we have everything you need to succeed.
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.secondary.light,
                fontWeight: "bold",
                textAlign: "center",
                fontSize: { xs: "1rem", sm: "1.2rem", md: "1.5rem" },
              }}
            >
              Shop Now and Enjoy Exclusive Offers!
            </Typography>
          </motion.div>
        </Container>
      </Box>
      <Footer/>
    </Box>
  );
}

export default Home;
