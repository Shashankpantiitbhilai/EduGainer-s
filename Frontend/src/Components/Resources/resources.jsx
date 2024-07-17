import React, { useState, useEffect } from "react";
import { Container, Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import FreeSolo from "./freesolo"; // Adjust the import path as necessary

import { fetchLibResources } from "../../services/Admin_services/adminUtils";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchResources = async (query) => {
      try {
        const data = await fetchLibResources(query);
        // console.log(data);

        setResources(data);
      } catch (error) {
        // console.error("Error fetching resources:", error);
      }
    };

    fetchResources(searchQuery);
  }, [searchQuery]);

  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 300 },
    { field: "name", headerName: "Name", width: 300 },
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
  ];

  return (
    <>
      <Container maxWidth="lg" style={{ marginTop: 50 }}>
        <Box>
          <FreeSolo resources={resources} onSearchChange={handleSearchChange} />

          <div style={{ height: 300, width: "100%", marginTop: 20 }}>
            <DataGrid
              rows={resources}
              columns={columns}
              autoHeight
              checkboxSelection
              getRowId={(row) => row._id}
            />
          </div>
        </Box>
      </Container>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
};

export default Resources;
