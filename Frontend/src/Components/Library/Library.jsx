import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Box,Snackbar,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Alert,
  AlertTitle,
  Grid,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";
import { getSeatsData, getStudentLibSeat } from "../../services/library/utils";
import { AdminContext } from "../../App";
import { io } from "socket.io-client";
import { fetchAdminCredentials } from "../../services/chat/utils";

const shifts = [
  "6:30 AM to 2 PM",
  "2 PM to 9:30 PM",
  "6:30 PM to 11 PM",
  "9:30 PM to 6:30 AM",
  "2 PM to 11 PM",
  "6:30 AM to 6:30 PM",
  "24*7",
];

const checkOverlap = (currentShift, bookedShifts) => {
  if (bookedShifts.includes("24*7")) return true;

  const overlapMap = {
    "6:30 AM to 2 PM": ["6:30 AM to 6:30 PM", "24*7", "6:30 AM to 2 PM"],
    "2 PM to 9:30 PM": [
      "2 PM to 11 PM",
      "2 PM to 9:30 PM",
      "6:30 AM to 6:30 PM",
      "24*7",
    ],
    "6:30 PM to 11 PM": [
      "2 PM to 11 PM",
      "24*7",
      "2 PM to 9:30 PM",
      "9:30 PM to 6:30 AM",
      "6:30 PM to 11 PM",
    ],
    "9:30 PM to 6:30 AM": ["24*7", "6:30 PM to 11 PM", "2 PM to 11 PM"],
    "2 PM to 11 PM": [
      "2 PM to 9:30 PM",
      "6:30 PM to 11 PM",
      "6:30 AM to 6:30 PM",
      "24*7",
      "2 PM to 11 PM",
    ],
    "6:30 AM to 6:30 PM": [
      "6:30 AM to 2 PM",
      "2 PM to 9:30 PM",
      "2 PM to 11 PM",
      "24*7",
      "6:30 AM to 6:30 PM",
    ],
    "24*7": shifts,
  };

  return bookedShifts.some((shift) => overlapMap[currentShift].includes(shift));
};

const getBackgroundColor = (status, seatStatuses, seat, selectedShift) => {
  if (!seatStatuses[seat]) {
    return "green"; // Default color if seat status is not available
  }

  // Check if there's a Confirmed status in any overlapping shift
  const hasOverlappingConfirmed = shifts.some(
    (shift) =>
      seatStatuses[seat][shift] === "Confirmed" &&
      checkOverlap(selectedShift, [shift])
  );

  if (hasOverlappingConfirmed) {
    return "yellow"; // Seat is confirmed in an overlapping shift
  }

  // Get all booked (Paid) shifts for this seat
  const bookedShifts = shifts.filter(
    (shift) => seatStatuses[seat][shift] === "Paid"
  );

  // Check for overlapping booked shifts
  if (checkOverlap(selectedShift, bookedShifts)) {
    return "red"; // Seat has an overlapping booking
  } else {
    return "green"; // Seat can be allocated
  }
};
const SeatRow = ({ seats, seatStatus, userSeat, selectedShift, userShift }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ display: "flex", gap: 1, mb: 1, flexWrap: "wrap" }}>
      {seats.map((seat) => (
        <Button
          key={seat}
          variant="contained"
          sx={{
            width: isMobile ? 30 : 40,
            height: isMobile ? 30 : 40,
            minWidth: isMobile ? 30 : 40,
            p: 0,
            fontSize: isMobile ? "0.7rem" : "0.875rem",
            backgroundColor: getBackgroundColor(
              seatStatus[`${seat}-${selectedShift}`],
              seatStatus,
              seat,
              selectedShift
            ),
            "&:hover": {
              backgroundColor: getBackgroundColor(
                seatStatus[`${seat}-${selectedShift}`],
                seatStatus,
                seat,
                selectedShift
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
};

const Library = () => {  const { IsUserLoggedIn } = useContext(AdminContext);
  const [selectedShift, setSelectedShift] = useState(shifts[0]);
  const [seatStatus, setSeatStatus] = useState({});
  const [userSeat, setUserSeat] = useState(null);
  const [userShift, setUserShift] = useState(null);
   const [snackbarOpen, setSnackbarOpen] = useState(false);
   const [snackbarMessage, setSnackbarMessage] = useState("");

  const socketRef = useRef(null);
  console.log(IsUserLoggedIn);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const url =
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_BACKEND_PROD
      : process.env.REACT_APP_BACKEND_DEV;

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
        
    
       if (socketRef.current) {
         socketRef.current.on("seatStatusUpdate", ({ id, status, seat, shift }) => {
        
           console.log(status, seat, shift);
            setSnackbarMessage(
              `Seat ${seat} status updated to ${status} for shift ${shift}`
            );
            setSnackbarOpen(true);
           setSeatStatus((prevStatus) => ({
             ...prevStatus,
             [seat]: {
               ...prevStatus[seat],
               [shift]: status,
             },
           }));
        
      
         });
       }
     

        try {
          const response = await getSeatsData();
          let statusMap = {};
          shifts.forEach((shift) => {
            const shiftData = response[shift] || [];
            shiftData.forEach((e) => {
              if (!statusMap[e.seat]) {
                statusMap[e.seat] = {};
              }
              statusMap[e.seat][shift] = e.status || "Empty";
            });
          });
          setSeatStatus(statusMap);
        } catch (error) {
          console.error("Error fetching seat data:", error);
        }
        console.log(IsUserLoggedIn);

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
  }, [IsUserLoggedIn?._id, url]);
const handleCloseSnackbar = (event, reason) => {
  if (reason === "clickaway") {
    return;
  }
  setSnackbarOpen(false);
};
  const handleShiftChange = (event) => {
    setSelectedShift(event.target.value);
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, maxWidth: "lg", mx: "auto" }}>
      <Box
        component="h1"
        sx={{ fontSize: { xs: "xl", sm: "2xl" }, fontWeight: "bold", mb: 4 }}
      >
        EduGainer's Live Seat Tracker
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "center",
          gap: 2,
          mb: 4,
        }}
      >
        <Button
          component={Link}
          to="/new-reg"
          variant="contained"
          color="primary"
          size={isMobile ? "medium" : "large"}
          sx={{ minWidth: 150, fontSize: { xs: "1rem", sm: "1.1rem" } }}
        >
          Register
        </Button>
        <Button
          component={Link}
          to="/library/fee-pay"
          variant="contained"
          color="secondary"
          size={isMobile ? "medium" : "large"}
          sx={{ minWidth: 150, fontSize: { xs: "1rem", sm: "1.1rem" } }}
        >
          Pay Fee
        </Button>
      </Box>
      <FormControl
        sx={{ mb: 4, minWidth: 200, width: { xs: "100%", sm: "auto" } }}
      >
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
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              borderRadius: 2,
              position: "relative",
              overflow: "auto",
            }}
          >
            <Box sx={{ border: "2px solid #ccc", borderRadius: "8px", p: 2 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
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
                    flexDirection: isMobile ? "column" : "row",
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
                    flexDirection: isMobile ? "column" : "row",
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
                  <Box sx={{ mx: { xs: 0, sm: 2, md: 4, lg: 5 } }}>
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
      </Grid>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />{" "}
  
      <Alert severity="info" sx={{ mt: 4 }}>
        <AlertTitle>Legend</AlertTitle>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "flex-start",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ width: 16, height: 16, bgcolor: "red", mr: 2 }}></Box>
            <Box>Booked</Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ width: 16, height: 16, bgcolor: "green", mr: 2 }}></Box>
            <Box>Empty</Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ width: 16, height: 16, bgcolor: "yellow", mr: 2 }}></Box>
            <Box>Pending</Box>
          </Box>
        </Box>
      </Alert>
    </Box>
  );
};

export default Library;
