import React, { useState, useContext } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
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
} from "@mui/material";
import { HowToReg } from "@mui/icons-material";
import { AdminContext } from "../../App";
import { sendFormData } from "../../services/utils";

const steps = [
  "Personal Information",
  "Contact Details",
  "Additional Information",
];

export default function LibraryRegistration() {
  const { IsUserLoggedIn } = useContext(AdminContext);
  const id = IsUserLoggedIn?._id;
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({});
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [imageBase64, setImageBase64] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
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
    setFileToBase64(file);
  };

  const handleStepSubmit = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    handleNext();
  };

  const onSubmit = async () => {
    setLoading(true);
    try {
      const finalFormData = {
        ...formData,
        image: imageBase64,
        userId: id,
      };
      await sendFormData(finalFormData);
      navigate(`/success/${id}`);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
         
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
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
              <Grid item xs={12} sm={6}>
                <Controller
                  name="gender"
                  control={control}
                  defaultValue={formData.gender || ""}
                  rules={{ required: "Gender is required" }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.gender}>
                      <InputLabel>Gender</InputLabel>
                      <Select {...field} label="Gender">
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
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
              <Grid item xs={12} sm={6}>
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
              <Grid item xs={12} sm={6}>
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
        
      
    
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
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
            <Grid item xs={12} sm={6}>
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
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="aadhaar"
                control={control}
                defaultValue={formData.aadhaar || ""}
                rules={{ required: "Aadhaar or ID No is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Aadhaar or Any ID No"
                    error={!!errors.aadhaar}
                    helperText={errors.aadhaar?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
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
                name="image"
                control={control}
                defaultValue=""
                rules={{ required: "Photo is required" }}
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
                        Upload Photo
                      </Button>
                    </label>
                    {errors.image && (
                      <Typography color="error">
                        {errors.image.message}
                      </Typography>
                    )}
                  </Box>
                )}
              />
              {imageBase64 && <Avatar src={imageBase64} alt="Uploaded Photo" />}
            </Grid>
          </Grid>
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <Container component="main" maxWidth="md" sx={{my:10}}>
      <Paper elevation={6} sx={{ p: 4 }}>
        <Typography component="h1" variant="h5" align="center">
          <HowToReg fontSize="large" /> Library Registration
        </Typography>
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <form onSubmit={handleSubmit(handleStepSubmit)}>
          {getStepContent(activeStep)}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            {activeStep !== 0 && (
              <Button onClick={handleBack} sx={{ mr: 1 }}>
                Back
              </Button>
            )}
            {activeStep === steps.length - 1 ? (
              <Button
                type="button"
                variant="contained"
                onClick={onSubmit}
                disabled={loading}
              >
                Submit
              </Button>
            ) : (
              <Button type="submit" variant="contained" onClick={handleNext}>
                Next
              </Button>
            )}
          </Box>
        </form>
      </Paper>
    </Container>
  );
}
