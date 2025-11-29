import React from "react";
import { motion } from "framer-motion";
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  Stack, 
  Chip,
  Grid,
  Button,
} from "@mui/material";
import { 
  LocationOn, 
  Phone, 
  Email, 
  AccessTime,
  Directions 
} from "@mui/icons-material";
import { colors, designTokens } from "./constants";

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const MapSection = () => {
  const contactInfo = [
    {
      icon: <LocationOn />,
      label: "Address",
      value: "EduGainer's Career Point,Uttarkashi,Uttarakhand - 249193",
    },
    {
      icon: <Phone />,
      label: "Phone",
      value: "+91 9997999765",
    },
    {
      icon: <Email />,
      label: "Email",
      value: "edugainersclasses@gmail.com",
    },
    {
      icon: <AccessTime />,
      label: "Hours",
      value: "24/7 Open",
    },
  ];

  return (
    <Box sx={{ 
      backgroundColor: colors.background.subtle,
      py: { xs: 8, md: 12 },
    }}>
      <Container maxWidth="lg">
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          sx={{ textAlign: "center", mb: 8 }}
        >
          <Chip
            label="Visit Our Campus"
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
            }}
          >
            Find Us on the Map
          </Typography>
          
          <Typography
            variant="h6"
            sx={{
              color: colors.text.secondary,
              fontSize: "1.2rem",
              lineHeight: designTokens.typography.lineHeight.relaxed,
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Located in the heart of Dehradun, our campus is easily accessible 
            and equipped with world-class facilities.
          </Typography>
        </MotionBox>

        <Grid container spacing={6} alignItems="stretch">
          {/* Contact Information */}
          <Grid item xs={12} md={4}>
            <MotionCard
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              sx={{
                p: 4,
                height: "100%",
                background: colors.background.paper,
                borderRadius: designTokens.borderRadius.xl,
                border: `1px solid ${colors.border.light}`,
                boxShadow: colors.shadow.lg,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  color: colors.text.primary,
                  fontWeight: designTokens.typography.fontWeight.bold,
                  mb: 4,
                }}
              >
                Get in Touch
              </Typography>

              <Stack spacing={3}>
                {contactInfo.map((info, index) => (
                  <MotionBox
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 2,
                      p: 2,
                      borderRadius: designTokens.borderRadius.lg,
                      "&:hover": {
                        background: colors.background.subtle,
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: colors.primary.gradient,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: colors.text.inverse,
                        flexShrink: 0,
                      }}
                    >
                      {info.icon}
                    </Box>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: colors.text.muted,
                          fontSize: "0.85rem",
                          fontWeight: designTokens.typography.fontWeight.medium,
                          mb: 0.5,
                        }}
                      >
                        {info.label}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: colors.text.primary,
                          fontSize: "0.95rem",
                          lineHeight: 1.4,
                        }}
                      >
                        {info.value}
                      </Typography>
                    </Box>
                  </MotionBox>
                ))}
              </Stack>

              <Button
                variant="contained"
                startIcon={<Directions />}
                fullWidth
                sx={{
                  mt: 4,
                  background: colors.secondary.gradient,
                  color: colors.text.primary,
                  fontWeight: designTokens.typography.fontWeight.semibold,
                  py: 1.5,
                  borderRadius: designTokens.borderRadius.lg,
                  textTransform: "none",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: colors.shadow.lg,
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Get Directions
              </Button>
            </MotionCard>
          </Grid>

          {/* Map */}
          <Grid item xs={12} md={8}>
            <MotionBox
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              sx={{
                position: "relative",
                height: { xs: 400, md: 500 },
                borderRadius: designTokens.borderRadius.xl,
                overflow: "hidden",
                boxShadow: colors.shadow.xl,
                border: `1px solid ${colors.border.light}`,
                "&:hover": {
                  transform: "scale(1.02)",
                  boxShadow: colors.shadow.xl,
                },
                transition: "all 0.3s ease",
              }}
            >
              {/* Loading placeholder */}
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: colors.background.paper,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: colors.text.muted }}
                >
                  Loading map...
                </Typography>
              </Box>

              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6859.271406693189!2d78.42992424145729!3d30.72864022085043!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3908ed08d3bdd33f%3A0xc82a9e75e23749e4!2sEduGainer&#39;s%20Career%20Point!5e0!3m2!1sen!2sin!4v1724170083231!5m2!1sen!2sin"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: 0,
                  zIndex: 2,
                }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                onLoad={(e) => {
                  // Hide loading placeholder when map loads
                  const placeholder = e.target.parentElement.querySelector('div');
                  if (placeholder) placeholder.style.display = 'none';
                }}
              />

              {/* Map overlay badge */}
              <Box
                sx={{
                  position: "absolute",
                  top: 16,
                  left: 16,
                  background: colors.background.paper,
                  borderRadius: designTokens.borderRadius.lg,
                  px: 2,
                  py: 1,
                  boxShadow: colors.shadow.md,
                  zIndex: 3,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: colors.text.primary,
                    fontWeight: designTokens.typography.fontWeight.semibold,
                    fontSize: "0.75rem",
                  }}
                >
                  EduGainer's Campus
                </Typography>
              </Box>
            </MotionBox>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default MapSection;
