import React, { useState, useEffect } from "react";
import { Box, Snackbar, Alert } from "@mui/material";
import { getSeatInfo, getStudentInfo } from "../../../../services/Admin_services/admin_lib";
import {getSeatsData} from "../../../../services/library/utils"
import ShiftSelector from './shiftSelector';
import SeatRow from './seatRow';
import SeatLegend from './seatLegend';
import SeatInfoDialog from './seatInfoDialog';
import PaymentFormDialog from './PaymentFormDialog';
import MultiplePersonsDialog from './multiplePersonDialg';
import DetailedPersonDialog from './DetailedPersonDialog';

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

  useEffect(() => {
    fetchData();
  }, [selectedShift]);

  const fetchData = async () => {
    try {
      const response = await getSeatsData();
      const selectedShiftData = response[selectedShift];
      if (selectedShiftData) {
        let statusMap = {};
        selectedShiftData.forEach((e) => {
          statusMap[e.Seat] = e.Status || "Unpaid";
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

  const handleStatusChange = (newStatus) => {
    if (newStatus === "Paid") {
      setFormData({
        ...formData,
        Seat: selectedSeat,
        Shift: selectedShift,
        Status: newStatus,
      });
      setFormDialogOpen(true);
    } else {
      setSeatStatus((prevStatus) => ({
        ...prevStatus,
        [selectedSeat]: newStatus,
      }));
      setSnackbarMessage(
        `Seat ${selectedSeat} status updated to ${newStatus || "No Status"}`
      );
      setSnackbarOpen(true);
      handleCloseDialog();
    }
  };

  const handleFormSubmit = () => {
    console.log("Form submitted with data:", formData);
    setSnackbarMessage(`Seat ${selectedSeat} marked as Paid`);
    setSnackbarOpen(true);
    setFormDialogOpen(false);
    handleCloseDialog();
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
    console.log(`Fetching details for seat ${selectedSeat}`);

    setDialogOpen(false);
    setMultiplePersonsDialogOpen(true);

    try {
      const seatdata = await getSeatInfo(selectedSeat);
      console.log("Seat data retrieved:", seatdata);
      setSeatInfo(seatdata);
    } catch (error) {
      console.error("Error fetching seat info:", error);
      setSnackbarMessage("Error fetching seat details");
      setSnackbarOpen(true);
    }
  };

  const handlePersonClick = async (reg) => {
    console.log(reg);
    const student = await getStudentInfo(reg);
    setSelectedPerson(student);
    setMultiplePersonsDialogOpen(false);
    setDetailedPersonDialogOpen(true);
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

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mx: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
            mx: 3,
          }}
        >
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

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
            mx: 3,
          }}
        >
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

        <Box
          sx={{ display: "flex", justifyContent: "flex-start", gap: 2, mx: 3 }}
        >
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

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
            mx: 3,
          }}
        >
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
          <Box sx={{ mx: 23 }}>
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
        onSubmit={handleFormSubmit}
      />

      <MultiplePersonsDialog
        open={multiplePersonsDialogOpen}
        onClose={() => setMultiplePersonsDialogOpen(false)}
        seatInfo={seatInfo}
        onPersonClick={handlePersonClick}
      />

      <DetailedPersonDialog
        open={detailedPersonDialogOpen}
        onClose={() => setDetailedPersonDialogOpen(false)}
        selectedPerson={selectedPerson}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManageSeats;