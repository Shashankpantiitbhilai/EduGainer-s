import React from "react";
import { Box, Container, Grid, Typography, Link } from "@mui/material";
import { Email, Phone, LocationOn } from "@mui/icons-material";

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
              Court, court road, Uttarkashi - 249193
              <br />
              (Beside Goswami School)
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
              9997999765 | 8126857111
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={footerStyles.heading}>
              Quick Links
            </Typography>
            <Link href="/Policies" sx={footerStyles.link}>
              Privacy Policy
            </Link>
            <br />
            <Link href="/Policies" sx={footerStyles.link}>
              Terms of Service
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
