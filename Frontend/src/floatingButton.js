import React from 'react';
import { Box } from '@mui/material';
import ChatPopup from './Components/AI/popup'; // Your existing ChatPopup component

const FloatingButtons = () => {

  return (
    <>
      {/* Middle Left - Chat Button */}
      <Box
        sx={{
          position: 'fixed',
          bottom: "-1%", // Center vertically
          left: 120, // Fixed left position
          transform: 'translateY(-50%)', // Center the button
          zIndex: 1200,
        }}
      >
        {/* Your existing ChatPopup component */}
        <ChatPopup />
      </Box>

      {/* Your existing ChatPopup component */}




    </>
  );
};

export default FloatingButtons;