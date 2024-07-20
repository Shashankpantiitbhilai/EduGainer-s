import React from "react";
import { Box, Button } from "@mui/material";

const SeatRow = ({ seats, seatStatus, getSeatColor, onSeatClick }) => {
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
            backgroundColor: getSeatColor(seat),
            "&:hover": {
              backgroundColor: getSeatColor(seat),
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
