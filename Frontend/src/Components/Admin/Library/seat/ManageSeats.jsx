import React, { useState, useEffect, useContext } from "react";
import { Box, Snackbar, Alert } from "@mui/material";
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
const ManageSeats = () => {
  const [selectedShift, setSelectedShift] = useState("6.30 AM to 2 PM");
  const [seatStatus, setSeatStatus] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [seatInfo, setSeatInfo] = useState(false);
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
  const url =
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_BACKEND_PROD
      : process.env.REACT_APP_BACKEND_DEV;
  useEffect(() => {
    fetchData();
  }, [selectedShift]);
  useEffect(() => {
    const newSocket = io(url);
    const roomId = IsUserLoggedIn?._id; // Replace with your server URL
    setSocket(newSocket);
    newSocket?.emit("joinSeatsRoom", roomId);
    return () => newSocket.close();
  }, []);
  useEffect(() => {
    if (socket) {
      socket.on("seatStatusUpdate", ({ id, status ,seat}) => {
        console.log("seatstatusupdateadmin", id, status,seat);
        setSeatStatus((prevStatus) => ({
          ...prevStatus,
          [seat]: status,
        }));
        setSnackbarMessage(`Seat ${seat} status updated to ${status}`);
        setSnackbarOpen(true);
      });
    }
  }, [socket]);
  const fetchData = async () => {
    try {let statusMap = {};
      const response = await getSeatsData();
      const selectedShiftData = response[selectedShift];
      if (selectedShiftData) {
        
        selectedShiftData.forEach((e) => {
          statusMap[e.seat] = e.status || "Unpaid";
        });
        setSeatStatus(statusMap);
      } else {
        console.error(`No data found for shift: ${selectedShift}`);
      }
    } catch (error) {
      console.error("Error fetching seat data:", error);
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
      console.error("Error updating seat status:", error);
      setSnackbarMessage("Error updating seat status");
      setSnackbarOpen(true);
    }
  };

  const handleFormSubmit = async (reg) => {
    console.log(reg);
    try {
      await updateSeatStatus(reg, "Paid",selectedSeat);
      socket.emit("updateSeatStatus", { id: reg, status: "Paid",seat:selectedSeat });
      setSnackbarMessage(`Seat ${selectedSeat} marked as Paid`);
      setSnackbarOpen(true);
      setFormDialogOpen(false);
      handleCloseDialog();
    } catch (error) {
      console.error("Error updating seat status:", error);
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
      console.error("Error fetching seat info:", error);
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
      console.error("Error fetching student info:", error);
      setSnackbarMessage("Error fetching student info");
      setSnackbarOpen(true);
    }
  };

  const handleDeallocate = async (reg) => {
    try {
    console.log(reg)
      await updateSeatStatus(reg, "Left","0");
        socket.emit("updateSeatStatus", {
          id: reg,
          status: "Left",
          seat:selectedSeat
        });
      setSnackbarMessage(
        `Seat for person with reg ${reg} has been deallocated`
      );
      setSnackbarOpen(true);
      fetchData(); // Refresh seat data after deallocation
    } catch (error) {
      console.error("Error deallocating seat:", error);
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
    <Box sx={{ p: 4, maxWidth: "lg", mx: "auto" }}>
      <Box component="h1" sx={{ fontSize: "2xl", fontWeight: "bold", mb: 4 }}>
        Admin Library Seating Management
      </Box>
      <ShiftSelector
        selectedShift={selectedShift}
        onShiftChange={handleShiftChange}
      />
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
          <SeatRow
            seats={["A3", "A4", "A5", "A6", "A7", "A8", "A9", "A0"]}
            seatStatus={seatStatus}
            onSeatClick={handleSeatClick}
          />
          <SeatRow
            seats={[77, 78, 79, 80, 81, 82, 83, 84]}
            seatStatus={seatStatus}
            onSeatClick={handleSeatClick}
          />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
          <Box>
            <SeatRow
              seats={[68, 67, 66, 65, 64, 63, 62, 61]}
              seatStatus={seatStatus}
              onSeatClick={handleSeatClick}
            />
            <SeatRow
              seats={[52, 51, 50, 49, 48, 47, 46, 45]}
              seatStatus={seatStatus}
              onSeatClick={handleSeatClick}
            />
          </Box>
          <Box>
            <SeatRow
              seats={[69, 70, 71, 72, 73, 74, 75, 76]}
              seatStatus={seatStatus}
              onSeatClick={handleSeatClick}
            />
            <SeatRow
              seats={[53, 54, 55, 56, 57, 58, 59, 60]}
              seatStatus={seatStatus}
              onSeatClick={handleSeatClick}
            />
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 2 }}>
          <Box>
            <SeatRow
              seats={[44, 43, 42, 41, 40, 39, 38, 37]}
              seatStatus={seatStatus}
              onSeatClick={handleSeatClick}
            />
            <SeatRow
              seats={[36, 35, 34, 33, 32, 31, 30, 29]}
              seatStatus={seatStatus}
              onSeatClick={handleSeatClick}
            />
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
          <Box>
            <SeatRow
              seats={[28, 27, 26]}
              seatStatus={seatStatus}
              onSeatClick={handleSeatClick}
            />
            <SeatRow
              seats={[21, 20, 19]}
              seatStatus={seatStatus}
              onSeatClick={handleSeatClick}
            />
            <SeatRow
              seats={[14, 13, 12]}
              seatStatus={seatStatus}
              onSeatClick={handleSeatClick}
            />
            <SeatRow
              seats={[1, 2, 3]}
              seatStatus={seatStatus}
              onSeatClick={handleSeatClick}
            />
          </Box>
          <Box>
            <SeatRow
              seats={[25, 24, 23, 22]}
              seatStatus={seatStatus}
              onSeatClick={handleSeatClick}
            />
            <SeatRow
              seats={[15, 16, 17, 18]}
              seatStatus={seatStatus}
              onSeatClick={handleSeatClick}
            />
            <SeatRow
              seats={[8, 9, 10, 11]}
              seatStatus={seatStatus}
              onSeatClick={handleSeatClick}
            />
            <SeatRow
              seats={[4, 5, 6, 7]}
              seatStatus={seatStatus}
              onSeatClick={handleSeatClick}
            />
          </Box>
        </Box>
      </Box>

      <SeatLegend />
      <SeatInfoDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        selectedSeat={selectedSeat}
        seatStatus={seatStatus}
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
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManageSeats;
