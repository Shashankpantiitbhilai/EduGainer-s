import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  TextField,
  Box,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  CircularProgress,
} from "@mui/material";
import {
  Search,
  FileDownload,
  Edit,
  Save,
  Delete,
  Add,
} from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  fetchLibSudents,
  deleteLibStudent,
  editLibStudentById,
  addStudentData,
} from "../../../services/Admin_services/adminUtils";
import ConfirmationDialog from "./monthlyseat/confirm";
import ExcelJS from "exceljs";

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3 MB in bytes

const shifts = [
  "6:30 AM to 2 PM",
  "2 PM to 9:30 PM",
  "6:30 PM to 11 PM",
  "9:30 PM to 6:30 AM",
  "2 PM to 11 PM",
  "6:30 AM to 6:30 PM",
  "24*7",
];

export default function EnhancedStudentGrid() {
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savingChanges, setSavingChanges] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [cellDialogOpen, setCellDialogOpen] = useState(false);
  const [cellContent, setCellContent] = useState({ field: "", value: "" });
  const [newStudent, setNewStudent] = useState({
    name: "",
    reg: "",
    email: "",
    amount: "",
    address: "",
    shift: "",
    gender: "",
    dob: "",
    fatherName: "",
    motherName: "",
    contact1: "",
    contact2: "",
    aadhaar: "",
    examPreparation: "",
    consent: "Agreed",
  });
  const [imageBase64, setImageBase64] = useState("");
  const [fileError, setFileError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const defaultData = await fetchLibSudents();
        setStudents(defaultData);
      } catch (error) {
        toast.error("Error fetching student data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCellClick = (params) => {
    setCellContent({ field: params.field, value: params.value });
    setCellDialogOpen(true);
  };

  const handleEdit = async (id, data) => {
    setSavingChanges(true);
    try {
      await editLibStudentById(id, { ...data, image: imageBase64 });
      const updatedStudents = students.map((student) =>
        student._id === id
          ? { ...student, ...data, image: { url: imageBase64 } }
          : student
      );
      setStudents(updatedStudents);
      toast.success("Student updated successfully");
      setEditDialogOpen(false);
    } catch (error) {
      toast.error("Failed to update student");
    } finally {
      setSavingChanges(false);
    }
  };

  const handleDelete = async () => {
    setSavingChanges(true);
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
      setSavingChanges(false);
    }
  };

  const handleAddStudent = async () => {
    setSavingChanges(true);
    try {
      const addedStudent = await addStudentData({
        ...newStudent,
        image: imageBase64,
      });
      setStudents((prevStudents) => [...prevStudents, addedStudent]);
      toast.success("Student added successfully");
      setAddDialogOpen(false);
      setNewStudent({
        name: "",
        reg: "",
        email: "",
        amount: "",
        address: "",
        shift: "",
        gender: "",
        dob: "",
        fatherName: "",
        motherName: "",
        contact1: "",
        contact2: "",
        aadhaar: "",
        examPreparation: "",
        consent: "Agreed",
      });
      setImageBase64("");
    } catch (error) {
      toast.error("Failed to add student");
    } finally {
      setSavingChanges(false);
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file && file.size > MAX_FILE_SIZE) {
      setFileError("File size should not exceed 3 MB");
      return;
    }
    setFileError("");
    setFileToBase64(file);
  };

  const setFileToBase64 = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImageBase64(reader.result);
    };
  };

  const columns = [
    { field: "reg", headerName: "Reg", width: 80, editable: true },
    { field: "Mode", headerName: "Mode", width: 80, editable: true },
    { field: "amount", headerName: "Amount", width: 80, editable: true },
    { field: "name", headerName: "Name", width: 150, editable: true },
    { field: "email", headerName: "Email", width: 150, editable: true },
    { field: "address", headerName: "Address", width: 150, editable: true },
    { field: "shift", headerName: "Shift", width: 150, editable: true },
    { field: "contact1", headerName: "ContactNo1", width: 120, editable: true },
    { field: "contact2", headerName: "ContactNo2", width: 120, editable: true },
    {
      field: "image",
      headerName: "Image",
      width: 80,
      renderCell: (params) =>
        params.value && params.value.url ? (
          <Avatar src={params.value.url} alt="User" />
        ) : null,
    },
    { field: "gender", headerName: "Gender", width: 80 },
    { field: "dob", headerName: "Date of Birth", width: 120 },
    { field: "fatherName", headerName: "Father's Name", width: 150 },
    { field: "motherName", headerName: "Mother's Name", width: 150 },
    { field: "aadhaar", headerName: "Aadhaar", width: 150 },
    { field: "examPreparation", headerName: "Exam Preparation", width: 150 },
    { field: "consent", headerName: "Consent", width: 100 },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params) => (
        <Box>
          <IconButton
            onClick={() => {
              setStudentToEdit(params.row);
              setEditDialogOpen(true);
            }}
            color="primary"
          >
            <Edit />
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
  ].map((column) => ({
    ...column,
    renderCell: (params) => (
      <div onClick={() => handleCellClick(params)}>
        {column.renderCell ? column.renderCell(params) : params.value}
      </div>
    ),
  }));

  const renderCellDialog = () => (
    <Dialog
      open={cellDialogOpen && cellContent.field !== "actions"}
      onClose={() => setCellDialogOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>{cellContent.field}</DialogTitle>
      <DialogContent>
        {cellContent.field === "image" &&
        cellContent.value &&
        cellContent.value.url ? (
          <Box display="flex" justifyContent="center" my={2}>
            <img
              src={cellContent.value.url}
              alt="Student"
              style={{
                maxWidth: "100%",
                maxHeight: "400px",
                objectFit: "contain",
              }}
            />
          </Box>
        ) : (
          <Typography>
            {cellContent.value instanceof Object
              ? JSON.stringify(cellContent.value, null, 2)
              : cellContent.value}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setCellDialogOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  );

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Students");

    worksheet.addRow(columns.map((col) => col.headerName));

    students.forEach((student) => {
      worksheet.addRow(columns.map((col) => student[col.field]));
    });

    const blob = await workbook.xlsx.writeBuffer();

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

  const renderDialog = (isEdit) => {
    const dialogTitle = isEdit ? "Edit Student" : "Add New Student";
    const handleSubmit = isEdit
      ? () => handleEdit(studentToEdit._id, studentToEdit)
      : handleAddStudent;
    const student = isEdit ? studentToEdit : newStudent;
    const setStudent = isEdit ? setStudentToEdit : setNewStudent;

    return (
      <Dialog
        open={isEdit ? editDialogOpen : addDialogOpen}
        onClose={() =>
          isEdit ? setEditDialogOpen(false) : setAddDialogOpen(false)
        }
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 2,
            }}
          >
            <TextField
              autoFocus
              margin="dense"
              label="Name"
              type="text"
              fullWidth
              value={student?.name}
              onChange={(e) => setStudent({ ...student, name: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Reg"
              type="text"
              fullWidth
              value={student?.reg}
              onChange={(e) => setStudent({ ...student, reg: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              value={student?.email}
              onChange={(e) =>
                setStudent({ ...student, email: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Amount"
              type="number"
              fullWidth
              value={student?.amount}
              onChange={(e) =>
                setStudent({ ...student, amount: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Address"
              type="text"
              fullWidth
              value={student?.address}
              onChange={(e) =>
                setStudent({ ...student, address: e.target.value })
              }
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Shift</InputLabel>
              <Select
                value={student?.shift}
                onChange={(e) =>
                  setStudent({ ...student, shift: e.target.value })
                }
              >
                {shifts.map((shift) => (
                  <MenuItem key={shift} value={shift}>
                    {shift}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel>Gender</InputLabel>
              <Select
                value={student?.gender}
                onChange={(e) =>
                  setStudent({ ...student, gender: e.target.value })
                }
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Date of Birth"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={student?.dob}
              onChange={(e) => setStudent({ ...student, dob: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Father's Name"
              type="text"
              fullWidth
              value={student?.fatherName}
              onChange={(e) =>
                setStudent({ ...student, fatherName: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Mother's Name"
              type="text"
              fullWidth
              value={student?.motherName}
              onChange={(e) =>
                setStudent({ ...student, motherName: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Contact No. 1"
              type="tel"
              fullWidth
              value={student?.contact1}
              onChange={(e) =>
                setStudent({ ...student, contact1: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Contact No. 2"
              type="tel"
              fullWidth
              value={student?.contact2}
              onChange={(e) =>
                setStudent({ ...student, contact2: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Aadhaar"
              type="text"
              fullWidth
              value={student?.aadhaar}
              onChange={(e) =>
                setStudent({ ...student, aadhaar: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Exam Preparation"
              type="text"
              fullWidth
              value={student?.examPreparation}
              onChange={(e) =>
                setStudent({ ...student, examPreparation: e.target.value })
              }
            />
          </Box>
          <Box mt={2}>
            <input
              accept="image/*"
              id="image-upload"
              type="file"
              onChange={handleImage}
              style={{ display: "none" }}
            />
            <label htmlFor="image-upload">
              <Button variant="contained" component="span">
                Upload Image
              </Button>
            </label>
            {fileError && <p style={{ color: "red" }}>{fileError}</p>}
            {imageBase64 && (
              <Avatar
                src={imageBase64}
                alt="Uploaded Photo"
                style={{ marginTop: 10 }}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              if (isEdit) {
                setEditDialogOpen(false);
                setStudentToEdit(null);
              } else {
                setAddDialogOpen(false);
                setNewStudent({
                  name: "",
                  reg: "",
                  email: "",
                  amount: "",
                  address: "",
                  shift: "",
                  gender: "",
                  dob: "",
                  fatherName: "",
                  motherName: "",
                  contact1: "",
                  contact2: "",
                  aadhaar: "",
                  examPreparation: "",
                  consent: "Agreed",
                });
              }
              setImageBase64("");
              setFileError("");
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            disabled={savingChanges}
          >
            {savingChanges ? (
              <CircularProgress size={24} />
            ) : isEdit ? (
              "Save"
            ) : (
              "Add"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

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
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FileDownload />}
            onClick={exportToExcel}
            sx={{ mr: 2 }}
          >
            Export to Excel
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<Add />}
            onClick={() => setAddDialogOpen(true)}
          >
            Add Student
          </Button>
        </Box>
      </Box>
      <DataGrid
        rows={filteredStudents}
        columns={columns}
        pageSize={30}
        rowsPerPageOptions={[10, 25, 50]}
        loading={loading}
        getRowId={(row) => row._id}
        disableSelectionOnClick
        sx={{
          "& .MuiDataGrid-root": { border: "1px solid #ddd" },
          "& .MuiDataGrid-cell": {
            borderRight: "1px solid #ddd",
            borderBottom: "1px solid #ddd",
            padding: "0 16px",
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
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
            "&:nth-of-type(odd)": {
              backgroundColor: "#f5f5f5",
            },
            "&:hover": {
              backgroundColor: "#e0e0e0",
            },
          },
          "& .MuiDataGrid-cell:focus": {
            outline: "none",
          },
        }}
      />
      <ConfirmationDialog
        open={deleteDialogOpen}
        handleClose={() => setDeleteDialogOpen(false)}
        handleConfirm={handleDelete}
      />
      {renderDialog(true)} {/* Edit dialog */}
      {renderDialog(false)} {/* Add dialog */}
      {renderCellDialog()} {/* Cell content dialog */}
    </Box>
  );
}