const shifts = [
    "6:30 AM to 2 PM",
    "2 PM to 9:30 PM",
    "6:30 PM to 11 PM",
    "9:30 PM to 6:30 AM",
    "2 PM to 11 PM",
    "6:30 AM to 6:30 PM",
    "24*7",
];
export const checkOverlap = (currentShift, bookedShifts) => {
    console.log(bookedShifts);
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

    const ans = bookedShifts.some((shift) => overlapMap[currentShift].includes(shift));
    console.log(ans, "ans");
    return ans;
};