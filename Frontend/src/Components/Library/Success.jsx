import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DownloadIcon from "@mui/icons-material/Download";
import { fetchUserDataById } from "../../services/utils";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import generatePDF from "react-to-pdf";

const SuccessPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [expanded, setExpanded] = useState("panel1");
  const pdfRef = useRef();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await fetchUserDataById(id);
        setUserData(data);
        toast.success("🎉 Registration successful! We will contact you soon.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } catch (error) {
        toast.error("Error fetching user data. Please try again.");
      }
    };
    getUserData();
  }, [id]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleDownloadPDF = () => {
    generatePDF(pdfRef, {
      filename: `registration_${userData.reg}.pdf`,
      page: { margin: 10 },
    });
  };

  if (!userData) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  const PDFContent = () => (
    <Box>
      <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
        <CheckCircleOutlineIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom>
          Registration Successful!
        </Typography>
        <Chip label={`Reg. No: ${userData.reg}`} color="primary" />
      </Box>

      <Grid container spacing={3} justifyContent="center" mb={4}>
        <Grid item xs={12} md={4}>
          <Avatar
            src={userData.image.url}
            alt={userData.name}
            sx={{ width: 150, height: 150, margin: "0 auto" }}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h5" gutterBottom>
            {userData.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {userData.email}
          </Typography>
          <Typography variant="body2" paragraph>
            Shift: {userData.shift}
          </Typography>
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom>
        Personal Information
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography>
            <strong>Father's Name:</strong> {userData.fatherName}
          </Typography>
          <Typography>
            <strong>Mother's Name:</strong> {userData.motherName}
          </Typography>
          <Typography>
            <strong>Contact:</strong> {userData.contact1}, {userData.contact2}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography>
            <strong>Address:</strong> {userData.address}
          </Typography>
          <Typography>
            <strong>Aadhaar:</strong> {userData.aadhaar}
          </Typography>
          <Typography>
            <strong>Exam Preparation:</strong> {userData.examPreparation}
          </Typography>
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Payment Details
      </Typography>
      <Typography>
        <strong>Order ID:</strong> {userData.Payment_detail.razorpay_order_id}
      </Typography>
      <Typography>
        <strong>Payment ID:</strong>{" "}
        {userData.Payment_detail.razorpay_payment_id || "Pending"}
      </Typography>
      <Typography>
        <strong>Amount Paid:</strong> ₹{userData.amount}
      </Typography>
    </Box>
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card elevation={3}>
        <CardContent>
          <Box ref={pdfRef}>
            <PDFContent />
          </Box>

          <Box mt={4} textAlign="center">
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate(`/dashboard/${id}`)}
              sx={{ mr: 2 }}
            >
              Go to Dashboard
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              size="large"
              startIcon={<DownloadIcon />}
              onClick={handleDownloadPDF}
            >
              Download PDF
            </Button>
          </Box>
        </CardContent>
      </Card>
      <ToastContainer />
    </Container>
  );
};

export default SuccessPage;
