import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Snackbar, Alert, Avatar, Box, Typography } from '@mui/material';
import io from 'socket.io-client';

const UserNotificationContext = createContext();

export const UserNotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({ 
    open: false, 
    message: '', 
    sender: '', 
    severity: 'info' 
  });
  const socketRef = useRef(null);

  const initializeUserSocket = (userId) => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    const url = process.env.NODE_ENV === 'production'
      ? process.env.REACT_APP_BACKEND_PROD
      : process.env.REACT_APP_BACKEND_DEV;

    const socket = io(url, {
      query: { userId }
    });

    socketRef.current = socket;

    socket.on('receiveMessage', (message, roomId, senderInfo) => {
      if (roomId === userId && message.messages[0].sender !== userId) {
        showNotification(message, senderInfo);
        playNotificationSound();
      }
    });

    return socket;
  };

  const showNotification = (message, senderInfo) => {
    setNotification({
      open: true,
      message: message.messages[0].content,
      sender: senderInfo.username || 'Someone',
      severity: 'info'
    });
  };

  const playNotificationSound = () => {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, context.currentTime);
    gainNode.gain.setValueAtTime(0.2, context.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start();
    oscillator.stop(context.currentTime + 0.2);
  };

  return (
    <UserNotificationContext.Provider value={{ initializeUserSocket }}>
      {children}
      <Snackbar
        open={notification.open}
        autoHideDuration={5000}
        onClose={() => setNotification(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setNotification(prev => ({ ...prev, open: false }))}
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%', minWidth: '300px' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ width: 24, height: 24 }}>
              {notification.sender[0]?.toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="subtitle2">
                {notification.sender}
              </Typography>
              <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                {notification.message}
              </Typography>
            </Box>
          </Box>
        </Alert>
      </Snackbar>
    </UserNotificationContext.Provider>
  );
};

export const useUserNotification = () => useContext(UserNotificationContext);

// Server-side code (add to your socket.io implementation)
// socket/index.js or wherever your socket logic is
