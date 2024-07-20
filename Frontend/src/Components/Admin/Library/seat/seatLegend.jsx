import React from "react";
import { Box, Alert, AlertTitle } from "@mui/material";

const SeatLegend = () => (
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
            <Box sx={{ width: 16, height: 16, bgcolor: "green", mr: 2 }}></Box>
            <Box>Paid</Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ width: 16, height: 16, bgcolor: "red", mr: 2 }}></Box>
            <Box>Empty</Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ width: 16, height: 16, bgcolor: "yellow", mr: 2 }}></Box>
            <Box>Confirmation</Box>
          </Box>
          
        </Box>
  
  </Alert>
);

export default SeatLegend;
