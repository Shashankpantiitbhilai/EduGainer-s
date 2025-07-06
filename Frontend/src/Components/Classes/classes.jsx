import  { useState, useEffect } from "react";
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
  styled,
  alpha,
  Fade,
} from "@mui/material";
import { motion } from 'framer-motion';
import { getAllClasses } from "../../services/Admin_services/admin_classes";
import {
  School as SchoolIcon,
  Event as EventIcon,
  AccessTime as AccessTimeIcon,
  Star as StarIcon,
  Speed as SpeedIcon,
  LocalOffer as OfferIcon,
  Groups as GroupsIcon,
} from "@mui/icons-material";
import { designTokens, glassMorphism, hoverScale } from '../../theme/enterpriseTheme';
import Footer from "../Footer/footer";

// Styled components for enterprise-level UI
const HeroSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(8, 6),
  marginBottom: theme.spacing(6),
  borderRadius: designTokens.borderRadius.xxl,
  background: theme.palette.mode === 'dark' 
    ? `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`
    : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: theme.palette.primary.contrastText,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: theme.palette.mode === 'dark'
      ? 'radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.03) 0%, transparent 70%)'
      : 'radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
}));

const FeatureCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: designTokens.borderRadius.lg,
  ...glassMorphism(0.1),
  backdropFilter: 'blur(10px)',
  border: `1px solid ${alpha(theme.palette.primary.contrastText, 0.1)}`,
  transition: `all ${designTokens.animation.duration.normal} ${designTokens.animation.easing.default}`,
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: `0 20px 40px ${alpha(theme.palette.primary.contrastText, 0.2)}`,
    border: `1px solid ${alpha(theme.palette.secondary.main, 0.3)}`,
  },
}));

const ClassCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: designTokens.borderRadius.xl,
  border: `1px solid ${theme.palette.divider}`,
  overflow: "hidden",
  position: "relative",
  ...glassMorphism(theme.palette.mode === 'dark' ? 0.05 : 0.02),
  backgroundColor: theme.palette.background.paper,
  transition: `all ${designTokens.animation.duration.normal} ${designTokens.animation.easing.default}`,
  '&:hover': {
    transform: 'translateY(-12px)',
    boxShadow: theme.shadows[12],
    borderColor: theme.palette.primary.main,
    '& .class-image': {
      transform: 'scale(1.05)',
    },
    '& .limited-seats-badge': {
      transform: 'scale(1.1) rotate(5deg)',
    },
  },
}));

const LimitedSeatsBadge = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: -12,
  right: -12,
  backgroundColor: theme.palette.error.main,
  color: theme.palette.error.contrastText,
  padding: theme.spacing(1.5, 2),
  borderRadius: designTokens.borderRadius.full,
  zIndex: 2,
  fontWeight: designTokens.typography.fontWeight.bold,
  fontSize: designTokens.typography.fontSize.xs,
  boxShadow: theme.shadows[6],
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  animation: 'pulse 2s infinite',
  '@keyframes pulse': {
    '0%': { transform: 'scale(1)' },
    '50%': { transform: 'scale(1.05)' },
    '100%': { transform: 'scale(1)' },
  },
  transition: `all ${designTokens.animation.duration.normal} ${designTokens.animation.easing.default}`,
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: designTokens.borderRadius.xl,
    border: `1px solid ${theme.palette.divider}`,
    ...glassMorphism(0.05),
    backdropFilter: 'blur(20px)',
  },
}));

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
    <>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Grow in={true} timeout={1000}>
          <HeroSection elevation={0}>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: designTokens.typography.fontWeight.bold,
                  textAlign: 'center',
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  mb: 2,
                }}
              >
                Welcome to EduGainer's Classes
              </Typography>
              <Typography
                variant="h5"
                align="center"
                gutterBottom
                sx={{
                  opacity: 0.9,
                  mb: 4,
                  fontSize: { xs: '1.2rem', md: '1.5rem' },
                  fontWeight: designTokens.typography.fontWeight.medium,
                }}
              >
                Empowering Education Through Innovation
              </Typography>
              
              <Divider sx={{ 
                my: 4, 
                backgroundColor: alpha(theme.palette.primary.contrastText, 0.3),
                height: 2,
                borderRadius: 1,
              }} />
              
              <Typography 
                variant="body1" 
                paragraph
                sx={{
                  fontSize: designTokens.typography.fontSize.lg,
                  textAlign: 'center',
                  maxWidth: '900px',
                  mx: 'auto',
                  mb: 6,
                  lineHeight: 1.8,
                  opacity: 0.95,
                }}
              >
                EduGainer is your gateway to excellence in education. We offer
                cutting-edge courses designed to propel your career forward. Our
                expert faculty, state-of-the-art curriculum, and innovative teaching
                methods ensure that you receive the best possible education.
              </Typography>
              
              <Grid container spacing={4} justifyContent="center">
                <Grid item xs={12} sm={4}>
                  <FeatureCard>
                    <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
                      <StarIcon sx={{ 
                        mb: 2, 
                        color: theme.palette.secondary.main, 
                        fontSize: '3rem',
                        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
                      }} />
                      <Typography 
                        variant="h6"
                        sx={{ 
                          fontWeight: designTokens.typography.fontWeight.bold,
                          textAlign: 'center',
                        }}
                      >
                        Expert Faculty
                      </Typography>
                      <Typography 
                        variant="body2"
                        sx={{ 
                          textAlign: 'center',
                          mt: 1,
                          opacity: 0.8,
                        }}
                      >
                        Learn from industry professionals
                      </Typography>
                    </Box>
                  </FeatureCard>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FeatureCard>
                    <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
                      <SpeedIcon sx={{ 
                        mb: 2, 
                        color: theme.palette.secondary.main, 
                        fontSize: '3rem',
                        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
                      }} />
                      <Typography 
                        variant="h6"
                        sx={{ 
                          fontWeight: designTokens.typography.fontWeight.bold,
                          textAlign: 'center',
                        }}
                      >
                        Fast-Track Learning
                      </Typography>
                      <Typography 
                        variant="body2"
                        sx={{ 
                          textAlign: 'center',
                          mt: 1,
                          opacity: 0.8,
                        }}
                      >
                        Accelerated course structure
                      </Typography>
                    </Box>
                  </FeatureCard>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FeatureCard>
                    <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
                      <SchoolIcon sx={{ 
                        mb: 2, 
                        color: theme.palette.secondary.main, 
                        fontSize: '3rem',
                        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
                      }} />
                      <Typography 
                        variant="h6"
                        sx={{ 
                          fontWeight: designTokens.typography.fontWeight.bold,
                          textAlign: 'center',
                        }}
                      >
                        Industry-Relevant Skills
                      </Typography>
                      <Typography 
                        variant="body2"
                        sx={{ 
                          textAlign: 'center',
                          mt: 1,
                          opacity: 0.8,
                        }}
                      >
                        Real-world applicable knowledge
                      </Typography>
                    </Box>
                  </FeatureCard>
                </Grid>
              </Grid>
            </Box>
          </HeroSection>
        </Grow>

        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{ 
              fontWeight: designTokens.typography.fontWeight.bold,
              color: theme.palette.primary.main,
              fontSize: { xs: '2rem', md: '2.75rem' },
              mb: 2,
            }}
          >
            Active Batches - Register Now!
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: designTokens.typography.fontSize.lg,
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            Choose from our comprehensive range of courses designed to elevate your skills
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          {classes.map((classItem, index) => (
            <Grid item xs={12} sm={6} lg={4} key={classItem._id}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
              >
                <ClassCard>
                  <LimitedSeatsBadge className="limited-seats-badge">
                    <OfferIcon sx={{ fontSize: '1rem' }} />
                    Limited Seats!
                  </LimitedSeatsBadge>
                  
                  {classItem.image?.url && (
                    <CardMedia
                      component="img"
                      className="class-image"
                      sx={{
                        height: 240,
                        objectFit: "cover",
                        transition: `transform ${designTokens.animation.duration.normal} ${designTokens.animation.easing.default}`,
                      }}
                      image={classItem.image.url}
                      alt={classItem.name}
                    />
                  )}
                  
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="h3"
                      sx={{
                        fontWeight: designTokens.typography.fontWeight.bold,
                        color: theme.palette.primary.main,
                        mb: 3,
                        fontSize: { xs: '1.3rem', md: '1.5rem' },
                      }}
                    >
                      {classItem.name}
                    </Typography>
                    
                    <Box sx={{ mb: 3 }}>
                      <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                        <SchoolIcon sx={{ 
                          mr: 1.5, 
                          color: theme.palette.secondary.main,
                          fontSize: '1.3rem',
                        }} />
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: theme.palette.text.primary,
                            fontWeight: designTokens.typography.fontWeight.medium,
                          }}
                        >
                          {classItem.facultyName}
                        </Typography>
                      </Box>
                      
                      <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                        <EventIcon sx={{ 
                          mr: 1.5, 
                          color: theme.palette.secondary.main,
                          fontSize: '1.3rem',
                        }} />
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: theme.palette.text.primary,
                            fontWeight: designTokens.typography.fontWeight.medium,
                          }}
                        >
                          {classItem.duration}
                        </Typography>
                      </Box>
                      
                      <Box display="flex" alignItems="center" sx={{ mb: 3 }}>
                        <AccessTimeIcon sx={{ 
                          mr: 1.5, 
                          color: theme.palette.secondary.main,
                          fontSize: '1.3rem',
                        }} />
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: theme.palette.text.primary,
                            fontWeight: designTokens.typography.fontWeight.medium,
                          }}
                        >
                          {classItem.timing}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography 
                        variant="h4" 
                        sx={{ 
                          color: theme.palette.error.main,
                          fontWeight: designTokens.typography.fontWeight.bold,
                          fontSize: '1.75rem',
                        }}
                      >
                        ₹{classItem.amount}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: theme.palette.text.secondary,
                          fontSize: designTokens.typography.fontSize.sm,
                        }}
                      >
                        Complete course fee
                      </Typography>
                    </Box>
                    
                    <Box display="flex" gap={2} flexDirection={{ xs: 'column', sm: 'row' }}>
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => handleCardClick(classItem)}
                        sx={{
                          borderColor: theme.palette.primary.main,
                          color: theme.palette.primary.main,
                          fontWeight: designTokens.typography.fontWeight.medium,
                          borderRadius: designTokens.borderRadius.lg,
                          py: 1.5,
                          transition: `all ${designTokens.animation.duration.normal} ${designTokens.animation.easing.default}`,
                          '&:hover': {
                            borderColor: theme.palette.primary.dark,
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            transform: 'translateY(-2px)',
                          },
                        }}
                      >
                        Learn More
                      </Button>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => handleRegister(classItem)}
                        sx={{
                          background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
                          color: theme.palette.secondary.contrastText,
                          fontWeight: designTokens.typography.fontWeight.bold,
                          borderRadius: designTokens.borderRadius.lg,
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
                        Register Now
                      </Button>
                    </Box>
                  </CardContent>
                </ClassCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <StyledDialog
          open={!!selectedClass}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
          TransitionComponent={Fade}
        >
          {selectedClass && (
            <>
              <DialogTitle
                sx={{ 
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  color: theme.palette.primary.contrastText,
                  py: 3,
                  px: 4,
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
                }}
              >
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: designTokens.typography.fontWeight.bold,
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {selectedClass.name}
                </Typography>
              </DialogTitle>
              <DialogContent sx={{ p: 4 }}>
                {selectedClass.image?.url && (
                  <CardMedia
                    component="img"
                    sx={{
                      height: 320,
                      objectFit: "cover",
                      borderRadius: designTokens.borderRadius.lg,
                      mb: 3,
                      boxShadow: theme.shadows[4],
                    }}
                    image={selectedClass.image.url}
                    alt={selectedClass.name}
                  />
                )}
                
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ 
                      p: 3, 
                      borderRadius: designTokens.borderRadius.lg,
                      border: `1px solid ${theme.palette.divider}`,
                      ...glassMorphism(0.02),
                    }}>
                      <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                        <SchoolIcon sx={{ mr: 2, color: theme.palette.primary.main }} />
                        <Typography variant="h6" sx={{ fontWeight: designTokens.typography.fontWeight.bold }}>
                          Faculty: {selectedClass.facultyName}
                        </Typography>
                      </Box>
                      
                      <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                        <EventIcon sx={{ mr: 2, color: theme.palette.secondary.main }} />
                        <Typography variant="body1">
                          <strong>Duration:</strong> {selectedClass.duration}
                        </Typography>
                      </Box>
                      
                      <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                        <AccessTimeIcon sx={{ mr: 2, color: theme.palette.secondary.main }} />
                        <Typography variant="body1">
                          <strong>Timing:</strong> {selectedClass.timing}
                        </Typography>
                      </Box>
                      
                      <Box display="flex" alignItems="center">
                        <GroupsIcon sx={{ mr: 2, color: theme.palette.error.main }} />
                        <Typography variant="h5" sx={{ 
                          color: theme.palette.error.main,
                          fontWeight: designTokens.typography.fontWeight.bold,
                        }}>
                          ₹{selectedClass.amount}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Box sx={{ 
                      p: 3, 
                      borderRadius: designTokens.borderRadius.lg,
                      border: `1px solid ${theme.palette.divider}`,
                      ...glassMorphism(0.02),
                      height: '100%',
                    }}>
                      <Typography variant="h6" sx={{ 
                        fontWeight: designTokens.typography.fontWeight.bold,
                        mb: 2,
                        color: theme.palette.primary.main,
                      }}>
                        Description
                      </Typography>
                      <Typography variant="body1" sx={{ 
                        lineHeight: 1.7,
                        color: theme.palette.text.primary,
                      }}>
                        {selectedClass.description}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: designTokens.typography.fontWeight.bold,
                    mb: 2,
                    color: theme.palette.primary.main,
                  }}>
                    Course Contents:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedClass.contents.map((content, index) => (
                      <Chip 
                        key={index}
                        label={content} 
                        sx={{
                          backgroundColor: theme.palette.secondary.main,
                          color: theme.palette.secondary.contrastText,
                          fontWeight: designTokens.typography.fontWeight.medium,
                          borderRadius: designTokens.borderRadius.lg,
                          '&:hover': {
                            backgroundColor: theme.palette.secondary.dark,
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Box>
                
                {selectedClass.additionalDetails && (
                  <Box sx={{ 
                    p: 3, 
                    borderRadius: designTokens.borderRadius.lg,
                    backgroundColor: alpha(theme.palette.info.main, 0.1),
                    border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                  }}>
                    <Typography variant="h6" sx={{ 
                      fontWeight: designTokens.typography.fontWeight.bold,
                      mb: 1,
                      color: theme.palette.info.main,
                    }}>
                      Additional Details:
                    </Typography>
                    <Typography variant="body1" sx={{ 
                      lineHeight: 1.7,
                      color: theme.palette.text.primary,
                    }}>
                      {selectedClass.additionalDetails}
                    </Typography>
                  </Box>
                )}
              </DialogContent>
              <DialogActions sx={{ p: 4, pt: 0 }}>
                <Button 
                  onClick={handleCloseDialog}
                  variant="outlined"
                  sx={{
                    borderColor: theme.palette.text.secondary,
                    color: theme.palette.text.secondary,
                    borderRadius: designTokens.borderRadius.lg,
                    px: 3,
                    py: 1,
                    fontWeight: designTokens.typography.fontWeight.medium,
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  Close
                </Button>
                <Button
                  variant="contained"
                  onClick={() => handleRegister(selectedClass)}
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
                    color: theme.palette.secondary.contrastText,
                    fontWeight: designTokens.typography.fontWeight.bold,
                    borderRadius: designTokens.borderRadius.lg,
                    px: 4,
                    py: 1.5,
                    ml: 2,
                    boxShadow: theme.shadows[4],
                    transition: `all ${designTokens.animation.duration.normal} ${designTokens.animation.easing.default}`,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[8],
                      filter: 'brightness(1.1)',
                    }
                  }}
                >
                  Register Now
                </Button>
              </DialogActions>
            </>
          )}
        </StyledDialog>
      </Container>
      <Footer />
    </>
  );
};

export default EduGainerClassesDisplay;
