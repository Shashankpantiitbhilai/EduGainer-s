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
  useTheme,
  styled,
  alpha,
  Fade,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DownloadIcon from "@mui/icons-material/Download";
import HomeIcon from "@mui/icons-material/Home";
import { getClassStudentInfo } from "../../services/Class/utils";
import { showSuccessToast, showErrorToast } from "../../utils/notificationUtils";
import generatePDF from "react-to-pdf";
import { designTokens, glassMorphism } from '../../theme/enterpriseTheme';

// Styled components for enterprise-level UI
const SuccessCard = styled(Card)(({ theme }) => ({
  borderRadius: designTokens.borderRadius.xxl,
  border: `1px solid ${theme.palette.divider}`,
  ...glassMorphism(theme.palette.mode === 'dark' ? 0.05 : 0.02),
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[8],
  overflow: 'hidden',
  position: 'relative',
}));

const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
  color: theme.palette.success.contrastText,
  padding: theme.spacing(6),
  textAlign: 'center',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
}));

const ClassSuccessPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const pdfRef = useRef();
  const theme = useTheme();

  useEffect(() => {
    const getClassData = async () => {
      try {
        const data = await getClassStudentInfo(id);
        setClassData(data);
        setLoading(false);
        showSuccessToast("🎉 Class registration successful!");
      } catch (error) {
        showErrorToast("Error fetching class data. Please try again.");
        setLoading(false);
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

  const handleGoHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{ 
          background: theme.palette.mode === 'dark' 
            ? `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`
            : `linear-gradient(135deg, ${theme.palette.grey[50]} 0%, ${theme.palette.grey[100]} 100%)`,
        }}
      >
        <CircularProgress 
          size={60} 
          sx={{ color: theme.palette.primary.main }}
        />
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
        EduGainer's Career Point
      </Typography>

      <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
        <CheckCircleOutlineIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom>
          Class Registration Successful!
        </Typography>
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
        <strong>Order ID:</strong>{" "}
        {classData?.Payment_detail?.razorpay_order_id}
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
    <Box sx={{ 
      minHeight: '100vh',
      background: theme.palette.mode === 'dark' 
        ? `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`
        : `linear-gradient(135deg, ${theme.palette.grey[50]} 0%, ${theme.palette.grey[100]} 100%)`,
      py: 4,
    }}>
      <Container maxWidth="lg">
        <Fade in={true} timeout={1000}>
          <SuccessCard>
            {/* Hero Section */}
            <HeroSection>
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <CheckCircleOutlineIcon 
                  sx={{ 
                    fontSize: 80, 
                    mb: 2,
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
                  }} 
                />
                <Typography 
                  variant="h3" 
                  component="h1" 
                  gutterBottom
                  sx={{
                    fontWeight: designTokens.typography.fontWeight.bold,
                    mb: 2,
                  }}
                >
                  Registration Successful!
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{
                    opacity: 0.9,
                    fontWeight: designTokens.typography.fontWeight.medium,
                  }}
                >
                  Welcome to EduGainer's Career Point
                </Typography>
              </Box>
            </HeroSection>

            {/* Content Section */}
            <CardContent sx={{ p: 6 }}>
              <Box ref={pdfRef} sx={{ mb: 4 }}>
                <PDFContent />
              </Box>

              {/* Action Buttons */}
              <Box 
                display="flex" 
                flexDirection={{ xs: 'column', sm: 'row' }}
                gap={2}
                justifyContent="center"
                mt={4}
              >
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<HomeIcon />}
                  onClick={handleGoHome}
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    color: theme.palette.primary.contrastText,
                    fontWeight: designTokens.typography.fontWeight.bold,
                    borderRadius: designTokens.borderRadius.lg,
                    px: 4,
                    py: 1.5,
                    boxShadow: theme.shadows[4],
                    transition: `all ${designTokens.animation.duration.normal} ${designTokens.animation.easing.default}`,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[8],
                      filter: 'brightness(1.1)',
                    },
                  }}
                >
                  Go to Home
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownloadPDF}
                  sx={{
                    borderColor: theme.palette.secondary.main,
                    color: theme.palette.secondary.main,
                    fontWeight: designTokens.typography.fontWeight.bold,
                    borderRadius: designTokens.borderRadius.lg,
                    px: 4,
                    py: 1.5,
                    transition: `all ${designTokens.animation.duration.normal} ${designTokens.animation.easing.default}`,
                    '&:hover': {
                      borderColor: theme.palette.secondary.dark,
                      backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  Download PDF
                </Button>
              </Box>
            </CardContent>
          </SuccessCard>
        </Fade>
      </Container>
    </Box>
  );
};

export default ClassSuccessPage;
