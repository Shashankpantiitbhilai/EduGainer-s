import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import { fetchUserDataById } from "../../services/utils";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Dashboard = () => {
  const [value, setValue] = useState(0);
  const [libraryDetails, setLibraryDetails] = useState(null);
  const { id } = useParams();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const getStudentDetails = async () => {
      try {
        const details = await fetchUserDataById(id);
        setLibraryDetails(details);
      } catch (error) {
        console.error("Error fetching library details:", error);
      }
    };

    if (value === 1) {
      getStudentDetails();
    }
  }, [value, id]);

  const classes = [
    {
      title: "How to build a product",
      category: "Product management",
      image: "mountain-lake.jpg",
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="Dashboard Sections"
          centered
        >
          <Tab label="My Classes" {...a11yProps(0)} />
          <Tab label="Library" {...a11yProps(1)} />
          <Tab label="Notifications" {...a11yProps(2)} />
          <Tab label="Help & Support" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <div className="class-list">
          {classes.map((cls, index) => (
            <div key={index} className="class-card">
              <img src={cls.image} alt={cls.title} />
              <h3>{cls.title}</h3>
              <p>{cls.category}</p>
            </div>
          ))}
        </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <div className="section-content">
          {libraryDetails ? (
            <Grid container spacing={0} padding={8}>
              <Grid item xs={12} md={7}>
                <h2>Library Subscription</h2>
                <p>
                  <strong>Name:</strong> {libraryDetails.name}
                </p>
                <p>
                  <strong>Shift:</strong> {libraryDetails.shift}
                </p>
                <p>
                  <strong>Email:</strong> {libraryDetails.email}
                </p>
                <p>
                  <strong>Mobile:</strong> {libraryDetails.mobile}
                </p>
                <p>
                  <strong>Address:</strong> {libraryDetails.address}
                </p>
                <p>
                  <strong>Amount:</strong> {libraryDetails.amount}
                </p>
                <p>
                  <strong>Razorpay Order ID:</strong>{" "}
                  {libraryDetails.Payment_detail.razorpay_order_id}
                </p>
                <p>
                  <strong>Razorpay Payment ID:</strong>{" "}
                  {libraryDetails.Payment_detail.razorpay_payment_id}
                </p>
              </Grid>
              <Grid item xs={12} md={5}>
                <img
                  src={libraryDetails.image.url}
                  alt={libraryDetails.name}
                  style={{ width: "100%", maxWidth: "500px" }}
                />
              </Grid>
            </Grid>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <div className="section-content">
          <p>You have no new notifications.</p>
        </div>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <div className="section-content">
          <p>
            Visit our <a href="/help">help center</a> for answers to common
            questions or to contact support.
          </p>
        </div>
      </TabPanel>
    </Box>
  );
};

export default Dashboard;
