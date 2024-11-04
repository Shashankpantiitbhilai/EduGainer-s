import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Box,
  Typography,
  IconButton,
  Paper,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Lock as LockIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { verifyLibraryAccess } from '../../../services/Admin_services/employeeAccess';
import logo from "../../../images/logo.jpg";

// Styled components with enhanced styling
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 20,
    padding: theme.spacing(2),
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  },
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  '& img': {
    height: 60,
    objectFit: 'contain',
  },
}));

const IconContainer = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  borderRadius: '50%',
  padding: theme.spacing(2),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: '0 auto',
  marginBottom: theme.spacing(3),
  width: 64,
  height: 64,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
}));

const LoadingButton = styled(Button)(({ theme }) => ({
  position: 'relative',
  minWidth: 140,
  height: 48,
  borderRadius: 24,
  textTransform: 'none',
  fontSize: '1rem',
  fontWeight: 600,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  '&:hover': {
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

export const LibraryAccessDialog = ({ open, onSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await verifyLibraryAccess(
        formData.email, 
        formData.password,
      );
      
      setLoading(false);
      onSuccess();
      window.location.reload();
    } catch (error) {
      setLoading(false);
      if (error.response) {
        switch (error.response.status) {
          case 404:
            setError('User not found. Please check your credentials.');
            break;
          case 401:
            setError('Invalid email or password. Please try again.');
            break;
          case 403:
            setError('You do not have permission to access the EduGainer library.');
            break;
          default:
            setError('An error occurred. Please try again later.');
        }
      } else {
        setError('Network error. Please check your internet connection.');
      }
    }
  };

  return (
    <StyledDialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        elevation: 0,
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <IconButton
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            bgcolor: 'grey.100',
            '&:hover': {
              bgcolor: 'grey.200',
            },
          }}
          onClick={onClose}
          disabled={loading}
        >
          <CloseIcon />
        </IconButton>

        <DialogTitle sx={{ textAlign: 'center', mt: 1 }}>
          <LogoContainer>
            <img src={logo} alt="EduGainer Logo" />
          </LogoContainer>
          <IconContainer elevation={2}>
            <LockIcon color="primary" sx={{ fontSize: 32 }} />
          </IconContainer>
          <Typography variant="h5" component="div" fontWeight="bold" color="primary">
            EduGainer Library Access
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Please verify your credentials to access the library
          </Typography>
        </DialogTitle>

        <Divider sx={{ my: 2 }} />

        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 2 }}>
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  borderRadius: 2,
                  '& .MuiAlert-icon': {
                    fontSize: 24
                  }
                }}
              >
                {error}
              </Alert>
            )}

            <StyledTextField
              autoFocus
              required
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              sx={{ mb: 3 }}
              placeholder="Enter your email"
              InputProps={{
                sx: { height: 56 }
              }}
            />

            <StyledTextField
              required
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              placeholder="Enter your password"
              InputProps={{
                sx: { height: 56 }
              }}
            />
          </DialogContent>

          <DialogActions sx={{ p: 3, justifyContent: 'center', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={onClose}
              disabled={loading}
              sx={{ 
                minWidth: 140,
                height: 48,
                borderRadius: 24,
                textTransform: 'none',
                fontSize: '1rem',
              }}
            >
              Cancel
            </Button>
            <LoadingButton
              type="submit"
              variant="contained"
              disabled={loading || !formData.email || !formData.password}
            >
              {loading ? (
                <>
                  <CircularProgress size={24} sx={{ mr: 1 }} />
                  Verifying...
                </>
              ) : (
                'Verify Access'
              )}
            </LoadingButton>
          </DialogActions>
        </form>
      </Box>
    </StyledDialog>
  );
};