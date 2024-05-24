import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { AdminContext } from "../App";
import { logoutUser } from "../services/auth";

function Navbar() {
  const { IsUserLoggedIn, setIsUserLoggedIn } = useContext(AdminContext);
  const [initials, setInitials] = useState("");
  useEffect(() => {
    if (IsUserLoggedIn && IsUserLoggedIn.username) {
      const userInitials = IsUserLoggedIn.username
        .split(" ")
        .map((name) => name[0])
        .join("");
      setInitials(userInitials.toUpperCase());
    } else {
      setInitials(""); // Reset initials if user is not logged in or username is undefined
    }
  }, [IsUserLoggedIn]); // Trigger effect whenever IsUserLoggedIn changes

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handlelogin = () => {
    navigate("/login");
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleLogout = async () => {
    try {
      await logoutUser(); // Call the logout function
      setIsUserLoggedIn(false); // Update context to reflect logged out state
      navigate("/"); // Redirect to login page after successful logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  let pages = [];
  if (IsUserLoggedIn) {
    const role = IsUserLoggedIn.role;
    console.log(role);
    if (role === "admin") {
      pages = [
        { name: "Library", link: "/admin_library" },
        { name: "Classes", link: "/admin_classes" },
        { name: "Blog", link: "/admin_blog" },
      ];
    } else {
      pages = [
        { name: "Library", link: "/library" },
        { name: "Classes", link: "/classes" },
        { name: "Blog", link: "/blog" },
      ];
    }
  }


  const settingsLoggedIn = [
    {
      name: "Profile",
      link: `/profile/${IsUserLoggedIn ? IsUserLoggedIn._id : ""}`,
    },
    {
      name: `Dashboard`,
      link: `/dashboard/${IsUserLoggedIn ? IsUserLoggedIn._id : ""}`,
    },
    { name: "Logout", link: "/logout", action: handleLogout },
  ];
  const settings = settingsLoggedIn;

  console.log(settings);
  return (
    <AppBar position="static" className="nav">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
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
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {page.name}
                    </Link>
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            EduGainer's
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                <Link
                  to={page.link}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  {page.name}
                </Link>
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title={IsUserLoggedIn ? "Open Settings" : ""}>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                {IsUserLoggedIn ? (
                  <Avatar
                    alt={IsUserLoggedIn.username}
                    src="/static/images/avatar/2.jpg"
                  >
                    {initials}
                  </Avatar>
                ) : (
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={handlelogin}
                  >
                    Get Started
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
            >
              {IsUserLoggedIn &&
                settings.map((setting) => (
                  <MenuItem key={setting.name} onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">
                      {setting.name === "Logout" ? (
                        <Button
                          onClick={setting.action}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          {setting.name}
                        </Button>
                      ) : (
                        <Link
                          to={setting.link}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          {setting.name}
                        </Link>
                      )}
                    </Typography>
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
