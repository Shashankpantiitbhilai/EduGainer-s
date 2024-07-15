import React from "react";
import { Box } from "@mui/material";
import Seat from "./seat";

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

export default SeatRow;
