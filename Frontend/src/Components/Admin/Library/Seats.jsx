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
  TextField,
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
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    Reg: "",
    Name: "",
    Seat: selectedSeat,
    Date: "#########",
    Cash: 0,
    Online: 0,
    Shift: selectedShift,
    Fee: 0,
    Remarks: "",
    Status: "Paid",
  });

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
    if (newStatus === "Paid") {
      setFormData({
        ...formData,
        Seat: selectedSeat,
        Shift: selectedShift,
        Status: newStatus,
      });
      setFormDialogOpen(true);
    } else {
      setSeatStatus((prevStatus) => ({
        ...prevStatus,
        [selectedSeat]: newStatus,
      }));
      setSnackbarMessage(
        `Seat ${selectedSeat} status updated to ${newStatus || "No Status"}`
      );
      setSnackbarOpen(true);
      handleCloseDialog();
    }
  };

  const handleFormSubmit = () => {
    // Handle form submission, e.g., send data to backend
    console.log("Form submitted with data:", formData);
    setSnackbarMessage(`Seat ${selectedSeat} marked as Paid`);
    setSnackbarOpen(true);
    setFormDialogOpen(false);
    handleCloseDialog(); // Optionally close the seat info dialog
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleFormClose = () => {
    setFormDialogOpen(false);
    setFormData({
      Reg: "",
      Name: "",
      Seat: selectedSeat,
      Date: "#########",
      Cash: 0,
      Online: 0,
      Shift: selectedShift,
      Fee: 0,
      Remarks: "",
      Status: "Paid",
    });
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

        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
          <Box>
            <SeatRow
              seats={[68, 67, 66, 65, 64, 63, 62, 61]}
              seatStatus={seatStatus}
              onSeatClick={handleSeatClick}
            />
            <SeatRow
              seats={[52, 51, 50, 49, 48, 47, 46, 45]}
              seatStatus={seatStatus}
              onSeatClick={handleSeatClick}
            />
          </Box>
          <Box>
            <SeatRow
              seats={[69, 70, 71, 72, 73, 74, 75, 76]}
              seatStatus={seatStatus}
              onSeatClick={handleSeatClick}
            />
            <SeatRow
              seats={[53, 54, 55, 56, 57, 58, 59, 60]}
              seatStatus={seatStatus}
              onSeatClick={handleSeatClick}
            />
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 2 }}>
          <Box>
            <SeatRow
              seats={[44, 43, 42, 41, 40, 39, 38, 37]}
              seatStatus={seatStatus}
              onSeatClick={handleSeatClick}
            />
            <SeatRow
              seats={[36, 35, 34, 33, 32, 31, 30, 29]}
              seatStatus={seatStatus}
              onSeatClick={handleSeatClick}
            />
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
          <Box>
            <SeatRow
              seats={[28, 27, 26]}
              seatStatus={seatStatus}
              onSeatClick={handleSeatClick}
            />
            <SeatRow
              seats={[21, 20, 19]}
              seatStatus={seatStatus}
              onSeatClick={handleSeatClick}
            />
            <SeatRow
              seats={[14, 13, 12]}
              seatStatus={seatStatus}
              onSeatClick={handleSeatClick}
            />
            <SeatRow
              seats={[1, 2, 3]}
              seatStatus={seatStatus}
              onSeatClick={handleSeatClick}
            />
          </Box>
          <Box>
            <SeatRow
              seats={[25, 24, 23, 22]}
              seatStatus={seatStatus}
              onSeatClick={handleSeatClick}
            />
            <SeatRow
              seats={[15, 16, 17, 18]}
              seatStatus={seatStatus}
              onSeatClick={handleSeatClick}
            />
            <SeatRow
              seats={[8, 9, 10, 11]}
              seatStatus={seatStatus}
              onSeatClick={handleSeatClick}
            />
            <SeatRow
              seats={[4, 5, 6, 7]}
              seatStatus={seatStatus}
              onSeatClick={handleSeatClick}
            />
          </Box>
        </Box>
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
          <Button onClick={handleCloseDialog} color="inherit">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Form Dialog */}
      <Dialog open={formDialogOpen} onClose={handleFormClose}>
        <DialogTitle>Payment Form</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="Reg"
            label="Reg"
            type="text"
            fullWidth
            value={formData.Reg}
            onChange={(e) => setFormData({ ...formData, Reg: e.target.value })}
          />
          <TextField
            margin="dense"
            id="Name"
            label="Name"
            type="text"
            fullWidth
            value={formData.Name}
            onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
          />
          <TextField
            margin="dense"
            id="Seat"
            label="Seat"
            type="text"
            fullWidth
            value={formData.Seat}
            onChange={(e) => setFormData({ ...formData, Seat: e.target.value })}
          />
          <TextField
            margin="dense"
            id="Date"
            label="Date"
            type="text"
            fullWidth
            value={formData.Date}
            onChange={(e) => setFormData({ ...formData, Date: e.target.value })}
          />
          <TextField
            margin="dense"
            id="Cash"
            label="Cash"
            type="number"
            fullWidth
            value={formData.Cash}
            onChange={(e) => setFormData({ ...formData, Cash: e.target.value })}
          />
          <TextField
            margin="dense"
            id="Online"
            label="Online"
            type="number"
            fullWidth
            value={formData.Online}
            onChange={(e) =>
              setFormData({ ...formData, Online: e.target.value })
            }
          />
          <TextField
            margin="dense"
            id="Shift"
            label="Shift"
            type="text"
            fullWidth
            value={formData.Shift}
            onChange={(e) =>
              setFormData({ ...formData, Shift: e.target.value })
            }
          />
          <TextField
            margin="dense"
            id="Fee"
            label="Fee"
            type="number"
            fullWidth
            value={formData.Fee}
            onChange={(e) => setFormData({ ...formData, Fee: e.target.value })}
          />
          <TextField
            margin="dense"
            id="Remarks"
            label="Remarks"
            type="text"
            fullWidth
            value={formData.Remarks}
            onChange={(e) =>
              setFormData({ ...formData, Remarks: e.target.value })
            }
          />
          <TextField
            margin="dense"
            id="Status"
            label="Status"
            type="text"
            fullWidth
            value={formData.Status}
            onChange={(e) =>
              setFormData({ ...formData, Status: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFormSubmit} color="primary">
            Submit
          </Button>
          <Button onClick={handleFormClose} color="inherit">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManageSeats;
