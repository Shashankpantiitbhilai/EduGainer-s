import React from "react";
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Link, 
  useTheme,
  Paper,
  Divider,
  Stack,
  IconButton
} from "@mui/material";
import {
  Email,
  Phone,
  LocationOn,
  Instagram,
  Facebook,
  LinkedIn,
} from "@mui/icons-material";
import XLogo from "@mui/icons-material/X";
import { designTokens } from '../../theme/enterpriseTheme';

function Footer() {
  const theme = useTheme();

  const socialLinks = [
    {
      name: "Instagram",
      url: "https://www.instagram.com/edugainersclasses/?hl=en",
      icon: Instagram,
      color: "#E1306C"
    },
    {
      name: "Facebook", 
      url: "https://www.facebook.com/EduGainers/",
      icon: Facebook,
      color: "#1877F2"
    },
    {
      name: "Twitter",
      url: "https://x.com/edugainers",
      icon: XLogo,
      color: "#000000"
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/edu-gainers-bb128328b/?originalSubdomain=in",
      icon: LinkedIn,
      color: "#0A66C2"
    }
  ];

  const contactInfo = [
    {
      icon: Email,
      text: "edugainersclasses@gmail.com",
      href: "mailto:edugainersclasses@gmail.com",
      type: "email"
    },
    {
      icon: Phone,
      text: "+91 8126857111 | +91 6397166682",
      href: "tel:+918126857111",
      type: "phone"
    },
    {
      icon: Phone,
      text: "+91 9997999768 | +91 9997999765",
      href: "tel:+919997999768",
      type: "phone"
    }
  ];

  return (
    <Box 
      component="footer"
      sx={{
        background: theme.palette.mode === 'dark' 
          ? `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`
          : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        color: theme.palette.primary.contrastText,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: theme.palette.mode === 'dark'
            ? 'radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.03) 0%, transparent 70%)'
            : 'radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        },
      }}
    >
      {/* Main Footer Content */}
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ py: { xs: 4, sm: 6, md: 8 } }}>
          <Grid container spacing={{ xs: 3, sm: 4, md: 6 }}>
            {/* Company Info */}
            <Grid item xs={12} md={4}>
              <Stack spacing={3}>
                <Typography 
                  variant="h5" 
                  sx={{
                    fontWeight: designTokens.typography.fontWeight.bold,
                    color: theme.palette.primary.contrastText,
                    mb: 2,
                  }}
                >
                  EduGainer's
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{
                    fontWeight: designTokens.typography.fontWeight.semibold,
                    color: theme.palette.secondary.main,
                    mb: 1,
                  }}
                >
                  Classes & Library
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <LocationOn 
                    sx={{ 
                      color: theme.palette.secondary.main,
                      mt: 0.5,
                      flexShrink: 0,
                    }} 
                  />
                  <Typography 
                    variant="body1" 
                    sx={{
                      color: theme.palette.primary.contrastText,
                      opacity: 0.9,
                      lineHeight: 1.6,
                    }}
                  >
                    Near Court road, MeriStationary,<br />
                    EduGainer's Classes & Library,<br />
                    Uttarkashi - 249193
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            {/* Contact Information */}
            <Grid item xs={12} md={4}>
              <Stack spacing={3}>
                <Typography 
                  variant="h6" 
                  sx={{
                    fontWeight: designTokens.typography.fontWeight.bold,
                    color: theme.palette.primary.contrastText,
                    mb: 2,
                  }}
                >
                  Contact Us
                </Typography>
                <Stack spacing={2}>
                  {contactInfo.map((contact, index) => (
                    <Link
                      key={index}
                      href={contact.href}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        color: contact.type === 'email' 
                          ? theme.palette.secondary.main 
                          : theme.palette.primary.contrastText,
                        textDecoration: 'none',
                        opacity: 0.9,
                        transition: `all ${designTokens.animation.duration.normal} ${designTokens.animation.easing.default}`,
                        borderRadius: designTokens.borderRadius.sm,
                        p: 1,
                        '&:hover': {
                          opacity: 1,
                          color: theme.palette.secondary.main,
                          transform: 'translateX(4px)',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        },
                      }}
                    >
                      <contact.icon sx={{ flexShrink: 0 }} />
                      <Typography variant="body1" sx={{ fontWeight: designTokens.typography.fontWeight.medium }}>
                        {contact.text}
                      </Typography>
                    </Link>
                  ))}
                </Stack>
              </Stack>
            </Grid>

            {/* Social Media Links */}
            <Grid item xs={12} md={4}>
              <Stack spacing={3}>
                <Typography 
                  variant="h6" 
                  sx={{
                    fontWeight: designTokens.typography.fontWeight.bold,
                    color: theme.palette.primary.contrastText,
                    mb: 2,
                  }}
                >
                  Connect with Us
                </Typography>
                <Stack spacing={1.5}>
                  {socialLinks.map((social) => (
                    <Link
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        color: theme.palette.primary.contrastText,
                        textDecoration: 'none',
                        opacity: 0.9,
                        transition: `all ${designTokens.animation.duration.normal} ${designTokens.animation.easing.default}`,
                        borderRadius: designTokens.borderRadius.sm,
                        p: 1,
                        '&:hover': {
                          opacity: 1,
                          color: theme.palette.secondary.main,
                          transform: 'translateX(4px)',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          '& .social-icon': {
                            color: social.color,
                            transform: 'scale(1.1)',
                          },
                        },
                      }}
                    >
                      <social.icon 
                        className="social-icon"
                        sx={{ 
                          flexShrink: 0,
                          transition: `all ${designTokens.animation.duration.normal} ${designTokens.animation.easing.default}`,
                        }} 
                      />
                      <Typography variant="body1" sx={{ fontWeight: designTokens.typography.fontWeight.medium }}>
                        {social.name}
                      </Typography>
                    </Link>
                  ))}
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Box>

        {/* Footer Bottom */}
        <Divider 
          sx={{ 
            borderColor: 'rgba(255, 255, 255, 0.1)',
            mb: 3,
          }} 
        />
        <Box 
          sx={{ 
            pb: 4,
            textAlign: 'center',
          }}
        >
          <Typography 
            variant="body1" 
            sx={{ 
              color: theme.palette.primary.contrastText,
              opacity: 0.8,
              mb: 2,
              fontWeight: designTokens.typography.fontWeight.medium,
            }}
          >
            {"Copyright © "}
            <Link
              href="https://maps.app.goo.gl/8CtfP1XWEz7dJaXZ8"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: theme.palette.secondary.main,
                textDecoration: 'none',
                fontWeight: designTokens.typography.fontWeight.semibold,
                transition: `color ${designTokens.animation.duration.normal} ${designTokens.animation.easing.default}`,
                '&:hover': {
                  color: theme.palette.secondary.light,
                },
              }}
            >
              EduGainer's Classes and Library
            </Link>{" "}
            {new Date().getFullYear()}. All rights reserved.
          </Typography>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Link 
              href="/Policies" 
              sx={{
                color: theme.palette.primary.contrastText,
                textDecoration: 'none',
                opacity: 0.8,
                transition: `all ${designTokens.animation.duration.normal} ${designTokens.animation.easing.default}`,
                '&:hover': {
                  color: theme.palette.secondary.main,
                  opacity: 1,
                },
              }}
            >
              Terms of Service
            </Link>
            <Typography 
              sx={{ 
                color: theme.palette.primary.contrastText,
                opacity: 0.5,
                display: { xs: 'none', sm: 'block' }
              }}
            >
              |
            </Typography>
            <Link 
              href="/Policies" 
              sx={{
                color: theme.palette.primary.contrastText,
                textDecoration: 'none',
                opacity: 0.8,
                transition: `all ${designTokens.animation.duration.normal} ${designTokens.animation.easing.default}`,
                '&:hover': {
                  color: theme.palette.secondary.main,
                  opacity: 1,
                },
              }}
            >
              Privacy Policy
            </Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
