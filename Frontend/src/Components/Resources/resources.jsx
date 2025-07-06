

import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Container, Box, Button, Typography, Chip, Card, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { AutoStories, Search, Lock } from '@mui/icons-material';
import FreeSolo from "./freesolo";
import { fetchLibResources } from "../../services/Admin_services/adminUtils";
import { ToastContainer, toast } from "react-toastify";
import Footer from "../Footer/footer";
import "react-toastify/dist/ReactToastify.css";
import { AdminContext } from "../../App";
import { designTokens } from '../../theme/enterpriseTheme';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const theme = useTheme();

  // Use context to check if user is logged in
  const { IsUserLoggedIn } = useContext(AdminContext);

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
    { 
      field: "_id", 
      headerName: "ID", 
      width: 300,
      headerAlign: 'center',
      align: 'center',
    },
    { 
      field: "name", 
      headerName: "Name", 
      width: 300,
      headerAlign: 'center',
      align: 'left',
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "tags",
      headerName: "Tags",
      width: 250,
      headerAlign: 'center',
      align: 'left',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {params.value.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              size="small"
              sx={{
                bgcolor: theme.palette.secondary.main,
                color: theme.palette.secondary.contrastText,
                fontSize: '0.75rem',
                fontWeight: 500,
              }}
            />
          ))}
        </Box>
      ),
    },
    {
      field: "url",
      headerName: "View",
      width: 150,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Button
          variant="contained"
          onClick={() => handleViewClick(params.value)}
          sx={{
            textTransform: "none",
            fontSize: "0.875rem",
            borderRadius: designTokens.borderRadius.lg,
            fontWeight: 500,
          }}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: theme.palette.background.default,
    }}>
      <Container maxWidth="lg" sx={{ pt: 4, pb: 6 }}>
        {/* Hero Section */}
        <Card
          sx={{
            p: 6,
            mb: 6,
            bgcolor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            textAlign: 'center',
            borderRadius: designTokens.borderRadius.xl,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
            <AutoStories sx={{ fontSize: 48, mr: 2 }} />
            <Typography 
              variant="h3" 
              sx={{
                fontWeight: designTokens.typography.fontWeight.bold,
              }}
            >
              EduGainer's ग्रंथालय
            </Typography>
          </Box>
          <Typography 
            variant="h6" 
            sx={{
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            Unlock a world of knowledge, from the fundamentals to the cutting edge. 
            Let's dive in and explore educational resources curated for your success!
          </Typography>
        </Card>

        {/* Search Section */}
        <Card
          sx={{
            p: 4,
            mb: 4,
            bgcolor: theme.palette.background.paper,
            borderRadius: designTokens.borderRadius.xl,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Search sx={{ fontSize: 28, mr: 2, color: theme.palette.primary.main }} />
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: designTokens.typography.fontWeight.bold,
                color: theme.palette.text.primary,
              }}
            >
              Search Resources
            </Typography>
          </Box>
          <FreeSolo
            resources={resources}
            onSearchChange={handleSearchChange}
          />
        </Card>

        {/* Data Grid Section */}
        <Card
          sx={{
            p: 4,
            bgcolor: theme.palette.background.paper,
            borderRadius: designTokens.borderRadius.xl,
          }}
        >
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: designTokens.typography.fontWeight.bold,
              color: theme.palette.text.primary,
              mb: 3,
              textAlign: 'center',
            }}
          >
            Available Resources
          </Typography>
          
          <Box sx={{ 
            height: 500, 
            width: "100%",
            '& .MuiDataGrid-root': {
              border: 'none',
              borderRadius: designTokens.borderRadius.lg,
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              fontWeight: designTokens.typography.fontWeight.bold,
              fontSize: '1rem',
            },
            '& .MuiDataGrid-row': {
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            },
          }}>
            <DataGrid
              rows={resources}
              columns={columns}
              autoHeight
              getRowId={(row) => row._id}
              disableSelectionOnClick
              pagination
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
            />
          </Box>

          {!IsUserLoggedIn && (
            <Card
              sx={{
                p: 3,
                mt: 4,
                bgcolor: theme.palette.warning.main,
                color: theme.palette.warning.contrastText,
                borderRadius: designTokens.borderRadius.lg,
                textAlign: 'center',
              }}
            >
              <Lock sx={{ fontSize: 32, mb: 1 }} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: designTokens.typography.fontWeight.medium,
                  mb: 1,
                }}
              >
                Access Restricted
              </Typography>
              <Typography variant="body2">
                You must be logged in to explore resources. Please{" "}
                <Link
                  to="/login"
                  style={{ 
                    color: 'inherit', 
                    textDecoration: 'underline',
                    fontWeight: 600,
                  }}
                >
                  log in
                </Link>{" "}
                to continue your learning journey.
              </Typography>
            </Card>
          )}
        </Card>
      </Container>
      
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar 
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{
          zIndex: 9999,
          top: '80px',
          '& .Toastify__toast': {
            borderRadius: designTokens.borderRadius.lg,
          }
        }}
      />
      <Footer />
    </Box>
  );
};

export default Resources;
