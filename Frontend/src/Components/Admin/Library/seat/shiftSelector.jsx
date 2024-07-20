import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const shifts = [
  "6:30 AM to 2 PM",
  "2 PM to 9:30 PM",
  "6:30 PM to 11 PM",
  "9:30 PM to 6:30 AM",
  "2 PM to 11 PM",
  "6:30 AM to 6:30 PM",
  "24*7",
];

const ShiftSelector = ({ selectedShift, onShiftChange }) => (
  <FormControl sx={{ mb: 4, minWidth: 200 }}>
    <InputLabel id="shift-select">Select Shift</InputLabel>
    <Select
      labelId="shift-select-label"
      id="shift-select"
      value={selectedShift} // Sets the value of the Select component to the selectedShift
      onChange={onShiftChange} // Handles the change event
      label="Select Shift"
    >
      {shifts.map((shift) => (
        <MenuItem key={shift} value={shift}>
          {shift}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

export default ShiftSelector;
