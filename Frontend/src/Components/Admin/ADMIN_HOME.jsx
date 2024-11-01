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
  Tooltip,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
  Stack,
} from "@mui/material";
import {
  ExitToApp as LogoutIcon,
  LibraryBooks as LibraryIcon,
  Class as ClassIcon,
  Chat as ChatIcon,
  Event as EventIcon,
  People as UsersIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Dashboard as DashboardIcon,
  Close as CloseIcon,
  Mail as MailIcon,
} from "@mui/icons-material";
import { AdminContext } from "../../App";
import { logoutUser } from "../../services/auth";
import { fetchUnseenMessages } from "../../services/chat/utils";
import DBLOGS from "./db-events";

// Transition component for smooth popup animation
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function ADMIN_HOME() {
  const navigate = useNavigate();
  const { IsUserLoggedIn, setIsUserLoggedIn } = useContext(AdminContext);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [unseenMessageCount, setUnseenMessageCount] = useState(0);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const adminId = IsUserLoggedIn?._id;
        const unseenMessages = await fetchUnseenMessages();
        const nonAdminMessages = unseenMessages.filter(
          (message) => message.user !== adminId
        );
        setUnseenMessageCount(nonAdminMessages.length);
        if (nonAdminMessages.length > 0) {
          setShowNotification(true);
        }
      } catch (error) {
        console.error("Error fetching unseen messages:", error);
      }
    };
    fetchData();
  }, [IsUserLoggedIn]);

  const handleCloseNotification = () => {
    setShowNotification(false);
  };

  const handleViewMessages = () => {
    setShowNotification(false);
    navigate("/admin/chat");
  };

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
    { title: "Manage Classes", icon: <ClassIcon />, link: "/admin/classes" },
    {
      title: "Admin Chat",
      icon: (
        <Badge badgeContent={unseenMessageCount} color="error">
          <ChatIcon />
        </Badge>
      ),
      link: "/admin/chat",
    },
    { title: "Manage Events", icon: <EventIcon />, link: "/admin/add-event" },
  ];

  const quickStats = [
    { title: "Total Users", value: "1,234", icon: <UsersIcon /> },
    { title: "Active Classes", value: "42", icon: <ClassIcon /> },
    { title: "Library Items", value: "5,678", icon: <LibraryIcon /> },
    { title: "Upcoming Events", value: "7", icon: <EventIcon /> },
  ];

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      <Dialog
        open={showNotification}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseNotification}
        aria-describedby="notification-dialog"
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2, bgcolor: "#1976d2", color: "white" }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <MailIcon />
            <Typography variant="h6">New Messages</Typography>
          </Stack>
          <IconButton
            aria-label="close"
            onClick={handleCloseNotification}
            sx={{ position: "absolute", right: 8, top: 8, color: "white" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Box sx={{ py: 2, textAlign: "center" }}>
            <Badge badgeContent={unseenMessageCount} color="error" sx={{ mb: 2 }}>
              <ChatIcon sx={{ fontSize: 40, color: "#1976d2" }} />
            </Badge>
            <Typography variant="h6" gutterBottom>
              You have {unseenMessageCount} new message{unseenMessageCount !== 1 ? "s" : ""}!
            </Typography>
            <Typography color="text.secondary">
              Click below to view your messages in the chat section.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={handleCloseNotification} color="inherit">
            Dismiss
          </Button>
          <Button onClick={handleViewMessages} variant="contained" startIcon={<ChatIcon />}>
            View Messages
          </Button>
        </DialogActions>
      </Dialog>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ borderRadius: "15px", overflow: "hidden" }}>
          <Box sx={{ p: 3, borderBottom: "1px solid #e0e0e0" }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" alignItems="center">
                <Avatar sx={{ width: 60, height: 60, mr: 2, bgcolor: "#1976d2" }}>A</Avatar>
                <Box>
                  <Typography variant="h4" component="h1" fontWeight="bold">
                    Welcome, Admin
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {currentTime.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
              <Box>
                <Tooltip title="Dashboard">
                  <IconButton color="primary" sx={{ mr: 1 }}>
                    <DashboardIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Settings">
                  <IconButton color="primary" sx={{ mr: 1 }}>
                    <SettingsIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Logout">
                  <IconButton onClick={handleLogout} color="secondary">
                    <LogoutIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Box>

          <Box sx={{ p: 4 }}>
            <Typography variant="h5" component="div" gutterBottom sx={{ mb: 4, fontWeight: "bold" }}>
              Admin Dashboard
            </Typography>

            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Paper elevation={2} sx={{ p: 2, mb: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    Quick Stats
                  </Typography>
                  <Grid container spacing={2}>
                    {quickStats.map((stat, index) => (
                      <Grid item xs={6} sm={3} key={index}>
                        <Box textAlign="center">
                          {React.cloneElement(stat.icon, {
                            sx: { fontSize: 40, color: "#1976d2", mb: 1 },
                          })}
                          <Typography variant="h4" component="div">
                            {stat.value}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {stat.title}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>

                <Paper elevation={2} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Admin Tools
                  </Typography>
                  <Grid container spacing={2}>
                    {adminTools.map((tool, index) => (
                      <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                          <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
                            {tool.icon}
                            <Typography variant="subtitle1">{tool.title}</Typography>
                          </CardContent>
                          <CardActions>
                            <Button fullWidth variant="outlined" component={Link} to={tool.link}>
                              Access
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Grid>

              <Grid item xs={12} md={4}>
                <DBLOGS />
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default ADMIN_HOME;
