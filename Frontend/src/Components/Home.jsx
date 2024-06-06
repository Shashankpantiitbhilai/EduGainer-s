import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AdminContext } from "../App";
import { logoutUser } from "../services/auth"; // Adjust the path as per your file structure
import { useMediaQuery, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";

function Home() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { IsUserLoggedIn, setIsUserLoggedIn } = useContext(AdminContext);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); // Check if the screen size is small (sm and below)

  const handleLogout = async () => {
    try {
      await logoutUser(); // Call the logout function
      setIsUserLoggedIn(false); // Update context to reflect logged out state
      navigate("/login"); // Redirect to login page after successful logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="app">
      <main>
        <section className="hero">
          <h1>Welcome to EduGainer's Library & Classes</h1>
          <p>Empowering Education Through Innovation</p>
          <div className="buttons">
            <Button
              variant="contained"
              className="explore"
              size={isSmallScreen ? "small" : "large"}
            >
              Explore Our Offerings
            </Button>
            <a href="#" className="learn-more">
              Learn More →
            </a>
          </div>
        </section>
      </main>

      <footer>{/* Footer content */}</footer>
    </div>
  );
}

export default Home;
