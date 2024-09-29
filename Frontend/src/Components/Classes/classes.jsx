import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Grow,
  useTheme,
  Paper,
  Divider,
} from "@mui/material";
import { getAllClasses } from "../../services/Admin_services/admin_classes";
import {
  School as SchoolIcon,
  Event as EventIcon,
  AccessTime as AccessTimeIcon,
  Star as StarIcon,
  Speed as SpeedIcon,
} from "@mui/icons-material";

const EduGainerClassesDisplay = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const data = await getAllClasses();
      setClasses(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch classes");
      setLoading(false);
    }
  };

  const handleCardClick = (classItem) => {
    setSelectedClass(classItem);
  };

  const handleCloseDialog = () => {
    setSelectedClass(null);
  };

  const handleRegister = (classItem) => {
    const id = classItem?._id;
    navigate(`/classes-reg/${id}`);
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grow in={true} timeout={1000}>
        <Paper elevation={3} sx={{ p: 4, mb: 6, borderRadius: 2 }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            fontWeight="bold"
            color="primary"
            align="center"
          >
            Welcome to EduGainer's Classes
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            align="center"
            gutterBottom
          >
            Empowering Education Through Innovation
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body1" paragraph>
            EduGainer is your gateway to excellence in education. We offer
            cutting-edge courses designed to propel your career forward. Our
            expert faculty, state-of-the-art curriculum, and innovative teaching
            methods ensure that you receive the best possible education.
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={4}>
              <Box display="flex" alignItems="center" justifyContent="center">
                <StarIcon color="secondary" sx={{ mr: 1 }} />
                <Typography variant="h6">Expert Faculty</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box display="flex" alignItems="center" justifyContent="center">
                <SpeedIcon color="secondary" sx={{ mr: 1 }} />
                <Typography variant="h6">Fast-Track Learning</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box display="flex" alignItems="center" justifyContent="center">
                <SchoolIcon color="secondary" sx={{ mr: 1 }} />
                <Typography variant="h6">Industry-Relevant Skills</Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Grow>

      <Typography
        variant="h4"
        component="h2"
        gutterBottom
        color="secondary"
        fontWeight="bold"
        align="center"
        sx={{ mb: 4 }}
      >
        Active Batches - Register Now!
      </Typography>
      <Grid container spacing={3}>
        {classes.map((classItem, index) => (
          <Grid item xs={12} sm={6} md={4} key={classItem._id}>
            <Grow in={true} timeout={1000 + 500 * index}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: theme.shadows[8],
                  },
                  position: "relative",
                  overflow: "visible",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: -15,
                    right: -15,
                    bgcolor: "error.main",
                    color: "white",
                    p: 1,
                    borderRadius: "50%",
                    zIndex: 1,
                    fontWeight: "bold",
                    fontSize: "0.8rem",
                    boxShadow: theme.shadows[3],
                  }}
                >
                  Limited Seats!
                </Box>
                {classItem.image?.url && (
                  <CardMedia
                    component="img"
                    sx={{
                      height: 200,
                      objectFit: "cover",
                    }}
                    image={classItem.image.url}
                    alt={classItem.name}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    fontWeight="bold"
                    color="primary"
                  >
                    {classItem.name}
                  </Typography>
                  <Box display="flex" alignItems="center" mb={1}>
                    <SchoolIcon sx={{ mr: 1, color: "secondary.main" }} />
                    <Typography variant="body2" color="text.secondary">
                      {classItem.facultyName}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <EventIcon sx={{ mr: 1, color: "secondary.main" }} />
                    <Typography variant="body2" color="text.secondary">
                      {classItem.duration}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={2}>
                    <AccessTimeIcon sx={{ mr: 1, color: "secondary.main" }} />
                    <Typography variant="body2" color="text.secondary">
                      {classItem.timing}
                    </Typography>
                  </Box>
                  <Typography variant="h6" color="error.main" gutterBottom>
                    ₹{classItem.amount}
                  </Typography>
                  <Box display="flex" justifyContent="space-between">
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleCardClick(classItem)}
                    >
                      Learn More
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleRegister(classItem)}
                    >
                      Register Now
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grow>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={!!selectedClass}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedClass && (
          <>
            <DialogTitle
              sx={{ bgcolor: "primary.main", color: "primary.contrastText" }}
            >
              {selectedClass.name}
            </DialogTitle>
            <DialogContent>
              {selectedClass.image?.url && (
                <CardMedia
                  component="img"
                  sx={{
                    height: 400,
                    objectFit: "cover",
                    borderRadius: 1,
                    mb: 2,
                    mt: 2,
                  }}
                  image={selectedClass.image.url}
                  alt={selectedClass.name}
                />
              )}
              <Typography variant="h6" color="primary" gutterBottom>
                Faculty: {selectedClass.facultyName}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Duration:</strong> {selectedClass.duration}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Timing:</strong> {selectedClass.timing}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Description:</strong> {selectedClass.description}
              </Typography>
              <Typography variant="h6" color="primary" gutterBottom>
                Course Contents:
              </Typography>
              <Grid container spacing={1} mb={2}>
                {selectedClass.contents.map((content, index) => (
                  <Grid item key={index}>
                    <Chip label={content} color="secondary" />
                  </Grid>
                ))}
              </Grid>
              {selectedClass.additionalDetails && (
                <Typography variant="body1">
                  <strong>Additional Details:</strong>{" "}
                  {selectedClass.additionalDetails}
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Close
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleRegister(selectedClass)}
              >
                Register Now
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default EduGainerClassesDisplay;
