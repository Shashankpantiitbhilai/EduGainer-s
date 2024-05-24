import React, { useState, useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { DataGrid } from "@mui/x-data-grid";

import { fetchLibSudents } from "../../services/Admin_services/adminUtils";

export default function SearchBar() {
  const [shift, setShift] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const defaultData = await fetchLibSudents(); // Fetch default data
        setStudents(defaultData);
      } catch (error) {
        console.error("Error fetching default data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = async (event, newValue) => {
    try {
      setShift(newValue);
      let response;
      if (newValue.length === 0) {
        // If input is empty, fetch default data
        response = await fetchLibSudents();
      } else {
        // If user selects anything, filter data accordingly
        response = await fetchLibSudents({
          shift: newValue.map((item) => item.shift),
        });
      }
      setStudents(response);
    } catch (error) {
      console.error("Error in capturing the input ", error);
    }
  };

  return (
    <>
      <Box
        sx={{ width: "100%", maxWidth: 500, margin: "0 auto", mt: 4, mb: 9 }}
      >
        <Autocomplete
          multiple
          id="search-bar"
          name="shift"
          options={shifts}
          getOptionLabel={(option) => option.shift}
          value={shift}
          onChange={handleSearch}
          filterSelectedOptions
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                variant="outlined"
                label={option.shift}
                {...getTagProps({ index })}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Search for students"
              placeholder="Type to search..."
              fullWidth
              inputProps={{
                ...params.inputProps,
                "aria-label": "Search for students",
              }}
            />
          )}
        />{" "}
      </Box>

      <div style={{ height: 800, width: "100%", margin: 8 }}>
        <DataGrid
          rows={students}
          columns={columns}
          pageSize={10}
          pagination
          getRowId={(row) => row._id}
          checkboxSelection
        />
      </div>
    </>
  );
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const shifts = [
  { shift: "9 PM to 6 AM" },
  { shift: "2 PM to 11 PM" },
  { shift: "7 AM to 7 PM" },
  { shift: "24*7" },
  { shift: "2 PM to 9 PM" },
  { shift: "7 PM to 11 PM" },
  // Add more shifts as needed
];

// Define columns for DataGrid

const columns = [
  { field: "_id", headerName: "ID", width: 70 },
  { field: "name", headerName: "Name", width: 150 },
  { field: "shift", headerName: "Shift", width: 120 },
  { field: "email", headerName: "Email", width: 200 },
  { field: "mobile", headerName: "Mobile", width: 120 },
  { field: "address", headerName: "Address", width: 150 },
  { field: "amount", headerName: "Amount", width: 70 },
  {
    field: "image",
    headerName: "Image",
    width: 120,
    renderCell: (params) => (
      <img
        src={params.row.image.url}
        alt="User"
        style={{ width: 50, height: 50, borderRadius: "50%" }}
      />
    ),
  },
  {
    field: `Payment_detail.razorpay_order_id`,
    headerName: "Order ID",
    width: 180,
    renderCell: (params) => (
      <span>{params.row.Payment_detail.razorpay_order_id}</span>
    ),
  },
  {
    field: `Payment_detail.razorpay_payment_id`,
    headerName: "Payment ID",
    width: 180,
    renderCell: (params) => (
      <span>{params.row.Payment_detail.razorpay_payment_id}</span>
    ),
  },
];

// Now you can update the seatsAvailable for each shift dynamically
