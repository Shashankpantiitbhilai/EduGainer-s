import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import {
  addLegend as addLegendService,
  getLegends as getLegendsService,
  deleteLegend as deleteLegendService,
} from "../../../services/Admin_services/admin_lib";

const LegendsFunctions = ({
  legends,
  setLegends,
  selectedColor,
  setSelectedColor,
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLegendId, setDeleteLegendId] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

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

  const handleLegendSubmit = async (formData) => {
    try {
      const newLegend = {
        name: formData.newLegendName,
        colorCode: formData.newLegendColor,
      };

      const addedLegend = await addLegendService(newLegend);
      setLegends([...legends, addedLegend]);

      reset();
      setOpenDialog(false);
    } catch (error) {
      console.error("Error adding new legend:", error);
    }
  };

  const handleDeleteLegend = async () => {
    try {
      await deleteLegendService(deleteLegendId);
      setLegends(legends.filter((legend) => legend._id !== deleteLegendId));
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting legend:", error);
    }
  };

  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        maxHeight: "calc(100vh - 64px)",
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
              justifyContent: "space-between",
              mb: 1,
              cursor: "pointer",
            }}
            onClick={() => setSelectedColor(legend.colorCode)}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
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
              <Typography variant="body2">{legend.name}</Typography>
            </Box>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
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

      {/* Add Legend Dialog */}
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

      {/* Delete Legend Dialog */}
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
    </Box>
  );
};

export default LegendsFunctions;
