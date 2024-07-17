import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
 
  Button,

  Typography,
  Container,
  Box,
} from "@mui/material";
import { AdminContext } from "../../App";
import { logoutUser } from "../../services/auth"; // Adjust the path as per your file structure

function ADMIN_HOME() {
  const navigate = useNavigate();
  const { IsUserLoggedIn, setIsUserLoggedIn } = useContext(AdminContext);

  // // Ensure user is logged in and is an admin
  // if (!IsUserLoggedIn || role !== "admin") {
  //   return null; // If not logged in or not an admin, do not render anything
  // }

  const handleLogout = async () => {
    try {
      await logoutUser(); // Call the logout function
      setIsUserLoggedIn(false); // Update context to reflect logged out state
      navigate("/login"); // Redirect to login page after successful logout
    } catch (error) {
      // console.error("Error logging out:", error);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Container>
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome to Admin Dashboard
          </Typography>
          <Typography variant="subtitle1" component="div" gutterBottom>
            Manage EduGainer's Library & Classes
          </Typography>
          <Button variant="contained" sx={{ mt: 2 }}>
            Explore Admin Tools
          </Button>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <Button variant="outlined" sx={{ mt: 2, ml: 2 }}>
              Return to Home
            </Button>
          </Link>
        </Box>
      </Container>
    </Box>
  );
}

export default ADMIN_HOME;
