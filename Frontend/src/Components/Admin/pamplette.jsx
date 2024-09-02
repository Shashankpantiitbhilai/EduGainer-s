import React, { useState, useEffect, useContext } from "react";
import {
  Typography,
  Button,
  Container,
  Box,
  Grid,
  TextField,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  CircularProgress,
  CardMedia,
  Alert,
  Backdrop,
} from "@mui/material";
import { AdminContext } from "../../App";
import {
  addEvent,
  editEvent,
  deleteEvent,
  getAllEvents,
} from "../../services/Admin_services/admin_event";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB in bytes

function Pamplette() {
  const { adminSettings, updateAdminSettings } = useContext(AdminContext);

  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventFormLink, setEventFormLink] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [fileError, setFileError] = useState("");
  const [events, setEvents] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [loadingButtons, setLoadingButtons] = useState({});

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const events = await getAllEvents();
      setEvents(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      showSnackbar("Error fetching events", "error");
    } finally {
      setLoading(false);
    }
  };

  const setFileToBase64 = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImageBase64(reader.result);
    };
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file && file.size > MAX_FILE_SIZE) {
      setFileError("File size should not exceed 2 MB");
      return;
    }
    setFileError("");
    setFileToBase64(file);
  };

  const handleSave = async () => {
    try {
      setLoadingButtons({ ...loadingButtons, save: true });
      const eventData = {
        title: eventTitle,
        description: eventDescription,
        googleFormLink: eventFormLink,
        endDate: eventEndDate,
        image: imageBase64,
      };

      if (currentEvent) {
        await editEvent(currentEvent._id, eventData);
        showSnackbar("Event updated successfully", "success");
      } else {
        await addEvent(eventData);
        showSnackbar("Event added successfully", "success");
      }

      await fetchEvents();
      resetForm();
      setDialogOpen(false);
    } catch (error) {
      console.error("Error saving event:", error);
      showSnackbar("Error saving event", "error");
    } finally {
      setLoadingButtons({ ...loadingButtons, save: false });
    }
  };

  const handleDelete = async (eventId) => {
    setEventToDelete(eventId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setLoadingButtons({ ...loadingButtons, delete: true });
      await deleteEvent(eventToDelete);
      showSnackbar("Event deleted successfully", "success");
      await fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
      showSnackbar("Error deleting event", "error");
    } finally {
      setLoadingButtons({ ...loadingButtons, delete: false });
      setDeleteDialogOpen(false);
      setEventToDelete(null);
    }
  };

  const handleEdit = (event) => {
    setEventTitle(event.title);
    setEventDescription(event.description);
    setEventFormLink(event.googleFormLink);
    setEventEndDate(event.endDate || "");
    setImageBase64(event.imageBase64 || "");
    setCurrentEvent(event);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    resetForm();
  };

  const handleAddEvent = () => {
    resetForm();
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEventTitle("");
    setEventDescription("");
    setEventFormLink("");
    setEventEndDate("");
    setImageBase64("");
    setCurrentEvent(null);
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  return (
    <Box sx={{ backgroundColor: "#F0F8FF", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", color: "#1976d2" }}
          >
            Admin Event Settings
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddEvent}
          >
            Add Event
          </Button>
        </Box>

        <Grid container spacing={3}>
          {events?.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event._id}>
              <Card
                elevation={3}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {event.image && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={event.image.url}
                    alt={event.title}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {event.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {event.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    End Date: {new Date(event.endDate).toLocaleDateString()}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    href={event.googleFormLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ mt: 1 }}
                  >
                    Google Form
                  </Button>
                </CardContent>
                <CardActions>
                  <IconButton onClick={() => handleEdit(event)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(event._id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            {currentEvent ? "Edit Event" : "Add New Event"}
          </DialogTitle>
          <DialogContent>
            <TextField
              label="Event Title"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <TextField
              label="Event Description"
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              variant="outlined"
              multiline
              rows={4}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Google Form Link"
              value={eventFormLink}
              onChange={(e) => setEventFormLink(e.target.value)}
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <TextField
              label="End Date"
              type="date"
              value={eventEndDate}
              onChange={(e) => setEventEndDate(e.target.value)}
              variant="outlined"
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" gutterBottom>
                Upload Pamphlet:
              </Typography>
              <input
                accept="image/*"
                type="file"
                onChange={handleImage}
                style={{ display: "none" }}
                id="raised-button-file"
              />
              <label htmlFor="raised-button-file">
                <Button variant="contained" component="span">
                  Choose File
                </Button>
              </label>
              {fileError && (
                <Typography
                  color="error"
                  variant="caption"
                  display="block"
                  sx={{ mt: 1 }}
                >
                  {fileError}
                </Typography>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              color="primary"
              variant="contained"
              disabled={loadingButtons.save}
            >
              {loadingButtons.save ? (
                <CircularProgress size={24} />
              ) : currentEvent ? (
                "Update Event"
              ) : (
                "Add Event"
              )}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this event?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              color="error"
              variant="contained"
              disabled={loadingButtons.delete}
            >
              {loadingButtons.delete ? (
                <CircularProgress size={24} />
              ) : (
                "Delete"
              )}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity={snackbarSeverity}
            variant="filled"
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>

        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Container>
    </Box>
  );
}

export default Pamplette;
