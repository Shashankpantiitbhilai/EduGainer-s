import React from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Box,
} from "@mui/material";

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

// Admin_Library Component
function Admin_Library() {
  return (
    <Container maxWidth="lg" style={{ marginTop: "2rem" }}>
      <Box textAlign="center" marginBottom="2rem">
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to EduGainer's Library (Admin View)
        </Typography>
        <Typography variant="h6" component="p" color="textSecondary">
          Manage Library Shifts and Users
        </Typography>
      </Box>

      <Box textAlign="center" marginBottom="4rem">
        <Button
          variant="contained"
          color="secondary"
          style={{ marginRight: "1rem" }}
        >
          Explore Library Offerings
        </Button>
        <Button variant="outlined" color="secondary">
          Learn More →
        </Button>
      </Box>

      <Typography variant="h4" component="h2" gutterBottom>
        Library Shifts
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
              Morning Shift
            </Typography>
            <Typography variant="body2">20 seats available</Typography>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/manage-users"
              style={{ marginTop: "1rem" }}
            >
              Manage Users
            </Button>
          </CardContent>
        </Card>
        {/* Add other shifts cards similarly */}
      </Box>
    </Container>
  );
}

export default Admin_Library;
