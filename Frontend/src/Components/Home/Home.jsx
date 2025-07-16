import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../../App";
import { ToastContainer } from "react-toastify";
import { Box, Fab, Zoom } from "@mui/material";
import { KeyboardArrowUp } from "@mui/icons-material";

import { fetchUnseenMessages } from "../../services/chat/utils";
import NotificationDialog from "../Notifications/notificationDialog";
import Feature from "../Features/feature";
import Footer from "../Footer/footer";
import GoogleReviews from "../Reviews/google-review";
import Event from "../Events/event";

// Import modular components
import {
  HeroSection,
  MapSection,
  LibraryFacilitiesSection,
  ClassesOfferedSection,
  ApproachSection,
  LibraryDetailsSection,
  ClassesDetailsSection,
  StationarySection,
  colors,
  designTokens,
} from "./index";

function Home() {
  const navigate = useNavigate();
  const { IsUserLoggedIn } = useContext(AdminContext);

  const [unseenMessageCount, setUnseenMessageCount] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = IsUserLoggedIn?._id;
        const unseenMessages = await fetchUnseenMessages();
        
        // Filter messages where the sender is not the admin
        const validMessages = unseenMessages.filter(
          (message) => message.messages[0].receiever !== userId || message.messages[0].receiever === "All"
        );
      
        setUnseenMessageCount(validMessages.length);
        
        // Show notification popup if there are unseen messages not from the admin
        if (validMessages.length > 0) {
          setShowNotification(true);
        }
      } catch (error) {
        console.error("Error fetching unseen messages:", error);
      }
    };
    fetchData();
  }, [IsUserLoggedIn]);

  // Handle scroll for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCloseNotification = () => {
    setShowNotification(false);
  };

  const handleViewMessages = () => {
    setShowNotification(false);
    navigate("/chat/home");
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <Box 
      sx={{ 
        backgroundColor: colors.background.default,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />

      <NotificationDialog
        open={showNotification}
        onClose={handleCloseNotification}
        unseenMessageCount={unseenMessageCount}
        onViewMessages={handleViewMessages}
      />

      {/* Modern gradient background overlay */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(ellipse at top left, ${colors.primary.main}05 0%, transparent 50%),
            radial-gradient(ellipse at top right, ${colors.secondary.main}05 0%, transparent 50%),
            radial-gradient(ellipse at bottom left, ${colors.accent.info}05 0%, transparent 50%)
          `,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Content with proper z-index */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {/* Enhanced Feature Banner */}
        <Feature />
        
        {/* Event Component with improved styling */}
        <Event showDialog={true} />

        {/* Hero Section with enhanced animations */}
        <HeroSection />
        
        {/* Content sections with improved spacing */}
        <Box sx={{ 
          background: colors.background.default,
          position: 'relative',
        }}>
          {/* Google Reviews with enhanced presentation */}
          <Box sx={{ py: { xs: 4, md: 6 } }}>
            <GoogleReviews />
          </Box>
          
          {/* Map Section */}
          <MapSection />

          {/* Library Facilities Section */}
          <LibraryFacilitiesSection />

          {/* Classes Offered Section */}
          <ClassesOfferedSection />

          {/* EduGainer's Approach Section */}
          <ApproachSection />

          {/* EduGainer's Library Section */}
          <LibraryDetailsSection />

          {/* EduGainer's Classes Section */}
          <ClassesDetailsSection />

          {/* MeriStaionary by EduGainer's Section */}
          <StationarySection />
        </Box>

        {/* Enhanced Footer */}
        <Footer />
      </Box>

      {/* Back to Top Button */}
      <Zoom in={showBackToTop}>
        <Fab
          color="primary"
          size="medium"
          onClick={scrollToTop}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
            background: colors.primary.gradient,
            color: colors.text.inverse,
            boxShadow: colors.shadow.xl,
            '&:hover': {
              transform: 'scale(1.1)',
              boxShadow: colors.shadow.xl,
            },
            transition: 'all 0.3s ease',
          }}
        >
          <KeyboardArrowUp />
        </Fab>
      </Zoom>
    </Box>
  );
}

export default Home;
