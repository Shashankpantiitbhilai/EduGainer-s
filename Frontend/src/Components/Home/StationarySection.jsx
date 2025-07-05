import React from "react";
import { motion } from "framer-motion";
import {
  Container,
  Box,
  Grid,
  Card,
  Typography,
} from "@mui/material";
import {
  Store,
  LocalLibrary,
  SupportAgent,
} from "@mui/icons-material";
import { colors } from "./constants";

const StyledCard = motion(Card);

const StationarySection = () => {
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
  );
};

export default StationarySection;
