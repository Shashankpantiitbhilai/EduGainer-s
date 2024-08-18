import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Grid,
  Paper,
  Divider,
  Button,
  Chip,
  Grow,
  Fade,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  School as SchoolIcon,
  Event as EventIcon,
  Phone as PhoneIcon,
  LocationOn as LocationOnIcon,
  Notifications as NotificationsIcon,
  ChevronRight as ChevronRightIcon,
  Class as ClassIcon,
  Assessment as AssessmentIcon,
  EmojiEvents as EmojiEventsIcon,
} from "@mui/icons-material";
import { AdminContext } from "../../App";

function EdugainerClasses() {
  const [comingSoonText, setComingSoonText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { IsUserLoggedIn } = useContext(AdminContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const text = "Coming Soon";
    let index = 0;
    const interval = setInterval(() => {
      if (index <= text.length) {
        setComingSoonText(text.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
        setIsLoading(false);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const offerings = [
    { type: "Class", items: ["6th to 12th"], icon: ClassIcon },
    { type: "Board", items: ["CBSE", "ICSE", "State Board"], icon: SchoolIcon },
    {
      type: "Competitive Exams",
      items: ["SSC CGL", "LT", "NEET", "JEE", "PCS"],
      icon: AssessmentIcon,
    },
    {
      type: "General Competitive Exams",
      items: ["Bank PO", "SSC", "Railway", "UPSC"],
      icon: EmojiEventsIcon,
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Fade in={true} timeout={1000}>
        <Paper
          elevation={6}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 4,
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              align="center"
              sx={{
                fontWeight: "bold",
                color: theme.palette.primary.main,
                mb: 2,
              }}
            >
              Welcome to EduGainer Classes
            </Typography>
            <Typography
              variant="h6"
              component="p"
              align="center"
              sx={{
                mb: 2,
                color: theme.palette.text.secondary,
                fontStyle: "italic",
              }}
            >
              Empowering Education Through Innovation
            </Typography>
            <Divider sx={{ mb: 4, bgcolor: theme.palette.divider }} />

            <Box mt={4}>
              <Typography
                variant="h4"
                gutterBottom
                sx={{ color: theme.palette.primary.main, fontWeight: "bold" }}
              >
                Our Comprehensive Offerings
              </Typography>
              <Grid container spacing={3}>
                {offerings.map((category, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Grow in={true} timeout={1000 + 500 * index}>
                      <Card
                        raised
                        sx={{
                          height: "100%",
                          backgroundColor: theme.palette.background.default,
                        }}
                      >
                        <CardContent>
                          <Box display="flex" alignItems="center" mb={2}>
                            {React.createElement(category.icon, {
                              sx: {
                                color: theme.palette.secondary.main,
                                mr: 1,
                              },
                            })}
                            <Typography
                              variant="h6"
                              sx={{
                                color: theme.palette.primary.main,
                                fontWeight: "bold",
                                fontSize: "1rem", // Adjust font size for better fit
                              }}
                            >
                              {category.type}
                            </Typography>
                          </Box>
                          <Box display="flex" flexWrap="wrap" gap={1}>
                            {category.items.map((item, itemIndex) => (
                              <Chip
                                key={itemIndex}
                                label={item}
                                size="small" // Make chips smaller
                                sx={{
                                  backgroundColor:
                                    theme.palette.secondary.light,
                                  color: theme.palette.secondary.contrastText,
                                  "&:hover": {
                                    backgroundColor:
                                      theme.palette.secondary.main,
                                  },
                                  fontSize: "0.75rem", // Adjust font size for better fit
                                }}
                              />
                            ))}
                          </Box>
                        </CardContent>
                      </Card>
                    </Grow>
                  </Grid>
                ))}
              </Grid>
            </Box>
            <Grid container spacing={4} sx={{ marginTop: 4 }}>
              <Grid item xs={12} md={6}>
                <Grow in={true} timeout={1000}>
                  <Card
                    raised
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      backgroundColor: theme.palette.background.default,
                      transition:
                        "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: theme.shadows[10],
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <SchoolIcon
                        sx={{
                          fontSize: isMobile ? 48 : 64,
                          color: theme.palette.secondary.main,
                          animation: "pulse 2s infinite",
                          "@keyframes pulse": {
                            "0%": { transform: "scale(1)" },
                            "50%": { transform: "scale(1.1)" },
                            "100%": { transform: "scale(1)" },
                          },
                        }}
                      />
                      <Typography
                        variant="h5"
                        component="h3"
                        gutterBottom
                        sx={{
                          mt: 2,
                          fontWeight: "bold",
                          color: theme.palette.primary.main,
                        }}
                      >
                        Online Classes
                      </Typography>
                      {isLoading ? (
                        <CircularProgress
                          sx={{ mt: 2, color: theme.palette.secondary.main }}
                        />
                      ) : (
                        <>
                          <Typography
                            variant="h4"
                            color={theme.palette.secondary.main}
                            gutterBottom
                            sx={{
                              mt: 2,
                              fontWeight: "bold",
                            }}
                          >
                            {comingSoonText}
                          </Typography>
                          <Typography
                            variant="body2"
                            color={theme.palette.text.secondary}
                            align="center"
                          >
                            Stay tuned for our upcoming online offerings!
                          </Typography>
                          <Button
                            variant="contained"
                            color="secondary"
                            sx={{
                              mt: 2,
                              borderRadius: 20,
                              transition: "all 0.3s ease-in-out",
                              "&:hover": {
                                transform: "scale(1.05)",
                                boxShadow: theme.shadows[8],
                              },
                            }}
                            endIcon={<NotificationsIcon />}
                          >
                            Notify Me
                          </Button>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grow in={true} timeout={1500}>
                  <Card
                    raised
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      backgroundColor: theme.palette.background.default,
                      transition:
                        "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: theme.shadows[10],
                      },
                    }}
                  >
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={2}>
                        <EventIcon
                          sx={{
                            fontSize: 32,
                            color: theme.palette.secondary.main,
                            mr: 1,
                          }}
                        />
                        <Typography
                          variant="h5"
                          component="h3"
                          sx={{
                            fontWeight: "bold",
                            color: theme.palette.primary.main,
                          }}
                        >
                          Offline Classes Available
                        </Typography>
                      </Box>
                      <Typography
                        variant="body1"
                        paragraph
                        sx={{ color: theme.palette.text.secondary }}
                      >
                        Visit our center for personalized learning experiences!
                      </Typography>
                      <Box display="flex" alignItems="center" mb={1}>
                        <LocationOnIcon
                          sx={{
                            fontSize: 24,
                            color: theme.palette.secondary.main,
                            mr: 1,
                          }}
                        />
                        <Typography
                          variant="body1"
                          sx={{ color: theme.palette.text.primary }}
                        >
                          Near Court Road, EduGainer's Classes & Library,
                          Uttarkashi, PIN-249193
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" mb={2}>
                        <PhoneIcon
                          sx={{
                            fontSize: 24,
                            color: theme.palette.secondary.main,
                            mr: 1,
                          }}
                        />
                        <Typography
                          variant="body1"
                          sx={{ color: theme.palette.text.primary }}
                        >
                          9997999768 | 8126857111 | 9997999765
                        </Typography>
                      </Box>
                      <Button
                        variant="outlined"
                        color="primary"
                        sx={{
                          mt: 2,
                          transition: "all 0.3s ease-in-out",
                          "&:hover": {
                            backgroundColor: theme.palette.action.hover,
                            transform: "scale(1.05)",
                          },
                        }}
                        endIcon={<ChevronRightIcon />}
                      >
                        Contact Us
                      </Button>
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Fade>
    </Container>
  );
}

export default EdugainerClasses;
