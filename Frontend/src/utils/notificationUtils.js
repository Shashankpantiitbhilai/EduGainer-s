// Utility functions for notifications with proper z-index handling
import { toast } from 'react-toastify';

// Default configuration for all toast notifications
export const defaultToastConfig = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  newestOnTop: true,
  closeOnClick: true,
  rtl: false,
  pauseOnFocusLoss: true,
  draggable: true,
  pauseOnHover: true,
  style: {
    zIndex: 9999,
    top: '80px'
  }
};

// Toast notification helpers with consistent styling
export const showSuccessToast = (message) => {
  toast.success(message, {
    ...defaultToastConfig,
    className: 'toast-success-custom'
  });
};

export const showErrorToast = (message) => {
  toast.error(message, {
    ...defaultToastConfig,
    className: 'toast-error-custom'
  });
};

export const showInfoToast = (message) => {
  toast.info(message, {
    ...defaultToastConfig,
    className: 'toast-info-custom'
  });
};

export const showWarningToast = (message) => {
  toast.warning(message, {
    ...defaultToastConfig,
    className: 'toast-warning-custom'
  });
};

// Snackbar configuration for MUI Snackbar components
export const defaultSnackbarConfig = {
  anchorOrigin: { vertical: 'top', horizontal: 'right' },
  autoHideDuration: 4000,
  sx: {
    zIndex: 9999,
    mt: 8, // Top margin to avoid navbar overlap
    '& .MuiSnackbarContent-root': {
      borderRadius: '12px',
      fontWeight: 500,
      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)',
    },
    '& .MuiAlert-root': {
      borderRadius: '12px',
      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)',
    },
  }
};
