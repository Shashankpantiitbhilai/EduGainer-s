import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
} from "@material-ui/core";
import { useParams } from "react-router-dom";
import { fetchCredentials } from "../services/auth";
import { updateUserDetails } from "../services/utils";
import { AdminContext } from "../App";

const useStyles = makeStyles({
  card: {
    maxWidth: 600,
    margin: "auto",
    marginTop: 20,
    padding: 20,
  },
  textField: {
    width: "100%",
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
    marginRight: 10,
  },
  fileInput: {
    display: "none",
  },
  imagePreview: {
    maxWidth: "100%",
    maxHeight: 300,
    marginBottom: 10,
  },
  progress: {
    margin: "auto",
    display: "block",
  },
});

const Profile = () => {
  const { IsUserLoggedIn } = useContext(AdminContext);
  const classes = useStyles();
  const { id } = useParams(); // Assuming you're using id from the route params
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
  const [error, setError] = useState(null); // To store error messages

  useEffect(() => {
    fetchUserDetails(id);
  }, [id]);

  const fetchUserDetails = async (id) => {
    try {
      const response = await fetchCredentials();
      setUser(response); // Ensure response.data contains the user object
    } catch (error) {
      console.error("Error fetching user data:", error);
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
      console.log(updatedUser);
      const response = await updateUserDetails(id, updatedUser);
      setUser(response);
      setEditing(false);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error("Error saving user data:", error);
      setError("Failed to save user data."); // Set an error message
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {IsUserLoggedIn && (
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Profile
            </Typography>
            {error && (
              <Typography variant="body2" color="error">
                {error}
              </Typography>
            )}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="username"
                  label="Username"
                  value={user.username}
                  variant="outlined"
                  className={classes.textField}
                  disabled
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="firstName"
                  label="First Name"
                  value={user.firstName}
                  variant="outlined"
                  className={classes.textField}
                  disabled={!editing}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="lastName"
                  label="Last Name"
                  value={user.lastName}
                  variant="outlined"
                  className={classes.textField}
                  disabled={!editing}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="address"
                  label="Address"
                  value={user.address}
                  variant="outlined"
                  className={classes.textField}
                  disabled={!editing}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="bio"
                  label="Bio"
                  value={user.bio}
                  variant="outlined"
                  multiline
                  rows={3}
                  className={classes.textField}
                  disabled={!editing}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                {user.photoUpload && (
                  <img
                    src={user.photoUpload}
                    alt="Uploaded"
                    className={classes.imagePreview}
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  disabled={!editing}
                  className={classes.fileInput}
                  id="photo-upload-input"
                />
                <label htmlFor="photo-upload-input">
                  <Button
                    variant="contained"
                    color="primary"
                    component="span"
                    className={classes.button}
                    disabled={!editing || loading}
                  >
                    Upload Photo
                  </Button>
                </label>
              </Grid>
              <Grid item xs={12}>
                {loading && (
                  <CircularProgress size={24} className={classes.progress} />
                )}
                {editing ? (
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={handleSave}
                    disabled={loading}
                  >
                    Save
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="secondary"
                    className={classes.button}
                    onClick={() => setEditing(true)}
                  >
                    Edit
                  </Button>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default Profile;
