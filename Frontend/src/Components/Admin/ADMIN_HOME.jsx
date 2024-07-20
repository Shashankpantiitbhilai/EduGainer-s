import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Typography,
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Paper,
  Avatar,
} from "@mui/material";
import {
  ExitToApp as LogoutIcon,
  LibraryBooks as LibraryIcon,
  Class as ClassIcon,
  Quiz as QuizIcon,
  Chat as ChatIcon,
  Home as HomeIcon,
} from "@mui/icons-material";
import { AdminContext } from "../../App";
import { logoutUser } from "../../services/auth";

const colors = {
  primary: "#006400", // Dark Green
  secondary: "#FFA500", // Orange
  text: "#333333",
  background: "#F0F8FF", // Light Sky Blue
  white: "#FFFFFF",
  accent: "#4CAF50", // Light Green
};

function ADMIN_HOME() {
  const navigate = useNavigate();
  const { IsUserLoggedIn, setIsUserLoggedIn } = useContext(AdminContext);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setIsUserLoggedIn(false);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const adminTools = [
    { title: "Manage Library", icon: <LibraryIcon />, link: "/admin_library" },
    
  
    { title: "Admin Chat", icon: <ChatIcon />, link: "/admin/chat" },
  ];

  return (
    <Box
      sx={{
        flexGrow: 1,
        backgroundColor: colors.background,
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ borderRadius: "15px", overflow: "hidden" }}>
          <Box
            sx={{
              p: 3,
              backgroundColor: colors.white,
              borderBottom: `4px solid ${colors.primary}`,
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box display="flex" alignItems="center">
                <Avatar
                  sx={{
                    width: 60,
                    height: 60,
                    bgcolor: colors.primary,
                    mr: 2,
                  }}
                >
                  A
                </Avatar>
                <Box>
                  <Typography
                    variant="h4"
                    component="h1"
                    fontWeight="bold"
                    color={colors.primary}
                  >
                    Welcome, Admin
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {currentTime.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
              <Box>
                <IconButton
                  component={Link}
                  to="/admin_home"
                  color="primary"
                  sx={{ mr: 1 }}
                >
                  <HomeIcon />
                </IconButton>
                <IconButton onClick={handleLogout} color="secondary">
                  <LogoutIcon />
                </IconButton>
              </Box>
            </Box>
          </Box>

          <Box sx={{ p: 4 }}>
            <Typography
              variant="h5"
              component="div"
              gutterBottom
              color={colors.text}
              sx={{ mb: 4, textAlign: "center" }}
            >
              Manage EduGainer's Resources and Services
            </Typography>

            <Grid container spacing={4}>
              {adminTools.map((tool, index) => (
                <Grid item xs={12} sm={6} md={6} key={index}>
                  <Card
                    elevation={4}
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "all 0.3s",
                      borderRadius: "10px",
                      overflow: "hidden",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        textAlign: "center",
                        backgroundColor: colors.white,
                      }}
                    >
                      {React.cloneElement(tool.icon, {
                        style: {
                          fontSize: 60,
                          color: colors.primary,
                          marginBottom: "16px",
                        },
                      })}
                      <Typography
                        variant="h6"
                        component="div"
                        color={colors.text}
                      >
                        {tool.title}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: "center", p: 2 }}>
                      <Button
                        variant="contained"
                        component={Link}
                        to={tool.link}
                        sx={{
                          backgroundColor: colors.primary,
                          color: colors.white,
                          "&:hover": {
                            backgroundColor: colors.accent,
                          },
                          borderRadius: "20px",
                          px: 4,
                        }}
                      >
                        Access
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default ADMIN_HOME;
