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
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Lock as LockIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { verifyLibraryAccess } from '../../../services/Admin_services/employeeAccess';

// Styled components
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 16,
    padding: theme.spacing(2),
  },
}));

const IconContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  borderRadius: '50%',
  padding: theme.spacing(2),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: '0 auto',
  marginBottom: theme.spacing(2),
}));

const LoadingButton = styled(Button)(({ theme }) => ({
  position: 'relative',
  minWidth: 120,
}));

export const LibraryAccessDialog = ({ open, onSuccess, onClose, adminId, isUserLoggedIn }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If user already has library access, don't show the dialog
  if (isUserLoggedIn?.libraryDetails?.libraryAccess) {
    return null;
  }

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
        adminId, 
        formData.email, 
        formData.password,
      );
       
      console.log(response, "response");
      setLoading(false);
      onSuccess();
    } catch (error) {
      setLoading(false);
      if (error.response) {
        switch (error.response.status) {
          case 404:
            setError('User not found');
            break;
          case 401:
            setError('Invalid email or password');
            break;
          case 403:
            setError('You do not have permission to access the library');
            break;
          default:
            setError('An error occurred. Please try again');
        }
      } else {
        setError('Network error. Please check your connection');
      }
    }
  };

  return (
    <StyledDialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="sm"
      fullWidth
    >
      <Box sx={{ position: 'relative' }}>
        <IconButton
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
          onClick={onClose}
          disabled={loading}
        >
          <CloseIcon />
        </IconButton>

        <DialogTitle sx={{ textAlign: 'center', mt: 2 }}>
          <IconContainer>
            <LockIcon color="primary" sx={{ fontSize: 32 }} />
          </IconContainer>
          <Typography variant="h5" component="div" fontWeight="bold">
            Library Access Verification
          </Typography>
        </DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 2 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              autoFocus
              required
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              sx={{ mb: 2 }}
              variant="outlined"
            />

            <TextField
              required
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              variant="outlined"
            />
          </DialogContent>

          <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
            <Button
              variant="outlined"
              onClick={onClose}
              disabled={loading}
              sx={{ minWidth: 100 }}
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
                  <CircularProgress size={20} sx={{ mr: 1 }} />
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