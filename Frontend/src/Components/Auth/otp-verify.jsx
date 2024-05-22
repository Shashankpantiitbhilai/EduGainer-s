import React, { useState, useContext } from "react";
import { Button, Form, FormGroup, Label, Input, Container } from "reactstrap";
import { verifyOTPAndRegisterUser } from "../../services/auth";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
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
  const { setIsUserLoggedIn } = useContext(AdminContext);
  const onSubmit = async (data) => {
    // console.log(data);
    try {
      const response = await verifyOTPAndRegisterUser(data.otp);
      console.log(response);
      if (response.success) {
        // OTP verified successfully, navigate to dashboard
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

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <Form onSubmit={handleSubmit(onSubmit)} className="otp-verify-form">
        <FormGroup>
          <Label for="otp">Enter OTP</Label>
          <input
            type="text"
            name="otp"
            id="otp"
            {...register("otp", {
              required: "OTP is required",
              minLength: {
                value: 6,
                message: "OTP must be  6 characters long",
              },
            })}
            placeholder="Enter OTP"
            className="form-control"
          />
          {errors.otp && <p className="error">{errors.otp.message}</p>}
        </FormGroup>
        {error && <p className="error">{error}</p>}
        <Button type="submit" color="primary">
          Verify OTP
        </Button>
      </Form>
    </Container>
  );
}

export default OTPVerify;
