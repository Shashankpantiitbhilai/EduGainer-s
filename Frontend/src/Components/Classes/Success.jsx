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
  Chip,
  CircularProgress,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DownloadIcon from "@mui/icons-material/Download";
import { getClassStudentInfo } from "../../services/Class/utils"; // Replace with your actual service
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import generatePDF from "react-to-pdf";

const ClassSuccessPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [classData, setClassData] = useState(null);
  const pdfRef = useRef();

  useEffect(() => {
    const getClassData = async () => {
      try {
        const data = await getClassStudentInfo(id);
        setClassData(data);
        toast.success("🎉 Class registration successful!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } catch (error) {
        toast.error("Error fetching class data. Please try again.");
      }
    };
    getClassData();
  }, [id]);

  const handleDownloadPDF = () => {
    generatePDF(pdfRef, {
      filename: `class_registration_${classData.reg}.pdf`,
      page: { margin: 10 },
    });
  };

  if (!classData) {
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
    <Box
      sx={{
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundPosition: "center",
          backgroundSize: "50%",
          opacity: 0.9,
          zIndex: -1,
        },
      }}
    >
      <Typography variant="h6" gutterBottom align="center">
        EduGainer's Classes & Library
      </Typography>

      <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
        <CheckCircleOutlineIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom>
          Class Registration Successful!
        </Typography>
        <Chip label={`Reg. No: ${classData.reg}`} color="primary" />
      </Box>

      <Grid container spacing={3} justifyContent="center" mb={4}>
        <Grid item xs={12} md={4}>
          <Avatar
            src={classData.image?.url}
            alt={classData?.name}
            sx={{ width: 150, height: 150, margin: "0 auto" }}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h5" gutterBottom>
            {classData.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {classData.email}
          </Typography>
          <Typography variant="body2" paragraph>
            Class: {classData.class}
          </Typography>
          <Typography variant="body2" paragraph>
            Subject: {classData.subject}
          </Typography>
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom>
        Additional Information
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography>
            <strong>Faculty:</strong> {classData.faculty}
          </Typography>
          <Typography>
            <strong>Board:</strong> {classData.board}
          </Typography>
          <Typography>
            <strong>School:</strong> {classData.school}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography>
            <strong>Father's Name:</strong> {classData.fatherName}
          </Typography>
          <Typography>
            <strong>Mother's Name:</strong> {classData.motherName}
          </Typography>
          <Typography>
            <strong>Contact:</strong> {classData.contact1}, {classData.contact2}
          </Typography>
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Payment Details
      </Typography>
      <Typography>
        <strong>Order ID:</strong> {classData?.Payment_detail?.razorpay_order_id}
      </Typography>
      <Typography>
        <strong>Payment ID:</strong>{" "}
        {classData?.Payment_detail?.razorpay_payment_id || "Pending"}
      </Typography>
      <Typography>
        <strong>Amount Paid:</strong> ₹{classData.amount}
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

export default ClassSuccessPage;
