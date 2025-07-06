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
  Person,
  Book,
  Email,
  Phone,
  Home,
  CreditCard,
  Assignment,
  School,
  ErrorOutline,
  Cake,
  People,
  Wc,
} from "@mui/icons-material";

import { fetchUserDataById } from "../../services/utils";
import Footer from "../Footer/footer";
const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchUserDataById(id);
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (isLoading) {
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

  if (!userData) {
    return (<>
      <Box sx={{ maxWidth: 800, margin: "auto", mt: 4 }}>
        <Card elevation={3}>
          <CardContent>
            <Box sx={{ textAlign: "center", py: 4 }}>
              <ErrorOutline sx={{ fontSize: 60, color: "error.main", mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                No Active Subscription
              </Typography>
              <Typography variant="body1" color="textSecondary">
                There is no active library subscription for this user.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
      <Footer/></>
    );
  }

  const libraryContent = [
    { icon: <Person />, label: "Name", value: userData.name },
    { icon: <Book />, label: "RegNo", value: userData.reg },
    { icon: <Book />, label: "Shift", value: userData.shift },
    { icon: <Email />, label: "Email", value: userData.email },
    { icon: <Phone />, label: "Primary Contact", value: userData.contact1 },
    { icon: <Phone />, label: "Secondary Contact", value: userData.contact2 },
    { icon: <Home />, label: "Address", value: userData.address },
    {
      icon: <CreditCard />,
      label: "Amount Paid",
      value: `₹${userData.amount}`,
    },
    { icon: <Assignment />, label: "Aadhaar", value: userData.aadhaar },
    { icon: <School />, label: "Exam Prep", value: userData.examPreparation },
    { icon: <Wc />, label: "Gender", value: userData.gender },
    { icon: <Cake />, label: "Date of Birth", value: userData.dob },
    { icon: <People />, label: "Father's Name", value: userData.fatherName },
    { icon: <People />, label: "Mother's Name", value: userData.motherName },
    { icon: <Book />, label: "Mode", value: userData.Mode },
    {
      icon: <CreditCard />,
      label: "Last Fee Date",
      value: userData.lastfeedate,
    },
  ];

  return (
    <>
      <Box sx={{ maxWidth: 800, margin: "auto", mt: 4 }}>
        <Card elevation={3}>
          <CardContent>
            <Alert severity="warning" sx={{ mb: 2 }}>
              Important: If you don't visit the library for 3 consecutive
              months, you will be charged a registration fee again. This
              subscription is valid until there's a 3-month consecutive gap in
              visits.
            </Alert>

            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar
                src={userData?.image?.url}
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
              <Tab label="Payment Info" />
            </Tabs>

            {tabValue === 0 && (
              <Grid container spacing={2}>
                {libraryContent.map((item, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Paper
                      elevation={1}
                      sx={{ p: 2, display: "flex", alignItems: "center" }}
                    >
                      <Box sx={{ mr: 2, color: "primary.main" }}>
                        {item.icon}
                      </Box>
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
              <Box>
                <Typography variant="h6" gutterBottom>
                  Payment Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Paper elevation={1} sx={{ p: 2 }}>
                      <Typography variant="body2" color="textSecondary">
                        Razorpay Order ID
                      </Typography>
                      <Typography variant="body1">
                        {userData.Payment_detail?.razorpay_order_id || "N/A"}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Paper elevation={1} sx={{ p: 2 }}>
                      <Typography variant="body2" color="textSecondary">
                        Razorpay Payment ID
                      </Typography>
                      <Typography variant="body1">
                        {userData.Payment_detail?.razorpay_payment_id || "N/A"}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12}>
                    <Paper elevation={1} sx={{ p: 2 }}>
                      <Typography variant="body2" color="textSecondary">
                        Consent
                      </Typography>
                      <Typography variant="body1">
                        {userData.consent}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
      <Footer />
    </>
  );
};

export default Dashboard;
