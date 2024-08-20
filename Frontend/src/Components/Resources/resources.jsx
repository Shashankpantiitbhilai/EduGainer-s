import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Container, Box, Button, Typography, Chip, Grid } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import FreeSolo from "./freesolo";
import { fetchLibResources } from "../../services/Admin_services/adminUtils";
import { ToastContainer, toast } from "react-toastify";
import Footer from "../footer";
import "react-toastify/dist/ReactToastify.css";
import { AdminContext } from "../../App"; // Import context

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Use context to check if user is logged in
  const { IsUserLoggedIn } = useContext(AdminContext); // Adjust as necessary

  useEffect(() => {
    const fetchResources = async (query) => {
      try {
        const data = await fetchLibResources(query);
        setResources(data);
      } catch (error) {
        toast.error(
          "Oops, there was an issue fetching the educational resources. Please try again later."
        );
      }
    };

    fetchResources(searchQuery);
  }, [searchQuery]);

  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  const handleViewClick = (url) => {
    if (IsUserLoggedIn) {
      window.open(url, "_blank");
      toast.success("Enjoy your new educational discovery!");
    } else {
      toast.error("Please log in to view resources.");
    }
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 300 },
    { field: "name", headerName: "Name", width: 300 },
    {
      field: "tags",
      headerName: "Tags",
      width: 250,
      renderCell: (params) => (
        <Box>
          {params.value.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              color="primary"
              size="small"
              style={{ marginRight: 5 }}
            />
          ))}
        </Box>
      ),
    },
    {
      field: "url",
      headerName: "View",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          onClick={() => handleViewClick(params.value)}
          style={{
            textTransform: "none",
            fontSize: "0.875rem",
            background: "orange",
          }}
          sx={{color:"black"}}
        // Disable if not logged in
        >
          Explore Resource
        </Button>
      ),
    },
  ];

  return (
    <>
      <Container maxWidth="lg" style={{ marginTop: 50 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Welcome to EduGainer's ग्रंथालय
          </Typography>
          <Typography variant="body1" gutterBottom>
            Unlock a world of knowledge, from the fundamentals to the cutting
            edge. Let's dive in!
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <FreeSolo
                resources={resources}
                onSearchChange={handleSearchChange}
              />
            </Grid>
          </Grid>
          <div style={{ height: 400, width: "100%", marginTop: 20 }}>
            <DataGrid
              rows={resources}
              columns={columns}
              autoHeight
              getRowId={(row) => row._id}
            />
          </div>
          {!IsUserLoggedIn && (
            <Typography
              variant="body2"
              color="error"
              align="center"
              style={{ marginTop: 20 }}
            >
              You must be logged in to explore resources. Please{" "}
              <Link
                to="/login"
                style={{ color: "red", textDecoration: "none" }} // Use inline styles
              >
                log in
              </Link>{" "}
              to continue.
            </Typography>
          )}
        </Box>
      </Container>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <Footer />
    </>
  );
};

export default Resources;
