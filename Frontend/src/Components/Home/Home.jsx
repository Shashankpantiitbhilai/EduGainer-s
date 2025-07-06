import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../../App";
import { ToastContainer } from "react-toastify";
import { Box } from "@mui/material";

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

  const handleCloseNotification = () => {
    setShowNotification(false);
  };

  const handleViewMessages = () => {
    setShowNotification(false);
    navigate("/chat/home");
  };
  return (
    <Box sx={{ backgroundColor: colors.background.default }}>
      <ToastContainer />

      <NotificationDialog
        open={showNotification}
        onClose={handleCloseNotification}
        unseenMessageCount={unseenMessageCount}
        onViewMessages={handleViewMessages}
      />

    
      <Feature />
      
      {/* Event Component */}
      <Event showDialog={true} />

      {/* Hero Section */}
      <HeroSection />
      
      {/* Google Reviews */}
      <GoogleReviews />
      
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

      {/* Footer */}
      <Footer />
    </Box>
  );
}

export default Home;
