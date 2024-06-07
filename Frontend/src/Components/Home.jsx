import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AdminContext } from "../App";
import { logoutUser } from "../services/auth";
import { Box, Button, Container, Typography } from "@mui/material";
import { styled } from "@mui/system";

const HeroSection = styled(Box)({
  textAlign: "center",
  padding: "40px 20px",
  backgroundColor: "#f5f5f5",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  marginTop: "20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

const HeroTitle = styled(Typography)({
  fontSize: "2rem",
  marginBottom: "20px",
  "@media (min-width:600px)": {
    fontSize: "3rem",
  },
});

const HeroSubtitle = styled(Typography)({
  fontSize: "1.2rem",
  marginBottom: "40px",
  "@media (min-width:600px)": {
    fontSize: "1.5rem",
  },
});

const ButtonContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  alignItems: "center",
  justifyContent: "center",
  width: "100%", // Full width for centering within parent container
  "@media (min-width:600px)": {
    flexDirection: "row",
  },
});

function Home() {
  const navigate = useNavigate();
  const { IsUserLoggedIn, setIsUserLoggedIn } = useContext(AdminContext);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setIsUserLoggedIn(false);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <Container>
      <HeroSection>
        <HeroTitle variant="h1">
          Welcome to EduGainer's Library & Classes
        </HeroTitle>
        <HeroSubtitle variant="body1">
          Empowering Education Through Innovation
        </HeroSubtitle>
        <ButtonContainer>
          <Button variant="contained" color="primary" className="explore">
            Explore Our Offerings
          </Button>
          <Button
            component={Link}
            to="/learn-more"
            color="primary"
            className="learn-more"
          >
            Learn More →
          </Button>
        </ButtonContainer>
      </HeroSection>
      <footer>{/* Footer content */}</footer>
    </Container>
  );
}

export default Home;
