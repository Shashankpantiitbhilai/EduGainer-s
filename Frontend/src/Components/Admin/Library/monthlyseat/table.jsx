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
  Grid,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Search, Delete, Add, Edit, GetApp } from "@mui/icons-material";
import {
  getBookingData,
  addBooking,
  deleteBooking,
  updateBooking,
  updateColor,
} from "../../../../services/Admin_services/admin_lib";
import BookingDialog from "./dialog";
import ConfirmationDialog from "./confirm";
import LegendsFunctions from "./legend";
import { columnOrder } from "./constants";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ExcelJS from "exceljs";
import Calender from "./calender"
const months = [
  { display: "January", value: "1" },
  { display: "February", value: "2" },
  { display: "March", value: "3" },
  { display: "April", value: "4" },
  { display: "May", value: "5" },
  { display: "June", value: "6" },
  { display: "July", value: "7" },
  { display: "August", value: "8" },
  { display: "September", value: "9" },
  { display: "October", value: "10" },
  { display: "November", value: "11" },
  { display: "December", value: "12" },
];

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
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteBookingId, setDeleteBookingId] = useState(null);
  const [updation, setupdation] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    const d = new Date();
    const currentMonth = d.getMonth() + 1;
    setSelectedMonth(currentMonth.toString());
  }, []);

  useEffect(() => {
    fetchBookingData(selectedMonth);
  }, [selectedMonth, updation]);

  const fetchBookingData = async (month) => {
    setLoading(true);
    try {
      const bookings = await getBookingData(month);
      const flattenedBookings = bookings.map((booking) => ({
        ...booking,
        razorpay_order_id: booking.Payment_detail?.razorpay_order_id || "",
        razorpay_payment_id: booking.Payment_detail?.razorpay_payment_id || "",
      }));
      setData(flattenedBookings);
    } catch (error) {
      // toast.error("Error fetching booking data.");
    } finally {
      setLoading(false);
    }
  };

  const handleMonthChange = (event) => {
    const selectedMonth = months.find(
      (month) => month.display === event.target.value
    );
    setSelectedMonth(selectedMonth ? selectedMonth.value : "");
  };

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
    } catch (error) {
      // console.error("Error updating color:", error);
    }
  };

  const handleExport = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Bookings");

    worksheet.addRow(columnOrder);

    data.forEach((item, rowIndex) => {
      const row = worksheet.addRow(columnOrder.map((key) => item[key]));

      if (item.colors) {
        Object.entries(item.colors).forEach(([key, color]) => {
          const colIndex = columnOrder.indexOf(key);
          if (colIndex !== -1) {
            const cell = row.getCell(colIndex + 1);
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: color.replace("#", "") },
            };
          }
        });
      }
    });

    worksheet.columns.forEach((column, index) => {
      let maxLength = columnOrder[index].length;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = maxLength < 10 ? 10 : maxLength + 2;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "bookings_export.xlsx";
    link.click();
    URL.revokeObjectURL(link.href);

    toast.success("Booking Data exported successfully ");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {loading ? (
        "Loading..."
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={10}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <TextField
                    label="Search"
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{ endAdornment: <Search /> }}
                  />
                  <FormControl sx={{ ml: 2, minWidth: 120 }}>
                    <InputLabel id="month-select-label">Month</InputLabel>
                    <Select
                      labelId="month-select-label"
                      id="month-select"
                      value={
                        months.find((month) => month.value === selectedMonth)
                          ?.display || ""
                      }
                      label="Month"
                      onChange={handleMonthChange}
                    >
                      <MenuItem value="">
                        <em>All</em>
                      </MenuItem>
                      {months.map((month) => (
                        <MenuItem key={month.value} value={month.display}>
                          {month.display}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<GetApp />}
                  onClick={handleExport}
                >
                  Export to Excel
                </Button>
              </Box>
              <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader sx={{ border: "1px solid #ddd" }}>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        padding="checkbox"
                        sx={{
                          backgroundColor: "orange",
                          color: "white",
                          fontWeight: "bold",
                          height: "40px",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      ></TableCell>
                      {columnOrder.map((key) => (
                        <TableCell
                          key={key}
                          sx={{
                            backgroundColor: "orange",
                            color: "white",
                            fontWeight: "bold",
                            height: "40px",
                            position: "sticky",
                            top: 0,
                            zIndex: 1,
                          }}
                        >
                          <TableSortLabel
                            active={sortConfig.key === key}
                            direction={
                              sortConfig.key === key
                                ? sortConfig.direction
                                : "asc"
                            }
                            onClick={() => handleSort(key)}
                            sx={{
                              "&.MuiTableSortLabel-root": {
                                color: "white",
                              },
                              "&.MuiTableSortLabel-root:hover": {
                                color: "white",
                              },
                              "&.Mui-active": {
                                color: "white",
                              },
                              "& .MuiTableSortLabel-icon": {
                                color: "white !important",
                              },
                            }}
                          >
                            {key}
                          </TableSortLabel>
                        </TableCell>
                      ))}
                      <TableCell
                        sx={{
                          backgroundColor: "orange",
                          color: "white",
                          fontWeight: "bold",
                          height: "40px",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        Actions
                      </TableCell>
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
                        <TableRow
                          key={item._id}
                          sx={{ height: "40px" }}
                        >
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
                                height: "40px",
                              }}
                            >
                              {item[key]}
                            </TableCell>
                          ))}
                          <TableCell>
                            <IconButton
                              onClick={() => handleDeleteBooking(item._id)}
                              size="small"
                            >
                              <Delete color="error" fontSize="small" />
                            </IconButton>
                            <IconButton
                              onClick={() => handleOpenEditDialog(item)}
                              size="small"
                            >
                              <Edit color="primary" fontSize="small" />
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

            <ConfirmationDialog
              open={openDeleteDialog}
              handleClose={() => setOpenDeleteDialog(false)}
              handleConfirm={handleConfirmDelete}
            />

            <ToastContainer />
          </Grid>
          <Grid item xs={2}>
            <LegendsFunctions
              legends={legends}
              setLegends={setLegends}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              />
              <Calender/>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default StudentManagementTable;
