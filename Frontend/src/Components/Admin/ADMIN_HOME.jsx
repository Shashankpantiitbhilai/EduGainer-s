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
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
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
  Transform as TransformIcon,
  ViewSidebar as LayoutIcon,
} from "@mui/icons-material";
import { AdminContext } from "../../App";
import { logoutUser } from "../../services/auth";
import { fetchUnseenMessages } from "../../services/chat/utils";
import DBLOGS from "./db-events";
import TrafficInsights from "./traffic/traffic";

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
  
  // Layout State
  const [layoutMode, setLayoutMode] = useState('split'); // 'split', 'logs-side', 'insights-side'
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  const toggleLayoutMode = () => {
    const modes = ['split', 'logs-side', 'insights-side'];
    const currentIndex = modes.indexOf(layoutMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setLayoutMode(modes[nextIndex]);
  };

  const adminTools = [
    { 
      title: "Manage Library", 
      icon: <LibraryIcon />, 
      link: "/admin_library" 
    },
    { 
      title: "Manage Classes", 
      icon: <ClassIcon />, 
      link: "/admin/classes" 
    },
    {
      title: "Admin Chat",
      icon: (
        <Badge badgeContent={unseenMessageCount} color="error">
          <ChatIcon />
        </Badge>
      ),
      link: "/admin/chat",
    },
    { 
      title: "Manage Events", 
      icon: <EventIcon />, 
      link: "/admin/add-event" 
    },
    { 
      title: "Doc Convert", 
      icon: <TransformIcon />, 
      link: "https://edugainers-format-test.vercel.app/",
      external: true 
    },
  ];

  const quickStats = [
    { 
      title: "Total Users", 
      value: "1,234", 
      icon: <UsersIcon />,
      color: "#1976d2" 
    },
    { 
      title: "Active Classes", 
      value: "42", 
      icon: <ClassIcon />,
      color: "#ff4400" 
    },
    { 
      title: "Library Items", 
      value: "5,678", 
      icon: <LibraryIcon />,
      color: "#4caf50" 
    },
    { 
      title: "Upcoming Events", 
      value: "7", 
      icon: <EventIcon />,
      color: "#ff9800" 
    },
  ];

  const renderAdminContent = () => (
    <Grid container spacing={4}>
      <Grid 
        item 
        xs={12} 
        md={layoutMode === 'split' ? 8 : 12}
      >
        {/* Quick Stats */}
        <Paper elevation={2} sx={{ p: 2, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Quick Stats
          </Typography>
          <Grid container spacing={2}>
            {quickStats.map((stat, index) => (
              <Grid item xs={6} sm={3} key={index}>
                <Box 
                  textAlign="center" 
                  sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    bgcolor: `${stat.color}10`, 
                    transition: 'transform 0.3s',
                    '&:hover': { transform: 'scale(1.05)' }
                  }}
                >
                  {React.cloneElement(stat.icon, {
                    sx: { 
                      fontSize: 40, 
                      color: stat.color, 
                      mb: 1 
                    },
                  })}
                  <Typography variant="h4" component="div" color={stat.color}>
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

        {/* Traffic Insights */}
        <Paper elevation={2} sx={{ p: 2, mb: 4 }}>
          <TrafficInsights />
        </Paper>

        {/* Admin Tools */}
        <Paper elevation={2} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Admin Tools
          </Typography>
          <Grid container spacing={2}>
            {adminTools.map((tool, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card 
                  sx={{ 
                    height: "100%", 
                    display: "flex", 
                    flexDirection: "column",
                    transition: 'transform 0.3s',
                    '&:hover': { 
                      transform: 'scale(1.05)',
                      boxShadow: 3 
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
                    {tool.icon}
                    <Typography variant="subtitle1">{tool.title}</Typography>
                  </CardContent>
                  <CardActions>
                    {tool.external ? (
                      <Button 
                        fullWidth 
                        variant="outlined" 
                        href={tool.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        Open
                      </Button>
                    ) : (
                      <Button 
                        fullWidth 
                        variant="outlined" 
                        component={Link} 
                        to={tool.link}
                      >
                        Access
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Grid>

      {/* Conditional Logs/Insights Rendering */}
      {layoutMode !== 'split' && (
        <Grid item xs={12} md={12}>
          {layoutMode === 'logs-side' ? <DBLOGS /> : <TrafficInsights />}
        </Grid>
      )}

      {/* Sidebar for Logs or Insights in Split Mode */}
      {layoutMode === 'split' && (
        <Grid item xs={12} md={4}>
          <DBLOGS />
        </Grid>
      )}
    </Grid>
  );

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      <Container maxWidth={false} sx={{ py: 4, px: { xs: 1, sm: 2, md: 4 } }}>
        <Paper elevation={3} sx={{ borderRadius: "15px", overflow: "hidden" }}>
          {/* Header Section */}
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
                <Tooltip title="Change Layout">
                  <IconButton color="primary" sx={{ mr: 1 }} onClick={toggleLayoutMode}>
                    <LayoutIcon />
                  </IconButton>
                </Tooltip>
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

          {/* Dashboard Content */}
          <Box sx={{ p: { xs: 1, sm: 2, md: 4 } }}>
            <Typography 
              variant="h5" 
              component="div" 
              gutterBottom 
              sx={{ 
                mb: 4, 
                fontWeight: "bold",
                display: "flex", 
                alignItems: "center", 
                justifyContent: "space-between" 
              }}
            >
              Admin Dashboard
              <Tooltip title="Toggle Layout">
                <IconButton onClick={toggleLayoutMode}>
                  <LayoutIcon />
                </IconButton>
              </Tooltip>
            </Typography>

            {renderAdminContent()}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default ADMIN_HOME;