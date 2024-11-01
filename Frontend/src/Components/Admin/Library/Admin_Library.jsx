import React, { useState,useContext } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Box,
  Grid,
  IconButton,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Person as PersonIcon,
  LibraryBooks as LibraryBooksIcon,
  EventSeat as EventSeatIcon,
  Inventory as InventoryIcon,
  ArrowForward as ArrowForwardIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { LibraryAccessDialog } from "./access"; // Adjust the path as necessary
import { AdminContext } from "../../../App";
const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[10],
  },
}));

const CardIcon = styled(Box)(({ theme }) => ({
  fontSize: 48,
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "scale(1.1)",
  },
}));

const AdminCard = ({ title, description, link, icon: Icon, onClick }) => (
  <StyledCard>
    <CardContent sx={{ flexGrow: 1, position: "relative" }}>
      <Tooltip title={`Information about ${title}`} placement="top">
        <IconButton
          sx={{ position: "absolute", top: 8, right: 8 }}
          aria-label={`Info about ${title}`}
          onClick={onClick} // Trigger dialog on info click
        >
          <InfoIcon />
        </IconButton>
      </Tooltip>
      <CardIcon>
        <Icon fontSize="inherit" />
      </CardIcon>
      <Typography variant="h5" component="h3" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </CardContent>
    <CardActions>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to={link}
        fullWidth
        endIcon={<ArrowForwardIcon />}
        sx={{
          transition: "background-color 0.3s",
          "&:hover": {
            backgroundColor: "primary.dark",
          },
        }}
      >
        {title}
      </Button>
    </CardActions>
  </StyledCard>
);

function Admin_Library() {
  const [dialogOpen, setDialogOpen] = useState(true);
  const { IsUserLoggedIn } = useContext(AdminContext)
  console.log(IsUserLoggedIn,"user")
  const adminCards = [
    {
      title: "Manage Library Seats",
      description: "Manage Library Seats and overall library operations.",
      link: "/admin_library/manage-current-month-bookings",
      icon: LibraryBooksIcon,
    },
    {
      title: "Manage Monthly Bookings",
      description: "Oversee and manage current library seat bookings.",
      link: "/admin_library/manage-seats",
      icon: EventSeatIcon,
    },
    {
      title: "Manage Library Resources",
      description:
        "Add, edit, and delete library resources. Categorize and tag resources for easier search and organization.",
      link: "/admin_library/manage-resources",
      icon: InventoryIcon,
    },
    {
      title: "Manage Library Database",
      description:
        "View, edit, and delete user profiles. Manage user roles and monitor user activity.",
      link: "/admin_library/manage-users",
      icon: PersonIcon,
    },
  ];

  const handleDialogSuccess = () => {
    
    setDialogOpen(false);
    // Handle success logic (e.g., refresh data)
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to EduGainer's Library
        </Typography>
        <Typography
          variant="h5"
          component="h2"
          color="text.secondary"
          gutterBottom
        >
          Admin Dashboard
        </Typography>
      </Box>

      <Typography variant="h4" component="h2" gutterBottom>
        Manage Sections
      </Typography>
      <Grid container spacing={4}>
        {adminCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <AdminCard 
              {...card} 
              onClick={() => setDialogOpen(true)} // Open dialog on info click
            />
          </Grid>
        ))}
      </Grid>

      {/* Library Access Dialog */}
      <LibraryAccessDialog
        open={dialogOpen}
        onSuccess={handleDialogSuccess}
        onClose={handleDialogClose}
        adminId={IsUserLoggedIn?._id}
        isUserLoggedIn={IsUserLoggedIn}// Pass the actual admin ID
      />
    </Container>
  );
}

export default Admin_Library;
