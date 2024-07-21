import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Avatar,
  Typography,
  Tabs,
  Tab,
  Grid,
  Paper,
  Chip,
  Divider,
  Alert,
} from "@mui/material";
import {
  Person as PersonIcon,
  Book as BookIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  CreditCard as CreditCardIcon,
  Assignment as AssignmentIcon,
  School as SchoolIcon,
} from "@mui/icons-material";

import { fetchUserDataById } from "../../services/utils";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchUserDataById(id);
      setUserData(data);
    };
    fetchData();
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (!userData) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Loading...
      </Box>
    );
  }

  const libraryContent = [
    { icon: <PersonIcon />, label: "Name", value: userData.name },
    { icon: <BookIcon />, label: "Shift", value: userData.shift },
    { icon: <EmailIcon />, label: "Email", value: userData.email },
    { icon: <PhoneIcon />, label: "Mobile", value: userData.contact1 },
    { icon: <HomeIcon />, label: "Address", value: userData.address },
    {
      icon: <CreditCardIcon />,
      label: "Amount Paid",
      value: `₹${userData.amount}`,
    },
    { icon: <AssignmentIcon />, label: "Aadhaar", value: userData.aadhaar },
    {
      icon: <SchoolIcon />,
      label: "Exam Prep",
      value: userData.examPreparation,
    },
  ];

  return (
    <Box sx={{ maxWidth: 800, margin: "auto", mt: 4 }}>
      <Card elevation={3}>
        <CardContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Important: If you don't visit the library for 3 consecutive months,
            you will be charged a registration fee again. This subscription is
            valid until there's a 3-month consecutive gap in visits.
          </Alert>

          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar
              src={userData.image.url}
              alt={userData.name}
              sx={{ width: 80, height: 80, mr: 2 }}
            />
            <Box>
              <Typography variant="h4" component="h1">
                {userData.name}
              </Typography>
              <Chip
                label="Library Subscription Active"
                color="primary"
                variant="outlined"
              />
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            centered
            sx={{ mb: 2 }}
          >
            <Tab label="Library Details" />
            <Tab label="My Classes" />
          </Tabs>

          {tabValue === 0 && (
            <Grid container spacing={2}>
              {libraryContent.map((item, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Paper
                    elevation={1}
                    sx={{ p: 2, display: "flex", alignItems: "center" }}
                  >
                    <Box sx={{ mr: 2, color: "primary.main" }}>{item.icon}</Box>
                    <Box>
                      <Typography variant="caption" color="textSecondary">
                        {item.label}
                      </Typography>
                      <Typography variant="body1">{item.value}</Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}

          {tabValue === 1 && (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <SchoolIcon
                sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
              />
              <Typography variant="h6">No active classes</Typography>
              <Typography variant="body2" color="textSecondary">
                Get started by enrolling in a class.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;
