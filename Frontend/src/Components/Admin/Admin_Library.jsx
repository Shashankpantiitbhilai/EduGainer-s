import React from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
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
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to EduGainer's Library (Admin View)
        </Typography>
        <Typography variant="h6" component="p" color="textSecondary">
          Manage Library Resources and Users
        </Typography>
      </Box>

      <Box textAlign="center" mb={6}>
        <Button variant="contained" color="secondary" sx={{ marginRight: 2 }}>
          Explore Library Offerings
        </Button>
        <Button variant="outlined" color="secondary">
          Learn More →
        </Button>
      </Box>

      <Typography variant="h4" component="h2" gutterBottom>
        Manage Sections
      </Typography>
      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" }}
        gap={4}
      >
        {/* Manage Users Card */}
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <CardContent>
            <Typography variant="h5" component="h3">
              Manage Users
            </Typography>
            <Typography variant="body2" color="textSecondary">
              View, edit, and delete user profiles. Manage user roles and
              monitor user activity.
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/admin_library/manage-users"
              sx={{ marginTop: 1, marginBottom: 0 }}
            >
              Go to Manage Users
            </Button>
          </CardActions>
        </Card>

        {/* Manage Resources Card */}
        <Card>
          <CardContent>
            <Typography variant="h5" component="h3">
              Manage Resources
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Add, edit, and delete library resources. Categorize and tag
              resources for easier search and organization.
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/admin_library/manage-resources"
              sx={{ marginTop: 1 }}
            >
              Go to Manage Resources
            </Button>
          </CardActions>
        </Card>
      </Box>
    </Container>
  );
}

export default Admin_Library;
