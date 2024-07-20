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
    "6:30 AM to 2 PM": ["6:30 AM to 6:30 PM", "24*7"],
    "2 PM to 9:30 PM": ["2 PM to 11 PM", "6:30 AM to 6:30 PM", "24*7"],
    "6:30 PM to 11 PM": ["2 PM to 11 PM", "24*7"],
    "9:30 PM to 6:30 AM": ["24*7"],
    "2 PM to 11 PM": ["2 PM to 9:30 PM", "6:30 PM to 11 PM", "6:30 AM to 6:30 PM", "24*7"],
    "6:30 AM to 6:30 PM": ["6:30 AM to 2 PM", "2 PM to 9:30 PM", "2 PM to 11 PM", "24*7"],
    "24*7": shifts,
  };

  return bookedShifts.some(shift => overlapMap[currentShift].includes(shift));
};

const getSeatColor = (seatNumber, seatStatus, selectedShift) => {
    const seatShifts = seatStatus[seatNumber];
    if (!seatShifts) return "grey";

    if (seatShifts["24*7"] === "Paid") return "green";
    if (seatShifts[selectedShift] === "Paid") return "green";

    const bookedShifts = Object.keys(seatShifts).filter(shift => seatShifts[shift] === "Paid");
 
    if (checkOverlap(selectedShift, bookedShifts)) {
        return "green"; // Can't be booked due to overlap
    } else {
        return "red"; // Can be booked
    }
return "grey"

  };
export default getSeatColor;
