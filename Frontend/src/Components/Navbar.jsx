import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Fade,
  Badge,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { AdminContext } from "../App";
import { logoutUser } from "../services/auth";
import logoImage from "../images/logo.jpg";
import DarkModeToggle from '../darkmode';
import { LoadingContext } from "../App";
import { fetchUnseenMessages } from "../services/chat/utils";
import CustomDrawer from './Drawer';
import { colors } from "../theme/enterpriseTheme";
import { designTokens } from '../theme/enterpriseTheme';

function Navbar() {
  const { IsUserLoggedIn, setIsUserLoggedIn } = useContext(AdminContext);
  const [initials, setInitials] = useState("");
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [unseenMessageCount, setUnseenMessageCount] = useState(0);
  const navigate = useNavigate();
  const { isDarkMode, setIsDarkMode } = useContext(LoadingContext);
  const theme = useTheme();

  useEffect(() => {
    if (IsUserLoggedIn?.username) {
      const userInitials = IsUserLoggedIn.username
        .split(" ")
        .map((name) => name[0])
        .join("");
      setInitials(userInitials.toUpperCase());
    } else {
      setInitials("");
    }
  }, [IsUserLoggedIn]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const userId = IsUserLoggedIn?._id;
        const unseenMessages = await fetchUnseenMessages();
        const validMessages = unseenMessages.filter(
          (message) => message.messages[0].receiever !== userId || message.messages[0].receiever === "All"
        );
        setUnseenMessageCount(validMessages.length);
      } catch (error) {
        console.error("Error fetching unseen messages:", error);
      }
    };

    if (IsUserLoggedIn) {
      fetchMessages();
    }
  }, [IsUserLoggedIn]);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("theme", newMode ? "dark" : "light");
      return newMode;
    });
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDrawerToggle = () => {
    setUnseenMessageCount(0);
    setDrawerOpen(!drawerOpen);
  };
  const handleUnseenMessage = () => {
   setUnseenMessageCount(0);
}
  const handleLogout = async () => {
    try {
      await logoutUser();
      setIsUserLoggedIn(false);
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const isAdmin = IsUserLoggedIn?.role === "admin" || IsUserLoggedIn?.role === "superAdmin" ;
  const pages = IsUserLoggedIn
    ? isAdmin
      ? [
          { name: "Library", link: "/admin_library" },
          { name: "Classes", link: "/admin/classes" },
          { name: "AdminChat", link: "/admin/chat" },
         
          { name: "Events", link: "/admin/add-event" },
        
        
        { name: "Doc-Convert", link: "https://edugainers-format-test.vercel.app/" },
         { name: "MeriStationary", link: "/stationary/home" },
          { name: "Privacy", link: "/Policies" },
         
        ]
      : [
          { name: "Library", link: "/library" },
          { name: "Classes", link: "/classes" },
       
          { name: "MeriStationary", link: "/stationary/home" },
        { name: "Query", link: "/chat/home", showBadge: true },
             { name: "Resources", link: "/resources" },
          { name: "Feedback", link: "/feedback" },
          { name: "Privacy", link: "/Policies" },
        
        ]
    : [
        { name: "Library", link: "/library" },
        { name: "Classes", link: "/classes" },
      
        { name: "MeriStationary", link: "/stationary/home" },
      { name: "Query", link: "/chat/home", showBadge: true },
          { name: "Resources", link: "/resources" },
        { name: "Privacy", link: "/Policies" },
        
     
      ];

  const id = IsUserLoggedIn?._id;
  const homeURL = isAdmin ? "/admin_home" : "/";
  const dashboardUrl = isAdmin ? "/admin_dashboard" : `/dashboard/${id}`;

  const settings = [
    {
      name: "Profile",
      link: `/profile/${IsUserLoggedIn ? IsUserLoggedIn._id : ""}`,
    },
    {
      name: "Dashboard",
      link: `${dashboardUrl}`,
    },
    { name: "Logout", link: "/logout", action: handleLogout },
  ];

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        backgroundColor: theme.palette.primary.main,
        boxShadow: theme.shadows[2],
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2 } }}>
        <Toolbar 
          sx={{ 
            justifyContent: "space-between",
            minHeight: { xs: 56, sm: 64 },
            px: 0,
          }}
        >
          {/* Logo Section */}
          <Box 
            component={Link} 
            to={homeURL} 
            sx={{ 
              display: "flex", 
              alignItems: "center",
              textDecoration: 'none',
              transition: `transform ${designTokens.animation.duration.normal} ${designTokens.animation.easing.default}`,
              '&:hover': {
                transform: 'scale(1.02)',
              },
            }}
          >
            <Box
              component="img"
              src={logoImage}
              alt="EduGainer's Logo"
              sx={{
                height: { xs: 40, sm: 48 },
                width: 'auto',
                display: "block",
                borderRadius: designTokens.borderRadius.sm,
              }}
            />
            <Typography
              variant="h6"
              noWrap
              sx={{
                fontFamily: designTokens.typography.fontFamily,
                fontWeight: designTokens.typography.fontWeight.bold,
                letterSpacing: ".1rem",
                color: theme.palette.primary.contrastText,
                textDecoration: "none",
                display: { xs: "none", md: "block" },
                ml: 2,
                transition: `color ${designTokens.animation.duration.normal} ${designTokens.animation.easing.default}`,
                "&:hover": {
                  color: theme.palette.secondary.main,
                },
              }}
            >
              EduGainer's
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1 }}>
            {pages.map((page) => (
              <Badge
                key={page.name}
                badgeContent={page.showBadge ? unseenMessageCount : 0}
                color="error"
                invisible={!page.showBadge || unseenMessageCount === 0}
              >
                <Button
                  onClick={handleUnseenMessage}
                  component={Link}
                  to={page.link}
                  sx={{
                    color: theme.palette.primary.contrastText,
                    fontWeight: designTokens.typography.fontWeight.medium,
                    fontSize: designTokens.typography.fontSize.sm,
                    px: 2,
                    py: 1,
                    borderRadius: designTokens.borderRadius.lg,
                    textTransform: 'none',
                    transition: `all ${designTokens.animation.duration.normal} ${designTokens.animation.easing.default}`,
                    "&:hover": {
                      backgroundColor: theme.palette.secondary.main,
                      color: theme.palette.secondary.contrastText,
                      transform: 'translateY(-1px)',
                      boxShadow: theme.shadows[2],
                    },
                  }}
                >
                  {page.name}
                </Button>
              </Badge>
            ))}
          </Box>

          {/* Mobile Actions */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Dark Mode Toggle */}
            <Box sx={{ display: "flex" }}>
              <DarkModeToggle isDarkMode={isDarkMode} onToggle={toggleTheme} />
            </Box>

            {/* Mobile Menu Button */}
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <Badge 
                badgeContent={unseenMessageCount} 
                color="error"
                invisible={unseenMessageCount === 0}
              >
                <IconButton
                  onClick={handleDrawerToggle}
                  sx={{ 
                    color: theme.palette.primary.contrastText,
                    borderRadius: designTokens.borderRadius.sm,
                    transition: `all ${designTokens.animation.duration.normal} ${designTokens.animation.easing.default}`,
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  <MenuIcon />
                </IconButton>
              </Badge>
            </Box>

            {/* User Settings */}
            <Box>
              <Tooltip title={IsUserLoggedIn ? "Open settings" : "Login"}>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  {IsUserLoggedIn ? (
                    <Avatar
                      alt={IsUserLoggedIn.username}
                      sx={{
                        bgcolor: theme.palette.secondary.main,
                        color: theme.palette.secondary.contrastText,
                        fontWeight: designTokens.typography.fontWeight.bold,
                        width: 40,
                        height: 40,
                        transition: `all ${designTokens.animation.duration.normal} ${designTokens.animation.easing.default}`,
                        "&:hover": {
                          bgcolor: theme.palette.secondary.dark,
                          transform: 'scale(1.1)',
                          boxShadow: theme.shadows[3],
                        },
                      }}
                    >
                      {initials}
                    </Avatar>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={() => navigate("/login")}
                      sx={{
                        backgroundColor: theme.palette.secondary.main,
                        color: theme.palette.secondary.contrastText,
                        fontWeight: designTokens.typography.fontWeight.medium,
                        borderRadius: designTokens.borderRadius.lg,
                        px: 3,
                        py: 1,
                        textTransform: 'none',
                        transition: `all ${designTokens.animation.duration.normal} ${designTokens.animation.easing.default}`,
                        "&:hover": {
                          backgroundColor: theme.palette.secondary.dark,
                          transform: 'translateY(-2px)',
                          boxShadow: theme.shadows[3],
                        },
                      }}
                    >
                      Login
                    </Button>
                  )}
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ 
                  mt: "45px",
                  '& .MuiPaper-root': {
                    borderRadius: designTokens.borderRadius.lg,
                    border: `1px solid ${theme.palette.divider}`,
                    boxShadow: theme.shadows[3],
                  },
                }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                TransitionComponent={Fade}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting.name}
                    onClick={setting.action || handleCloseUserMenu}
                    component={setting.action ? "div" : Link}
                    to={setting.link}
                    sx={{
                      borderRadius: designTokens.borderRadius.sm,
                      mx: 1,
                      my: 0.5,
                      fontWeight: designTokens.typography.fontWeight.medium,
                      transition: `all ${designTokens.animation.duration.normal} ${designTokens.animation.easing.default}`,
                      "&:hover": {
                        backgroundColor: theme.palette.action.hover,
                        transform: 'translateX(4px)',
                      },
                    }}
                  >
                    <Typography 
                      textAlign="center"
                      sx={{
                        fontWeight: designTokens.typography.fontWeight.medium,
                        color: theme.palette.text.primary,
                      }}
                    >
                      {setting.name}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Box>
        </Toolbar>
      </Container>

      <CustomDrawer
        open={drawerOpen}
        onClose={handleDrawerToggle}
        pages={pages}
        unseenMessageCount={unseenMessageCount}
      />
    </AppBar>
  );
}

export default Navbar;