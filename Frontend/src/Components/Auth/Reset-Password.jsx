import React from "react";
import { Container, Form, FormGroup, Label, Button } from "reactstrap"; // Assuming you're using Reactstrap
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom"; // Import Link for routing
import { resetPassword } from "../../services/auth";

function ResetPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const { id, token } = useParams();

  const onSubmit = async (data) => {
    try {
      const response = await resetPassword(data.password, id, token);
      if (response && response.success) {
        navigate("/login");
      } else {
        // console.error("Error resetting password:", response.message);
      }
    } catch (error) {
      // console.error("Error resetting password:", error);
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center login-container"
      style={{ height: "100vh" }}
    >
      <Form
        onSubmit={handleSubmit(onSubmit)}
        className="login-form"
        style={{ width: "30%" }}
        noValidate
      >
        <FormGroup className="text-center mt-3">
          <h2>Reset Password</h2>
        </FormGroup>

        <FormGroup className="mb-3">
          <Label for="password">New Password</Label>
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
            className="form-control" // Apply 'is-invalid' class if there's an error
          />
          <div className="error">{errors.password?.message}</div>
        </FormGroup>

        <FormGroup className="text-center">
          <Button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%" }}
          >
            Submit
          </Button>
        </FormGroup>
      </Form>
    </Container>
  );
}

export default ResetPassword;
