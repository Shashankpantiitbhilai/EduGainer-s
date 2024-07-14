import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Alert,
  AlertTitle,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Snackbar,
} from "@mui/material";
import { getSeatsData } from "../../../services/library/utils";

const shiftAmounts = [
  "9.30 PM to 6.30 AM",
  "2 PM to 11 PM",
  "6.30 AM to 6.30 PM",
  "24*7",
];

const Seat = ({ seatNumber, seatStatus, onClick }) => {
  let seatColor = "grey"; // Default color for seats with no status

  if (seatStatus === "Paid") {
    seatColor = "green"; // Green color for paid seats
  } else if (seatStatus === "Unpaid") {
    seatColor = "orange"; // Orange color for unpaid seats
  }

  return (
    <Box
      onClick={() => onClick(seatNumber)}
      sx={{
        width: "100%",
        height: 20,
        m: 0.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "0.75rem",
        border: "1px solid",
        borderColor: "gray",
        borderRadius: 1,
        bgcolor: seatColor,
        cursor: "pointer",
      }}
    >
      {seatNumber}
    </Box>
  );
};

const SeatRow = ({ seats, seatStatus, onSeatClick }) => (
  <Box sx={{ display: "flex" }}>
    {seats.map((seatNumber) => (
      <Seat
        key={seatNumber}
        seatNumber={seatNumber}
        seatStatus={seatStatus[seatNumber]}
        onClick={onSeatClick}
      />
    ))}
  </Box>
);

const ManageSeats = () => {
  const [selectedShift, setSelectedShift] = useState(shiftAmounts[0]);
  const [seatStatus, setSeatStatus] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    fetchData();
  }, [selectedShift]);

  const fetchData = async () => {
    try {
      const response = await getSeatsData();
      const selectedShiftData = response[selectedShift];
      if (selectedShiftData) {
        let statusMap = {};
        selectedShiftData.forEach((e) => {
          statusMap[e.Seat] = e.Status || "Unpaid";
        });
        setSeatStatus(statusMap);
      } else {
        console.error(`No data found for shift: ${selectedShift}`);
      }
    } catch (error) {
      console.error("Error fetching seat data:", error);
      setSnackbarMessage("Error fetching seat data");
      setSnackbarOpen(true);
    }
  };

  const handleShiftChange = (event) => {
    setSelectedShift(event.target.value);
  };

  const handleSeatClick = (seatNumber) => {
    setSelectedSeat(seatNumber);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedSeat(null);
  };

  const handleStatusChange = (newStatus) => {
    setSeatStatus((prevStatus) => ({
      ...prevStatus,
      [selectedSeat]: newStatus,
    }));
    setSnackbarMessage(
      `Seat ${selectedSeat} status updated to ${newStatus || "No Status"}`
    );
    setSnackbarOpen(true);
    handleCloseDialog();
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ p: 4, maxWidth: "lg", mx: "auto" }}>
      <Box component="h1" sx={{ fontSize: "2xl", fontWeight: "bold", mb: 4 }}>
        Admin Library Seating Management
      </Box>

      <FormControl sx={{ mb: 4, minWidth: 200 }}>
        <InputLabel id="shift-select-label">Select Shift</InputLabel>
        <Select
          labelId="shift-select-label"
          id="shift-select"
          value={selectedShift}
          onChange={handleShiftChange}
          label="Select Shift"
        >
          {shiftAmounts.map((shift) => (
            <MenuItem key={shift} value={shift}>
              {shift}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
          <SeatRow
            seats={["A3", "A4", "A5", "A6", "A7", "A8", "A9", "A0"]}
            seatStatus={seatStatus}
            onSeatClick={handleSeatClick}
          />
          <SeatRow
            seats={[77, 78, 79, 80, 81, 82, 83, 84]}
            seatStatus={seatStatus}
            onSeatClick={handleSeatClick}
          />
        </Box>

        {/* Add more SeatRow components here */}
      </Box>

      <Alert severity="info" sx={{ mt: 4 }}>
        <AlertTitle>Legend</AlertTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ width: 16, height: 16, bgcolor: "green", mr: 2 }}></Box>
            <Box>Paid</Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ width: 16, height: 16, bgcolor: "orange", mr: 2 }}></Box>
            <Box>Unpaid</Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ width: 16, height: 16, bgcolor: "grey", mr: 2 }}></Box>
            <Box>No Status</Box>
          </Box>
        </Box>
      </Alert>

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Seat Information</DialogTitle>
        <DialogContent>
          <Typography>Seat Number: {selectedSeat}</Typography>
          <Typography>
            Status: {seatStatus[selectedSeat] || "No Status"}
          </Typography>
          {seatStatus[selectedSeat] === "Paid" && (
            <>
              <Typography>Name: John Doe</Typography>
              <Typography>Email: johndoe@example.com</Typography>
              <Typography>Phone: +1234567890</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleStatusChange("Paid")} color="primary">
            Mark as Paid
          </Button>
          <Button
            onClick={() => handleStatusChange("Unpaid")}
            color="secondary"
          >
            Mark as Unpaid
          </Button>
          <Button onClick={() => handleStatusChange(null)}>Clear Status</Button>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default ManageSeats;
