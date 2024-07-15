import React from "react";
import { Box } from "@mui/material";

const Seat = ({ seatNumber, seatStatus, onClick }) => {
  let seatColor = "grey";
  if (seatStatus === "Paid") {
    seatColor = "green";
  } else if (seatStatus === "Unpaid") {
    seatColor = "orange";
  }

  return (
    <Box
      onClick={() => onClick(seatNumber)}
      sx={{
        width: 40,
        height: 35,
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

export default Seat;
