import React, { useState, useContext, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  AlertTitle,
  Divider,
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Avatar,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import CheckIcon from "@mui/icons-material/Check";
import { HowToReg, CheckCircleOutline, Info } from "@mui/icons-material";
import { AdminContext } from "../../App";
import { eligibleForNewRegistration } from "../../services/library/utils";
import Payment from "../payment/razorpay";
import { CircularProgress } from "@mui/material";
const steps = [
  "Benefits",
  "Personal Info",
  "Contact",
  "Additional Info",
  "Payment",
];

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3 MB in bytes

export default function LibraryRegistration() {
  const { IsUserLoggedIn } = useContext(AdminContext);
  const id = IsUserLoggedIn?._id;
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [submit, setsubmit] = useState("");
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [imageBase64, setImageBase64] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isEligible, setIsEligible] = useState(null);
  const [consentGiven, setConsentGiven] = useState(false);
  const [fileError, setFileError] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { initializePayment } = Payment({
    formData,
    imageBase64,
    amount: 105,
    userId: id,
    setLoading,
    status: "newRegistration",
  });

  useEffect(() => {
    const checkEligibility = async () => {
      try {
        const response = await eligibleForNewRegistration(id);
        setIsEligible(response.eligible);
      } catch (error) {
        setIsEligible(false);
      }
    };

    if (id) {
      checkEligibility();
    }
  }, [id]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    reset();
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const setFileToBase64 = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImageBase64(reader.result);
    };
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file && file.size > MAX_FILE_SIZE) {
      setFileError("File size should not exceed 3 MB");
      return;
    }
    setFileError("");
    setFileToBase64(file);
  };

  const handleStepSubmit = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    handleNext();
  };

  const onSubmit = async () => {
    if (activeStep === steps.length - 1) {
      setsubmit("Payment");
      await initializePayment();
    } else {
      handleNext();
    }
  };

  const shifts = [
    "6:30 AM to 2 PM",
    "2 PM to 9:30 PM",
    "6:30 PM to 11 PM",
    "9:30 PM to 6:30 AM",
    "2 PM to 11 PM",
    "6:30 AM to 6:30 PM",
    "24*7",
  ];

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Benefits of Online Library Registration
              </Typography>
              <List>
                {[
                  "Get Instant Registration Number",
                  "Download Your Information Card Immediately",
                  "Guaranteed Seats and Priority Access",
                  "Secure Your Spot in Advance",
                  "Priority Processing",
                  "Reserve Your Preferred Time Slot",
                  "Complete Registration from Anywhere",
                  "Be Among the First",
                ].map((benefit, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckCircleOutline color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={benefit} />
                  </ListItem>
                ))}
              </List>
              <Typography variant="body1" sx={{ mt: 2 }}>
                Don't wait - register online now and step into a world of
                knowledge with confidence and ease!
              </Typography>
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="name"
                control={control}
                defaultValue={formData.name || ""}
                rules={{ required: "Name is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Name"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="gender"
                control={control}
                defaultValue={formData.gender || ""}
                rules={{ required: "Gender is required" }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.gender}>
                    <InputLabel>Gender</InputLabel>
                    <Select {...field} label="Gender">
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                    {errors.gender && (
                      <Typography color="error" variant="caption">
                        {errors.gender.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="dob"
                control={control}
                defaultValue={formData.dob || ""}
                rules={{ required: "Date of Birth is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Date of Birth"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={!!errors.dob}
                    helperText={errors.dob?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="fatherName"
                control={control}
                defaultValue={formData.fatherName || ""}
                rules={{ required: "Father's Name is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Father's Name"
                    error={!!errors.fatherName}
                    helperText={errors.fatherName?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="motherName"
                control={control}
                defaultValue={formData.motherName || ""}
                rules={{ required: "Mother's Name is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Mother's Name"
                    error={!!errors.motherName}
                    helperText={errors.motherName?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="contact1"
                control={control}
                defaultValue={formData.contact1 || ""}
                rules={{
                  required: "Primary contact number is required",
                  pattern: {
                    value: /^\d{10}$/,
                    message: "Please enter a valid 10-digit contact number",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Primary Contact Number"
                    error={!!errors.contact1}
                    helperText={errors.contact1?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="contact2"
                control={control}
                defaultValue={formData.contact2 || ""}
                rules={{
                  required: "Secondary contact number is required",
                  pattern: {
                    value: /^\d{10}$/,
                    message: "Please enter a valid 10-digit contact number",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Secondary Contact Number"
                    error={!!errors.contact2}
                    helperText={errors.contact2?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="email"
                control={control}
                defaultValue={formData.email || ""}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email address",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email Address"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="address"
                control={control}
                defaultValue={formData.address || ""}
                rules={{ required: "Address is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Address"
                    multiline
                    rows={3}
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        );
      case 3:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="aadhaar"
                control={control}
                defaultValue={formData.aadhaar || ""}
                rules={{
                  required: "Aadhaar   No is required",
                  pattern: {
                    value: /^[2-9][0-9]{3}\s[0-9]{4}\s[0-9]{4}$/,
                    message:
                      "Invalid Aadhaar number format. Must start with 2 and be in the format: 2xxx xxxx xxxx",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Aadhaar Number"
                    error={!!errors.aadhaar}
                    helperText={errors.aadhaar?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="examPreparation"
                control={control}
                defaultValue={formData.examPreparation || ""}
                rules={{ required: "This field is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Preparing for Exam"
                    error={!!errors.examPreparation}
                    helperText={errors.examPreparation?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="shift"
                control={control}
                defaultValue={formData.shift || ""}
                rules={{ required: "Shift selection is required" }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.shift}>
                    <InputLabel>Preferred Shift</InputLabel>
                    <Select {...field} label="Preferred Shift">
                      {shifts.map((shift) => (
                        <MenuItem key={shift} value={shift}>
                          {shift}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.shift && (
                      <Typography color="error" variant="caption">
                        {errors.shift.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="image"
                control={control}
                defaultValue=""
                rules={{
                  required: "Adhaar Card Front Photo is required",
                }}
                render={({ field }) => (
                  <Box>
                    <input
                      accept="image/*"
                      id="image-upload"
                      type="file"
                      onChange={(e) => {
                        field.onChange(e.target.files[0]);
                        handleImage(e);
                      }}
                      style={{ display: "none" }}
                    />
                    <label htmlFor="image-upload">
                      <Button variant="contained" component="span">
                        Upload Aadhaar Card front Side Photo
                      </Button>
                    </label>
                    {errors.image && (
                      <Typography color="error">
                        {errors.image.message}
                      </Typography>
                    )}
                    {fileError && (
                      <Typography color="error">{fileError}</Typography>
                    )}
                  </Box>
                )}
              />
              {imageBase64 && (
                <Avatar src={imageBase64} alt="Uploaded Photo" sx={{ mt: 2 }} />
              )}
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={consentGiven}
                    onChange={(e) => setConsentGiven(e.target.checked)}
                    name="consentCheckbox"
                    color="primary"
                  />
                }
                label="I agree to the privacy policy, terms of conditions, and agree to abide by the rules and regulations of the EduGainer's library."
              />
            </Grid>
          </Grid>
        );
      case 4:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6">Payment Details</Typography>
            </Grid>
            <Grid item xs={12}>
              <Alert icon={<CheckIcon fontSize="inherit" />} severity="info">
                When clicking on Submit, the payment portal will start. You are
                advised not to refresh the page during the payment process. Once
                the payment is successful, you will be automatically taken to
                your library subscription page.
              </Alert>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">Registration Fee: ₹105</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">
                Click "Submit" to proceed with the payment.
              </Typography>
            </Grid>
          </Grid>
        );
      default:
        return "Unknown step";
    }
  };

  if (isEligible === null) {
    return (
      <Container component="main" maxWidth="sm" sx={{ my: 4 }}>
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="center" alignItems="center">
              <Typography variant="h6">Checking eligibility...</Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    );
  }

  if (isEligible === false) {
    return (
      <Container component="main" maxWidth="sm" sx={{ my: 4 }}>
        <Card elevation={3}>
          <CardContent>
            <Alert
              severity="info"
              icon={<Info fontSize="large" />}
              sx={{ mb: 2 }}
            >
              <AlertTitle>Registration Status</AlertTitle>
              Our records indicate that you have already completed the library
              registration process.
            </Alert>
            <Typography variant="body1" paragraph>
              If you need to update your information or have any questions
              regarding your registration, please don't hesitate to contact us:
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" fontWeight="bold">
              Edugainer's Office Contact Information:
            </Typography>
            <Typography variant="body1">Phone: 9997999768</Typography>
            <Typography variant="body1">Phone: 9997999765</Typography>
            <Typography variant="body1">Phone: 8126857111</Typography>
            <Typography variant="body1">
              Email: edugainersclasses@gmail.com
            </Typography>
            <Typography variant="body1">
              Hours: Monday to Sunday, 9:00 AM - 9:00 PM
            </Typography>
            <Box mt={3}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/")}
                fullWidth
              >
                Return to HomePage
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    );
  }

  if (submit === "Payment") {
    return <CircularProgress />;
  } else {
    return (
      <Container component="main" maxWidth="sm" sx={{ my: 4 }}>
        <Paper elevation={6} sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            <HowToReg fontSize="large" /> Library Registration
          </Typography>
          <Stepper
            activeStep={activeStep}
            sx={{ pt: 3, pb: 5 }}
            orientation={isMobile ? "vertical" : "horizontal"}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <form onSubmit={handleSubmit(handleStepSubmit)}>
            {getStepContent(activeStep)}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 3,
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              {activeStep !== 0 && (
                <Button
                  onClick={handleBack}
                  sx={{ mr: 1, mb: isMobile ? 2 : 0 }}
                  fullWidth={isMobile}
                >
                  Back
                </Button>
              )}
              {activeStep === steps.length - 1 ? (
                <Button
                  type="button"
                  variant="contained"
                  onClick={onSubmit}
                  disabled={loading || !consentGiven}
                  fullWidth={isMobile}
                >
                  Submit and Pay ₹105
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={activeStep === 3 && !consentGiven}
                  fullWidth={isMobile}
                >
                  Next
                </Button>
              )}
            </Box>
          </form>
        </Paper>
      </Container>
    );
  }
}
