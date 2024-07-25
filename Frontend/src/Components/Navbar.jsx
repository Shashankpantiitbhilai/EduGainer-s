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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { AdminContext } from "../App";
import { logoutUser } from "../services/auth";
import logoImage from "../images/logo.jpg";
const colors = {
  primary: "#006400", // Dark Green
  secondary: "#FFA500", // Orange
  text: "#333333",
  background: "#F0F8FF", // Light Sky Blue
  white: "#FFFFFF",
  accent: "#4CAF50", // Light Green
};

function Navbar() {
  const { IsUserLoggedIn, setIsUserLoggedIn } = useContext(AdminContext);
  const [initials, setInitials] = useState("");
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
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

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
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
          { name: "Policies", link: "/Policies" },
        ]
      : [
          { name: "Library", link: "/library" },
          { name: "Classes", link: "/classes" },
          { name: "Resources", link: "/resources" },
          { name: "Query", link: "/chat/home" },
          { name: "Policies", link: "/Policies" },
        ]
    : [];

  const homeURL = isAdmin ? "/admin_home" : "/";
  const settings = [
    {
      name: "Profile",
      link: `/profile/${IsUserLoggedIn ? IsUserLoggedIn._id : ""}`,
    },
    {
      name: "Dashboard",
      link: `/dashboard/${IsUserLoggedIn ? IsUserLoggedIn._id : ""}`,
    },
    { name: "Logout", link: "/logout", action: handleLogout },
  ];

  

  return (
    <AppBar position="static" sx={{ backgroundColor: colors.primary }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Box
            component="img"
            src={logoImage}
            alt="EduGainer's Logo"
            sx={{
              height: 40,
              marginRight: 2,
              display: { xs: "none", md: "flex" },
            }}
          />
          <Typography
            variant="h6"
            noWrap
          
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
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

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">
                    <Link
                      to={page.link}
                      style={{ textDecoration: "none", color: colors.text }}
                    >
                      {page.name}
                    </Link>
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Typography
            variant="h5"
            noWrap
            component={Link}
            to={homeURL}
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
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
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                component={Link}
                to={page.link}
                onClick={handleCloseNavMenu}
                sx={{
                  my: 2,
                  color: colors.white,
                  display: "block",
                  "&:hover": {
                    backgroundColor: colors.accent,
                    transition: "background-color 0.3s ease-in-out",
                  },
                }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title={IsUserLoggedIn ? "Open settings" : "Login"}>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                {IsUserLoggedIn ? (
                  <Avatar
                    alt={IsUserLoggedIn.username}
                    src="/static/images/avatar/2.jpg"
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
                    Begin Your Journey
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
    </AppBar>
  );
}

export default Navbar;