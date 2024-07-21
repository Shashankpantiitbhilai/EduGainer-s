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
  "2 PM to 9:30 PM": 550,
  "6:30 AM to 6:30 PM": 900,
  "24*7": 1100,
  "6:30 AM to 11 PM": 350,
  "2 PM to 11 PM": 700,
  "9:30 PM to 6:30 AM": 500,
};

const deals = [
  { id: 1, fee: 550, months: 3, discount: 3, totalFee: 1600.5 },
  { id: 2, fee: 350, months: 3, discount: 3, totalFee: 1018.5 },
  { id: 3, fee: 750, months: 3, discount: 3, totalFee: 2182.5 },
  { id: 4, fee: 850, months: 3, discount: 3, totalFee: 2473.5 },
  { id: 5, fee: 1100, months: 3, discount: 3, totalFee: 3201 },
  { id: 6, fee: 550, months: 6, discount: 6, totalFee: 3102 },
  { id: 7, fee: 350, months: 6, discount: 6, totalFee: 1974 },
  { id: 8, fee: 750, months: 6, discount: 6, totalFee: 4230 },
  { id: 9, fee: 850, months: 6, discount: 6, totalFee: 4794 },
  { id: 10, fee: 1100, months: 6, discount: 6, totalFee: 6204 },
  { id: 11, fee: 550, months: 9, discount: 9, totalFee: 4504.5 },
  { id: 12, fee: 350, months: 9, discount: 9, totalFee: 2866.5 },
  { id: 13, fee: 750, months: 9, discount: 9, totalFee: 6142.5 },
  { id: 14, fee: 850, months: 9, discount: 9, totalFee: 6961.5 },
  { id: 15, fee: 1100, months: 9, discount: 9, totalFee: 9009 },
  { id: 16, fee: 550, months: 12, discount: 12, totalFee: 5808 },
  { id: 17, fee: 350, months: 12, discount: 12, totalFee: 3696 },
  { id: 18, fee: 750, months: 12, discount: 12, totalFee: 7920 },
  { id: 19, fee: 850, months: 12, discount: 12, totalFee: 8976 },
  { id: 20, fee: 1100, months: 12, discount: 12, totalFee: 11616 },
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
  const [availableDeals, setAvailableDeals] = useState([]);

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
    setError("");
    try {
      const data = await fetchLibStudent(regNo);
      if (!data || !data.student) {
        setError("Student not registered");
        return;
      }
console.log(data,"kkkkk")
      setStudentData(data.student);
      setValue("name", data.student.name);
      setValue("shift", data.student.shift);

      if (data.student.shift) {
        const shiftFee = shifts[data.student.shift] || 0;
        const currentMonthFee = shiftFee;
        console.log(currentMonthFee,shiftFee,data.student.shift,"feeees")
        const totalFee =
          currentMonthFee +
          (data.student.due || 0) -
          (data.student.advance || 0);
        setCalculatedFee(totalFee);
        setAdvancePaymentPeriod("Current Month");
        setSelectedDeal("current");

        // Filter deals based on the student's shift fee
        const filteredDeals = deals.filter((deal) => deal.fee === shiftFee);
        setAvailableDeals(filteredDeals);
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
      setStudentData(null);
      setError(
        error.message || "An error occurred while fetching student data"
      );
      toast.error(
        "Not registered, if you have already registered then kindly Contact Us"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDealSelect = (event) => {
    const selectedValue = event.target.value;
    setSelectedDeal(selectedValue);

    if (selectedValue === "current") {
      if (studentData && studentData.shift) {
        const currentMonthFee = shifts[studentData.shift] || 0;
        const totalFee =
          currentMonthFee + (studentData.due || 0) - (studentData.advance || 0);
        setCalculatedFee(totalFee);
        setAdvancePaymentPeriod("Current Month");
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
      `${currentMonth} ${currentYear} - ${endMonth} ${endYear}`
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
    if (calculatedFee > 0) setShouldInitiatePayment(true);
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
          {studentData && (
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
                {availableDeals.map((deal) => (
                  <MenuItem key={deal.id} value={deal.id}>
                    ₹{deal.totalFee.toFixed(2)} for {deal.months} months -
                    Discount: {deal.discount}%
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          {selectedDeal && (
            <>
              <Box mt={2}>
                <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
                  Fee Details:
                </Typography>
                <Typography variant="body1">
                  Advance Payment Period: {advancePaymentPeriod}
                </Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="textSecondary">
                      Due Fee:
                    </Typography>
                    <Typography variant="h6" color="error">
                      ₹{studentData?.due || 0}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="textSecondary">
                      Advance Fee:
                    </Typography>
                    <Typography variant="h6" color="primary">
                      ₹{studentData?.advance || 0}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="textSecondary">
                      Net Fee:
                    </Typography>
                    <Typography variant="h6" color="success.main">
                      ₹{calculatedFee.toFixed(2)}
                    </Typography>
                  </Grid>
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
                {loading ? (
                  <CircularProgress size={24} />
                ) : calculatedFee > 0 ? (
                  `Pay Now: ₹${calculatedFee.toFixed(2)}`
                ) : (
                  "No fee to be paid"
                )}
              </Button>
            </>
          )}
        </Box>
      </StyledPaper>
    </Container>
  );
};

export default Fee;
