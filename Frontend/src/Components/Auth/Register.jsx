import React, { useState } from "react";
import { Button, Form, FormGroup, Label, Input, Container } from "reactstrap";
import { registerUser, sendOTP } from "../../services/auth"; // Import sendOTP service
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

function Register() {
  const { register, handleSubmit, setError, formState } = useForm();
  const { errors } = formState;
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await registerUser(data.email, data.password);
      console.log(response);
      if (response && response.message === "User already exists") {
        setError("email", { type: "manual", message: "Email already exists" });
      } else if (response && response.message === "OTP sent successfully") {
        navigate("/otp-verify");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <Form
        onSubmit={handleSubmit(onSubmit)}
        className="register-form"
        style={{ width: "30%" }}
        noValidate
      >
        <FormGroup className="text-center mt-3">
          <h2>Register</h2>
        </FormGroup>
        <FormGroup className="mb-3">
          <Label for="email">Email address</Label>
          <input
            type="email"
            name="email"
            id="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email address",
              },
            })}
            placeholder="Enter email"
            className="form-control"
          />
          <p className="error">{errors.email?.message}</p>
        </FormGroup>
        <FormGroup className="mb-3">
          <Label for="password">Password</Label>
          <input
            type="password"
            name="password"
            id="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
              maxLength: {
                value: 16,
                message: "Password must not exceed 16 characters",
              },
            })}
            placeholder="Enter password"
            className="form-control"
          />
          <p className="error">{errors.password?.message}</p>
        </FormGroup>
        <FormGroup className="text-center">
          <Button
            type="submit"
            className="btn btn-warning"
            style={{ width: "100%" }}
          >
            Send OTP
          </Button>
        </FormGroup>
        <FormGroup className="text-center mt-3">
          <Label>
            Already have an account? <a href="/login">Login</a>
          </Label>
        </FormGroup>
      </Form>
    </Container>
  );
}

export default Register;
