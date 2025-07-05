import React from "react";
import { motion } from "framer-motion";
import {
  Container,
  Grid,
  Card,
  Typography,
} from "@mui/material";
import {
  Class,
  MenuBook,
  SupportAgent,
} from "@mui/icons-material";
import { colors } from "./constants";

const StyledCard = motion(Card);

const ClassesDetailsSection = () => {
  return (
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
  );
};

export default ClassesDetailsSection;
