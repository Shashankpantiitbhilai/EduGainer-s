import React, { useState, useContext, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import {
  Alert,
  AlertTitle,
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

import { HowToReg, CheckCircleOutline, Info } from "@mui/icons-material";
import { AdminContext } from "../../App";
import {
  eligibleForNewRegistration,
  getStudentDetails,
} from "../../services/Class/utils";
import Payment from "../payment/razorpay";
import { CircularProgress } from "@mui/material";

const steps = [
  "Benefits",
  "Personal Info",
  "Academic Info",
  "Contact Info",
  "Additional Info",
  "Payment",
];

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB in bytes

export default function ClassReg() {
  const { IsUserLoggedIn } = useContext(AdminContext);
  const id = IsUserLoggedIn?._id;
  const [activeStep, setActiveStep] = useState(0);
  const { ClassId } = useParams();
  const [submit, setSubmit] = useState("");
  const [formData, setFormData] = useState({
    email: IsUserLoggedIn?.username || "",
  });
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: IsUserLoggedIn?.username || "",
      Batch: ClassId,
    },
  });
  const [imageBase64, setImageBase64] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isEligible, setIsEligible] = useState(null);
  const [consentGiven, setConsentGiven] = useState(false);
  const [fileError, setFileError] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [fee, setFee] = useState(0);
  const { initializePayment } = Payment({
    formData,
    imageBase64,
    amount: fee,
    userId: id,
    setLoading,
    status: "newClassRegistration",
  });

  useEffect(() => {
    const checkEligibility = async () => {
      try {
        const response = await eligibleForNewRegistration(id, ClassId);
        console.log(response);
        setIsEligible(response);
      } catch (error) {
        setIsEligible(false);
      }
    };

    if (id) {
      checkEligibility();
    }
  }, [id, ClassId]);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      if (id) {
        try {
          const data = await getStudentDetails(id, ClassId);
          // Populate form fields with fetched data
          const studentDetails = data.studentDetails;

          setFee(data?.fee);
          Object.keys(studentDetails).forEach((key) => {
            console.log(key, studentDetails[key]);
            setValue(key, studentDetails[key]);
          });
          setFormData((prev) => ({ ...prev, ...studentDetails }));

          // If there's a profile picture, set it
          console.log(formData, "ppppppp");
          if (studentDetails.image) {
            setImageBase64(studentDetails.image);
          }
        } catch (error) {
          console.error("Error fetching student details:", error);
          // You might want to show an error message to the user here
        }
      }
    };

    fetchStudentDetails();
  }, [id, setValue]);

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
      setFileError("File size should not exceed 2 MB");
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
      setSubmit("Payment");
      await initializePayment();
    } else {
      handleNext();
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Benefits of Edugainers Classes Registration
              </Typography>
              <List>
                {[
                  "Access to expert faculty",
                  "Personalized learning experience",
                  "Regular assessments and feedback",
                  "Study materials and resources",
                  "Interactive learning environment",
                  "Preparation for competitive exams",
                  "Flexible class schedules",
                  "Progress tracking and reporting",
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
                Join Edugainers Classes today and unlock your full potential!
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
                    error={!!errors.father}
                    helperText={errors.father?.message}
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
                name="standard"
                control={control}
                defaultValue={formData.standard || ""}
                rules={{ required: "standard is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="standard"
                    error={!!errors.standard}
                    helperText={errors.standard?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="subject"
                control={control}
                defaultValue={formData.subject || ""}
                rules={{ required: "Subject is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Subject"
                    error={!!errors.subject}
                    helperText={errors.subject?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="board"
                control={control}
                defaultValue={formData.board || ""}
                rules={{ required: "Board is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Board"
                    error={!!errors.board}
                    helperText={errors.board?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="school"
                control={control}
                defaultValue={formData.school || ""}
                rules={{ required: "School name is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="School Name"
                    error={!!errors.school}
                    helperText={errors.school?.message}
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
                  pattern: {
                    value: /^\d{10}$/,
                    message: "Please enter a valid 10-digit contact number",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Secondary Contact Number (Optional)"
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
                defaultValue={IsUserLoggedIn?.username || ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email Address"
                    disabled
                    InputProps={{
                      readOnly: true,
                    }}
                    value={IsUserLoggedIn?.username || ""}
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
      case 4:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="aadhar"
                control={control}
                defaultValue={formData.aadhar || ""}
                rules={{
                  required: "Aadhar Number is required",
                  pattern: {
                    value: /^[2-9][0-9]{3}\s[0-9]{4}\s[0-9]{4}$/,
                    message:
                      "Invalid Aadhar number format. Must be in the format: 2xxx xxxx xxxx",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Aadhar Number"
                    error={!!errors.aadhar}
                    helperText={errors.aadhar?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="preparingForExam"
                control={control}
                defaultValue={formData.preparingForExam || ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Preparing for Exam (Optional)"
                    error={!!errors.preparingForExam}
                    helperText={errors.preparingForExam?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="image"
                control={control}
                defaultValue=""
                rules={{
                  required: "Student Photo is required",
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
                        Upload Student Photo
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
                label="I agree to the privacy policy, terms of conditions, and agree to abide by the rules and regulations of Edugainers Classes."
              />
            </Grid>
          </Grid>
        );
      case 5:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6">Payment Details</Typography>
            </Grid>
            <Grid item xs={12}>
              <Alert severity="info">
                When clicking on Submit, the payment portal will start. You are
                advised not to refresh the page during the payment process. Once
                the payment is successful, you will be automatically taken to
                your class registration confirmation page.
              </Alert>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">Registration Fee: ₹{fee}</Typography>
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
              Our records indicate that you have already completed the class
              registration process.
            </Alert>
            <Typography variant="body1" paragraph>
              If you need to update your information or have any questions
              regarding your registration, please don't hesitate to contact us:
            </Typography>
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
            <HowToReg fontSize="large" /> Class Registration
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
                  Submit and Pay ₹{fee}
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={activeStep === 4 && !consentGiven}
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
