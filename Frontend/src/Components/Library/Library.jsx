import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Box,
  Snackbar,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Alert,
  AlertTitle,
  Grid,
  Paper,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Typography,
  Slide,
  Chip,
  Container,
} from "@mui/material";
import {
  WatchLater,
  AcUnit as AcUnitIcon,
  Wifi,
  Weekend,
  PowerSettingsNew,
  MenuBook,
  Info as InfoIcon,
} from "@mui/icons-material";
import Footer from "../Footer/footer";
import { Link } from "react-router-dom";
import { getSeatsData, getStudentLibSeat } from "../../services/library/utils";
import { AdminContext } from "../../App";
import { io } from "socket.io-client";
import { fetchAdminCredentials } from "../../services/chat/utils";
import { designTokens } from '../../theme/enterpriseTheme';
import { defaultSnackbarConfig } from '../../utils/notificationUtils';

const libraryFacilities = [
  { icon: <WatchLater />, text: "24/7 Accessibility" },
  { icon: <AcUnitIcon />, text: "Temperature Control (Fans, AC, Heater)" },
  { icon: <Wifi />, text: "High-Speed WiFi" },
  { icon: <Weekend />, text: "Comfortable Seating" },
  { icon: <PowerSettingsNew />, text: "Individual Power Stations" },
  { icon: <MenuBook />, text: "Extensive Study Materials" },
];

const libraryRules = [
  "Maintain silence at all times",
  "Keep your mobile phones on silent mode",
  "Handle study materials with care",
  "Clean your space before leaving",
  "Report any issues to staff immediately",
];

const FacilityCard = ({ icon, text }) => {
  const theme = useTheme();
  
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center',
        borderRadius: designTokens.borderRadius.lg,
        border: `1px solid ${theme.palette.divider}`,
        transition: `all ${designTokens.animation.duration.normal} cubic-bezier(0.4, 0, 0.2, 1)`,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[1],
        p: 2,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[6],
          borderColor: theme.palette.primary.main,
          '& .facility-icon': {
            transform: 'scale(1.1)',
            color: theme.palette.primary.main,
          }
        },
      }}
    >
      <Box 
        className="facility-icon"
        sx={{ 
          color: theme.palette.primary.main,
          mr: 2,
          transition: `all ${designTokens.animation.duration.normal} cubic-bezier(0.4, 0, 0.2, 1)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 40,
          height: 40,
          borderRadius: designTokens.borderRadius.md,
          backgroundColor: theme.palette.action.hover,
        }}
      >
        {icon}
      </Box>
      <Typography 
        variant="body1" 
        sx={{ 
          fontWeight: designTokens.typography.fontWeight.medium,
          color: theme.palette.text.primary,
          flex: 1,
        }}
      >
        {text}
      </Typography>
    </Card>
  );
};


const shifts = [
  "6:30 AM to 2 PM",
  "2 PM to 9:30 PM",
  "6:30 PM to 11 PM",
  "9:30 PM to 6:30 AM",
  "2 PM to 11 PM",
  "6:30 AM to 6:30 PM",
  "24*7",
];

const checkOverlap = (currentShift, bookedShifts) => {
  if (bookedShifts.includes("24*7")) return true;

  const overlapMap = {
    "6:30 AM to 2 PM": ["6:30 AM to 6:30 PM", "24*7", "6:30 AM to 2 PM"],
    "2 PM to 9:30 PM": [
      "2 PM to 11 PM",
      "2 PM to 9:30 PM",
      "6:30 AM to 6:30 PM",
      "24*7",
    ],
    "6:30 PM to 11 PM": [
      "2 PM to 11 PM",
      "24*7",
      "2 PM to 9:30 PM",
      "9:30 PM to 6:30 AM",
      "6:30 PM to 11 PM",
    ],
    "9:30 PM to 6:30 AM": ["24*7", "6:30 PM to 11 PM", "2 PM to 11 PM"],
    "2 PM to 11 PM": [
      "2 PM to 9:30 PM",
      "6:30 PM to 11 PM",
      "6:30 AM to 6:30 PM",
      "24*7",
      "2 PM to 11 PM",
    ],
    "6:30 AM to 6:30 PM": [
      "6:30 AM to 2 PM",
      "2 PM to 9:30 PM",
      "2 PM to 11 PM",
      "24*7",
      "6:30 AM to 6:30 PM",
    ],
    "24*7": shifts,
  };

  return bookedShifts.some((shift) => overlapMap[currentShift].includes(shift));
};

const getBackgroundColor = (seatStatuses, seat, selectedShift, userSeat, userShift) => {
  if (!seatStatuses[seat]) {
    return "green"; // Default color if seat status is not available
  }

  // Check if there's a Confirmed status in any overlapping shift
  const hasOverlappingConfirmed = shifts.some(
    (shift) =>
      seatStatuses[seat][shift] === "Confirmed" &&
      checkOverlap(selectedShift, [shift])
  );

  if (hasOverlappingConfirmed) {
    return "yellow"; // Seat is confirmed in an overlapping shift
  }
  
  if (seat == userSeat && selectedShift === userShift) {
    return "purple";
  }
  
  // Get all booked (Paid) shifts for this seat
  const bookedShifts = shifts.filter(
    (shift) => seatStatuses[seat][shift] === "Paid"
  );

  // Check for overlapping booked shifts
  if (checkOverlap(selectedShift, bookedShifts)) {
    return "red"; // Seat has an overlapping booking
  } else {
    return "green"; // Seat can be allocated
  }
};

const SeatRow = ({ seats, seatStatus, userSeat, selectedShift, userShift }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ display: "flex", gap: 1, mb: 1, flexWrap: "wrap" }}>
      {seats.map((seat) => {
        const backgroundColor = getBackgroundColor(
          seatStatus,
          seat,
          selectedShift,
          userSeat,
          userShift
        );
        
        return (
          <Button
            key={seat}
            variant="contained"
            sx={{
              width: isMobile ? 32 : 44,
              height: isMobile ? 32 : 44,
              minWidth: isMobile ? 32 : 44,
              p: 0,
              fontSize: isMobile ? "0.7rem" : "0.875rem",
              fontWeight: designTokens.typography.fontWeight.bold,
              backgroundColor: backgroundColor,
              borderRadius: designTokens.borderRadius.sm,
              border: `2px solid ${
                backgroundColor === 'purple' 
                  ? theme.palette.secondary.main
                  : backgroundColor === 'red'
                  ? '#d32f2f'
                  : backgroundColor === 'green'
                  ? '#2e7d32'
                  : '#ed6c02'
              }`,
              color: backgroundColor === 'yellow' ? '#000' : '#fff',
              boxShadow: theme.shadows[1],
              transition: `all ${designTokens.animation.duration.normal} cubic-bezier(0.4, 0, 0.2, 1)`,
              "&:hover": {
                backgroundColor: backgroundColor,
                opacity: 0.8,
                transform: 'scale(1.05)',
                boxShadow: theme.shadows[3],
              },
            }}
          >
            {seat}
          </Button>
        );
      })}
    </Box>
  );
};

const Library = () => {
  const { IsUserLoggedIn } = useContext(AdminContext);

  const [selectedShift, setSelectedShift] = useState(shifts[0]);
  const [seatStatus, setSeatStatus] = useState({});
  const [userSeat, setUserSeat] = useState(null);
  const [userShift, setUserShift] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showDiscount, setShowDiscount] = useState(false);

  const socketRef = useRef(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const id = IsUserLoggedIn?._id;

  const url =
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_BACKEND_PROD
      : process.env.REACT_APP_BACKEND_DEV;

  useEffect(() => {
    const initializeData = async () => {
      try {
        const adminData = await fetchAdminCredentials();
        const roomId = adminData?._id;

        socketRef.current = io(url, {
          query: {
            sender: IsUserLoggedIn?._id,
            admin: adminData?._id,
          },
        });

        socketRef.current.emit("joinSeatsRoom", roomId);

        if (socketRef.current) {
          socketRef.current.on(
            "seatStatusUpdate",
            ({ id, status, seat, shift }) => {
            
              setSnackbarMessage(
                `Seat ${seat} status updated to ${status} for shift ${shift}`
              );
              setSnackbarOpen(true);
              setSeatStatus((prevStatus) => ({
                ...prevStatus,
                [seat]: {
                  ...prevStatus[seat],
                  [shift]: status,
                },
              }));
            }
          );
        }

        try {
          const response = await getSeatsData();
          let statusMap = {};
          shifts.forEach((shift) => {
            const shiftData = response[shift] || [];
            shiftData.forEach((e) => {
              if (!statusMap[e.seat]) {
                statusMap[e.seat] = {};
              }
              statusMap[e.seat][shift] = e.status || "Empty";
            });
          });
          setSeatStatus(statusMap);
        } catch (error) {
          console.error("Error fetching seat data:", error);
        }
        if (IsUserLoggedIn) {
          const userSeatData = await getStudentLibSeat(id);
          if (userSeatData?.booking?.seat && userSeatData?.booking?.shift) {
            setUserSeat(userSeatData.booking.seat);
            setUserShift(userSeatData.booking.shift);
          }
        }
      } catch (error) {
          console.error("Error initializing data:", error);
        }
      };
    
    initializeData();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [IsUserLoggedIn?._id, url]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleShiftChange = (event) => {
    setSelectedShift(event.target.value);
  };

  const toggleDiscountCards = () => {
    setShowDiscount(!showDiscount);
  };
return (
    <>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Hero Section - Redesigned */}
        <Box 
          sx={{ 
            mb: 6, 
            textAlign: 'center',
            p: { xs: 3, sm: 4, md: 6 },
            borderRadius: designTokens.borderRadius.xl,
            background: theme.palette.mode === 'dark' 
              ? `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`
              : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
            color: theme.palette.primary.contrastText,
            position: 'relative',
            overflow: 'hidden',
            boxShadow: theme.shadows[3],
            border: `1px solid ${theme.palette.mode === 'dark' ? theme.palette.primary.dark : 'transparent'}`,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: theme.palette.mode === 'dark' 
                ? 'radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.05) 0%, transparent 70%)'
                : 'radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
              pointerEvents: 'none',
            },
          }}
        >
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom
            sx={{
              fontWeight: designTokens.typography.fontWeight.bold,
              mb: 2,
              position: 'relative',
              zIndex: 1,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            }}
          >
            EduGainer's Library
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 4,
              opacity: 0.95,
              position: 'relative',
              zIndex: 1,
              maxWidth: 600,
              mx: 'auto',
              fontSize: { xs: '1rem', sm: '1.125rem' },
            }}
          >
            Your Gateway to Focused Learning and Academic Excellence
          </Typography>
        </Box>

        {/* Action Buttons Section - New Professional Design */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            mb: 6,
            borderRadius: designTokens.borderRadius.xl,
            backgroundColor: theme.palette.mode === 'dark' 
              ? theme.palette.background.paper 
              : theme.palette.background.default,
            border: `2px solid ${theme.palette.divider}`,
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
                ? `linear-gradient(135deg, ${theme.palette.primary.dark}10 0%, ${theme.palette.secondary.dark}10 100%)`
                : `linear-gradient(135deg, ${theme.palette.primary.light}05 0%, ${theme.palette.secondary.light}05 100%)`,
              pointerEvents: 'none',
            },
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography 
              variant="h5" 
              align="center"
              gutterBottom
              sx={{
                fontWeight: designTokens.typography.fontWeight.bold,
                color: theme.palette.text.primary,
                mb: 3,
              }}
            >
              Quick Actions
            </Typography>
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={12} sm={6} md={4}>
                <Button
                  component={Link}
                  to="/new-reg"
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{ 
                    py: 2,
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    borderRadius: designTokens.borderRadius.lg,
                    fontWeight: designTokens.typography.fontWeight.bold,
                    fontSize: '1.1rem',
                    boxShadow: theme.shadows[2],
                    border: `2px solid ${theme.palette.primary.main}`,
                    transition: `all ${designTokens.animation.duration.normal} cubic-bezier(0.4, 0, 0.2, 1)`,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                      transform: 'translateY(-3px)',
                      boxShadow: theme.shadows[4],
                    },
                  }}
                >
                  📚 Register Now
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Button
                  component={Link}
                  to="/library/fee-pay"
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{ 
                    py: 2,
                    backgroundColor: theme.palette.secondary.main,
                    color: theme.palette.mode === 'dark' ? theme.palette.text.primary : theme.palette.secondary.contrastText,
                    borderRadius: designTokens.borderRadius.lg,
                    fontWeight: designTokens.typography.fontWeight.bold,
                    fontSize: '1.1rem',
                    boxShadow: theme.shadows[2],
                    border: `2px solid ${theme.palette.secondary.main}`,
                    transition: `all ${designTokens.animation.duration.normal} cubic-bezier(0.4, 0, 0.2, 1)`,
                    '&:hover': {
                      backgroundColor: theme.palette.secondary.dark,
                      transform: 'translateY(-3px)',
                      boxShadow: theme.shadows[4],
                    },
                  }}
                >
                  💳 Pay Fee
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Button
                  onClick={toggleDiscountCards}
                  variant="outlined"
                  size="large"
                  fullWidth
                  sx={{ 
                    py: 2,
                    borderColor: theme.palette.info.main,
                    color: theme.palette.info.main,
                    borderWidth: 2,
                    borderRadius: designTokens.borderRadius.lg,
                    fontWeight: designTokens.typography.fontWeight.bold,
                    fontSize: '1.1rem',
                    backgroundColor: 'transparent',
                    transition: `all ${designTokens.animation.duration.normal} cubic-bezier(0.4, 0, 0.2, 1)`,
                    '&:hover': {
                      borderColor: theme.palette.info.main,
                      backgroundColor: theme.palette.info.main,
                      color: theme.palette.mode === 'dark' ? theme.palette.text.primary : theme.palette.info.contrastText,
                      borderWidth: 2,
                      transform: 'translateY(-3px)',
                      boxShadow: theme.shadows[2],
                    },
                  }}
                >
                  🎯 View Plans
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {/* Subscription Plans - Sliding section */}
        <Slide direction="up" in={showDiscount} mountOnEnter unmountOnExit>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mb: 6,
              borderRadius: designTokens.borderRadius.xl,
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography 
              variant="h5" 
              align="center" 
              gutterBottom
              sx={{
                fontWeight: designTokens.typography.fontWeight.bold,
                color: theme.palette.primary.main,
                mb: 3,
              }}
            >
              💰 Subscription Plans & Discounts
            </Typography>
            <Grid container spacing={3} justifyContent="center">
              {[
                { months: 3, discount: 3 },
                { months: 6, discount: 6 },
                { months: 9, discount: 9 },
                { months: 12, discount: 12 }
              ].map((plan) => (
                <Grid item xs={12} sm={6} md={3} key={plan.months}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      textAlign: 'center',
                      borderRadius: designTokens.borderRadius.lg,
                      border: `2px solid ${theme.palette.divider}`,
                      transition: `all ${designTokens.animation.duration.normal} cubic-bezier(0.4, 0, 0.2, 1)`,
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: theme.shadows[4],
                        borderColor: theme.palette.primary.main,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Typography 
                        variant="h4" 
                        component="div"
                        sx={{
                          fontWeight: designTokens.typography.fontWeight.bold,
                          color: theme.palette.primary.main,
                          mb: 1,
                        }}
                      >
                        {plan.months}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: theme.palette.text.secondary,
                          mb: 2,
                        }}
                      >
                        Months
                      </Typography>
                      <Chip
                        label={`${plan.discount}% OFF`}
                        sx={{
                          backgroundColor: theme.palette.success.main,
                          color: theme.palette.mode === 'dark' ? theme.palette.text.primary : '#fff',
                          fontWeight: designTokens.typography.fontWeight.bold,
                          fontSize: '0.875rem',
                        }}
                      />
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          mt: 2,
                          color: theme.palette.text.primary,
                        }}
                      >
                        Subscribe now and save!
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Slide>

        {/* Facilities Section - Redesigned */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            mb: 6,
            borderRadius: designTokens.borderRadius.xl,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography 
            variant="h4" 
            align="center"
            gutterBottom 
            sx={{ 
              fontWeight: designTokens.typography.fontWeight.bold,
              color: theme.palette.primary.main,
              mb: 4,
            }}
          >
            🏢 World-Class Facilities
          </Typography>
          <Grid container spacing={3}>
            {libraryFacilities.map((facility, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <FacilityCard {...facility} />
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Rules Section - Redesigned */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: { xs: 3, sm: 4 }, 
            mb: 6,
            borderRadius: designTokens.borderRadius.xl,
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Typography 
            variant="h5" 
            gutterBottom 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              fontWeight: designTokens.typography.fontWeight.bold,
              color: theme.palette.primary.main,
              mb: 3,
              justifyContent: 'center',
            }}
          >
            <InfoIcon sx={{ color: theme.palette.primary.main, fontSize: '1.5rem' }} />
            📋 Library Guidelines & Rules
          </Typography>
          
          <Grid container spacing={2}>
            {libraryRules.map((rule, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Box
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: 2,
                    p: 2,
                    borderRadius: designTokens.borderRadius.lg,
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? theme.palette.background.default 
                      : theme.palette.action.hover,
                    border: `1px solid ${theme.palette.divider}`,
                    transition: `all ${designTokens.animation.duration.normal} cubic-bezier(0.4, 0, 0.2, 1)`,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[2],
                      borderColor: theme.palette.primary.main,
                    },
                  }}
                >
                  <Chip 
                    size="small" 
                    label={index + 1} 
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      fontWeight: designTokens.typography.fontWeight.bold,
                      minWidth: 32,
                      height: 24,
                    }}
                  />
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: theme.palette.text.primary,
                      fontWeight: designTokens.typography.fontWeight.medium,
                      flex: 1,
                    }}
                  >
                    {rule}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Shift Selection - Redesigned */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            mb: 4,
            borderRadius: designTokens.borderRadius.xl,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography 
            variant="h5" 
            gutterBottom
            sx={{
              fontWeight: designTokens.typography.fontWeight.bold,
              color: theme.palette.primary.main,
              mb: 3,
              textAlign: 'center',
            }}
          >
            ⏰ Select Your Preferred Time Slot
          </Typography>
          <FormControl 
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: designTokens.borderRadius.lg,
                backgroundColor: theme.palette.mode === 'dark' 
                  ? theme.palette.background.default 
                  : theme.palette.background.paper,
                border: `2px solid ${theme.palette.divider}`,
                transition: `all ${designTokens.animation.duration.normal} cubic-bezier(0.4, 0, 0.2, 1)`,
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                },
                '&.Mui-focused': {
                  borderColor: theme.palette.primary.main,
                },
              },
              '& .MuiInputLabel-root': {
                color: theme.palette.text.secondary,
                fontWeight: designTokens.typography.fontWeight.medium,
                '&.Mui-focused': {
                  color: theme.palette.primary.main,
                },
              },
            }}
          >
            <InputLabel id="shift-select-label">Choose Time Slot</InputLabel>
            <Select
              labelId="shift-select-label"
              value={selectedShift}
              onChange={handleShiftChange}
              label="Choose Time Slot"
              sx={{
                '& .MuiSelect-select': {
                  fontWeight: designTokens.typography.fontWeight.medium,
                  color: theme.palette.text.primary,
                },
              }}
            >
              {shifts.map((shift) => (
                <MenuItem 
                  key={shift} 
                  value={shift}
                  sx={{
                    borderRadius: designTokens.borderRadius.sm,
                    mx: 1,
                    my: 0.5,
                    fontWeight: designTokens.typography.fontWeight.medium,
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                    '&.Mui-selected': {
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                      },
                    },
                  }}
                >
                  {shift}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>

        {/* Important Alert */}
        <Alert 
          severity="warning" 
          sx={{ 
            mb: 4,
            borderRadius: designTokens.borderRadius.lg,
            border: `1px solid ${theme.palette.warning.main}`,
            backgroundColor: theme.palette.mode === 'dark' 
              ? `${theme.palette.warning.main}10` 
              : `${theme.palette.warning.main}05`,
          }}
        >
          <AlertTitle sx={{ fontWeight: designTokens.typography.fontWeight.bold }}>
            📢 Important Note
          </AlertTitle>
          <Typography variant="body1">
            In case the seat you need is not available, kindly contact our office.
            <strong> Register early to secure your preferred seat!</strong>
          </Typography>
        </Alert>
        {/* Seat Layout Section - Redesigned */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: { xs: 3, sm: 4 }, 
            mb: 4,
            borderRadius: designTokens.borderRadius.xl,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography 
            variant="h5" 
            gutterBottom
            sx={{
              fontWeight: designTokens.typography.fontWeight.bold,
              color: theme.palette.primary.main,
              mb: 3,
              textAlign: 'center',
            }}
          >
            🪑 Interactive Seat Layout
          </Typography>
          
          <Paper
            elevation={2}
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: designTokens.borderRadius.lg,
              position: "relative",
              overflow: "auto",
              backgroundColor: theme.palette.mode === 'dark' 
                ? theme.palette.background.default 
                : '#fafafa',
              border: `2px solid ${theme.palette.divider}`,
            }}
          >
            <Box 
              sx={{ 
                border: `2px solid ${theme.palette.primary.main}`, 
                borderRadius: designTokens.borderRadius.lg, 
                p: { xs: 2, sm: 3 },
                backgroundColor: theme.palette.background.paper,
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  <SeatRow
                    seats={["A3", "A4", "A5", "A6", "A7", "A8", "A9", "A0"]}
                    seatStatus={seatStatus}
                    userSeat={userSeat}
                    selectedShift={selectedShift}
                    userShift={userShift}
                  />
                  <SeatRow
                    seats={[77, 78, 79, 80, 81, 82, 83, 84]}
                    seatStatus={seatStatus}
                    userSeat={userSeat}
                    selectedShift={selectedShift}
                    userShift={userShift}
                  />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  <Box>
                    <SeatRow
                      seats={[68, 67, 66, 65, 64, 63, 62, 61]}
                      seatStatus={seatStatus}
                      userSeat={userSeat}
                      selectedShift={selectedShift}
                      userShift={userShift}
                    />
                    <SeatRow
                      seats={[52, 51, 50, 49, 48, 47, 46, 45]}
                      seatStatus={seatStatus}
                      userSeat={userSeat}
                      selectedShift={selectedShift}
                      userShift={userShift}
                    />
                  </Box>
                  <Box>
                    <SeatRow
                      seats={[69, 70, 71, 72, 73, 74, 75, 76]}
                      seatStatus={seatStatus}
                      userSeat={userSeat}
                      selectedShift={selectedShift}
                      userShift={userShift}
                    />
                    <SeatRow
                      seats={[53, 54, 55, 56, 57, 58, 59, 60]}
                      seatStatus={seatStatus}
                      userSeat={userSeat}
                      selectedShift={selectedShift}
                      userShift={userShift}
                    />
                  </Box>
                </Box>

                <Box
                  sx={{ display: "flex", justifyContent: "flex-start", gap: 2 }}
                >
                  <Box>
                    <SeatRow
                      seats={[44, 43, 42, 41, 40, 39, 38, 37]}
                      seatStatus={seatStatus}
                      userSeat={userSeat}
                      selectedShift={selectedShift}
                      userShift={userShift}
                    />
                    <SeatRow
                      seats={[36, 35, 34, 33, 32, 31, 30, 29]}
                      seatStatus={seatStatus}
                      userSeat={userSeat}
                      selectedShift={selectedShift}
                      userShift={userShift}
                    />
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  <Box>
                    <SeatRow
                      seats={[28, 27, 26]}
                      seatStatus={seatStatus}
                      userSeat={userSeat}
                      selectedShift={selectedShift}
                      userShift={userShift}
                    />
                    <SeatRow
                      seats={[21, 20, 19]}
                      seatStatus={seatStatus}
                      userSeat={userSeat}
                      selectedShift={selectedShift}
                      userShift={userShift}
                    />
                    <SeatRow
                      seats={[14, 13, 12]}
                      seatStatus={seatStatus}
                      userSeat={userSeat}
                      selectedShift={selectedShift}
                      userShift={userShift}
                    />
                    <SeatRow
                      seats={[1, 2, 3]}
                      seatStatus={seatStatus}
                      userSeat={userSeat}
                      selectedShift={selectedShift}
                      userShift={userShift}
                    />
                  </Box>
                  <Box sx={{ mx: { xs: 0, sm: 2, md: 4, lg: 5 } }}>
                    <SeatRow
                      seats={[25, 24, 23, 22]}
                      seatStatus={seatStatus}
                      userSeat={userSeat}
                      selectedShift={selectedShift}
                      userShift={userShift}
                    />
                    <SeatRow
                      seats={[15, 16, 17, 18]}
                      seatStatus={seatStatus}
                      userSeat={userSeat}
                      selectedShift={selectedShift}
                      userShift={userShift}
                    />
                    <SeatRow
                      seats={[8, 9, 10, 11]}
                      seatStatus={seatStatus}
                      userSeat={userSeat}
                      selectedShift={selectedShift}
                      userShift={userShift}
                    />
                    <SeatRow
                      seats={[4, 5, 6, 7]}
                      seatStatus={seatStatus}
                      userSeat={userSeat}
                      selectedShift={selectedShift}
                      userShift={userShift}
                    />
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  mt: 4,
                }}
              >
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mr: 2, 
                    color: theme.palette.text.secondary,
                    fontWeight: designTokens.typography.fontWeight.medium,
                  }}
                >
                  🚪 Exit →
                </Typography>
                <Box 
                  sx={{ 
                    width: 64, 
                    height: 6, 
                    bgcolor: theme.palette.primary.main,
                    borderRadius: designTokens.borderRadius.sm,
                  }}
                />
              </Box>
            </Box>
          </Paper>
        </Paper>

        {/* Legend Section - Redesigned */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            mb: 4,
            borderRadius: designTokens.borderRadius.xl,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{
              fontWeight: designTokens.typography.fontWeight.bold,
              color: theme.palette.primary.main,
              mb: 3,
              textAlign: 'center',
            }}
          >
            🔍 Seat Status Legend
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            {[
              { color: "purple", label: "Your Seat", icon: "👤" },
              { color: "red", label: "Booked", icon: "❌" },
              { color: "green", label: "Available", icon: "✅" },
              { color: "yellow", label: "Pending", icon: "⏳" },
            ].map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box 
                  sx={{ 
                    display: "flex", 
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                    p: 2,
                    borderRadius: designTokens.borderRadius.lg,
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? theme.palette.background.default 
                      : theme.palette.action.hover,
                    border: `1px solid ${theme.palette.divider}`,
                    transition: `all ${designTokens.animation.duration.normal} cubic-bezier(0.4, 0, 0.2, 1)`,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[2],
                    },
                  }}
                >
                  <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>
                    {item.icon}
                  </Typography>
                  <Box 
                    sx={{ 
                      width: 20, 
                      height: 20, 
                      bgcolor: item.color, 
                      borderRadius: designTokens.borderRadius.sm,
                      border: `1px solid ${theme.palette.divider}`,
                    }} 
                  />
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: designTokens.typography.fontWeight.medium,
                      color: theme.palette.text.primary,
                    }}
                  >
                    {item.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
        <Snackbar
          {...defaultSnackbarConfig}
          open={snackbarOpen}
          onClose={handleCloseSnackbar}
          sx={{
            ...defaultSnackbarConfig.sx,
            '& .MuiSnackbarContent-root': {
              ...defaultSnackbarConfig.sx['& .MuiSnackbarContent-root'],
              backgroundColor: theme.palette.mode === 'dark' 
                ? theme.palette.primary.dark 
                : theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
            },
          }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity="info" 
            sx={{ 
              width: '100%',
              borderRadius: designTokens.borderRadius.lg,
            }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
      <Footer />
    </>
  );
};

export default Library;