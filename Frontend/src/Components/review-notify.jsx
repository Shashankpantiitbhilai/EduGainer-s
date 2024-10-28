import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Typography,
  Box,
  Divider,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/system";
import StarIcon from "@mui/icons-material/Star"; // Star icon for reviews
import CloseIcon from "@mui/icons-material/Close"; // Close icon for the dialog
import logo from "../images/logo.jpg"; // Import the EduGainer logo

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: 16,
    padding: theme.spacing(2),
    minWidth: "400px",
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(2),
  position: "relative",
}));

const GoogleReviewPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAndShowPopup = () => {
      const lastPopup = JSON.parse(
        localStorage.getItem("lastGoogleReviewPopup") || "{}"
      );
      const lastShownDate = new Date(lastPopup.lastShownDate);

      const now = new Date();
      const differenceInTime = now - lastShownDate;
      const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

      if (differenceInDays >= 10 || !lastPopup.lastShownDate) {
        setShowPopup(true);
        localStorage.setItem(
          "lastGoogleReviewPopup",
          JSON.stringify({
            lastShownDate: now.toISOString(),
          })
        );
      }
    };

    checkAndShowPopup();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      window.open("https://g.page/r/CeRJN-J1nirIEBM/review", "_blank");
    } catch (error) {
      console.error("Error opening Google review page:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowPopup(false);
  };

  return (
    <StyledDialog
      open={showPopup}
      onClose={() => {}} // Prevent closing when clicking outside
      disableBackdropClick // Disable closing on backdrop click
    >
      <StyledDialogTitle>Review EduGainer's on Google</StyledDialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
          <img
            src={logo}
            alt="EduGainer Logo"
            style={{
              width: "100px",
              height: "auto",
              marginBottom: "16px",
              marginTop: "10px",
            }} // Adjust size as necessary
          />
          <Box display="flex" alignItems="center">
            <StarIcon color="primary" fontSize="large" />
            <Typography variant="h6" ml={1}>
              Your feedback matters!
            </Typography>
          </Box>
        </Box>
        <Typography variant="body1" gutterBottom>
          Please take a moment to leave a review for EduGainer's on Google. Your
          feedback helps us improve our services.
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body2" color="text.secondary">
          ⭐️ ⭐️ ⭐️ ⭐️ ⭐️
        </Typography>
      </DialogContent>
      <DialogActions>
        <Box position="relative">
          <Button
            onClick={handleClose}
            color="secondary"
            variant="outlined"
            disabled={loading}
          >
            Already Reviewed
          </Button>
        </Box>
        <Box position="relative" ml={1}>
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            disabled={loading}
          >
            Leave Review
          </Button>
          {loading && (
            <CircularProgress
              size={24}
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                marginTop: "-12px",
                marginLeft: "-12px",
              }}
            />
          )}
        </Box>
      </DialogActions>
    </StyledDialog>
  );
};

export default GoogleReviewPopup;
