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
} from "@mui/material";
import { getAllClasses } from "../../services/Admin_services/admin_classes";
import {
  School as SchoolIcon,
  Event as EventIcon,
  AccessTime as AccessTimeIcon,
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
    console.log(id);
    // Implement registration logic here
    navigate(`/classes-reg/${id}`);
    console.log(`Registering for ${classItem.name}`);
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grow in={true} timeout={1000}>
        <Box textAlign="center" mb={6}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            fontWeight="bold"
            color="primary"
          >
            Welcome to EduGainer's Classes
          </Typography>
          <Typography variant="h5" color="text.secondary">
            Empowering Education Through Innovation
          </Typography>
        </Box>
      </Grow>

      <Typography
        variant="h4"
        component="h2"
        gutterBottom
        color="secondary"
        fontWeight="bold"
      >
        Active Batches
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
                }}
              >
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
                    <Typography variant="body2" color="text.secondary">
                      {classItem.amount}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    {" "}
                    <EventIcon sx={{ mr: 1, color: "secondary.main" }} />
                    <Typography variant="body2" color="text.secondary">
                      {classItem.duration}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={2}>
                    <AccessTimeIcon sx={{ mr: 1, color: "secondary.main" }} />
                    <Typography variant="body2" color="text.secondary">
                      {classItem.timing}
                      <Typography variant="body2" color="text.secondary">
                        {classItem.amount}
                      </Typography>
                    </Typography>
                  </Box>
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
                      Register
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
