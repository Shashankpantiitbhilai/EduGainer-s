import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  TextField,
  Box,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Search, FileDownload, Edit, Save, Delete } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  fetchLibSudents,
  deleteLibStudent,
  editLibStudentById,
} from "../../../services/Admin_services/adminUtils";
import ConfirmationDialog from "./monthlyseat/confirm";
import ExcelJS from "exceljs";

export default function EnhancedStudentGrid() {
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModeId, setEditModeId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [cellDialogOpen, setCellDialogOpen] = useState(false);
  const [cellDialogContent, setCellDialogContent] = useState({
    title: "",
    content: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const defaultData = await fetchLibSudents();
        setStudents(defaultData);
      } catch (error) {
        toast.error("Error fetching student data");
      }
    };

    fetchData();
  }, []);

  const handleEdit = async (id, data) => {
    setLoading(true);
    try {
      await editLibStudentById(id, data);
      const updatedStudents = students.map((student) =>
        student._id === id ? { ...student, ...data } : student
      );
      setStudents(updatedStudents);
      toast.success("Student updated successfully");
    } catch (error) {
      toast.error("Failed to update student");
    } finally {
      setLoading(false);
      setEditModeId(null);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteLibStudent(studentToDelete);
      setStudents(
        students.filter((student) => student._id !== studentToDelete)
      );
      toast.success("Student deleted successfully");
    } catch (error) {
      toast.error("Failed to delete student");
    } finally {
      setDeleteDialogOpen(false);
      setStudentToDelete(null);
    }
  };

  const handleCellClick = (params) => {
    if (params.field !== "actions" && editModeId === null) {
      setCellDialogContent({
        title: params.colDef.headerName,
        content: params.value,
      });
      setCellDialogOpen(true);
    }
  };

  const columns = [
    { field: "reg", headerName: "Reg", width: 30, editable: true },
    { field: "amount", headerName: "Amount", width: 30, editable: true },
    { field: "name", headerName: "Name", width: 150, editable: true },
    { field: "email", headerName: "Email", width: 150, editable: true },
    { field: "address", headerName: "Address", width: 100, editable: true },
    { field: "shift", headerName: "Shift", width: 150, editable: true },
    { field: "contact1", headerName: "ContactNo1", width: 150, editable: true },
    { field: "contact2", headerName: "ContactNo2", width: 150, editable: true },
    {
      field: "image",
      headerName: "Image",
      width: 80,
      editable: true,
      renderCell: (params) =>
        params.value && params.value.url ? (
          <img
            src={params.value.url}
            alt="User"
            style={{ width: 40, height: 40, borderRadius: "50%" }}
          />
        ) : null,
    },
    { field: "gender", headerName: "Gender", width: 50 },
    {
      field: "dob",
      editable: true,
      headerName: "Date of Birth",
      width: 80,
    },
    {
      field: "fatherName",
      editable: true,
      headerName: "Father's Name",
      width: 100,
    },
    {
      field: "motherName",
      editable: true,
      headerName: "Mother's Name",
      width: 100,
    },
    { field: "aadhaar", editable: true, headerName: "Aadhaar", width: 150 },
    {
      field: "examPreparation",
      editable: true,
      headerName: "Exam Preparation",
      width: 100,
    },
    { field: "consent", editable: true, headerName: "Consent", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box>
          <IconButton
            onClick={() => {
              if (editModeId === params.row._id) {
                handleEdit(params.row._id, params.row);
              } else {
                setEditModeId(params.row._id);
              }
            }}
            color="primary"
          >
            {editModeId === params.row._id ? <Save /> : <Edit />}
          </IconButton>
          <IconButton
            onClick={() => {
              setDeleteDialogOpen(true);
              setStudentToDelete(params.row._id);
            }}
            color="error"
          >
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ];

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Students");

    // Add headers
    worksheet.addRow(columns.map((col) => col.headerName));

    // Add data
    students.forEach((student) => {
      worksheet.addRow(columns.map((col) => student[col.field]));
    });

    // Generate blob
    const blob = await workbook.xlsx.writeBuffer();

    // Create download link
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "students.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const filteredStudents = students.filter((student) =>
    Object.values(student).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <Box sx={{ height: "80vh", width: "100%", p: 2 }}>
      <ToastContainer />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{ endAdornment: <Search /> }}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<FileDownload />}
          onClick={exportToExcel}
        >
          Export to Excel
        </Button>
      </Box>
      <DataGrid
        rows={filteredStudents}
        columns={columns}
        pageSize={30}
        rowsPerPageOptions={[10, 25, 50]}
       
        loading={loading}
        getRowId={(row) => row._id}
        onCellClick={handleCellClick}
        sx={{
          "& .MuiDataGrid-root": {
            border: "1px solid #ddd",
          },
          "& .MuiDataGrid-cell": {
            borderRight: "1px solid #ddd",
            borderBottom: "1px solid #ddd",
            maxHeight: "40px!important",
            minHeight: "40px!important",
            display: "flex",
            alignItems: "center",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "orange",
            color: "#fff",
            fontWeight: "bold",
            borderBottom: "2px solid #1565c0",
          },
          "& .MuiDataGrid-columnHeader": {
            borderRight: "1px solid #1565c0",
            backgroundColor: "orange",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: "bold",
          },
          "& .MuiDataGrid-row": {
            maxHeight: "40px!important",
            minHeight: "40px!important",
          },
          "& .MuiDataGrid-cell:focus": {
            outline: "none",
          },
          "& .MuiDataGrid-cell:hover": {
            backgroundColor: "green",
          },
        }}
      />
      <ConfirmationDialog
        open={deleteDialogOpen}
        handleClose={() => setDeleteDialogOpen(false)}
        handleConfirm={handleDelete}
      />
      <Dialog open={cellDialogOpen} onClose={() => setCellDialogOpen(false)}>
        <DialogTitle>{cellDialogContent.title}</DialogTitle>
        <DialogContent>
          {cellDialogContent.title === "Image" ? (
            <img
              src={cellDialogContent.content?.url}
              alt="User"
              style={{
                width: "100%",
                maxHeight: "300px",
                objectFit: "contain",
              }}
            />
          ) : (
            <p>{cellDialogContent.content}</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCellDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
