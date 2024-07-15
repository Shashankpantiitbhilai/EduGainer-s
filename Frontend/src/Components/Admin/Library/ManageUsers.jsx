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
import { Search } from "@mui/icons-material";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModeId, setEditModeId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const defaultData = await fetchLibSudents(); // Fetch default data
        setStudents(defaultData);
        console.log(defaultData);
      } catch (error) {
        console.error("Error fetching default data:", error);
      }
    };

    fetchData();
  }, []);

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
    { field: "reg", headerName: "Reg", width: 70 },
    {
      field: "name",
      headerName: "Name",
      width: 150,
      editable: true,
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
      editable: true,
    },
    {
      field: "address",
      headerName: "Address",
      width: 150,
      editable: true,
    },
    {
      field: "image",
      headerName: "Image",
      width: 80,
      renderCell: (params) =>
        params.row.image && params.row.image.url ? (
          <img
            src={params.row.image.url}
            alt="User"
            style={{ width: 50, height: 50, borderRadius: "50%" }}
          />
        ) : null,
    },
    {
      field: "gender",
      headerName: "Gender",
      width: 80,
      renderCell: (params) =>
        params.row.gender ? <span>{params.row.gender}</span> : null,
    },
    {
      field: "dob",
      headerName: "Date of Birth",
      width: 150,
      renderCell: (params) =>
        params.row.dob ? (
          <span>{new Date(params.row.dob).toLocaleDateString()}</span>
        ) : null,
    },
    {
      field: "fatherName",
      headerName: "Father's Name",
      width: 150,
      renderCell: (params) =>
        params.row.fatherName ? <span>{params.row.fatherName}</span> : null,
    },
    {
      field: "motherName",
      headerName: "Mother's Name",
      width: 150,
      renderCell: (params) =>
        params.row.motherName ? <span>{params.row.motherName}</span> : null,
    },
    {
      field: "contactNo1",
      headerName: "Contact No 1",
      width: 120,
      renderCell: (params) =>
        params.row.contactNo1 ? <span>{params.row.contactNo1}</span> : null,
    },
    {
      field: "contactNo2",
      headerName: "Contact No 2",
      width: 120,
      renderCell: (params) =>
        params.row.contactNo2 ? <span>{params.row.contactNo2}</span> : null,
    },
    {
      field: "aadhaarNo",
      headerName: "Aadhaar",
      width: 150,
      renderCell: (params) =>
        params.row.aadhaarNo ? <span>{params.row.aadhaarNo}</span> : null,
    },
    {
      field: "examPreparation",
      headerName: "Exam Preparation",
      width: 180,
      renderCell: (params) =>
        params.row.examPreparation ? (
          <span>{params.row.examPreparation}</span>
        ) : null,
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

  const filteredStudents = students.filter((student) =>
    Object.values(student).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <>
      <Box
        sx={{ width: "100%", maxWidth: 500, margin: "0 auto", mt: 4, mb: 9 }}
      >
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{ endAdornment: <Search /> }}
        />
      </Box>
      <div style={{ height: 800, width: "100%", margin: 8 }}>
        <DataGrid
          rows={filteredStudents}
          columns={columns}
          pageSize={10}
          pagination
          getRowId={(row) => row._id}
          checkboxSelection
        />
        {loading && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 9999,
            }}
          >
            <CircularProgress />
          </div>
        )}
      </div>
    </>
  );
}
