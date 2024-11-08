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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { AdminContext } from "../App";
import { logoutUser } from "../services/auth";
import logoImage from "../images/logo.jpg";
import DarkModeToggle from '../darkmode';
import { LoadingContext } from "../App";
import { fetchUnseenMessages } from "../services/chat/utils";
import CustomDrawer from './Drawer';

const colors = {
  primary: "#006400",
  secondary: "#FFA500",
  text: "#FFFFFF",
  background: "#F0F8FF",
  white: "#FFFFFF",
  accent: "#4CAF50",
};

function Navbar() {
  const { IsUserLoggedIn, setIsUserLoggedIn } = useContext(AdminContext);
  const [initials, setInitials] = useState("");
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [unseenMessageCount, setUnseenMessageCount] = useState(0);
  const navigate = useNavigate();
  const { isDarkMode, setIsDarkMode } = useContext(LoadingContext);

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
          { name: "MeriStationary", link: "/stationary/home" },
          { name: "Events", link: "/admin/add-event" },
          { name: "Privacy", link: "/Policies" },
        { name: "Credits", link: "/credits" },
        { name: "Vision-Beta", link: "/admin/vision/uploader" },
         
        ]
      : [
          { name: "Library", link: "/library" },
          { name: "Classes", link: "/classes" },
       
          { name: "MeriStationary", link: "/stationary/home" },
        { name: "Query", link: "/chat/home", showBadge: true },
             { name: "Resources", link: "/resources" },
          { name: "Feedback", link: "/feedback" },
          { name: "Privacy", link: "/Policies" },
          { name: "Credits", link: "/credits" },
        ]
    : [
        { name: "Library", link: "/library" },
        { name: "Classes", link: "/classes" },
      
        { name: "MeriStationary", link: "/stationary/home" },
      { name: "Query", link: "/chat/home", showBadge: true },
          { name: "Resources", link: "/resources" },
        { name: "Privacy", link: "/Policies" },
        
        { name: "Credits", link: "/credits" },
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
    <AppBar position="sticky" sx={{ backgroundColor: colors.primary }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          {/* Logo Section */}
          <Box component={Link} to={homeURL} sx={{ display: "flex", alignItems: "center" }}>
            <Box
              component="img"
              src={logoImage}
              alt="EduGainer's Logo"
              sx={{
                height: { xs: 40, sm: 40 },
                display: "block",
              }}
            />
            <Typography
              variant="h6"
              noWrap
              sx={{
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".1rem",
                color: colors.white,
                textDecoration: "none",
                display: { xs: "none", md: "block" },
                "&:hover": {
                  color: colors.secondary,
                  transition: "color 0.3s ease-in-out",
                },
              }}
            >
              EduGainer's
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
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
                    color: colors.white,
                    display: "block",
                    mx: 1,
                    "&:hover": {
                      backgroundColor: colors.secondary,
                      transition: "background-color 0.3s ease-in-out",
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
                  sx={{ color: colors.white }}
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
                        bgcolor: colors.secondary,
                        "&:hover": {
                          bgcolor: colors.accent,
                          transition: "background-color 0.3s ease-in-out",
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
                        backgroundColor: colors.secondary,
                        color: colors.white,
                        "&:hover": {
                          backgroundColor: colors.accent,
                          transition: "background-color 0.3s ease-in-out",
                        },
                      }}
                    >
                      Login
                    </Button>
                  )}
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
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
                      "&:hover": {
                        backgroundColor: colors.background,
                        transition: "background-color 0.3s ease-in-out",
                      },
                    }}
                  >
                    <Typography textAlign="center">{setting.name}</Typography>
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