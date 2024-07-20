import React, { useState, useEffect, useContext } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Typography,
  Box,
} from "@mui/material";
import { styled } from "@mui/system";
import {
  updateMonthlyStatus,
  getStudentLibSeat,
} from "../../services/library/utils";
import { AdminContext } from "../../App";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: 16,
    padding: theme.spacing(2),
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(2),
}));

const NotificationWrapper = ({ children }) => {
  const [showNotification, setShowNotification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bookingReg, setBookingReg] = useState(null);
  const { IsUserLoggedIn } = useContext(AdminContext);
  const id = IsUserLoggedIn?._id;

  useEffect(() => {
    const checkSeatAndSetInterval = async () => {
      try {
        const response = await getStudentLibSeat(id);
        console.log(response);
        if (response.booking && response.booking.reg) {
          setBookingReg(response.booking.reg);
          const interval = setInterval(checkTimeAndShowNotification, 1000);
          return () => clearInterval(interval);
        }
      } catch (error) {
        console.error("Error checking library seat:", error);
      }
    };

    const checkTimeAndShowNotification = () => {
      const now = new Date();
      const lastNotificationDate = localStorage.getItem("lastNotificationDate");
      const currentDate = now.toDateString();

      if (
        now.getHours() >= 18 &&
        now.getMinutes() >= 30 &&
        (!lastNotificationDate ||
          new Date(lastNotificationDate).toDateString() !== currentDate)
      ) {
     
        setShowNotification(true);
        localStorage.setItem("lastNotificationDate", now.toISOString());
      }
    };

    checkSeatAndSetInterval();
  }, [id]);

  const handleSubmit = async () => {
    if (!bookingReg) {
      setError("No active booking found.");
      return;
    }

    setLoading(true);
    try {
    
      
      await updateMonthlyStatus(bookingReg, "Confirmed");
      setShowNotification(false);
    } catch (error) {
      console.error("Error updating monthly status:", error);
      setError("Failed to update status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowNotification(false);
    setError("");
  };

  if (!bookingReg) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      <StyledDialog open={showNotification} onClose={handleClose}>
        <StyledDialogTitle>Continue with EduGainer's Library</StyledDialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Do you wish to continue with EduGainer's Library next month?
          </Typography>
          {error && (
            <Typography color="error" variant="body2" gutterBottom>
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Box position="relative">
            <Button
              onClick={handleSubmit}
              color="primary"
              variant="contained"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Continue Subscription"}
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
    </>
  );
};

export default NotificationWrapper;
