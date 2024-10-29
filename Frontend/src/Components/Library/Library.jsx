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
  Divider,
  Chip,
  Container,
  IconButton,
  Tooltip,
  Stack,
} from "@mui/material";
import {
  WatchLater,
  AcUnit as AcUnitIcon,
  Wifi,
  Weekend,
  PowerSettingsNew,
  MenuBook,
  Info as InfoIcon,
  ChevronRight,
  ChevronLeft,
} from "@mui/icons-material";
import Footer from "../footer";
import { Link } from "react-router-dom";
import { getSeatsData, getStudentLibSeat } from "../../services/library/utils";
import { AdminContext } from "../../App";
import { io } from "socket.io-client";
import { fetchAdminCredentials } from "../../services/chat/utils";

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

const FacilityCard = ({ icon, text }) => (
  <Card sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box sx={{ color: 'primary.main' }}>{icon}</Box>
      <Typography variant="body1">{text}</Typography>
    </CardContent>
  </Card>
);


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
      {seats.map((seat) => (
        <Button
          key={seat}
          variant="contained"
          sx={{
            width: isMobile ? 30 : 40,
            height: isMobile ? 30 : 40,
            minWidth: isMobile ? 30 : 40,
            p: 0,
            fontSize: isMobile ? "0.7rem" : "0.875rem",
            backgroundColor: getBackgroundColor(
              seatStatus,
              seat,
              selectedShift,
              userSeat,
              userShift
            ),
            "&:hover": {
              backgroundColor: getBackgroundColor(
                seatStatus,
                seat,
                selectedShift,
                userSeat,
                userShift
              ),
              opacity: 0.8,
            },
          }}
        >
          {seat}
        </Button>
      ))}
    </Box>
  );
};

const SubscriptionCard = ({ months, discount }) => (
  <Card sx={{ minWidth: 200, m: 1 }}>
    <CardContent>
      <Typography variant="h5" component="div">
        {months} Months
      </Typography>
      <Typography sx={{ mb: 1.5 }} color="text.secondary">
        {discount}% off
      </Typography>
      <Typography variant="body2">
        Subscribe now and save!
      </Typography>
    </CardContent>
  </Card>
);

const Library = () => {
  const { IsUserLoggedIn } = useContext(AdminContext);

  const [selectedShift, setSelectedShift] = useState(shifts[0]);
  const [seatStatus, setSeatStatus] = useState({});
  const [userSeat, setUserSeat] = useState(null);
  const [userShift, setUserShift] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showDiscount, setShowDiscount] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const maxSlides = Math.ceil(libraryRules.length / 2);

  // Previous useEffect and handler functions remain the same...

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % maxSlides);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + maxSlides) % maxSlides);
  };

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
        {/* Hero Section */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom>
            EduGainer's Library
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Your Gateway to Focused Learning and Academic Excellence
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
          >
            <Button
              component={Link}
              to="/new-reg"
              variant="contained"
              size="large"
              sx={{ minWidth: 200 }}
            >
              Register Now
            </Button>
            <Button
              component={Link}
              to="/library/fee-pay"
              variant="outlined"
              size="large"
              sx={{ minWidth: 200 }}
            >
              Pay Fee
            </Button>
          </Stack>
        </Box>

        {/* Facilities Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>
            Our Facilities
          </Typography>
          <Grid container spacing={3}>
            {libraryFacilities.map((facility, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <FacilityCard {...facility} />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Rules Section */}
        <Paper elevation={3} sx={{ p: 3, mb: 6 }}>
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <InfoIcon color="primary" />
            Library Rules
          </Typography>
          <Box sx={{ position: 'relative', my: 2 }}>
            <IconButton
              onClick={handlePrevSlide}
              sx={{ position: 'absolute', left: -20, top: '50%', transform: 'translateY(-50%)' }}
            >
              <ChevronLeft />
            </IconButton>
            <IconButton
              onClick={handleNextSlide}
              sx={{ position: 'absolute', right: -20, top: '50%', transform: 'translateY(-50%)' }}
            >
              <ChevronRight />
            </IconButton>
            <Box sx={{ overflow: 'hidden' }}>
              <Grid container spacing={2} sx={{ transform: `translateX(-${currentSlide * 100}%)`, transition: 'transform 0.3s' }}>
                {libraryRules.map((rule, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip size="small" label={index + 1} color="primary" />
                      {rule}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        </Paper>

        {/* Shift Selection */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Select Your Shift
          </Typography>
          <FormControl fullWidth>
            <InputLabel id="shift-select-label">Time Slot</InputLabel>
            <Select
              labelId="shift-select-label"
              value={selectedShift}
              onChange={handleShiftChange}
              label="Time Slot"
            >
              {shifts.map((shift) => (
                <MenuItem key={shift} value={shift}>{shift}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>


      <Slide direction="up" in={showDiscount} mountOnEnter unmountOnExit>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            mb: 4,
          }}
        >
          <SubscriptionCard months={3} discount={3} />
          <SubscriptionCard months={6} discount={6} />
          <SubscriptionCard months={9} discount={9} />
          <SubscriptionCard months={12} discount={12} />
        </Box>
      </Slide>

    

      <Alert severity="warning" sx={{ mt: 2, mb: 4 }}>
        <AlertTitle>Note</AlertTitle>
        In case the seat you need is not empty, kindly contact our office.
        Register early to secure your preferred seat!
      </Alert>
 <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Seat Layout
          </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              borderRadius: 2,
              position: "relative",
              overflow: "auto",
            }}
          >
            <Box sx={{ border: "2px solid #ccc", borderRadius: "8px", p: 2 }}>
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
                <Box sx={{ mr: 4 }}>door →</Box>
                <Box sx={{ width: 64, height: 4, bgcolor: "black" }}></Box>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      </Paper>
        <Alert severity="info" sx={{ mt: 4 }}>
        <AlertTitle>Legend</AlertTitle>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "flex-start",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ width: 16, height: 16, bgcolor: "purple", mr: 2 }}></Box>
            <Box>Your Seat</Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ width: 16, height: 16, bgcolor: "red", mr: 2 }}></Box>
            <Box>Booked</Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ width: 16, height: 16, bgcolor: "green", mr: 2 }}></Box>
            <Box>Empty</Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ width: 16, height: 16, bgcolor: "yellow", mr: 2 }}></Box>
            <Box>Pending</Box>
          </Box>
        </Box>
      </Alert>
      <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          message={snackbarMessage}
        />
      </Container>
      <Footer />
    </>

    
   
  );
};

export default Library;