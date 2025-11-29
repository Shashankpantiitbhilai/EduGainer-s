import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Grid,
  Card,
  Typography,
  Button
} from "@mui/material";
import {
  Store,
  LocalLibrary,
  SupportAgent,
  ShoppingCart,
  ArrowForward
} from "@mui/icons-material";
import { colors } from "./constants";

const StyledCard = motion(Card);
const MotionButton = motion(Button);

const StationarySection = () => {
  const navigate = useNavigate();

  const handleVisitStore = () => {
    window.open("https://vyaparapp.in/store/meristationeryedugainers", "_blank");
  };

  const handleShopNow = () => {
    window.open("https://vyaparapp.in/store/meristationeryedugainers", "_blank");
  };

  return (
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
          MeriStationary by EduGainer's
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.2rem",
            mb: 4,
            textAlign: "center",
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          MeriStationary is your one-stop shop for all academic needs. We
          provide high-quality stationery, textbooks, and study materials to
          support your learning journey. Experience seamless online shopping
          with our comprehensive e-commerce platform.
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontSize: "1.1rem",
            mb: 6,
            textAlign: "center",
            maxWidth: "800px",
            margin: "0 auto",
            fontWeight: "bold",
            color: colors.secondary,
          }}
        >
          🛒 Order directly from our online store - Click below to shop now!
        </Typography>
        
        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', mb: 8, flexWrap: 'wrap' }}>
          <MotionButton
            variant="contained"
            size="large"
            onClick={handleVisitStore}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            sx={{
              px: 4,
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 600,
              backgroundColor: colors.white,
              color: colors.primary,
              borderRadius: '50px',
              boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
              '&:hover': {
                backgroundColor: '#f8f9fa',
                boxShadow: '0 12px 35px rgba(0,0,0,0.3)'
              }
            }}
            endIcon={<Store />}
          >
            Order Online Now
          </MotionButton>
          
          <MotionButton
            variant="outlined"
            size="large"
            onClick={handleShopNow}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            sx={{
              px: 4,
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderColor: colors.white,
              color: colors.white,
              borderRadius: '50px',
              borderWidth: 2,
              '&:hover': {
                borderColor: colors.white,
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderWidth: 2
              }
            }}
            endIcon={<ShoppingCart />}
          >
            Shop Online Now
          </MotionButton>
        </Box>

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
                cursor: "pointer"
              }}
              onClick={handleVisitStore}
            >
              <Store sx={{ fontSize: 64, color: colors.secondary, mb: 2 }} />
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", textAlign: "center", mb: 2 }}
              >
                Wide Range of Products
              </Typography>
              <Typography sx={{ textAlign: "center", mb: 3 }}>
                From pens and notebooks to specialized textbooks, find
                everything you need for your studies.
              </Typography>
              <Button
                variant="text"
                sx={{ color: colors.primary, fontWeight: 600 }}
                endIcon={<ArrowForward />}
              >
                Browse Products
              </Button>
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
                cursor: "pointer"
              }}
              onClick={() => navigate('/shop/categories')}
            >
              <LocalLibrary
                sx={{ fontSize: 64, color: colors.secondary, mb: 2 }}
              />
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", textAlign: "center", mb: 2 }}
              >
                Exam-Specific Materials
              </Typography>
              <Typography sx={{ textAlign: "center", mb: 3 }}>
                Curated study materials and practice tests tailored for
                various competitive exams.
              </Typography>
              <Button
                variant="text"
                sx={{ color: colors.primary, fontWeight: 600 }}
                endIcon={<ArrowForward />}
              >
                View Categories
              </Button>
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
                cursor: "pointer"
              }}
              onClick={() => navigate('/shop/account')}
            >
              <SupportAgent
                sx={{ fontSize: 64, color: colors.secondary, mb: 2 }}
              />
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", textAlign: "center", mb: 2 }}
              >
                Expert Recommendations
              </Typography>
              <Typography sx={{ textAlign: "center", mb: 3 }}>
                Get personalized advice on the best study materials for your
                specific needs and goals.
              </Typography>
              <Button
                variant="text"
                sx={{ color: colors.primary, fontWeight: 600 }}
                endIcon={<ArrowForward />}
              >
                Get Support
              </Button>
            </StyledCard>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default StationarySection;
