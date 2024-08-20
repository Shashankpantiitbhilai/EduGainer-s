import React from "react";
import { Box, Container, Grid, Typography, Link } from "@mui/material";
import {
  Email,
  Phone,
  LocationOn,
  Instagram,
  Facebook,
  LinkedIn,
} from "@mui/icons-material";

const footerStyles = {
  footer: {
    backgroundColor: "#006400", // Dark Green
    color: "#FFFFFF",
    py: 6,
    borderTop: "4px solid #FFA500", // Orange border
  },
  heading: {
    fontWeight: "bold",
    mb: 2,
  },
  link: {
    color: "#FFFFFF",
    "&:hover": {
      color: "#FFA500", // Orange on hover
    },
  },
  icon: {
    verticalAlign: "middle",
    mr: 1,
  },
  instagramIcon: {
    color: "#E1306C",
    "&:hover": {
      color: "#FFA500",
    },
  },
  facebookIcon: {
    color: "#1877F2",
    "&:hover": {
      color: "#FFA500",
    },
  },
  linkedinIcon: {
    color: "#0A66C2",
    "&:hover": {
      color: "#FFA500",
    },
  },
};

function Footer() {
  return (
    <Box sx={footerStyles.footer} component="footer">
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={footerStyles.heading}>
              EduGainer's Classes and Library
            </Typography>
            <Typography variant="body2">
              <LocationOn sx={footerStyles.icon} />
              Near Court road,MeriStationary,EduGainer's Classes & Library,
              Uttarkashi - 249193
              <br />
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={footerStyles.heading}>
              Contact Us
            </Typography>
            <Typography variant="body1" sx={{ color: "orange" }}>
              <Link
                href="mailto:edugainersclasses@gmail.com"
                sx={{ color: "orange", textDecoration: "none" }}
              >
                <Email sx={footerStyles.icon} /> edugainersclasses@gmail.com
              </Link>
            </Typography>
            <Typography variant="body2">
              <Phone sx={footerStyles.icon} />
              +91 8126857111 | +91 6397166682 | +91 9997999768 | +91 9997999765
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={footerStyles.heading}>
              Connect with Us
            </Typography>
            <Link
              href="https://www.instagram.com/edugainersclasses/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              sx={footerStyles.link}
            >
              <Instagram
                sx={{ ...footerStyles.icon, ...footerStyles.instagramIcon }}
              />{" "}
              Instagram
            </Link>
            <br />
            <Link
              href="https://www.facebook.com/EduGainers/"
              target="_blank"
              rel="noopener noreferrer"
              sx={footerStyles.link}
            >
              <Facebook
                sx={{ ...footerStyles.icon, ...footerStyles.facebookIcon }}
              />{" "}
              Facebook
            </Link>
            <br />
            <Link
              href="https://www.linkedin.com/in/edu-gainers-bb128328b/?originalSubdomain=in"
              target="_blank"
              rel="noopener noreferrer"
              sx={footerStyles.link}
            >
              <LinkedIn
                sx={{ ...footerStyles.icon, ...footerStyles.linkedinIcon }}
              />{" "}
              LinkedIn
            </Link>
          </Grid>
        </Grid>
        <Box
          sx={{ mt: 4, borderTop: "1px solid rgba(255,255,255,0.1)", pt: 2 }}
        >
          <Typography variant="body2" align="center">
            {"Copyright © "}
            <Link color="inherit" href="/" sx={footerStyles.link}>
              EduGainer's Classes and Library
            </Link>{" "}
            {new Date().getFullYear()}. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
