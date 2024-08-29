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
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { AdminContext } from "../App";
import { logoutUser } from "../services/auth";
import logoImage from "../images/logo.jpg";

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
  const navigate = useNavigate();

  useEffect(() => {
    if (IsUserLoggedIn && IsUserLoggedIn.username) {
      const userInitials = IsUserLoggedIn.username
        .split(" ")
        .map((name) => name[0])
        .join("");
      setInitials(userInitials.toUpperCase());
    } else {
      setInitials("");
    }
  }, [IsUserLoggedIn]);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setIsUserLoggedIn(false);
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const isAdmin = IsUserLoggedIn?.role === "admin";
  const pages = IsUserLoggedIn
    ? isAdmin
      ? [
          { name: "Library", link: "/admin_library" },
          { name: "AdminChat", link: "/admin/chat" },
          { name: "MeriStationary", link: "/stationary/home" },
          { name: "Privacy Policy", link: "/Policies" },
        ]
      : [
          { name: "Library", link: "/library" },
          { name: "Classes", link: "/classes" },
          { name: "Resources", link: "/resources" },
          { name: "MeriStationary", link: "/stationary/home" },
          { name: "Query", link: "/chat/home" },
          { name: "Feedback", link: "/feedback" },
          { name: "Privacy Policy", link: "/Policies" },
        ]
    : [
        { name: "Library", link: "/library" },
        { name: "Classes", link: "/classes" },
        { name: "Resources", link: "/resources" },
        { name: "MeriStationary", link: "/stationary/home" },
        { name: "Query", link: "/chat/home" },
        { name: "Privacy Policy", link: "/Policies" },
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

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        EduGainer's
      </Typography>
      <List>
        {pages.map((page) => (
          <ListItem
            key={page.name}
            component={Link}
            to={page.link}
            sx={{ textAlign: "center" }}
          >
            <ListItemText primary={page.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar position="sticky" sx={{ backgroundColor: colors.primary }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
            <Box
              component="img"
              src={logoImage}
              alt="EduGainer's Logo"
              sx={{
                height: 40,
                marginRight: 2,
                display: { xs: "none", sm: "flex" },
              }}
            />
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to={homeURL}
              sx={{
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".1rem",
                color: colors.white,
                textDecoration: "none",
                "&:hover": {
                  color: colors.secondary,
                  transition: "color 0.3s ease-in-out",
                },
              }}
            >
              EduGainer's
            </Typography>
          </Box>

          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page.name}
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
            ))}
          </Box>

          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <Button
              variant="contained"
              startIcon={<MenuIcon />}
              onClick={handleDrawerToggle}
              sx={{
                backgroundColor: colors.secondary,
                color: colors.white,
                "&:hover": {
                  backgroundColor: colors.accent,
                  transition: "background-color 0.3s ease-in-out",
                },
              }}
            >
              Menu
            </Button>
          </Box>

          <Box sx={{ flexGrow: 0, ml: 2 }}>
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
        </Toolbar>
      </Container>
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
}

export default Navbar;
