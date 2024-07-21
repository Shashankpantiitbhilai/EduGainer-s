import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
} from "@mui/material";
import { styled } from "@mui/system";
import { Edit as EditIcon, Save as SaveIcon } from "@mui/icons-material";
import { useParams } from "react-router-dom";

import { updateUserDetails } from "../../services/utils";
import { AdminContext } from "../../App";

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 800,
  margin: "auto",
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  [theme.breakpoints.down("sm")]: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(20),
  height: theme.spacing(20),
  margin: "auto",
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    width: theme.spacing(15),
    height: theme.spacing(15),
  },
}));

const FileInput = styled("input")({
  display: "none",
});

const Profile = () => {
  const { IsUserLoggedIn } = useContext(AdminContext);
  const { id } = useParams();
  const [user, setUser] = useState({
    username: "",
    firstName: "",
    lastName: "",
    address: "",
    bio: "",
    photoUpload: "",
    mobile: "",
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageBase64, setImageBase64] = useState("");
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    fetchUserDetails(id);
  }, []);

  const fetchUserDetails = async (id) => {
    try {
      setUser(IsUserLoggedIn);
    } catch (error) {
      setError("Failed to fetch user data.");
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const setFileToBase64 = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImageBase64(reader.result);
      setUser((prevUser) => ({ ...prevUser, photoUpload: reader.result }));
    };
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setFileToBase64(file);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const updatedUser = {
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
        bio: user.bio,
        image: imageBase64,
      };
      const response = await updateUserDetails(id, updatedUser);
      setUser(response);
      setEditing(false);
      setError(null);
      setSnackbar({
        open: true,
        message: "Profile updated successfully!",
        severity: "success",
      });
    } catch (error) {
      setError("Failed to save user data.");
      setSnackbar({
        open: true,
        message: "Failed to update profile.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      {IsUserLoggedIn && (
        <StyledCard elevation={3}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box textAlign="center">
                  <StyledAvatar src={user.photoUpload} alt={user.firstName} />
                  <FileInput
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                    disabled={!editing}
                    id="photo-upload-input"
                  />
                  <label htmlFor="photo-upload-input">
                    <Button
                      variant="outlined"
                      color="primary"
                      component="span"
                      disabled={!editing || loading}
                      startIcon={<EditIcon />}
                    >
                      Change Photo
                    </Button>
                  </label>
                </Box>
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography variant="h4" gutterBottom>
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography variant="body1" color="textSecondary" paragraph>
                  {user.username}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="firstName"
                      label="First Name"
                      value={user.firstName}
                      variant="outlined"
                      disabled={!editing}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="lastName"
                      label="Last Name"
                      value={user.lastName}
                      variant="outlined"
                      disabled={!editing}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="address"
                      label="Address"
                      value={user.address}
                      variant="outlined"
                      disabled={!editing}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="bio"
                      label="Bio"
                      value={user.bio}
                      variant="outlined"
                      multiline
                      rows={3}
                      disabled={!editing}
                      onChange={handleInputChange}
                    />
                  </Grid>
                </Grid>
                <Box mt={3} display="flex" justifyContent="flex-end">
                  {editing ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSave}
                      disabled={loading}
                      startIcon={
                        loading ? <CircularProgress size={20} /> : <SaveIcon />
                      }
                    >
                      Save
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => setEditing(true)}
                      startIcon={<EditIcon />}
                    >
                      Edit Profile
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </StyledCard>
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Profile;
