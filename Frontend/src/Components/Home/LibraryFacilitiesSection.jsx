import React from "react";
import { motion } from "framer-motion";
import {
  Container,
  Box,
  Grid,
  Card,
  Typography,
  Stack,
  Chip,
} from "@mui/material";
import { colors, designTokens, libraryFacilities } from "./constants";

const MotionCard = motion(Card);
const MotionBox = motion(Box);

const LibraryFacilitiesSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <Box sx={{ 
      backgroundColor: colors.background.default,
      py: { xs: 8, md: 12 },
      position: "relative",
    }}>
      {/* Background decoration */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "100px",
          background: `linear-gradient(180deg, ${colors.background.subtle} 0%, ${colors.background.default} 100%)`,
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          sx={{ textAlign: "center", mb: 8 }}
        >
          <Chip
            label="24/7 Learning Environment"
            sx={{
              background: colors.primary.gradient,
              color: colors.text.inverse,
              fontWeight: designTokens.typography.fontWeight.medium,
              mb: 3,
              px: 2,
              py: 0.5,
              fontSize: "0.9rem",
            }}
          />
          
          <Typography
            variant="h2"
            sx={{
              color: colors.text.primary,
              fontWeight: designTokens.typography.fontWeight.bold,
              mb: 3,
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              lineHeight: designTokens.typography.lineHeight.tight,
              background: colors.primary.gradient,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            EduGainer's Learning Oasis
          </Typography>
          
          <Typography
            variant="h6"
            sx={{
              color: colors.text.secondary,
              fontSize: "1.25rem",
              lineHeight: designTokens.typography.lineHeight.relaxed,
              maxWidth: "800px",
              margin: "0 auto",
              fontWeight: designTokens.typography.fontWeight.normal,
            }}
          >
            Step into a world where learning never sleeps. Our state-of-the-art
            library is your personal sanctuary for success, designed to fuel your 
            aspirations around the clock.
          </Typography>
        </MotionBox>

        <MotionBox
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Grid container spacing={4}>
            {libraryFacilities.map((facility, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <MotionCard
                  variants={itemVariants}
                  whileHover={{ 
                    y: -8,
                    transition: { duration: 0.3 }
                  }}
                  sx={{
                    height: "100%",
                    background: colors.background.paper,
                    borderRadius: designTokens.borderRadius.xl,
                    border: `1px solid ${colors.border.light}`,
                    boxShadow: colors.shadow.md,
                    overflow: "hidden",
                    position: "relative",
                    "&:hover": {
                      boxShadow: colors.shadow.xl,
                      border: `1px solid ${colors.primary.light}`,
                    },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "4px",
                      background: colors.primary.gradient,
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  <Stack
                    spacing={3}
                    sx={{
                      p: 4,
                      height: "100%",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        background: colors.primary.gradient,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: colors.text.inverse,
                        fontSize: "2.5rem",
                        boxShadow: colors.shadow.lg,
                        position: "relative",
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          inset: -4,
                          borderRadius: "50%",
                          background: colors.primary.gradient,
                          opacity: 0.2,
                          zIndex: -1,
                        },
                      }}
                    >
                      {facility.icon}
                    </Box>

                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: colors.text.primary,
                          fontWeight: designTokens.typography.fontWeight.semibold,
                          fontSize: "1.1rem",
                          lineHeight: designTokens.typography.lineHeight.tight,
                        }}
                      >
                        {facility.text}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        width: "100%",
                        height: 2,
                        background: colors.border.light,
                        borderRadius: 1,
                        position: "relative",
                        overflow: "hidden",
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          left: 0,
                          top: 0,
                          width: "60%",
                          height: "100%",
                          background: colors.secondary.gradient,
                          borderRadius: 1,
                        },
                      }}
                    />
                  </Stack>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </MotionBox>

        {/* Call to action */}
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          sx={{
            textAlign: "center",
            mt: 8,
            p: 6,
            background: colors.background.paper,
            borderRadius: designTokens.borderRadius.xxl,
            border: `1px solid ${colors.border.light}`,
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `radial-gradient(circle at center, ${colors.primary.main}05 0%, transparent 70%)`,
            },
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: colors.text.primary,
              fontWeight: designTokens.typography.fontWeight.semibold,
              mb: 2,
            }}
          >
            Ready to Experience Excellence?
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: colors.text.secondary,
              fontSize: "1.1rem",
            }}
          >
            Visit our campus and see why thousands of students choose EduGainer's 
            as their pathway to success.
          </Typography>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default LibraryFacilitiesSection;
