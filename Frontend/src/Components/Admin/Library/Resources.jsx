import React, { useState, useEffect } from "react";
import Chip from "@mui/material/Chip";
import {
  Container,
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  LinearProgress,
  Autocomplete,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import SaveIcon from "@mui/icons-material/Save";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {
  fileUpload,
  fetchLibResources,
  editLibResources,
  deleteLibResource,
} from "../../../services/Admin_services/adminUtils";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [resources, setResources] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [newResource, setNewResource] = useState({
    name: "",
    tags: [],
    file: null,
  });

  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [editModeId, setEditModeId] = useState(null);

  const [resourceUpdated, setResourceUpdated] = useState(false);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const data = await fetchLibResources();
        setResources(data);
      } catch (error) {
        // console.error("Error fetching resources:", error);
      }
    };
    // console.log(resourceUpdated);

    fetchResources();
  }, [resourceUpdated]);
  const handleEdit = async (id, data) => {
    setLoading(true);
    try {
      await editLibResources(id, data);
      const updatedResources = resources.map((resource) =>
        resource._id === id ? { ...resource, ...data } : resource
      );
      setResources(updatedResources);
    } catch (error) {
      // console.error("Error editing resource:", error);
    } finally {
      setLoading(false);
      setEditModeId(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteLibResource(id);
      setResourceUpdated(!resourceUpdated);
      toast.success("Resource deleted successfully");
      //  setResources(resources.filter((resource) => resource._id !== id));
    } catch (error) {
      // console.error("error in deleting", error);
      throw error;
    }
  };

  const handleFileChange = (event) => {
    setNewResource({ ...newResource, file: event.target.files[0] });
  };

  const handleUpload = async () => {
    if (!newResource.file) return;
    try {
      const response = await fileUpload(newResource, (progressEvent) => {
        const total = progressEvent.total;
        const current = progressEvent.loaded;
        const percentCompleted = Math.round((current / total) * 100);
        setUploadProgress(percentCompleted);
      });

      toast.success("Resource uploaded successfully");
      setResources([
        ...resources,
        {
          _id: resources.length + 1,
          name: newResource.name,
          date: new Date().toISOString().split("T")[0],
          tags: newResource.tags,
          url: response.url,
        },
      ]);

      setNewResource({ name: "", tags: [], file: null });
      setOpen(false);
      setUploadProgress(0);
      // console.log(resourceUpdated);
      setResourceUpdated(!resourceUpdated);
      // console.log(resourceUpdated);
    } catch (error) {
      // console.error("Error uploading file:", error);
      toast.error("Failed to upload resource");
    }
  };

  const handleSearch = (event, value) => {
    setSearchQuery(value);
  };

  const enterEditMode = (id) => {
    setEditModeId(id);
  };

  const isEditMode = (id) => {
    return id === editModeId;
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 150 },
    { field: "name", headerName: "Name", width: 200, editable: true },
    { field: "tags", headerName: "Tags", width: 250 },
    {
      field: "url",
      headerName: "View",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          onClick={() => window.open(params.value, "_blank")}
          style={{
            textTransform: "none",
            fontSize: "0.875rem",
            background: "orange",
          }}
        >
          View File
        </Button>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <div>
          {isEditMode(params.row._id) ? (
            <IconButton
              onClick={() => handleEdit(params.row._id, params.row)}
              style={{ color: "lightgreen" }}
            >
              <SaveIcon />
            </IconButton>
          ) : (
            <IconButton
              onClick={() => enterEditMode(params.row._id)}
              style={{ color: "red" }}
            >
              <EditIcon />
            </IconButton>
          )}
          <IconButton
            onClick={() => handleDelete(params.row._id)}
            style={{ color: "blue" }}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <>
      <Container maxWidth="lg">
        <Box
          centered
          sx={{
            margin: 9,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 9,
          }}
        >
          <Button
            variant="contained"
            style={{ background: "green" }}
            startIcon={<UploadFileIcon />}
            onClick={() => setOpen(true)}
          >
            Upload New Resource
          </Button>
        </Box>
        <Box>
          <Autocomplete
            multiple
            id="search-bar"
            options={resources}
            getOptionLabel={(option) => option.name}
            onChange={handleSearch}
            filterSelectedOptions
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  key={index}
                  variant="outlined"
                  label={option.name}
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Search for resources"
                placeholder="Type to search..."
                fullWidth
                inputProps={{
                  ...params.inputProps,
                  "aria-label": "Search for resources",
                }}
              />
            )}
          />

          <div style={{ height: 300, width: "100%" }}>
            <DataGrid
              rows={resources}
              columns={columns}
              autoHeight
              checkboxSelection
              getRowId={(row) => row._id}
            />
          </div>
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
                options = {[
  "Science",
  "Maths",
  "Literature",
  "History",
  "Civics",
  "Geography",
  "English",
  "Sanskrit",
  "General Studies",
  "Arts",
  "Commerce",
  "Physics",
  "Chemistry",
  "Biology",
  "Hindi",
  "Computer Science",
  "Economics",
  "Psychology",
  "Sociology",
  "Philosophy",
  "Political Science",
  "Environmental Science",
  "Statistics",
  "Foreign Languages",
  "Physical Education",
  "Music",
  "Drama",
  "Visual Arts",
  "Home Science",
  "Accounting",
  "Business Studies",
  "Engineering Graphics",
  "Biotechnology",
  "Geology",
  "Astronomy",
  "Anthropology",
  "Linguistics",
  "Media Studies",
  "Information Technology",
  "Artificial Intelligence",
  "Robotics",
  "Nutrition and Dietetics",
  "Agriculture",
  "Animal Husbandry",
  "Horticulture",
  "Archaeology"
]}
               
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
              {uploadProgress > 0 && (
                <LinearProgress variant="determinate" value={uploadProgress} />
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
        </Box>
      </Container>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
};

export default App;
