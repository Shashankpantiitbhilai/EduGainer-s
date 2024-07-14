import React, { useState, useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import CircularProgress from "@mui/material/CircularProgress";
import {
  fetchLibSudents,
  deleteLibStudent,
  editLibStudentById,
} from "../../../services/Admin_services/adminUtils";

export default function SearchBar() {
  const [shift, setShift] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModeId, setEditModeId] = useState(null);

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

  const handleEdit = async (id, data) => {
    setLoading(true);
    console.log(id, data);
    try {
      await editLibStudentById(id, data);
      const updatedStudents = students.map((student) =>
        student._id === id ? { ...student, ...data } : student
      );
      setStudents(updatedStudents);
    } catch (error) {
      console.error("Error editing student:", error);
    } finally {
      setLoading(false);
      setEditModeId(null); // Exit edit mode after save
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteLibStudent(id);
      setStudents(students.filter((student) => student._id !== id));
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const enterEditMode = (id) => {
    setEditModeId(id);
  };

  const exitEditMode = () => {
    setEditModeId(null);
  };

  const isEditMode = (id) => {
    return id === editModeId;
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 70 },
    {
      field: "name",
      headerName: "Name",
      width: 150,
      editable: true,
    },
    { field: "shift", headerName: "Shift", width: 120 },
    {
      field: "email",
      headerName: "Email",
      width: 200,
      editable: true,
    },
    {
      field: "mobile",
      headerName: "Mobile",
      width: 120,
      editable: true,
    },
    {
      field: "address",
      headerName: "Address",
      width: 150,
      editable: true,
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 70,
      editable: true,
    },
    {
      field: "image",
      headerName: "Image",
      width: 80,
      renderCell: (params) => (
        <img
          src={params.row.image.url}
          alt="User"
          style={{ width: 50, height: 50, borderRadius: "50%" }}
        />
      ),
    },
    {
      field: "Payment_detail.razorpay_order_id",
      headerName: "Order ID",
      width: 180,
      renderCell: (params) => (
        <span>{params.row.Payment_detail.razorpay_order_id}</span>
      ),
    },
    {
      field: "Payment_detail.razorpay_payment_id",
      headerName: "Payment ID",
      width: 180,
      renderCell: (params) => (
        <span>{params.row.Payment_detail.razorpay_payment_id}</span>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <div>
          {isEditMode(params.row._id) ? (
            <IconButton
              onClick={() => handleEdit(params.row._id, params.row)}
              style={{ color: "light-green" }}
            >
              <SaveIcon />
            </IconButton>
          ) : (
            <IconButton
              onClick={() => enterEditMode(params.row._id)}
              style={{ color: "red" }}
            >
              <EditIcon />
            </IconButton>
          )}
          <IconButton
            onClick={() => handleDelete(params.row._id)}
            style={{ color: "blue" }}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

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
        />
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
        {loading && (
          <div
            style={{ display: "flex", justifyContent: "center", marginTop: 20 }}
          >
            <CircularProgress />
          </div>
        )}
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
