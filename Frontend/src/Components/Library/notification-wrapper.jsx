import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  CircularProgress,
} from "@mui/material";

const NotificationWrapper = ({ children }) => {
  const [showNotification, setShowNotification] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const lastNotificationDate = localStorage.getItem("lastNotificationDate");
      const currentDate = now.toDateString();
    //   console.log(lastNotificationDate);

      if (
        now.getHours() === 15 &&
        now.getMinutes() >= 11 &&
        (!lastNotificationDate ||
          new Date(lastNotificationDate).toDateString() !== currentDate)
      ) {
        setShowNotification(true);
        localStorage.setItem("lastNotificationDate", now.toISOString());
      }
    };

    // Initial check
    checkTime();

    // Set up an interval to check every second
    const interval = setInterval(checkTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRegistrationData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (
      !registrationData.name ||
      !registrationData.email ||
      !registrationData.phone
    ) {
      alert("All fields are required!");
      return;
    }

    setLoading(true);
    try {
    //   console.log("Submitting registration data:", registrationData);
      // Simulate an API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setShowNotification(false);
    } catch (error) {
      console.error("Error submitting registration data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowNotification(false);
  };

  return (
    <>
      {children}
      <Dialog open={showNotification} onClose={handleClose}>
        <DialogTitle>Daily Registration</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="normal"
                label="reg"
                name="reg"
                value={registrationData.reg}
                onChange={handleInputChange}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NotificationWrapper;
