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

  useEffect(() => {
    const checkSeatAndShowNotification = async () => {
      if (!IsUserLoggedIn || !IsUserLoggedIn._id) {
        console.log("User is not logged in or ID is not defined");
        return;
      }

      try {
        const response = await getStudentLibSeat(IsUserLoggedIn._id);
        console.log(response);
        if (response.booking && response.booking.reg) {
          setBookingReg(response.booking.reg);
          checkTimeAndShowNotification();
        }
      } catch (error) {
        console.error("Error checking library seat:", error);
      }
    };

    const checkTimeAndShowNotification = () => {
      const now = new Date();
      const currentDate = now.toDateString();
      const lastNotification = JSON.parse(
        localStorage.getItem("lastNotification") || "{}"
      );
      const { lastSeenDate, submitted } = lastNotification;

      // Check if it's a new day or if the notification hasn't been shown today
      if (currentDate !== lastSeenDate || !submitted) {
        const targetTime = new Date(now);
        targetTime.setHours(9, 55, 0, 0);

        if (now >= targetTime || !lastSeenDate) {
          setShowNotification(true);
          localStorage.setItem(
            "lastNotification",
            JSON.stringify({
              lastSeenDate: currentDate,
              submitted: false,
            })
          );
        } else {
          // Schedule the notification for 9:55 AM
          const timeUntilTarget = targetTime.getTime() - now.getTime();
          setTimeout(() => {
            setShowNotification(true);
            localStorage.setItem(
              "lastNotification",
              JSON.stringify({
                lastSeenDate: currentDate,
                submitted: false,
              })
            );
          }, timeUntilTarget);
        }
      }
    };

    checkSeatAndShowNotification();
    // Set up a daily check
    const dailyCheck = setInterval(
      checkSeatAndShowNotification,
      24 * 60 * 60 * 1000
    );

    return () => clearInterval(dailyCheck);
  }, [IsUserLoggedIn]);

  const handleSubmit = async (status) => {
    if (!bookingReg) {
      setError("No active booking found.");
      return;
    }

    setLoading(true);
    try {
      await updateMonthlyStatus(bookingReg, status);
      setShowNotification(false);

      // Update localStorage to mark as submitted
      const lastNotification = JSON.parse(
        localStorage.getItem("lastNotification") || "{}"
      );
      localStorage.setItem(
        "lastNotification",
        JSON.stringify({
          ...lastNotification,
          submitted: true,
        })
      );
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
          <Box position="relative">
            <Button
              onClick={() => handleSubmit("discontinue")}
              color="secondary"
              variant="outlined"
              disabled={loading}
            >
              No
            </Button>
          </Box>
          <Box position="relative" ml={1}>
            <Button
              onClick={() => handleSubmit("Confirmed")}
              color="primary"
              variant="contained"
              disabled={loading}
            >
              Yes
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
