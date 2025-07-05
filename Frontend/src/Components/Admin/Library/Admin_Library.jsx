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
import { AdminContext } from "../../../App";
import { colors, designTokens, glassMorphism, hoverScale } from '../../../theme/enterpriseTheme';

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: designTokens.borderRadius.xl,
  border: `1px solid ${colors.border.light}`,
  background: colors.background.paper,
  transition: `all ${designTokens.animation.duration.normal} ${designTokens.animation.easing.default}`,
  ...glassMorphism(0.05),
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: colors.shadow.xl,
    borderColor: colors.primary.light,
  },
}));

const CardIcon = styled(Box)(({ theme }) => ({
  fontSize: '3rem',
  marginBottom: designTokens.spacing.md,
  color: colors.primary.main,
  transition: `all ${designTokens.animation.duration.normal} ${designTokens.animation.easing.default}`,
  "&:hover": {
    transform: "scale(1.1) rotate(5deg)",
    color: colors.secondary.main,
  },
}));

const AdminCard = ({ title, description, link, icon: Icon, onClick }) => (
  <StyledCard>
    <CardContent sx={{ flexGrow: 1, position: "relative", p: 3 }}>
      <Tooltip title={`Information about ${title}`} placement="top">
        <IconButton
          sx={{ 
            position: "absolute", 
            top: 8, 
            right: 8,
            backgroundColor: colors.background.subtle,
            border: `1px solid ${colors.border.light}`,
            ...hoverScale(1.1),
          }}
          aria-label={`Info about ${title}`}
          onClick={onClick}
        >
          <InfoIcon sx={{ color: colors.primary.main }} />
        </IconButton>
      </Tooltip>
      <CardIcon>
        <Icon fontSize="inherit" />
      </CardIcon>
      <Typography 
        variant="h5" 
        component="h3" 
        gutterBottom
        sx={{
          fontWeight: designTokens.typography.fontWeight.bold,
          color: colors.text.primary,
        }}
      >
        {title}
      </Typography>
      <Typography 
        variant="body2" 
        sx={{ 
          color: colors.text.secondary,
          lineHeight: designTokens.typography.lineHeight.relaxed,
        }}
      >
        {description}
      </Typography>
    </CardContent>
    <CardActions sx={{ p: 3, pt: 0 }}>
      <Button
        variant="contained"
        component={Link}
        to={link}
        fullWidth
        endIcon={<ArrowForwardIcon />}
        sx={{
          background: colors.primary.gradient,
          color: colors.text.inverse,
          borderRadius: designTokens.borderRadius.lg,
          fontWeight: designTokens.typography.fontWeight.bold,
          py: 1.5,
          transition: `all ${designTokens.animation.duration.normal} ${designTokens.animation.easing.default}`,
          "&:hover": {
            filter: 'brightness(1.1)',
            transform: 'translateY(-2px)',
            boxShadow: colors.shadow.lg,
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

 

  

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box 
        sx={{ 
          textAlign: "center", 
          mb: 6,
          p: 4,
          borderRadius: designTokens.borderRadius.xxl,
          background: colors.primary.gradient,
          color: colors.text.inverse,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
          },
        }}
      >
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{
            fontWeight: designTokens.typography.fontWeight.bold,
            position: 'relative',
            zIndex: 1,
          }}
        >
          Welcome to EduGainer's Library
        </Typography>
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{
            opacity: 0.9,
            position: 'relative',
            zIndex: 1,
          }}
        >
          Admin Dashboard
        </Typography>
      </Box>

      <Typography 
        variant="h4" 
        component="h2" 
        gutterBottom
        sx={{
          fontWeight: designTokens.typography.fontWeight.bold,
          color: colors.primary.main,
          mb: 3,
        }}
      >
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
    
    </Container>
  );
}

export default Admin_Library;
