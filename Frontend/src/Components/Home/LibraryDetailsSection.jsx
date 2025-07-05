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
import {
  BookOnline,
  AutoStories,
  DesktopMac,
} from "@mui/icons-material";
import { colors, designTokens } from "./constants";

const MotionCard = motion(Card);
const MotionBox = motion(Box);

const LibraryDetailsSection = () => {
  const libraryFeatures = [
    {
      icon: <BookOnline />,
      title: "Vast Collection",
      description: "Access to thousands of books, journals, and online resources covering a wide range of subjects.",
      color: colors.primary.main,
    },
    {
      icon: <AutoStories />,
      title: "Quiet Study Areas",
      description: "Dedicated spaces for focused individual study and group collaboration.",
      color: colors.secondary.main,
    },
    {
      icon: <DesktopMac />,
      title: "Digital Resources",
      description: "Access to online databases, e-books, and research materials to support your studies.",
      color: colors.accent.info,
    },
  ];

  return (
    <Box
      sx={{ 
        background: colors.primary.gradient,
        color: colors.text.inverse,
        py: { xs: 8, md: 12 },
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 30% 80%, ${colors.secondary.main}15 0%, transparent 50%)`,
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          sx={{ textAlign: "center", mb: 8 }}
        >
          <Chip
            label="State-of-the-Art Facilities"
            sx={{
              background: colors.secondary.gradient,
              color: colors.text.primary,
              fontWeight: designTokens.typography.fontWeight.semibold,
              mb: 3,
              px: 3,
              py: 1,
              fontSize: "0.9rem",
            }}
          />
          
          <Typography
            variant="h2"
            sx={{
              fontWeight: designTokens.typography.fontWeight.bold,
              mb: 3,
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              lineHeight: designTokens.typography.lineHeight.tight,
            }}
          >
            EduGainer's Library
          </Typography>
          
          <Typography
            variant="h6"
            sx={{
              color: colors.neutral[200],
              fontSize: "1.25rem",
              lineHeight: designTokens.typography.lineHeight.relaxed,
              maxWidth: "800px",
              margin: "0 auto",
            }}
          >
            Our state-of-the-art library is a haven for knowledge seekers. With
            an extensive collection of books, digital resources, and a serene
            environment, it's the perfect place to immerse yourself in learning.
          </Typography>
        </MotionBox>

        <Grid container spacing={4}>
          {libraryFeatures.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <MotionCard
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                whileHover={{ 
                  y: -12,
                  transition: { duration: 0.3 }
                }}
                sx={{
                  height: "100%",
                  background: colors.background.paper,
                  borderRadius: designTokens.borderRadius.xl,
                  border: `1px solid ${colors.border.light}`,
                  boxShadow: colors.shadow.lg,
                  overflow: "hidden",
                  position: "relative",
                  "&:hover": {
                    boxShadow: colors.shadow.xl,
                    border: `1px solid ${feature.color}`,
                  },
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background: `linear-gradient(90deg, ${feature.color} 0%, ${feature.color}80 100%)`,
                  },
                  transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                }}
              >
                <Stack spacing={3} sx={{ p: 4, height: "100%" }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      background: `${feature.color}15`,
                      border: `2px solid ${feature.color}30`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: feature.color,
                      fontSize: "2.5rem",
                      margin: "0 auto",
                      position: "relative",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        inset: -8,
                        borderRadius: "50%",
                        background: `${feature.color}08`,
                        zIndex: -1,
                      },
                    }}
                  >
                    {feature.icon}
                  </Box>

                  <Box sx={{ flex: 1, textAlign: "center" }}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: colors.text.primary,
                        fontWeight: designTokens.typography.fontWeight.bold,
                        fontSize: "1.2rem",
                        mb: 2,
                      }}
                    >
                      {feature.title}
                    </Typography>
                    
                    <Typography
                      variant="body2"
                      sx={{
                        color: colors.text.secondary,
                        lineHeight: 1.6,
                        fontSize: "1rem",
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </Box>

                  {/* Progress indicator */}
                  <Box
                    sx={{
                      width: "100%",
                      height: 3,
                      background: colors.border.light,
                      borderRadius: 2,
                      position: "relative",
                      overflow: "hidden",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        left: 0,
                        top: 0,
                        width: "75%",
                        height: "100%",
                        background: `linear-gradient(90deg, ${feature.color} 0%, ${feature.color}80 100%)`,
                        borderRadius: 2,
                      },
                    }}
                  />
                </Stack>
              </MotionCard>
            </Grid>
          ))}
        </Grid>

        {/* Bottom section with additional info */}
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          sx={{
            textAlign: "center",
            mt: 10,
            p: 6,
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            borderRadius: designTokens.borderRadius.xxl,
            border: `1px solid rgba(255, 255, 255, 0.2)`,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: designTokens.typography.fontWeight.bold,
              mb: 2,
              color: colors.text.inverse,
            }}
          >
            24/7 Access to Knowledge
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: colors.neutral[200],
              fontSize: "1.1rem",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Our library never sleeps, ensuring that your learning journey continues 
            around the clock. Experience the perfect blend of traditional books and 
            modern digital resources.
          </Typography>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default LibraryDetailsSection;
