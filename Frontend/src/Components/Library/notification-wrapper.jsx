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
          checkDateAndShowNotification();
        }
      } catch (error) {
        console.error("Error checking library seat:", error);
      }
    };

    const checkDateAndShowNotification = () => {
      const now = new Date();
      const currentDay = now.getDate();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const lastNotification = JSON.parse(
        localStorage.getItem("lastNotification") || "{}"
      );
      const {
        lastSeenMonth,
        lastSeenYear,
        lastSubmittedMonth,
        lastSubmittedYear,
      } = lastNotification;

      // Check if it's between the 28th of the current month and the 5th of the next month
      const isNotificationPeriod =
        currentDay >= 28 || (currentMonth !== lastSeenMonth && currentDay <= 5);

      if (isNotificationPeriod) {
        // Check if we're in a new period compared to the last submission
        const isNewPeriod =
          currentYear > lastSubmittedYear ||
          (currentYear === lastSubmittedYear &&
            currentMonth > lastSubmittedMonth) ||
          (currentYear === lastSubmittedYear &&
            currentMonth === lastSubmittedMonth &&
            currentDay >= 28);

        if (isNewPeriod || !lastSubmittedMonth) {
          setShowNotification(true);
          localStorage.setItem(
            "lastNotification",
            JSON.stringify({
              lastSeenMonth: currentMonth,
              lastSeenYear: currentYear,
              lastSubmittedMonth,
              lastSubmittedYear,
            })
          );
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

      // Update localStorage to mark as submitted for this period
      const now = new Date();
      const lastNotification = JSON.parse(
        localStorage.getItem("lastNotification") || "{}"
      );
      localStorage.setItem(
        "lastNotification",
        JSON.stringify({
          ...lastNotification,
          lastSubmittedMonth: now.getMonth(),
          lastSubmittedYear: now.getFullYear(),
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
              onClick={() => handleSubmit("NotContinue")}
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
