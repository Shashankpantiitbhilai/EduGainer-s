import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../../App";
import { ToastContainer } from "react-toastify";
import { Box, Fab, Zoom, Alert, Button, IconButton, Collapse } from "@mui/material";
import { KeyboardArrowUp, ShoppingCart, Close, NewReleases } from "@mui/icons-material";
import { motion } from "framer-motion";

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
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  
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
        {/* New Feature Announcement Banner - Top Priority */}
        <Collapse in={showAnnouncement}>
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Box
              sx={{
                position: 'relative',
                background: `linear-gradient(135deg, ${colors.secondary.main} 0%, ${colors.secondary.dark} 50%, ${colors.primary.main} 100%)`,
                py: { xs: 2, sm: 2.5 },
                px: { xs: 2, sm: 4 },
                boxShadow: `0 8px 32px ${colors.secondary.main}40`,
                borderBottom: `3px solid ${colors.secondary.light}`,
                animation: 'pulse 2s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': {
                    boxShadow: `0 8px 32px ${colors.secondary.main}40`,
                  },
                  '50%': {
                    boxShadow: `0 12px 48px ${colors.secondary.main}60`,
                  },
                },
              }}
            >
              <Box
                sx={{
                  maxWidth: '1200px',
                  margin: '0 auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: { xs: '100%', sm: 'auto' } }}>
                  <NewReleases 
                    sx={{ 
                      fontSize: { xs: 32, sm: 40 },
                      color: colors.text.inverse,
                      animation: 'spin 3s linear infinite',
                      '@keyframes spin': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' },
                      },
                    }} 
                  />
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Box
                        sx={{
                          background: colors.text.inverse,
                          color: colors.secondary.main,
                          px: 1.5,
                          py: 0.5,
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                        }}
                      >
                        NEW FEATURE
                      </Box>
                    </Box>
                    <Box
                      component="span"
                      sx={{
                        color: colors.text.inverse,
                        fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1.2rem' },
                        fontWeight: 'bold',
                        display: 'block',
                      }}
                    >
                      🎉 Order directly from our online store! Click here to shop now
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<ShoppingCart />}
                    onClick={() => window.open("https://vyaparapp.in/store/meristationeryedugainers", "_blank")}
                    sx={{
                      backgroundColor: colors.text.inverse,
                      color: colors.secondary.main,
                      fontWeight: 'bold',
                      px: { xs: 2, sm: 3 },
                      py: 1,
                      borderRadius: '25px',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      textTransform: 'none',
                      boxShadow: `0 4px 12px rgba(0,0,0,0.2)`,
                      '&:hover': {
                        backgroundColor: colors.background.default,
                        transform: 'scale(1.05)',
                        boxShadow: `0 6px 16px rgba(0,0,0,0.3)`,
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Shop Now
                  </Button>
                  <IconButton
                    size="small"
                    onClick={() => setShowAnnouncement(false)}
                    sx={{
                      color: colors.text.inverse,
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.2)',
                      },
                    }}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          </motion.div>
        </Collapse>

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
