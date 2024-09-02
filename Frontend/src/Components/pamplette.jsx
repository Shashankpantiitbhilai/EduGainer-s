import React, { useState, useEffect, useContext } from "react";
import {
  Typography,
  Button,
  Container,
  Box,
  Grid,
  TextField,
} from "@mui/material";
import { AdminContext } from "../App";
import {
  addEvent,
  editEvent,
  deleteEvent,
  getAllEvents,
} from "../services/Admin_services/admin_event"; // Adjust the import path if necessary

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB in bytes

function Pamplette() {
  const { adminSettings, updateAdminSettings } = useContext(AdminContext);

  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventFormLink, setEventFormLink] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [fileError, setFileError] = useState("");
  const [existingEvent, setExistingEvent] = useState(null);

  useEffect(() => {
    // Fetch existing event data
    const fetchEvent = async () => {
      try {
        const events = await getAllEvents();
        if (events.length > 0) {
          setExistingEvent(events[0]); // Assuming you want to edit the first event if multiple exist
          setEventTitle(events[0].title);
          setEventDescription(events[0].description);
          setEventFormLink(events[0].googleFormLink);
          setImageBase64(events[0].imageBase64 || ""); // Set the Base64 if available
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvent();
  }, []);

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
      const eventData = {
        title: eventTitle,
        description: eventDescription,
        googleFormLink: eventFormLink,
        imageBase64, // Include Base64 image
      };
      console.log(eventData);
      if (existingEvent) {
        // Edit existing event
        await editEvent(existingEvent._id, eventData);
      } else {
        // Add new event
        await addEvent(eventData);
      }

      // Optionally refresh the events list or admin settings
      const events = await getAllEvents();
      if (events.length > 0) {
        setExistingEvent(events[0]);
      }

      // Reset file input
      setImageBase64("");
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

    const handleDelete = async () => {
      console.log(existingEvent,"eeee")
    if (existingEvent) {
      try {
        await deleteEvent(existingEvent._id);
        setExistingEvent(null);
        // Optionally refresh the events list or admin settings
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
  };

  return (
    <Box sx={{ backgroundColor: "#F0F8FF", padding: 4 }}>
      <Container maxWidth="md">
        <Typography variant="h4" sx={{ mb: 4 }}>
          Admin Event Settings
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Event Title"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Event Description"
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              variant="outlined"
              multiline
              rows={4}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Google Form Link"
              value={eventFormLink}
              onChange={(e) => setEventFormLink(e.target.value)}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">Upload Pamphlete:</Typography>
            <input type="file" onChange={handleImage} />
            {fileError && <Typography color="error">{fileError}</Typography>}
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              fullWidth
            >
              {existingEvent ? "Update Event" : "Add Event"}
            </Button>
          </Grid>
          {existingEvent && (
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleDelete}
                fullWidth
              >
                Delete Event
              </Button>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
}

export default Pamplette;
