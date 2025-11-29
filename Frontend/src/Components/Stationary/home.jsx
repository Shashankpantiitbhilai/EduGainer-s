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
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StoreIcon from "@mui/icons-material/Store";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import Footer from "../Footer/footer";
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

  const handleOrderNow = () => {
    window.open("https://vyaparapp.in/store/meristationeryedugainers", "_blank");
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
                onClick={handleOrderNow}
                variant="contained"
                size="large"
                startIcon={<ShoppingCartIcon />}
                sx={{
                  backgroundColor: theme.palette.secondary.main,
                  color: theme.palette.secondary.contrastText,
                  "&:hover": { backgroundColor: theme.palette.secondary.dark },
                  fontSize: { xs: "1rem", sm: "1.1rem", md: "1.3rem" },
                  py: 2,
                  px: 5,
                  borderRadius: "50px",
                  fontWeight: "bold",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
                }}
              >
               Order Now
              </Button>
            </motion.div>
          </Box>
        </Container>
      </Box>

      {/* Prominent Inline Ordering Section */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Card
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
              color: theme.palette.secondary.contrastText,
              p: { xs: 3, sm: 4, md: 5 },
              borderRadius: "20px",
              boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
              textAlign: "center",
              mb: 4,
            }}
          >
            <StoreIcon sx={{ fontSize: 60, mb: 2, color: theme.palette.secondary.contrastText }} />
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                mb: 2,
                fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
              }}
            >
              Order directly from our online store!
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                opacity: 0.95,
                fontSize: { xs: "1rem", sm: "1.2rem", md: "1.4rem" },
              }}
            >
              Click here to shop now and get the best deals on quality stationery
            </Typography>
            <Button
              onClick={handleOrderNow}
              variant="contained"
              size="large"
              startIcon={<ShoppingCartIcon />}
              sx={{
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.secondary.main,
                "&:hover": { 
                  backgroundColor: theme.palette.background.default,
                  transform: "scale(1.05)",
                },
                fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
                py: 1.5,
                px: 5,
                borderRadius: "50px",
                fontWeight: "bold",
                boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
                transition: "all 0.3s ease",
              }}
            >
              Shop Online Now
            </Button>
          </Card>
        </motion.div>
      </Container>

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
              mb: 2,
            }}
          >
            उत्तराखण्ड की समस्त परीक्षाओं की तैयारी हेतु सर्वश्रेष्ठ संस्थान
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: "bold",
              textAlign: "center",
              fontSize: { xs: "1rem", sm: "1.2rem", md: "1.5rem" },
              mb: 4,
            }}
          >
            Library facilities with all subjects tuition classes for school students.
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.primary,
              fontWeight: "bold",
              textAlign: "center",
              fontSize: { xs: "1rem", sm: "1.2rem", md: "1.5rem" },
            }}
          >
            Wanna buy study-related stuff? Don't worry, we have everything at
            affordable prices!
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

      {/* Social Media and Contact Section */}
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          py: 6,
          borderTop: `4px solid ${theme.palette.secondary.main}`,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={12}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                    mb: 3,
                    color: theme.palette.primary.main,
                    textAlign: { xs: "center", md: "left" },
                  }}
                >
                  Contact Information
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      justifyContent: { xs: "center", md: "flex-start" },
                    }}
                  >
                    <EmailIcon sx={{ color: theme.palette.primary.main }} />
                    <Typography
                      component="a"
                      href="mailto:Meristationeryedugainers@gmail.com"
                      sx={{
                        color: theme.palette.text.primary,
                        textDecoration: "none",
                        "&:hover": {
                          color: theme.palette.primary.main,
                          textDecoration: "underline",
                        },
                      }}
                    >
                      Meristationeryedugainers@gmail.com
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      justifyContent: { xs: "center", md: "flex-start" },
                    }}
                  >
                    <PhoneIcon sx={{ color: theme.palette.primary.main }} />
                    <Typography
                      component="a"
                      href="tel:+916397166682"
                      sx={{
                        color: theme.palette.text.primary,
                        textDecoration: "none",
                        "&:hover": {
                          color: theme.palette.primary.main,
                          textDecoration: "underline",
                        },
                      }}
                    >
                      +91 6397166682
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      justifyContent: { xs: "center", md: "flex-start" },
                    }}
                  >
                    <WhatsAppIcon sx={{ color: "#25D366" }} />
                    <Typography
                      component="a"
                      href="https://wa.me/916397166682"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: theme.palette.text.primary,
                        textDecoration: "none",
                        "&:hover": {
                          color: "#25D366",
                          textDecoration: "underline",
                        },
                      }}
                    >
                      WhatsApp: +91 6397166682
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Footer/>
    </Box>
  );
}

export default Home;
