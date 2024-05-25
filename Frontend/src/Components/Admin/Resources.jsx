import React, { useState } from "react";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  Typography,
  LinearProgress,
  Autocomplete,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { fileUpload } from "../../services/Admin_services/adminUtils";

const App = () => {
  const [resources, setResources] = useState([
    {
      id: 1,
      name: "Resource Name",
      date: "2023-01-01",
      tags: ["Tag1", "Tag2"],
      url: "",
    },
    {
      id: 2,
      name: "Resource Name 2",
      date: "2023-01-02",
      tags: ["Tag3"],
      url: "",
    },
    {
      id: 3,
      name: "Resource Name 3",
      date: "2023-01-03",
      tags: ["Tag4", "Tag5"],
      url: "",
    },
  ]);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [newResource, setNewResource] = useState({
    name: "",
    tags: [],
    file: null,
  });
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleEdit = (id) => {
    // Edit functionality here
  };

  const handleDelete = (id) => {
    setResources(resources.filter((resource) => resource.id !== id));
  };

  const handleFileChange = (event) => {
    setNewResource({ ...newResource, file: event.target.files[0] });
  };

  const handleUpload = async () => {
    if (!newResource.file) return;
    console.log(newResource);
    try {
      const response = await fileUpload(newResource, (progressEvent) => {
        const total = progressEvent.total;
        const current = progressEvent.loaded;
        const percentCompleted = Math.round((current / total) * 100);
        setUploadProgress(percentCompleted);
      });

      setResources([
        ...resources,
        {
          id: resources.length + 1,
          name: newResource.name,
          date: new Date().toISOString().split("T")[0],
          tags: newResource.tags,
          url: response.data.url, // Assuming response contains the file URL
        },
      ]);
      setNewResource({ name: "", tags: [], file: null });
      setOpen(false);
      setUploadProgress(0);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleSearch = (event, value) => {
    setSearchQuery(value);
  };

  const filteredResources = resources.filter((resource) =>
    resource.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container>
      <Box my={4}>
        <Typography variant="h4" gutterBottom>
          Resource List
        </Typography>
        <Autocomplete
          freeSolo
          options={resources.map((resource) => resource.name)}
          onInputChange={handleSearch}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search for a resource"
              variant="outlined"
              fullWidth
            />
          )}
        />
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell>File</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredResources.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell>{resource.name}</TableCell>
                  <TableCell>{resource.date}</TableCell>
                  <TableCell>{resource.tags.join(", ")}</TableCell>
                  <TableCell>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View File
                    </a>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => handleEdit(resource.id)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDelete(resource.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box my={4}>
        <Button
          variant="contained"
          startIcon={<UploadFileIcon />}
          onClick={() => setOpen(true)}
        >
          Upload New Resource
        </Button>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Upload New Resource</DialogTitle>
          <DialogContent>
            <TextField
              label="Resource Title"
              variant="outlined"
              fullWidth
              margin="normal"
              value={newResource.name}
              onChange={(e) =>
                setNewResource({ ...newResource, name: e.target.value })
              }
            />
            <Autocomplete
              multiple
              options={["Tag1", "Tag2", "Tag3", "Tag4", "Tag5"]}
              value={newResource.tags}
              onChange={(event, newValue) =>
                setNewResource({ ...newResource, tags: newValue })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Tags"
                  margin="normal"
                  fullWidth
                />
              )}
            />
            <Button
              variant="contained"
              component="label"
              startIcon={<UploadFileIcon />}
              fullWidth
            >
              Select File
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
            {newResource.file && (
              <Typography variant="body1" mt={2}>
                File name: {newResource.file.name}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              onClick={handleUpload}
              disabled={!newResource.name || !newResource.file}
            >
              Upload
            </Button>
          </DialogActions>
        </Dialog>
        <Box mt={2}>
          <Typography variant="body1">Upload Progress:</Typography>
          <LinearProgress variant="determinate" value={uploadProgress} />
        </Box>
      </Box>
    </Container>
  );
};

export default App;
