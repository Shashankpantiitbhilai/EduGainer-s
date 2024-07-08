import React, { useState, useEffect, useContext } from "react";
import { styled } from "@mui/system";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
} from "@mui/material";
import { useParams } from "react-router-dom";

import { updateUserDetails } from "../../services/utils";
import { AdminContext } from "../../App";

const RootCard = styled(Card)(({ theme }) => ({
  maxWidth: 800,
  margin: "auto",
  marginTop: 20,
  padding: 20,
  display: "flex",
  flexDirection: "row",
}));

const TextFieldWrapper = styled(TextField)(({ theme }) => ({
  width: "100%",
  marginBottom: 10,
}));

const ButtonWrapper = styled(Button)(({ theme }) => ({
  marginTop: 20,
  marginRight: 10,
}));

const FileInput = styled("input")({
  display: "none",
});

const ImagePreview = styled("img")({
  width: "300px",
  height: "300px",
  objectFit: "cover",
  marginBottom: 10,
});

const CircularProgressWrapper = styled(CircularProgress)({
  margin: "auto",
  display: "block",
});

const Details = styled(CardContent)({
  flex: 1,
});

const ImageContainer = styled(CardContent)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
});

const UploadButton = styled(Button)({
  marginTop: 10,
});

const Profile = () => {
  const { IsUserLoggedIn } = useContext(AdminContext);
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
  },[]);

  const fetchUserDetails = async (id) => {
    try {
      setUser(IsUserLoggedIn); // Ensure response.data contains the user object
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
        <RootCard>
          <Details>
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
                <TextFieldWrapper
                  name="username"
                  label="Email"
                  value={user.username}
                  variant="outlined"
                  disabled
                />
              </Grid>
              <Grid item xs={6}>
                <TextFieldWrapper
                  name="firstName"
                  label="First Name"
                  value={user.firstName}
                  variant="outlined"
                  disabled={!editing}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextFieldWrapper
                  name="lastName"
                  label="Last Name"
                  value={user.lastName}
                  variant="outlined"
                  disabled={!editing}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextFieldWrapper
                  name="address"
                  label="Address"
                  value={user.address}
                  variant="outlined"
                  disabled={!editing}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextFieldWrapper
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
              <Grid item xs={12}>
                {loading && <CircularProgressWrapper size={24} />}
                {editing ? (
                  <ButtonWrapper
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    disabled={loading}
                  >
                    Save
                  </ButtonWrapper>
                ) : (
                  <ButtonWrapper
                    variant="contained"
                    color="secondary"
                    onClick={() => setEditing(true)}
                  >
                    Edit
                  </ButtonWrapper>
                )}
              </Grid>
            </Grid>
          </Details>
          <ImageContainer>
            {user.photoUpload && (
              <ImagePreview src={user.photoUpload} alt="Uploaded" />
            )}
            <FileInput
              type="file"
              accept="image/*"
              onChange={handleImage}
              disabled={!editing}
              id="photo-upload-input"
            />
            <label htmlFor="photo-upload-input">
              <UploadButton
                variant="contained"
                color="primary"
                component="span"
                disabled={!editing || loading}
              >
                Upload Photo
              </UploadButton>
            </label>
          </ImageContainer>
        </RootCard>
      )}
    </>
  );
};

export default Profile;
