import React, { useState, useEffect } from "react";
import {
  getAllClasses,
  addClass,
  editClass,
  deleteClass,
} from "../../../services/Admin_services/admin_classes"; // Adjust path accordingly
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  IconButton,
  CircularProgress,
  Typography,
  Paper,
  Container,
  Box,
  Divider,
  Card,
  CardContent,
  Chip,
  Avatar,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

const AdminBatches = () => {
  const [batches, setBatches] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState("");
  const [batchToDelete, setBatchToDelete] = useState(null);
  const [openWarningDialog, setOpenWarningDialog] = useState(false);
  const [error, setError] = useState(null); // Error state
  const [currentBatch, setCurrentBatch] = useState({
    id: null,
    name: "",
    duration: "",
    facultyName: "",
    description: "",
    timing: "",
    contents: [],
    additionalDetails: "",
    image: {
      url: "",
      publicId: "",
    },
  });

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        const classes = await getAllClasses();
        setBatches(classes);
      } catch (error) {
        console.error("Error fetching classes:", error);
        setError("Error fetching classes.");
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const handleOpenDialog = (batch = null) => {
    if (batch) {
      setCurrentBatch(batch);
      setImagePreview(null);
    } else {
      setCurrentBatch({
        id: null,
        name: "",
        duration: "",
        facultyName: "",
        description: "",
        timing: "",
        contents: [],
        additionalDetails: "",
        image: { url: "", publicId: "" },
      });
      setImagePreview(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentBatch((prev) => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (e) => {
    const contentsArray = e.target.value.split(",");
    setCurrentBatch((prev) => ({ ...prev, contents: contentsArray }));
  };

  const setFileToBase64 = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImageBase64(reader.result);
    };
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImagePreview(URL.createObjectURL(file));
    setFileToBase64(file);
  };

  const handleSubmit = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append("name", currentBatch.name);
    formData.append("duration", currentBatch.duration);
    formData.append("facultyName", currentBatch.facultyName);
    formData.append("description", currentBatch.description);
      formData.append("timing", currentBatch.timing);
       formData.append("amount", currentBatch.amount);
    formData.append("contents", currentBatch.contents.join(","));
    formData.append("additionalDetails", currentBatch.additionalDetails);
    if (imageBase64) {
      formData.append("image", imageBase64);
    }

    try {
      if (currentBatch._id) {
        await editClass(currentBatch._id, formData);
        setBatches((prev) =>
          prev.map((b) => (b._id === currentBatch._id ? currentBatch : b))
        );
      } else {
        const newBatch = await addClass(formData);
        setBatches((prev) => [...prev, newBatch]);
      }
    } catch (error) {
      console.error("Error submitting class:", error);
      setError("Error submitting class.");
    } finally {
      setLoading(false);
      handleCloseDialog();
    }
  };

  const handleDeleteClick = (id) => {
    setBatchToDelete(id);
    setOpenWarningDialog(true);
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      await deleteClass(batchToDelete);
      setBatches((prev) => prev.filter((b) => b._id !== batchToDelete));
    } catch (error) {
      console.error("Error deleting class:", error);
      setError("Error deleting class.");
    } finally {
      setLoading(false);
      setOpenWarningDialog(false);
    }
  };

  const handleCancelDelete = () => {
    setOpenWarningDialog(false);
    setBatchToDelete(null);
  };

  const handleCloseError = () => {
    setError(null); // Clear the error state
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to Admin Classes Panel
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Manage your classes efficiently from this dashboard.
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">Class Management</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Class
          </Button>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {loading ? (
          <CircularProgress />
        ) : batches.length === 0 ? (
          <Typography color="text.secondary" align="center">
            No classes added yet. Click 'Add Class' to get started.
          </Typography>
        ) : (
          <List>
            {batches.map((batch) => (
              <Card key={batch.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                  >
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6">{batch.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        facultyName: {batch.facultyName} - Timing:{" "}
                                    {batch.timing} - Duration: {batch.duration} - Fee:{""}
                                     {batch.amount} 
                      </Typography>
                      <Chip
                        label={`Contents: ${batch.contents.join(", ")}`}
                        size="small"
                        color="primary"
                        sx={{ mt: 1 }}
                      />
                    </Box>
                    <Box>
                      <IconButton
                        aria-label="edit"
                        onClick={() => handleOpenDialog(batch)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        onClick={() => handleDeleteClick(batch._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  {batch?.image && batch.image.url && (
                    <Box sx={{ mt: 2 }}>
                      <Avatar
                        alt={batch.name}
                        src={batch.image.url}
                        sx={{ width: 100, height: 100 }}
                      />
                    </Box>
                  )}
                </CardContent>
              </Card>
            ))}
          </List>
        )}
      </Paper>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {currentBatch.id ? "Edit Class" : "Add Class"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Class Name"
            type="text"
            fullWidth
            variant="outlined"
            value={currentBatch.name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="facultyName"
            label="facultyName "
            type="text"
            fullWidth
            variant="outlined"
            value={currentBatch.facultyName}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={currentBatch.description}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="timing"
            label="Timing"
            type="text"
            fullWidth
            variant="outlined"
            value={currentBatch.timing}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="amount"
            label="amount"
            type="number"
            fullWidth
            variant="outlined"
            value={currentBatch.amount}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="duration"
            label="Duration"
            type="text"
            fullWidth
            variant="outlined"
            value={currentBatch.duration}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="contents"
            label="Contents (comma-separated)"
            type="text"
            fullWidth
            variant="outlined"
            value={currentBatch.contents.join(",")}
            onChange={handleContentChange}
          />
          <TextField
            margin="dense"
            name="additionalDetails"
            label="Additional Details"
            type="text"
            fullWidth
            variant="outlined"
            value={currentBatch.additionalDetails}
            onChange={handleInputChange}
          />
          <Box mt={2}>
            <Button variant="contained" component="label">
              Upload Image
              <input
                type="file"
                hidden
                onChange={handleImageChange}
                accept="image/*"
              />
            </Button>
            {imagePreview && (
              <Box mt={2}>
                <Avatar
                  alt="Preview"
                  src={imagePreview}
                  sx={{ width: 100, height: 100 }}
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openWarningDialog} onClose={handleCancelDelete}>
        <DialogTitle>Are you sure you want to delete this class?</DialogTitle>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminBatches;
