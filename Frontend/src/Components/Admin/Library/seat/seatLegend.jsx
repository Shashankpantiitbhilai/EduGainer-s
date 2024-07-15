import React from "react";
import { Box, Alert, AlertTitle } from "@mui/material";

const SeatLegend = () => (
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
);

export default SeatLegend;
