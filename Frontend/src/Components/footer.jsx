// Footer.js
import React from "react";
import { Box, Typography, Link } from "@mui/material";

function Footer() {
  return (
    <Box
      sx={{
        mt: 5,
        py: 3,
        px: 2,
        backgroundColor: (theme) =>
          theme.palette.mode === "dark"
            ? theme.palette.blue[200]
            : theme.palette.grey[800],
      }}
      component="footer"
    >
      <Typography variant="body1" align="center">
        <Link href="/Policies" underline="none" color="inherit">
          Privacy Policy
        </Link>
        {" | "}
        <Link href="/Policies" underline="none" color="inherit">
          Terms of Use
        </Link>
      </Typography>
      <Typography variant="body2" color="textSecondary" align="center">
        {"Copyright © "}
        <Link color="inherit" href="/">
          EduGainer's Library & Classes
        </Link>{" "}
        {new Date().getFullYear()}.{" All rights reserved."}
      </Typography>
    </Box>
  );
}

export default Footer;
