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
import CheckIcon from "@mui/icons-material/Check";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(6),
  },
}));

const shifts = {
  "6:30 AM to 2 PM": 550,
  "2 PM to 9:30 PM": 550,
  "6:30 AM to 6:30 PM": 850,
  "24*7": 1100,
  "6:30 PM to 11 PM": 350,
  "2 PM to 11 PM": 750,
  "9:30 PM to 6:30 AM": 550,
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
  const [isInactive, setIsInactive] = useState(false);
  const [info, setInfo] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

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
  status,
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
    setIsInactive(false);
    setInfo("");
    setStatus("");
    setCalculatedFee(0);
    setAvailableDeals([]);
    setSelectedDeal("");

    try {
      const data = await fetchLibStudent(regNo);
      if (!data || !data.student) {
        setError("Student not registered");
        return;
      }

      setStudentData(data.student);
      setMessage(data.message);
      setValue("name", data.student.name);

      if (data.message === "Student is not active for 3 months straight") {
        setInfo(
          "You are being charged Rs.50 registration fees for the gap of 90+ days without being active"
        );
        setStatus("Reregistration");
        setCalculatedFee(50);
        setValue("shift", "");
        setAdvancePaymentPeriod("Reregistration Fee");
        setSelectedDeal("reregistration");
      } else if (data.student?.shift === "NULL") {
        setError("No shift allocated. Please contact the office.");
        setValue("shift", "");
      } else {
        setStatus("fee-payment");
        setValue("shift", data.student.shift);
        const shiftFee = shifts[data.student.shift] || 0;
        const currentMonthFee = shiftFee;
        let totalFee =
          currentMonthFee +
          (data.student.due || 0) -
          (data.student.advance || 0);

        setCalculatedFee(totalFee);
        setAdvancePaymentPeriod("Current Month");
        setSelectedDeal("current");

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

    if (status === "Reregistration") {
      setCalculatedFee(1);
      setAdvancePaymentPeriod("Reregistration Fee");
    } else if (selectedValue === "current") {
      if (studentData && studentData.shift) {
        const currentMonthFee = shifts[studentData.shift] || 0;
        const totalFee =
          currentMonthFee + (studentData.due || 0) - (studentData.advance || 0);
        setCalculatedFee(totalFee);
        setAdvancePaymentPeriod("Current Month");
      }
    } else {
      const deal = deals.find((d) => d.id === selectedValue);
      let totalFee =
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
    if (!selectedDeal && status !== "Reregistration") {
      toast.error("Please select a deal or generate the current month's fee");
      return;
    }

    const newFormData = {
      reg: data.regNo,
      fee: calculatedFee,
      shift: status === "Reregistration" ? "Reregistration" : data.shift,
      name: data.name,
      advancePaymentPeriod,
      email: studentData.email,
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
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="info">
          Please enter your correct reg no. Entering someone else's reg no will
          not be considered for your payment and you will be charged a fine.
        </Alert>
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
          {info && (
            <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
              {info}
            </Alert>
          )}
          {!isInactive && studentData && (
            <>
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
              {status !== "Reregistration" && (
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
              )}
              {(selectedDeal || status === "Reregistration") && (
                <StyledPaper>
                  <Box mt={2}>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: "bold", mb: 1 }}
                    >
                      Fee Details:
                    </Typography>
                    <Typography variant="body1">
                      Advance Payment Period: {advancePaymentPeriod}
                    </Typography>
                    {status !== "Reregistration" && (
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
                    )}
                    {status === "Reregistration" && (
                      <Typography
                        variant="h6"
                        color="success.main"
                        sx={{ mt: 2 }}
                      >
                        Reregistration Fee: ₹{calculatedFee.toFixed(2)}
                      </Typography>
                    )}
                  </Box>

                  <Alert
                    icon={<CheckIcon fontSize="bold" />}
                    severity="info"
                    sx={{ mt: 2 }}
                  >
                    After clicking on Pay fee, the payment portal will activate.
                    Choose any method but do not refresh the page during the
                    payment process until it is completed. On completion and
                    verification, you will be taken to the Home page
                    automatically.
                  </Alert>

                  {info && (
                    <Alert
                      icon={<CheckIcon fontSize="inherit" />}
                      severity="warning"
                      sx={{ mt: 2 }}
                    >
                      {info}
                    </Alert>
                  )}

                  {calculatedFee > 0 && (
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
                      ) : (
                        `Pay Now: ₹${calculatedFee.toFixed(2)}`
                      )}
                    </Button>
                  )}
                </StyledPaper>
              )}

              {status !== "Reregistration" && availableDeals.length > 0 && (
                <FormControl fullWidth sx={{ mt: 3 }}>
                  <InputLabel id="deal-select-label">Select Deal</InputLabel>
                  <Select
                    labelId="deal-select-label"
                    id="deal-select"
                    value={selectedDeal}
                    label="Select Deal"
                    onChange={handleDealSelect}
                  >
                    <MenuItem value="current">Current Month</MenuItem>
                    {availableDeals.map((deal) => (
                      <MenuItem key={deal.id} value={deal.id}>
                        {deal.months} Months - ₹{deal.totalFee} (Save{" "}
                        {deal.discount}%)
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </>
          )}
        </Box>
      </StyledPaper>
    </Container>
  );
};

export default Fee;
