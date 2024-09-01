import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Snackbar,
  Alert,
  Grid,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import {
  getSeatInfo,
  getStudentInfo,
  updateSeatStatus,
} from "../../../../services/Admin_services/admin_lib";
import { getSeatsData } from "../../../../services/library/utils";
import ShiftSelector from "./shiftSelector";
import SeatRow from "./seatRow";
import SeatLegend from "./seatLegend";
import SeatInfoDialog from "./seatInfoDialog";
import PaymentFormDialog from "./PaymentFormDialog";
import MultiplePersonsDialog from "./multiplePersonDialg";
import DetailedPersonDialog from "./DetailedPersonDialog";
import io from "socket.io-client";
import { AdminContext } from "../../../../App";
import {getSeatColor} from "./getSeatColor";
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

const ManageSeats = () => {
  const [selectedShift, setSelectedShift] = useState("6:30 AM to 6:30 PM");
  const [seatStatus, setSeatStatus] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [seatInfo, setSeatInfo] = useState("");
  const [multiplePersonsDialogOpen, setMultiplePersonsDialogOpen] =
    useState(false);
  const [detailedPersonDialogOpen, setDetailedPersonDialogOpen] =
    useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [formData, setFormData] = useState({
    Reg: "",
    Name: "",
    Seat: "",
    Date: "#########",
    Cash: 0,
    Online: 0,
    Shift: "",
    Fee: 0,
    Remarks: "",
    Status: "Paid",
  });
  const { IsUserLoggedIn } = useContext(AdminContext);
  const [socket, setSocket] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const url =
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_BACKEND_PROD
      : process.env.REACT_APP_BACKEND_DEV;

  useEffect(() => {
    fetchData();
  }, [selectedShift]);

  useEffect(() => {
    const newSocket = io(url);
    const roomId = IsUserLoggedIn?._id;
    setSocket(newSocket);
    newSocket?.emit("joinSeatsRoom", roomId);
    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("seatStatusUpdate", ({ id, status, seat, shift }) => {
      
    
        setSeatStatus((prevStatus) => ({
          ...prevStatus,
          [seat]: {
            ...prevStatus[seat],
            [shift]: status,
          },
        }));
        setSnackbarMessage(
          `Seat ${seat} status updated to ${status} for shift ${shift}`
        );
        setSnackbarOpen(true);
      });
    }
  }, [socket]);

  const fetchData = async () => {
    try {
      let statusMap = {};
      const response = await getSeatsData();
   
      shifts.forEach((shift) => {
        const shiftData = response[shift];
        if (shiftData) {
          shiftData.forEach((e, key) => {
            if (!statusMap[e.seat]) {
            
           
              statusMap[e.seat] = {};
            }
            if (e.seat === "6" && shift === "24*7") {
console.log(e.status,"staus")
            }
            statusMap[e.seat][shift] = e.status || "Unknown";
          });
        }
      });
       console.log(statusMap)
    
      setSeatStatus(statusMap);
    } catch (error) {
      setSnackbarMessage("Error fetching seat data");
      setSnackbarOpen(true);
    }
  };

  const handleShiftChange = (event) => {
    setSelectedShift(event.target.value);
  };

  const handleSeatClick = (seatNumber) => {
    setSelectedSeat(seatNumber);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedSeat(null);
  };

  const handleStatusChange = async (newStatus) => {
    try {
      if (newStatus === "Paid") {
        setFormData({
          Status: newStatus,
        });
        setFormDialogOpen(true);
      }
    } catch (error) {
      setSnackbarMessage("Error updating seat status");
      setSnackbarOpen(true);
    }
  };

 const handleFormSubmit = async (reg) => {
   try {
    
     const currentSeatStatus = seatStatus[selectedSeat];
// console.log(currentSeatStatus)
     // Check for overlapping Paid or Confirmed shifts
     if (currentSeatStatus) {
       const overlappingShifts = Object.keys(currentSeatStatus).filter(
         (shift) =>
           (currentSeatStatus[shift] === "Paid" ||
             currentSeatStatus[shift] === "Confirmed") &&
           checkOverlap(selectedShift, [shift])
       );
     
       if (overlappingShifts.length > 0) {
         const statusType =
           currentSeatStatus[overlappingShifts[0]] === "Paid"
             ? "paid booking"
             : "confirmed reservation";
         setSnackbarMessage(
           `Cannot book seat ${selectedSeat} for ${selectedShift} due to overlapping ${statusType}`
         );
         setSnackbarOpen(true);
         return;
       }
     }
      //  console.log("submit")
       const response = await updateSeatStatus(
         reg,
         "Paid",
         selectedSeat,
         selectedShift
       );

       socket.emit("updateSeatStatus", {
         id: reg,
         status: "Paid",
         seat: selectedSeat,
         shift: selectedShift,
       });
    
  
       setSnackbarMessage(
         `Seat ${selectedSeat} marked as Paid for ${selectedShift}`
       );
       setSnackbarOpen(true);
       setFormDialogOpen(false);
       handleCloseDialog();
     }
    catch (error) {
     setSnackbarMessage("Error updating seat status");
     setSnackbarOpen(true);
   }
 };
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleFormClose = () => {
    setFormDialogOpen(false);
    setFormData({
      Reg: "",
      Name: "",
      Seat: selectedSeat,
      Date: "",
      Cash: "0",
      Online: "0",
      Shift: selectedShift,
      Fee: "0",
      Remarks: "",
      Status: "Paid",
    });
  };

  const handleViewDetails = async () => {
    setDialogOpen(false);
    setMultiplePersonsDialogOpen(true);

    try {
      const seatdata = await getSeatInfo(selectedSeat);
      setSeatInfo(seatdata);
    } catch (error) {
      setSnackbarMessage("Error fetching seat details");
      setSnackbarOpen(true);
    }
  };

  const handlePersonClick = async (reg) => {
    try {
      const student = await getStudentInfo(reg);
      setSelectedPerson(student);
      setMultiplePersonsDialogOpen(false);
      setDetailedPersonDialogOpen(true);
    } catch (error) {
      setSnackbarMessage("Error fetching student info");
      setSnackbarOpen(true);
    }
  };

  const handleDeallocate = async (reg) => {
    try {
      const currentSeatStatus = seatStatus[selectedSeat];

      await updateSeatStatus(reg, "Empty", selectedSeat, selectedShift);
      socket.emit("updateSeatStatus", {
        id: reg,
        status: "Empty",
        seat: selectedSeat,
        shift: selectedShift,
      });
      setSnackbarMessage(
        `Seat ${selectedSeat} has been deallocated for ${selectedShift}`
      );
      setSnackbarOpen(true);
      fetchData();
    } catch (error) {
      setSnackbarMessage("Error deallocating seat");
      setSnackbarOpen(true);
    }
  };

  const handleFormChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, maxWidth: "100%", mx: "auto" }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{ fontWeight: "bold", mb: 4 }}
      >
        Admin Library Seating Management
      </Typography>
      <ShiftSelector
        selectedShift={selectedShift}
        onShiftChange={handleShiftChange}
      />
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
                    getSeatColor={(seatNumber) =>
                      getSeatColor(seatNumber, seatStatus, selectedShift)
                    }
                    onSeatClick={handleSeatClick}
                  />
                  <SeatRow
                    seats={[77, 78, 79, 80, 81, 82, 83, 84]}
                    getSeatColor={(seatNumber) =>
                      getSeatColor(seatNumber, seatStatus, selectedShift)
                    }
                    onSeatClick={handleSeatClick}
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
                      getSeatColor={(seatNumber) =>
                        getSeatColor(seatNumber, seatStatus, selectedShift)
                      }
                      onSeatClick={handleSeatClick}
                    />
                    <SeatRow
                      seats={[52, 51, 50, 49, 48, 47, 46, 45]}
                      getSeatColor={(seatNumber) =>
                        getSeatColor(seatNumber, seatStatus, selectedShift)
                      }
                      onSeatClick={handleSeatClick}
                    />
                  </Box>
                  <Box>
                    <SeatRow
                      seats={[69, 70, 71, 72, 73, 74, 75, 76]}
                      getSeatColor={(seatNumber) =>
                        getSeatColor(seatNumber, seatStatus, selectedShift)
                      }
                      onSeatClick={handleSeatClick}
                    />
                    <SeatRow
                      seats={[53, 54, 55, 56, 57, 58, 59, 60]}
                      getSeatColor={(seatNumber) =>
                        getSeatColor(seatNumber, seatStatus, selectedShift)
                      }
                      onSeatClick={handleSeatClick}
                    />
                  </Box>
                </Box>

                <Box
                  sx={{ display: "flex", justifyContent: "flex-start", gap: 2 }}
                >
                  <Box>
                    <SeatRow
                      seats={[44, 43, 42, 41, 40, 39, 38, 37]}
                      getSeatColor={(seatNumber) =>
                        getSeatColor(seatNumber, seatStatus, selectedShift)
                      }
                      onSeatClick={handleSeatClick}
                    />
                    <SeatRow
                      seats={[36, 35, 34, 33, 32, 31, 30, 29]}
                      getSeatColor={(seatNumber) =>
                        getSeatColor(seatNumber, seatStatus, selectedShift)
                      }
                      onSeatClick={handleSeatClick}
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
                      getSeatColor={(seatNumber) =>
                        getSeatColor(seatNumber, seatStatus, selectedShift)
                      }
                      onSeatClick={handleSeatClick}
                    />
                    <SeatRow
                      seats={[21, 20, 19]}
                      getSeatColor={(seatNumber) =>
                        getSeatColor(seatNumber, seatStatus, selectedShift)
                      }
                      onSeatClick={handleSeatClick}
                    />
                    <SeatRow
                      seats={[14, 13, 12]}
                      getSeatColor={(seatNumber) =>
                        getSeatColor(seatNumber, seatStatus, selectedShift)
                      }
                      onSeatClick={handleSeatClick}
                    />
                    <SeatRow
                      seats={[1, 2, 3]}
                      getSeatColor={(seatNumber) =>
                        getSeatColor(seatNumber, seatStatus, selectedShift)
                      }
                      onSeatClick={handleSeatClick}
                    />
                  </Box>
                  <Box sx={{ mx: { xs: 0, sm: 2, md: 4, lg: 5 } }}>
                    <SeatRow
                      seats={[25, 24, 23, 22]}
                      getSeatColor={(seatNumber) =>
                        getSeatColor(seatNumber, seatStatus, selectedShift)
                      }
                      onSeatClick={handleSeatClick}
                    />
                    <SeatRow
                      seats={[15, 16, 17, 18]}
                      getSeatColor={(seatNumber) =>
                        getSeatColor(seatNumber, seatStatus, selectedShift)
                      }
                      onSeatClick={handleSeatClick}
                    />
                    <SeatRow
                      seats={[8, 9, 10, 11]}
                      getSeatColor={(seatNumber) =>
                        getSeatColor(seatNumber, seatStatus, selectedShift)
                      }
                      onSeatClick={handleSeatClick}
                    />
                    <SeatRow
                      seats={[4, 5, 6, 7]}
                      getSeatColor={(seatNumber) =>
                        getSeatColor(seatNumber, seatStatus, selectedShift)
                      }
                      onSeatClick={handleSeatClick}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <SeatLegend />
      <SeatInfoDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        selectedSeat={selectedSeat}
        getSeatColor={(seatNumber) =>
          getSeatColor(seatNumber, seatStatus, selectedShift)
        }
        onStatusChange={handleStatusChange}
        onViewDetails={handleViewDetails}
      />
      <PaymentFormDialog
        open={formDialogOpen}
        onClose={handleFormClose}
        formData={formData}
        onFormChange={handleFormChange}
        onFormSubmit={handleFormSubmit}
      />
      <MultiplePersonsDialog
        open={multiplePersonsDialogOpen}
        onClose={() => setMultiplePersonsDialogOpen(false)}
        seatInfo={seatInfo}
        onPersonClick={handlePersonClick}
        onDeallocate={handleDeallocate}
      />
      <DetailedPersonDialog
        open={detailedPersonDialogOpen}
        onClose={() => setDetailedPersonDialogOpen(false)}
        selectedPerson={selectedPerson}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="info" onClose={handleCloseSnackbar}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManageSeats;
