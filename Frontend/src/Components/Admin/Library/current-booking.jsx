// Import necessary modules from MUI and MUI icons
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  TableSortLabel,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { Search, Delete } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import {
  getBookingData,
  updateColor,
  addLegend as addLegendService,
  getLegends as getLegendsService,
  deleteLegend as deleteLegendService, // Update import for deleteLegendService
} from "../../../services/Admin_services/admin_lib"; // Adjust import paths as per your project structure

const columnOrder = [
  "Reg",
  "Name",
  "Seat",
  "Date",
  "Cash",
  "Online",
  "Shift",
  "Fee",
  "Remarks",
  "Status",
  "_id",
];

const StudentManagementTable = () => {
  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("");
  const [legends, setLegends] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLegendId, setDeleteLegendId] = useState(""); // State to store delete legend id

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const bookings = await getBookingData();
        const updatedBookings = bookings.map((booking) => ({
          ...booking,
          colors: booking.colors || {},
        }));
        setData(updatedBookings);
      } catch (error) {
        console.error("Error fetching booking data:", error);
      }
    };

    fetchBookingData();
  }, []);

  useEffect(() => {
    const fetchLegends = async () => {
      try {
        const legendsData = await getLegendsService();
        setLegends(legendsData.legends);
      } catch (error) {
        console.error("Error fetching legends:", error);
      }
    };

    fetchLegends();
  }, []);

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

  const handleColorChange = async (color, columnName, rowId) => {
    setSelectedColumn(columnName);
    setSelectedColor(color);
    try {
      const updatedData = data.map((item) => {
        if (item._id === rowId) {
          const updatedColors = {
            ...item.colors,
            [columnName]: color,
          };
          return {
            ...item,
            colors: updatedColors,
          };
        }
        return item;
      });

      setData(updatedData);

      await updateColor(rowId, columnName, color);
    } catch (error) {
      console.error("Error updating color:", error);
    }
  };

  const handleRowCheckboxChange = (id) => {
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.includes(id)
        ? prevSelectedRows.filter((rowId) => rowId !== id)
        : [...prevSelectedRows, id]
    );
  };

  const handleLegendSubmit = async (formData) => {
    try {
      const newLegend = {
        name: formData.newLegendName,
        colorCode: formData.newLegendColor,
      };

      await addLegendService(newLegend);
      setLegends([...legends, newLegend]);

      reset();

      setOpenDialog(false);
    } catch (error) {
      console.error("Error adding new legend:", error);
    }
  };

  const handleDeleteLegend = async () => {
    try {
      console.log(deleteLegendId)
      await deleteLegendService(deleteLegendId);
      setLegends(legends.filter((legend) => legend._id !== deleteLegendId));
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting legend:", error);
    }
  };

  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={8}>
        <Box sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Student Management
          </Typography>
          <Paper sx={{ p: 2, mb: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Search sx={{ mr: 1 }} />
              <TextField
                label="Search"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
              />
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox"></TableCell>
                    {columnOrder.map((key) => (
                      <TableCell
                        key={key}
                        sortDirection={
                          sortConfig.key === key ? sortConfig.direction : false
                        }
                        onClick={() => handleSort(key)}
                      >
                        <TableSortLabel
                          active={sortConfig.key === key}
                          direction={
                            sortConfig.key === key
                              ? sortConfig.direction
                              : "asc"
                          }
                        >
                          {key}
                        </TableSortLabel>
                      </TableCell>
                    ))}
                    <TableCell>Delete</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedRows.includes(item._id)}
                          onChange={() => handleRowCheckboxChange(item._id)}
                        />
                      </TableCell>
                      {columnOrder.map((key) => (
                        <TableCell
                          key={key}
                          onClick={() =>
                            handleColorChange(selectedColor, key, item._id)
                          }
                          sx={{
                            backgroundColor:
                              selectedRows.includes(item._id) &&
                              selectedColumn === key
                                ? selectedColor
                                : item.colors && item.colors[key]
                                ? item.colors[key]
                                : "inherit",
                          }}
                        >
                          {item[key]}
                        </TableCell>
                      ))}
                      <TableCell>
                        <IconButton
                          onClick={() => {
                            setDeleteLegendId(item._id);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Delete color="error" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </Grid>
      <Grid item xs={12} md={4}>
        <Box
          sx={{
            position: "sticky",
            top: 0,
            maxHeight: "calc(100vh - 64px)", // Adjust as per your layout
            overflowY: "auto",
            p: 2,
            bgcolor: "background.paper",
          }}
        >
          <Typography variant="h6">Color Legend:</Typography>
          <Box sx={{ display: "flex", flexDirection: "column", mt: 1 }}>
            {legends.map((legend) => (
              <Box
                key={legend._id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between", // Align items and place delete icon at the end
                  mb: 1,
                  cursor: "pointer",
                }}
                onClick={() => setSelectedColor(legend.colorCode)}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      mr: 1,
                      backgroundColor:
                        selectedColor === legend.colorCode
                          ? selectedColor
                          : legend.colorCode,
                      border: "1px solid #ccc",
                    }}
                  />
                  <Typography variant="body2">{`${legend.name}`}</Typography>
                </Box>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents row click event
                    setDeleteLegendId(legend._id);
                    setDeleteDialogOpen(true);
                  }}
                >
                  <Delete color="error" />
                </IconButton>
              </Box>
            ))}
          </Box>

          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenDialog(true)}
            >
              Add Legend
            </Button>
          </Box>
        </Box>
      </Grid>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <form onSubmit={handleSubmit(handleLegendSubmit)}>
          <DialogTitle>Add Legend</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="newLegendName"
              label="Legend Name"
              type="text"
              fullWidth
              {...register("newLegendName", { required: true })}
              error={!!errors.newLegendName}
              helperText={errors.newLegendName ? "Name is required" : ""}
            />
            <TextField
              margin="dense"
              id="newLegendColor"
              label="Legend Color"
              type="color"
              fullWidth
              {...register("newLegendColor", { required: true })}
              error={!!errors.newLegendColor}
              helperText={errors.newLegendColor ? "Color is required" : ""}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Legend</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this legend?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteLegend}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default StudentManagementTable;
