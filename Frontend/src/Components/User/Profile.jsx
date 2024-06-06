import React, { useState, useEffect, useContext } from "react";
import { styled } from "@mui/material/styles";
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
import { fetchCredentials } from "../../services/auth";
import { updateUserDetails } from "../../services/utils";
import { AdminContext } from "../../App";

// Example of custom styles using styled
const useStyles = styled((theme) => ({
  card: {
    margin: theme.spacing(2),
  },
  textField: {
    marginBottom: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(2),
  },
  gridContainer: {
    display: "flex",
    alignItems: "center",
  },
}));

const UserProfile = () => {
  const classes = useStyles();
  const { userId } = useParams();
  const { adminState } = useContext(AdminContext);
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      const credentials = await fetchCredentials(userId);
      setUserDetails(credentials);
      setLoading(false);
    };

    fetchUserDetails();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await updateUserDetails(userId, userDetails);
    setLoading(false);
  };

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h5">User Profile</Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} className={classes.gridContainer}>
              <Grid item xs={12}>
                <TextField
                  label="Name"
                  name="name"
                  value={userDetails.name || ""}
                  onChange={handleChange}
                  fullWidth
                  className={classes.textField}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  name="email"
                  value={userDetails.email || ""}
                  onChange={handleChange}
                  fullWidth
                  className={classes.textField}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.button}
                >
                  Update
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default UserProfile;
