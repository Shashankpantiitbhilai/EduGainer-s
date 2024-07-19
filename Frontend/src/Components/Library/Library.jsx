import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Alert,
  AlertTitle,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Link } from "react-router-dom";
import { getSeatsData, getStudentLibSeat } from "../../services/library/utils";
import { AdminContext } from "../../App";
import { io } from "socket.io-client";
import { fetchAdminCredentials } from "../../services/chat/utils";
import { fetchLibStudent } from "../../services/library/utils";
const shifts = [
  "6:30 AM to 2 PM",
  "2 PM to 9:30 PM",
  "6:30 PM to 11 PM",
  "9:30 PM to 6:30 AM",
  "2 PM to 11 PM",
  "6:30 AM to 6:30 PM",
  "24*7",
];

const ButtonLink = ({ to, children }) => (
  <Link to={to} style={{ textDecoration: "none" }}>
    <Button variant="contained" color="primary">
      {children}
    </Button>
  </Link>
);

const getBackgroundColor = (status, isUserSeat) => {
  if (isUserSeat) return "orange";
  switch (status) {
    case "Paid":
      return "red";
    
   
    default:
      return "green";
  }
};

const SeatRow = ({
  seats,
  seatStatus,
  userSeat,
  selectedShift,
  userShift,
  onSeatClick,
}) => (
  <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
    {seats.map((seat) => (
      <Button
        key={seat}
        variant="contained"
        // onClick={() => onSeatClick(seat)}
        sx={{
          width: 40,
          height: 40,
          minWidth: 40,
          p: 0,
          backgroundColor: getBackgroundColor(
            seatStatus[seat],
            seat == userSeat && selectedShift == userShift
          ),
          "&:hover": {
            backgroundColor: getBackgroundColor(
              seatStatus[seat],
              seat == userSeat && selectedShift == userShift
            ),
            opacity: 0.8,
          },
        }}
      >
        {seat}
      </Button>
    ))}
  </Box>
);

const Library = () => {
  const [selectedShift, setSelectedShift] = useState(shifts[0]);
  const [seatStatus, setSeatStatus] = useState({});
  const [userSeat, setUserSeat] = useState(null);
  const [userShift, setUserShift] = useState(null);
  const { IsUserLoggedIn } = useContext(AdminContext);
  const socketRef = useRef(null);
  const [showNotification, setShowNotification] = useState(false);
  const url =
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_BACKEND_PROD
      : process.env.REACT_APP_BACKEND_DEV;
   useEffect(() => {
     const checkTime = () => {
       const now = new Date();
       const hours = now.getHours();
       const minutes = now.getMinutes();

       if (hours === 14 && minutes === 50) {
         setShowNotification(true);
       }
     };

     // Check immediately on component mount
     checkTime();

     // Set up an interval to check every minute
     const interval = setInterval(checkTime, 60 * 1000);

     return () => clearInterval(interval);
   }, []);
  const handleContinue = () => {
    // Add logic here to handle user's decision to continue
    console.log("User decided to continue for the next month");
    setShowNotification(false);
  };

  const handleDiscontinue = () => {
    // Add logic here to handle user's decision to discontinue
    console.log("User decided to discontinue for the next month");
    setShowNotification(false);
  };

  useEffect(() => {
    const initializeData = async () => {
      try {
        const adminData = await fetchAdminCredentials();
        const roomId = adminData?._id;

        socketRef.current = io(url, {
          query: {
            sender: IsUserLoggedIn._id,
            admin: adminData._id,
          },
        });

        socketRef.current.emit("joinSeatsRoom", roomId);

        socketRef.current.on("seatStatusUpdate", ({ id, status, seat }) => {
          console.log("Seat status update received:", { id, status, seat });
          setSeatStatus((prevStatus) => ({
            ...prevStatus,
            [seat]: status,
          }));
        });

        const response = await getSeatsData();
        const selectedShiftData = response[selectedShift];
        if (selectedShiftData) {
          let statusMap = {};
          selectedShiftData.forEach((e) => {
            statusMap[e.seat] = e.status || "Unpaid";
          });
          setSeatStatus(statusMap);
        } else {
          console.error(`No data found for shift: ${selectedShift}`);
        }

        const userSeatData = await getStudentLibSeat(IsUserLoggedIn?._id);
        if (userSeatData?.booking?.seat && userSeatData?.booking?.shift) {
          setUserSeat(userSeatData.booking.seat);
          setUserShift(userSeatData.booking.shift);
        }
      } catch (error) {
        console.error("Error initializing data:", error);
      }
    };

    initializeData();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [selectedShift, IsUserLoggedIn?._id, url]);
  const handleShiftChange = (event) => {
    setSelectedShift(event.target.value);
  };

  const handleSeatClick = (seat) => {
    console.log(`Seat ${seat} clicked`);
    // Add your logic for seat click here
  };

  return (
    <Box sx={{ p: 4, maxWidth: "lg", mx: "auto" }}>
      <Box component="h1" sx={{ fontSize: "2xl", fontWeight: "bold", mb: 4 }}>
        EduGainer's Library Seating
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 4, mb: 4 }}>
        <Button
          component={Link}
          to="/new-reg"
          variant="contained"
          color="primary"
          size="large"
          sx={{ minWidth: 150, fontSize: "1.1rem" }}
        >
          Register
        </Button>
        <Button
          component={Link}
          to="/library/fee-pay"
          variant="contained"
          color="secondary"
          size="large"
          sx={{ minWidth: 150, fontSize: "1.1rem" }}
        >
          Pay Fee
        </Button>
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
          {shifts.map((shift) => (
            <MenuItem key={shift} value={shift}>
              {shift}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Alert severity="warning" sx={{ mt: 2, mb: 4 }}>
        <AlertTitle>Note</AlertTitle>
        In case the seat you need is not empty, kindly contact our office.
      </Alert>
      <Grid item xs={12} md={8}>
        <Paper
          elevation={2}
          sx={{ p: 2, borderRadius: 2, position: "relative" }}
        >
          <Box sx={{ border: "2px solid #ccc", borderRadius: "8px", p: 2 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <SeatRow
                  seats={["A3", "A4", "A5", "A6", "A7", "A8", "A9", "A0"]}
                  seatStatus={seatStatus}
                  userSeat={userSeat}
                  selectedShift={selectedShift}
                  userShift={userShift}
                />
                <SeatRow
                  seats={[77, 78, 79, 80, 81, 82, 83, 84]}
                  seatStatus={seatStatus}
                  userSeat={userSeat}
                  selectedShift={selectedShift}
                  userShift={userShift}
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <Box>
                  <SeatRow
                    seats={[68, 67, 66, 65, 64, 63, 62, 61]}
                    seatStatus={seatStatus}
                    userSeat={userSeat}
                    selectedShift={selectedShift}
                    userShift={userShift}
                  />
                  <SeatRow
                    seats={[52, 51, 50, 49, 48, 47, 46, 45]}
                    seatStatus={seatStatus}
                    userSeat={userSeat}
                    selectedShift={selectedShift}
                    userShift={userShift}
                  />
                </Box>
                <Box>
                  <SeatRow
                    seats={[69, 70, 71, 72, 73, 74, 75, 76]}
                    seatStatus={seatStatus}
                    userSeat={userSeat}
                    selectedShift={selectedShift}
                    userShift={userShift}
                  />
                  <SeatRow
                    seats={[53, 54, 55, 56, 57, 58, 59, 60]}
                    seatStatus={seatStatus}
                    userSeat={userSeat}
                    selectedShift={selectedShift}
                    userShift={userShift}
                  />
                </Box>
              </Box>

              <Box
                sx={{ display: "flex", justifyContent: "flex-start", gap: 2 }}
              >
                <Box>
                  <SeatRow
                    seats={[44, 43, 42, 41, 40, 39, 38, 37]}
                    seatStatus={seatStatus}
                    userSeat={userSeat}
                    selectedShift={selectedShift}
                    userShift={userShift}
                  />
                  <SeatRow
                    seats={[36, 35, 34, 33, 32, 31, 30, 29]}
                    seatStatus={seatStatus}
                    userSeat={userSeat}
                    selectedShift={selectedShift}
                    userShift={userShift}
                  />
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <Box>
                  <SeatRow
                    seats={[28, 27, 26]}
                    seatStatus={seatStatus}
                    userSeat={userSeat}
                    selectedShift={selectedShift}
                    userShift={userShift}
                  />
                  <SeatRow
                    seats={[21, 20, 19]}
                    seatStatus={seatStatus}
                    userSeat={userSeat}
                    selectedShift={selectedShift}
                    userShift={userShift}
                  />
                  <SeatRow
                    seats={[14, 13, 12]}
                    seatStatus={seatStatus}
                    userSeat={userSeat}
                    selectedShift={selectedShift}
                    userShift={userShift}
                  />
                  <SeatRow
                    seats={[1, 2, 3]}
                    seatStatus={seatStatus}
                    userSeat={userSeat}
                    selectedShift={selectedShift}
                    userShift={userShift}
                  />
                </Box>
                <Box sx={{ mx: 50 }}>
                  <SeatRow
                    seats={[25, 24, 23, 22]}
                    seatStatus={seatStatus}
                    userSeat={userSeat}
                    selectedShift={selectedShift}
                    userShift={userShift}
                  />
                  <SeatRow
                    seats={[15, 16, 17, 18]}
                    seatStatus={seatStatus}
                    userSeat={userSeat}
                    selectedShift={selectedShift}
                    userShift={userShift}
                  />
                  <SeatRow
                    seats={[8, 9, 10, 11]}
                    seatStatus={seatStatus}
                    userSeat={userSeat}
                    selectedShift={selectedShift}
                    userShift={userShift}
                  />
                  <SeatRow
                    seats={[4, 5, 6, 7]}
                    seatStatus={seatStatus}
                    userSeat={userSeat}
                    selectedShift={selectedShift}
                    userShift={userShift}
                  />
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                mt: 4,
              }}
            >
              <Box sx={{ mr: 4 }}>door →</Box>
              <Box sx={{ width: 64, height: 4, bgcolor: "black" }}></Box>
            </Box>
          </Box>
        </Paper>
      </Grid>
      <Alert severity="info" sx={{ mt: 4 }}>
        <AlertTitle>Legend</AlertTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ width: 16, height: 16, bgcolor: "green", mr: 2 }}></Box>
            <Box>Paid</Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ width: 16, height: 16, bgcolor: "yellow", mr: 2 }}></Box>
            <Box>Unpaid</Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ width: 16, height: 16, bgcolor: "purple", mr: 2 }}></Box>
            <Box>Left</Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ width: 16, height: 16, bgcolor: "red", mr: 2 }}></Box>
            <Box>Unknown</Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ width: 16, height: 16, bgcolor: "orange", mr: 2 }}></Box>
            <Box>Your Seat</Box>
          </Box>
        </Box>
      </Alert>
      <Dialog
        open={showNotification}
        onClose={() => setShowNotification(false)}
      >
        <DialogTitle>Monthly Continuation</DialogTitle>
        <DialogContent>
          Do you want to continue using the library for the next month?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDiscontinue} color="secondary">
            Discontinue
          </Button>
          <Button onClick={handleContinue} color="primary" variant="contained">
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Library;
