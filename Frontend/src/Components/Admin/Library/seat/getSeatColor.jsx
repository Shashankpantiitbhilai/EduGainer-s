import { red } from "@mui/material/colors";

// Define the shifts
const shifts = [
  "6:30 AM to 2 PM",
  "2 PM to 9:30 PM",
  "6:30 PM to 11 PM",
  "9:30 PM to 6:30 AM",
  "2 PM to 11 PM",
  "6:30 AM to 6:30 PM",
  "24*7",
];

// checkOverlap function
export const checkOverlap = (currentShift, bookedShifts) => {
  // console.log(bookedShifts);
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

  const ans = bookedShifts.some((shift) =>
    overlapMap[currentShift].includes(shift)
  );

  return ans;
};

// getSeatColor function
export const getSeatColor = (seatNumber, seatStatus, selectedShift) => {
  if (!seatStatus[seatNumber]) {
    return "red"; // Default color if seat status is not available
  }
  if (seatStatus === "Unknown")
  {
    return "red";
  }
  // Check if there's a Confirmed status in any overlapping shift
  const hasOverlappingConfirmed = shifts.some(
    (shift) =>
      seatStatus[seatNumber][shift] === "Confirmed" &&
      checkOverlap(selectedShift, [shift])
  );

  if (hasOverlappingConfirmed) {
    return "yellow"; // Seat is confirmed in an overlapping shift
  }
  if (seatStatus[seatNumber][selectedShift] === "discontinue")
  {
    return "grey";
  }

  // Get all booked (Paid) shifts for this seat
  const bookedShifts = shifts.filter(
    (shift) => seatStatus[seatNumber][shift] === "Paid"
  );

  // Check for overlapping booked shifts
  if (checkOverlap(selectedShift, bookedShifts)) {
    return "green"; // Seat has an overlapping booking
  } else {
    return "red"; // Seat can be allocated
  }
};
