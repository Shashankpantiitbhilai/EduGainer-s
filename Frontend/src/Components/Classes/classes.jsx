import React, { useContext } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import { AdminContext } from "../../App";
// ButtonLink Component
function ButtonLink({ to, children }) {
  return (
    <Link to={to} style={{ textDecoration: "none" }}>
      <Button variant="contained" color="primary">
        {children}
      </Button>
    </Link>
  );
}

// EdugainerClasses Component
function EdugainerClasses() {
  const { IsUserLoggedIn, setIsUserLoggedIn } = useContext(AdminContext);
  let id = 0;
  if (IsUserLoggedIn) {
    id = IsUserLoggedIn._id;
  }
  return (
    <Container maxWidth="lg" style={{ marginTop: "2rem" }}>
      <Box textAlign="center" marginBottom="2rem">
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to EduGainer Classes
        </Typography>
        <Typography variant="h6" component="p" color="textSecondary">
          Empowering Education Through Innovation
        </Typography>
      </Box>

      <Box textAlign="center" marginBottom="4rem">
        <Button
          variant="contained"
          color="secondary"
          style={{ marginRight: "1rem" }}
        >
          Explore Our Classes
        </Button>
        <Button variant="outlined" color="secondary">
          Learn More →
        </Button>
      </Box>

      <Typography variant="h4" component="h2" gutterBottom>
        Registration Batches
      </Typography>
      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" }}
        gap="1rem"
      >
        {/* Card 1 */}
        <Card>
          <CardContent>
            <Typography variant="h5" component="h3">
              Batch 12
            </Typography>
            <Typography variant="body2">
              Join our latest batch for comprehensive learning.
            </Typography>
            <ButtonLink to={`/classes-reg/${id}`}>Register</ButtonLink>
          </CardContent>
        </Card>
        {/* Card 2 */}
        <Card>
          <CardContent>
            <Typography variant="h5" component="h3">
              Batch 13
            </Typography>
            <Typography variant="body2">
              Enroll now for an immersive learning experience.
            </Typography>
            <ButtonLink to="/batch-13-reg">Register</ButtonLink>
          </CardContent>
        </Card>
        {/* Card 3 */}
        <Card>
          <CardContent>
            <Typography variant="h5" component="h3">
              Batch 14
            </Typography>
            <Typography variant="body2">
              Secure your spot in our upcoming batch.
            </Typography>
            <ButtonLink to="/batch-14-reg">Register</ButtonLink>
          </CardContent>
        </Card>
        {/* Add more cards as needed */}
      </Box>
    </Container>
  );
}

export default EdugainerClasses;
