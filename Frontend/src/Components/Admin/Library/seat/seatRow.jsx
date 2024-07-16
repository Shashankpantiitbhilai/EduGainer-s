import React from "react";
import { Box, Button } from "@mui/material";

const SeatRow = ({ seats, seatStatus, onSeatClick }) => {
  // console.log(seatStatus)

  const getBackgroundColor = (status) => {
    switch (status) {
      case "Paid":
        return "green";
      case "Unpaid":
        return "yellow";
      case "Left":
        return "purple"
      default:
        return "red";
    }
  };

  return (
    <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
      {seats.map((seat) => (
        <Button
          key={seat}
          variant="contained"
          onClick={() => onSeatClick(seat)}
          sx={{
            width: 40,
            height: 40,
            minWidth: 40,
            p: 0,
            backgroundColor: getBackgroundColor(seatStatus[seat]),
            "&:hover": {
              backgroundColor: getBackgroundColor(seatStatus[seat]),
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

export default SeatRow;
