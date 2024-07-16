import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Alert,
  AlertTitle,
} from "@mui/material";
import { Link } from "react-router-dom";
import { getSeatsData, getStudentLibSeat } from "../../services/library/utils";
import { AdminContext } from "../../App";
const shifts = [
  "6.30 AM to 2 PM",
  "2 PM to 9.30 PM",
  "6.30 PM to 11 PM",
  "9.30 PM to 6.30 AM",
  "2 PM to 11 PM",
  "6.30 AM to 6.30 PM",
  "24*7",
];

const ButtonLink = ({ to, children }) => (
  <Link to={to} style={{ textDecoration: "none" }}>
    <Button variant="contained" color="primary">
      {children}
    </Button>
  </Link>
);

const Seat = ({
  seatNumber,
  seatStatus,
  userSeat,
  selectedShift,
  userShift,
}) => {
  let seatColor = "red"; // Default color for booked seats

  if (seatStatus && seatStatus == "Unpaid") {
    seatColor = "green"; // Green color for unpaid (empty) seats
  } else if (seatNumber == userSeat && selectedShift == userShift) {
    seatColor = "orange"; // Purple color for the logged-in user's seat
  }

  return (
    <Box
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
      }}
    >
      {seatNumber}
    </Box>
  );
};

const SeatRow = ({ seats, seatStatus, userSeat, selectedShift, userShift }) => (
  <Box sx={{ display: "flex" }}>
    {seats.map((seatNumber) => (
      <Seat
        key={seatNumber}
        seatNumber={seatNumber}
        seatStatus={seatStatus[seatNumber]}
        userSeat={userSeat}
        selectedShift={selectedShift}
        userShift={userShift}
      />
    ))}
  </Box>
);

const Library = () => {
  const [selectedShift, setSelectedShift] = useState(shifts[0]);
  const [seatStatus, setSeatStatus] = useState({});
  const [userSeat, setUserSeat] = useState(null);
  const [userShift, setUserShift] = useState(null);
  const { IsUserLoggedIn } = useContext(AdminContext);
  const id = IsUserLoggedIn?._id;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getSeatsData();
        console.log(response);
        const selectedShiftData = response[selectedShift];
        console.log(selectedShiftData);
        if (selectedShiftData) {
          let statusMap = {};
          selectedShiftData.forEach((e) => {
            statusMap[e.Seat] =
              e.Status && e.Status[e.Status] ? e.Status[e.Status] : "Unpaid";
          });
          setSeatStatus(statusMap);
          console.log(statusMap);
        } else {
          console.error(`No data found for shift: ${selectedShift}`);
        }
      } catch (error) {
        console.error("Error fetching seat data:", error);
      }
    };
    fetchData();

    // Fetch user's seat
    const fetchUserSeat = async () => {
      try {
        // Assuming you have the user's ID available. Replace 'userId' with the actual user ID.
        // Replace this with the actual logged-in user's ID
        const userSeatData = await getStudentLibSeat(id);
        console.log(userSeatData.booking, id);
        if (
          userSeatData &&
          userSeatData.booking.seat &&
          userSeatData.booking.shift
        ) {
          setUserSeat(userSeatData.booking.seat);
          setUserShift(userSeatData.booking.shift);
        }
      } catch (error) {
        console.error("Error fetching user's seat:", error);
      }
    };
    fetchUserSeat();
  }, [selectedShift]);

  const handleShiftChange = (event) => {
    setSelectedShift(event.target.value);
  };

  return (
    <Box sx={{ p: 4, maxWidth: "lg", mx: "auto" }}>
      <Box component="h1" sx={{ fontSize: "2xl", fontWeight: "bold", mb: 4 }}>
        EduGainer's Library Seating
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

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
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

        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
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

        <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 2 }}>
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

        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
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
          <Box>
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

      <Alert severity="info" sx={{ mt: 4 }}>
        <AlertTitle>Legend</AlertTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ width: 16, height: 16, bgcolor: "green", mr: 2 }}></Box>
            <Box>Empty</Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ width: 16, height: 16, bgcolor: "red", mr: 2 }}></Box>
            <Box>Booked</Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ width: 16, height: 16, bgcolor: "yellow", mr: 2 }}></Box>
            <Box>No Confirmation</Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ width: 16, height: 16, bgcolor: "purple", mr: 2 }}></Box>
            <Box>Your Seat</Box>
          </Box>
        </Box>
      </Alert>

      <ButtonLink to={`/new-reg`}>Register</ButtonLink>
    </Box>
  );
};

export default Library;
