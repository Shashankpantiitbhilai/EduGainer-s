import React, { useState, useContext, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Alert,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { toast, ToastContainer } from "react-toastify";
import { AdminContext } from "../../App";
import { fetchLibStudent } from "../../services/library/utils";
import Payment from "../payment/razorpay";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(6),
  },
}));

const shifts = {
  "6:30 AM to 2 PM": 550,
  "2 PM to 9:30 PM": 1,
  "6:30 PM to 11 PM": 350,
  "9:30 PM to 6:30 AM": 500,
  "2 PM to 11 PM": 750,
  "6:30 AM to 6:30 PM": 850,
  "24*7": 1100,
};

const deals = [
  { id: 1, fee: 1, months: 3, discount: 3, totalFee: 1 },
  // ... (other deals)
];

const Fee = () => {
  const { IsUserLoggedIn } = useContext(AdminContext);
  const navigate = useNavigate();
  const [selectedDeal, setSelectedDeal] = useState("");
  const [calculatedFee, setCalculatedFee] = useState(0);
  const [advancePaymentPeriod, setAdvancePaymentPeriod] = useState("");
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
    const [error, setError] = useState("");
  const [shouldInitiatePayment, setShouldInitiatePayment] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      regNo: "",
      name: "",
      shift: "",
    },
  });

  const regNo = watch("regNo");
  const id = IsUserLoggedIn?._id;

  const { initializePayment } = Payment({
    formData,
    imageBase64: "",
    amount: calculatedFee,
    userId: id,
    setLoading,
    status: "fee-payment",
  });

  useEffect(() => {
    if (shouldInitiatePayment) {
      const initiatePayment = async () => {
        try {
          await initializePayment();
          toast.success("Fee payment successful");
        } catch (error) {
          console.error("Payment failed:", error);
          if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
          }
          toast.error(`Payment failed: ${error.message}`);
        } finally {
          setShouldInitiatePayment(false);
        }
      };

      initiatePayment();
    }
  }, [shouldInitiatePayment]);

 const autoGenerateFee = async () => {
   setLoading(true);
   setError(""); // Clear any previous errors
   try {
     const data = await fetchLibStudent(regNo);
     if (!data || !data.student) {
       setError("Student not registered");
     }
     setStudentData(data.student);
     setValue("name", data.student.name);
     setValue("shift", data.student.shift);
     if (data.student.shift) {
       const date = new Date();
       const monthNames = [
         "January",
         "February",
         "March",
         "April",
         "May",
         "June",
         "July",
         "August",
         "September",
         "October",
         "November",
         "December",
       ];
       const currentMonthName = monthNames[date.getMonth()];

       const currentMonthFee = shifts[data.student.shift] || 0;
       const totalFee =
         currentMonthFee +
         (data.student.due || 0) -
         (data.student.advance || 0);
       setCalculatedFee(totalFee);
       setAdvancePaymentPeriod(currentMonthName);
       setSelectedDeal("current month");
     }
   } catch (error) {
     console.error("Error fetching student data:", error);
     setStudentData(null);
     setError(error.message || "An error occurred while fetching student data");
     toast.error(
       "Not registered, if you have already registred then kindly Contact Us"
     );
   } finally {
     setLoading(false);
   }
 };

  const handleDealSelect = (event) => {
    const selectedValue = event.target.value;
    setSelectedDeal(selectedValue);
    const date = new Date();
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const currentMonthName = monthNames[date.getMonth()];
    if (selectedValue === "current") {
      if (studentData && studentData.shift) {
        const currentMonthFee = shifts[studentData.shift] || 0;
        const totalFee =
          currentMonthFee + (studentData.due || 0) - (studentData.advance || 0);
        setCalculatedFee(totalFee);
        setAdvancePaymentPeriod(currentMonthName);
      }
    } else {
      const deal = deals.find((d) => d.id === selectedValue);
      const totalFee =
        deal.totalFee + (studentData.due || 0) - (studentData.advance || 0);
      setCalculatedFee(totalFee);
      updateAdvancePaymentPeriod(deal.months);
    }
  };

  const updateAdvancePaymentPeriod = (months) => {
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString("default", {
      month: "long",
    });
    const currentYear = currentDate.getFullYear();
    const endDate = new Date(
      currentDate.setMonth(currentDate.getMonth() + months - 1)
    );
    const endMonth = endDate.toLocaleString("default", { month: "long" });
    const endYear = endDate.getFullYear();
    setAdvancePaymentPeriod(
      `Advance Payment from ${currentMonth} ${currentYear} - ${endMonth} ${endYear}`
    );
  };

  const onSubmit = async (data) => {
    if (!selectedDeal) {
      toast.error("Please select a deal or generate the current month's fee");
      return;
    }

    const newFormData = {
      reg: data.regNo,
      fee: calculatedFee,
      shift: data.shift,
      name: data.name,
      advancePaymentPeriod,
    };

    setFormData(newFormData);
    setShouldInitiatePayment(true);
  };

  return (
    <Container maxWidth="sm">
      <ToastContainer position="top-right" autoClose={3000} />
      <StyledPaper elevation={3}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          align="center"
          sx={{ fontWeight: "bold", mb: 4 }}
        >
          Fee Payment
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Controller
            name="regNo"
            control={control}
            rules={{ required: "Registration Number is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                id="regNo"
                label="Registration Number"
                autoComplete="off"
                autoFocus
                error={!!errors.regNo}
                helperText={errors.regNo?.message}
              />
            )}
          />
          <Button
            variant="outlined"
            color="primary"
            onClick={autoGenerateFee}
            disabled={!regNo || loading}
            sx={{ mt: 2, mb: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : "Auto Generate Fee"}
          </Button>
          {error && (
            <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
              {error}
            </Alert>
          )}
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                fullWidth
                id="name"
                label="Name"
                disabled
              />
            )}
          />
          <Controller
            name="shift"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                fullWidth
                id="shift"
                label="Shift"
                disabled
              />
            )}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="deal-select-label">
              Select Deal or Current Month
            </InputLabel>
            <Select
              labelId="deal-select-label"
              id="deal-select"
              value={selectedDeal}
              label="Select Deal or Current Month"
              onChange={handleDealSelect}
            >
              <MenuItem value="current">Current Month</MenuItem>
              {deals.map((deal) => (
                <MenuItem key={deal.id} value={deal.id}>
                  ₹{deal.fee} for {deal.months} months - Discount:{" "}
                  {deal.discount}%
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {selectedDeal && (
            <>
              <Box mt={2}>
                <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
                  Fee Details:
                </Typography>
                <Typography variant="body1">
                  Advance Payment Period: {advancePaymentPeriod}
                </Typography>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body1" color="textSecondary">
                    Due Fee:
                  </Typography>
                  <Typography variant="h6" color="red">
                    ₹{studentData?.due || 0}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body1" color="textSecondary">
                    Advance Fee:
                  </Typography>
                  <Typography variant="h6" color="primary">
                    ₹{studentData?.advance || 0}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body1" color="textSecondary">
                    Calculated Net Fee:
                  </Typography>
                  <Typography variant="h6" color="blue">
                    ₹{calculatedFee}
                  </Typography>
                </Grid>
              </Box>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Pay Now"}
              </Button>
            </>
          )}
        </Box>
      </StyledPaper>
    </Container>
  );
};

export default Fee;
