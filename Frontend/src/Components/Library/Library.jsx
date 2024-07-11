import React, { useState } from "react";
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
const shifts = [
  { time: "2-9pm", availableSeats: [1, 2, 5, 6, 8, 9, 12, 13, 16, 17] },
  { time: "9pm-6am", availableSeats: [20, 21, 22, 23, 24, 25, 26, 27, 28, 29] },
];
function ButtonLink({ to, children }) {
  return (
    <Link to={to} style={{ textDecoration: "none" }}>
      <Button variant="contained" color="primary">
        {children}
      </Button>
    </Link>
  );
}
const Seat = ({ seatNumber, isAvailable }) => (
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
      bgcolor: isAvailable ? "gray" : "orange",
    }}
  >
    {seatNumber}
  </Box>
);

const SeatRow = ({ seats, availableSeats }) => (
  <Box sx={{ display: "flex" }}>
    {seats.map((seatNumber) => (
      <Seat
        key={seatNumber}
        seatNumber={seatNumber}
        isAvailable={availableSeats.includes(seatNumber)}
      />
    ))}
  </Box>
);

const Library = () => {
  const [selectedShift, setSelectedShift] = useState(shifts[0].time);
  const [availableSeats, setAvailableSeats] = useState(
    shifts[0].availableSeats
  );

  const handleShiftChange = (event) => {
    const selected = event.target.value;
    setSelectedShift(selected);
    const shift = shifts.find((s) => s.time === selected);
    setAvailableSeats(shift.availableSeats);
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
            <MenuItem key={shift.time} value={shift.time}>
              {shift.time}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Alert severity="warning" sx={{ mt: 2, mb: 4 }}>
        <AlertTitle>Note</AlertTitle>

        <Box className="danger">
          In case ,the seat you need is not empty kindly ,you can Contact our
          office
        </Box>
      </Alert>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Top row - two 1x8 matrices */}
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
          <SeatRow
            seats={["A3", "A4", "A5", "A6", "A7", "A8", "A9", "A0"]}
            availableSeats={availableSeats}
          />
          <SeatRow
            seats={[77, 78, 79, 80, 81, 82, 83, 84]}
            availableSeats={availableSeats}
          />
        </Box>

        {/* Two 2x8 matrices */}
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
          <Box>
            <SeatRow
              seats={[68, 67, 66, 65, 64, 63, 62, 61]}
              availableSeats={availableSeats}
            />
            <SeatRow
              seats={[52, 51, 50, 49, 48, 47, 46, 45]}
              availableSeats={availableSeats}
            />
          </Box>
          <Box>
            <SeatRow
              seats={[69, 70, 71, 72, 73, 74, 75, 76]}
              availableSeats={availableSeats}
            />
            <SeatRow
              seats={[53, 54, 55, 56, 57, 58, 59, 60]}
              availableSeats={availableSeats}
            />
          </Box>
        </Box>

        {/* One 2x8 matrix on the left */}
        <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 2 }}>
          <Box>
            <SeatRow
              seats={[44, 43, 42, 41, 40, 39, 38, 37]}
              availableSeats={availableSeats}
            />
            <SeatRow
              seats={[36, 35, 34, 33, 32, 31, 30, 29]}
              availableSeats={availableSeats}
            />
          </Box>
        </Box>

        {/* Bottom row - 4x3 and 4x4 matrices */}
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
          <Box>
            <SeatRow seats={[28, 27, 26]} availableSeats={availableSeats} />
            <SeatRow seats={[21, 20, 19]} availableSeats={availableSeats} />
            <SeatRow seats={[14, 13, 12]} availableSeats={availableSeats} />
            <SeatRow seats={[1, 2, 3]} availableSeats={availableSeats} />
          </Box>
          <Box>
            <SeatRow seats={[25, 24, 23, 22]} availableSeats={availableSeats} />
            <SeatRow seats={[15, 16, 17, 18]} availableSeats={availableSeats} />
            <SeatRow seats={[8, 9, 10, 11]} availableSeats={availableSeats} />
            <SeatRow seats={[4, 5, 6, 7]} availableSeats={availableSeats} />
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
            <Box sx={{ width: 16, height: 16, bgcolor: "gray", mr: 2 }}></Box>
            <Box>Available</Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ width: 16, height: 16, bgcolor: "orange", mr: 2 }}></Box>
            <Box>Occupied</Box>
          </Box>
        </Box>
      </Alert>

      <ButtonLink to={`/new-reg`}>Register</ButtonLink>
    </Box>
  );
};

export default Library;
