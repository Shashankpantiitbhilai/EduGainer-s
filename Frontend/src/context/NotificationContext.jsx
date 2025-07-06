import React, { createContext, useContext, useState } from 'react';
import { Snackbar, Alert, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { defaultSnackbarConfig } from '../utils/notificationUtils';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = (message, severity = 'info', options = {}) => {
    const id = Date.now() + Math.random();
    const notification = {
      id,
      message,
      severity,
      ...options,
    };

    setNotifications(prev => [...prev, notification]);

    // Auto-remove notification after specified duration
    const duration = options.autoHideDuration || defaultSnackbarConfig.autoHideDuration;
    if (duration && duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const showSuccess = (message, options = {}) => {
    return showNotification(message, 'success', options);
  };

  const showError = (message, options = {}) => {
    return showNotification(message, 'error', options);
  };

  const showWarning = (message, options = {}) => {
    return showNotification(message, 'warning', options);
  };

  const showInfo = (message, options = {}) => {
    return showNotification(message, 'info', options);
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const value = {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeNotification,
    clearAll,
    notifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {notifications.map((notification, index) => (
        <Snackbar
          key={notification.id}
          open={true}
          {...defaultSnackbarConfig}
          {...notification}
          anchorOrigin={{
            ...defaultSnackbarConfig.anchorOrigin,
            ...notification.anchorOrigin,
          }}
          sx={{
            ...defaultSnackbarConfig.sx,
            ...notification.sx,
            // Stack notifications with increasing top margin
            mt: defaultSnackbarConfig.sx.mt + (index * 7),
          }}
          onClose={() => removeNotification(notification.id)}
        >
          <Alert
            onClose={() => removeNotification(notification.id)}
            severity={notification.severity}
            variant="filled"
            action={
              notification.persistent ? null : (
                <IconButton
                  size="small"
                  aria-label="close"
                  color="inherit"
                  onClick={() => removeNotification(notification.id)}
                >
                  <Close fontSize="small" />
                </IconButton>
              )
            }
            sx={{
              '& .MuiAlert-message': {
                fontSize: '0.875rem',
                fontWeight: 500,
              },
            }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
