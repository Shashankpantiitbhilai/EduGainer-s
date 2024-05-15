import React, { useState } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Container,
  Alert,
} from "reactstrap";
import { forgotPassword } from "../../services/auth";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm();
  const [successMessage, setSuccessMessage] = useState("");

  const onSubmit = async (data) => {
    try {
      const response = await forgotPassword(data.email);
      if (response && response.Status === "Success") {
        setSuccessMessage("Check your email");
      } else {
        setError("email", {
          type: "manual",
          message: "Error: Email not found",
        });
      }
    } catch (error) {
      console.log("Error:", error);
      setError("email", {
        type: "manual",
        message: "Error: Something went wrong",
      });
    }
    setTimeout(() => {
      clearErrors("email");
      setSuccessMessage("");
    }, 3000);
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Form onSubmit={handleSubmit(onSubmit)} className="w-25" noValidate>
        <h2 className="text-center mb-4">Forgot Password</h2>
        {errors.email && <p class="error">{errors.email.message}</p>}
        {successMessage && <Alert color="success">{successMessage}</Alert>}
        <FormGroup className="mb-3">
          <Label for="email">Email address</Label>
          <input
            type="email"
            name="email"
            id="email"
            className="form-control"
            placeholder="Enter email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email address",
              },
            })}
          />
        </FormGroup>
        <Button type="submit" color="primary" block>
          Send
        </Button>
      </Form>
    </Container>
  );
}

export default ForgotPassword;
