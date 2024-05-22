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

// Library Component
function Library() {
  return (
    <Container maxWidth="lg" style={{ marginTop: "2rem" }}>
      <Box textAlign="center" marginBottom="2rem">
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to EduGainer's Library
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
          Explore Our Offerings
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
            <ButtonLink to="/new-reg">Register</ButtonLink>
          </CardContent>
        </Card>
        {/* Card 2 */}
        <Card>
          <CardContent>
            <Typography variant="h5" component="h3">
              Afternoon Shift
            </Typography>
            <Typography variant="body2">15 seats available</Typography>
          </CardContent>
        </Card>
        {/* Card 3 */}
        <Card>
          <CardContent>
            <Typography variant="h5" component="h3">
              Evening Shift
            </Typography>
            <Typography variant="body2">10 seats available</Typography>
          </CardContent>
        </Card>
        {/* Card 4 */}
        <Card>
          <CardContent>
            <Typography variant="h5" component="h3">
              Night Shift
            </Typography>
            <Typography variant="body2">18 seats available</Typography>
          </CardContent>
        </Card>
        {/* Card 5 */}
        <Card>
          <CardContent>
            <Typography variant="h5" component="h3">
              Weekend Shift
            </Typography>
            <Typography variant="body2">25 seats available</Typography>
          </CardContent>
        </Card>
        {/* Card 6 */}
        <Card>
          <CardContent>
            <Typography variant="h5" component="h3">
              24/7 Shift
            </Typography>
            <Typography variant="body2">5 seats available</Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default Library;
