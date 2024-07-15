import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  TableSortLabel,
  Button,
  IconButton,
  TextField,
} from "@mui/material";
import { Search, Delete, Add, Edit } from "@mui/icons-material";
import {
  getBookingData,
  addBooking,
  deleteBooking,
  updateBooking,
  updateColor,
} from "../../../../services/Admin_services/admin_lib";
import BookingDialog from "./dialog";
import ConfirmationDialog from "./confirm"; // Import the ConfirmationDialog component
import LegendsFunctions from "../legend";
import { columnOrder } from "./constants";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Import the LoadingAnimation component

const StudentManagementTable = () => {
  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editFormData, setEditFormData] = useState(null);
  const [legends, setLegends] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // State for delete confirmation dialog
  const [deleteBookingId, setDeleteBookingId] = useState(null); // State to hold booking ID to delete
  const [updation, setupdation] = useState(0);
  const [loading, setLoading] = useState(true); // State to track loading state

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const bookings = await getBookingData();
        setData(bookings);
        setLoading(false); // Set loading to false once data is fetched
        // toast.success("Booking data fetched successfully!");
      } catch (error) {
        console.error("Error fetching booking data:", error);
        // toast.error("Error fetching booking data.");
      }
    };

    fetchBookingData();
  }, [updation]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    setData((prevData) =>
      [...prevData].sort((a, b) => {
        if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
        if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
        return 0;
      })
    );
  };

  const handleAddBooking = async (formData) => {
    try {
      await addBooking(formData);
      setOpenAddDialog(false);
      setupdation(!updation);
      toast.success("Booking added successfully!");
    } catch (error) {
      console.error("Error adding new booking:", error);
      toast.error("Error adding new booking.");
    }
  };

  const handleDeleteBooking = (bookingId) => {
    setDeleteBookingId(bookingId);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteBooking(deleteBookingId);
      setOpenDeleteDialog(false);
      setupdation(!updation);
      toast.success("Booking deleted successfully!");
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast.error("Error deleting booking.");
    }
  };

  const handleEditBooking = async (formData) => {
    try {
      await updateBooking(formData);
      setOpenEditDialog(false);
      setupdation(!updation);
      toast.success("Booking updated successfully!");
    } catch (error) {
      console.error("Error updating booking:", error);
      toast.error("Error updating booking.");
    }
  };

  const handleOpenEditDialog = (rowData) => {
    setEditFormData(rowData);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditFormData(null);
  };

  const handleColorChange = async (columnName, rowId) => {
    if (!selectedColor) return;

    try {
      const updatedData = data.map((item) => {
        if (item._id === rowId) {
          return {
            ...item,
            colors: {
              ...item.colors,
              [columnName]: selectedColor,
            },
          };
        }
        return item;
      });

      setData(updatedData);
      await updateColor(rowId, columnName, selectedColor);
      toast.success("Color updated successfully!");
    } catch (error) {
      console.error("Error updating color:", error);
      toast.error("Error updating color.");
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      {loading ? (
        "loading"
      ) : (
        <>
          <Box sx={{ flexGrow: 1, p: 2 }}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
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
                  startIcon={<Add />}
                  sx={{ ml: 2 }}
                  onClick={() => setOpenAddDialog(true)}
                >
                  Add Booking
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox />
                      </TableCell>
                      {columnOrder.map((key) => (
                        <TableCell key={key}>
                          <TableSortLabel
                            active={sortConfig.key === key}
                            direction={
                              sortConfig.key === key
                                ? sortConfig.direction
                                : "asc"
                            }
                            onClick={() => handleSort(key)}
                          >
                            {key}
                          </TableSortLabel>
                        </TableCell>
                      ))}
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data
                      .filter((item) =>
                        Object.values(item).some(
                          (value) =>
                            typeof value === "string" &&
                            value
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())
                        )
                      )
                      .map((item) => (
                        <TableRow key={item._id}>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedRows.includes(item._id)}
                              onChange={() =>
                                setSelectedRows((prevSelectedRows) =>
                                  prevSelectedRows.includes(item._id)
                                    ? prevSelectedRows.filter(
                                        (rowId) => rowId !== item._id
                                      )
                                    : [...prevSelectedRows, item._id]
                                )
                              }
                            />
                          </TableCell>
                          {columnOrder.map((key) => (
                            <TableCell
                              key={key}
                              onClick={() => handleColorChange(key, item._id)}
                              sx={{
                                backgroundColor:
                                  item.colors && item.colors[key]
                                    ? item.colors[key]
                                    : "inherit",
                                cursor: "pointer",
                              }}
                            >
                              {item[key]}
                            </TableCell>
                          ))}
                          <TableCell>
                            <IconButton
                              onClick={() => handleDeleteBooking(item._id)}
                            >
                              <Delete color="error" />
                            </IconButton>
                            <IconButton
                              onClick={() => handleOpenEditDialog(item)}
                            >
                              <Edit color="primary" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            <BookingDialog
              open={openAddDialog}
              handleClose={() => setOpenAddDialog(false)}
              handleSubmitForm={handleAddBooking}
              defaultValues={{}}
            />

            <BookingDialog
              open={openEditDialog}
              handleClose={handleCloseEditDialog}
              handleSubmitForm={handleEditBooking}
              defaultValues={editFormData}
            />

            {/* Confirmation dialog for delete action */}
            <ConfirmationDialog
              open={openDeleteDialog}
              handleClose={() => setOpenDeleteDialog(false)}
              handleConfirm={handleConfirmDelete}
            />

            {/* Toast container for notifications */}
            <ToastContainer />
          </Box>
          <LegendsFunctions
            legends={legends}
            setLegends={setLegends}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
          />
        </>
      )}
    </Box>
  );
};

export default StudentManagementTable;
