import React, { useState, useContext } from "react";
import { Button, TextField, Container, Typography, Box } from "@mui/material";
import { verifyOTPAndRegisterUser } from "../../services/auth";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { AdminContext } from "../../App";

function OTPVerify() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();
  const [error, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const { setIsUserLoggedIn } = useContext(AdminContext);

  const onSubmit = async (data) => {
    try {
      console.log(data);
      const response = await verifyOTPAndRegisterUser(data.otp, id);
      if (response.success) {
        setIsUserLoggedIn(response);
        navigate("/");
      } else {
        setErrorMsg("OTP verification failed");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      setErrorMsg("An error occurred while verifying OTP");
    }
  };
  console.log(id);
  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Verify OTP
        </Typography>
        <TextField
          fullWidth
          id="otp"
          label="Enter OTP"
          variant="outlined"
          margin="normal"
          {...register("otp", {
            required: "OTP is required",
            minLength: {
              value: 6,
              message: "OTP must be 6 characters long",
            },
          })}
          error={!!errors.otp}
          helperText={errors.otp ? errors.otp.message : ""}
        />
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Verify OTP
        </Button>
      </Box>
    </Container>
  );
}

export default OTPVerify;
