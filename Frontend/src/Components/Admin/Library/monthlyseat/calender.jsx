import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { sendFinancialSummary } from "../../../../services/Admin_services/admin_lib"; // Import the service function

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  // Form fields state
  const [formData, setFormData] = useState({
    cash: "",
    online: "",
    website: "",
    diary: "",
    expenses: "",
  });

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = new Date(year, month, 1).getDay();

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const handleDateClick = (day) => {
    if (day) {
      setSelectedDate(
        new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      );
      setIsOpen(true);
    }
  };

  const closeDialog = () => {
    setIsOpen(false);
    setFormData({
      cash: "",
      online: "",
      website: "",
      diary: "",
      expenses: "",
    });
  };

  const changeMonth = (offset) => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1)
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    const financialSummary = {
      date: selectedDate,
      ...formData,
    };

    sendFinancialSummary(financialSummary)
      .then((response) => {
        console.log("Financial summary submitted successfully:", response);
        closeDialog(); // Close the dialog after successful submission
      })
      .catch((error) => {
        console.error("Error submitting financial summary:", error);
      });
  };

  const calendar = generateCalendar();

  return (
    <Card sx={{ maxWidth: 300, mt: 2 }}>
      <Typography variant="body-1">Daily Financial Summary</Typography>
      <CardContent sx={{ p: 1 }}>
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 1 }}
        >
          <IconButton size="small" onClick={() => changeMonth(-1)}>
            <ChevronLeft />
          </IconButton>
          <Typography variant="subtitle1">
            {currentDate.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </Typography>
          <IconButton size="small" onClick={() => changeMonth(1)}>
            <ChevronRight />
          </IconButton>
        </Grid>
        <Grid container spacing={0.5}>
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <Grid key={day} item xs={12 / 7}>
              <Typography align="center" variant="caption">
                {day}
              </Typography>
            </Grid>
          ))}
          {calendar.map((day, index) => (
            <Grid key={index} item xs={12 / 7}>
              {day && (
                <IconButton
                  size="small"
                  onClick={() => handleDateClick(day)}
                  sx={{
                    width: "100%",
                    height: 24,
                    p: 0,
                    fontSize: "0.75rem",
                    color: "text.primary",
                    "&:hover": { backgroundColor: "action.hover" },
                  }}
                >
                  {day}
                </IconButton>
              )}
            </Grid>
          ))}
        </Grid>
      </CardContent>

      <Dialog open={isOpen} onClose={closeDialog}>
        <DialogTitle>
          Details for {selectedDate?.toLocaleDateString()}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Cash"
            name="cash"
            type="number"
            value={formData.cash}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Online"
            name="online"
            type="number"
            value={formData.online}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Website"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Diary"
            name="diary"
            value={formData.diary}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Expenses"
            name="expenses"
            type="number"
            value={formData.expenses}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{ mt: 2 }}
          >
            Submit
          </Button>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default Calendar;
