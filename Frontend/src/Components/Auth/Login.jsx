import React, { useState, useContext } from "react";
import { AdminContext } from "../../App";
import { Button, Form, FormGroup, Label, Input, Container } from "reactstrap";
import GoogleIcon from "@mui/icons-material/Google";
import { loginUser } from "../../services/auth";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";

function Login() {
  const form = useForm();
  const { register, control, handleSubmit, formState, setError, clearErrors } =
    form;
  const { errors } = formState;
  const { setIsUserLoggedIn } = useContext(AdminContext);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await loginUser(data.email, data.password);
      console.log(response);
      if (response && response.user.role === "user") {
        setIsUserLoggedIn(response.user);
        navigate("/");
      } else if (response && response.user.role === "admin") {
      
        setIsUserLoggedIn(response.user);
        navigate("/admin_home");
      } else {
        setError("login", { type: "manual", message: "Invalid credentials" });
        // Clear the error after a short delay
        setTimeout(() => {
          clearErrors("login"); // Assuming clearErrors is defined in useForm
        }, 3000); // Adjust the delay as needed
      }
    } catch (error) {
      console.error("Login error:", error);
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
          <h2>Sign In</h2>
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
          <FormGroup className="text-center">
            {errors.login && <p className="error">{errors.login.message}</p>}
          </FormGroup>
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
        <a href="/forgot-password">Forgot Password</a>
        <FormGroup className="text-center">
          <Button
            type="submit"
            className="btn btn-warning"
            style={{ width: "100%" }}
          >
            Submit
          </Button>
        </FormGroup>
        <FormGroup className="text-right"></FormGroup>
        <div className="or-divider mb-3">
          <hr />
          <p>OR</p>
          <hr />
        </div>
        <FormGroup className="text-center">
          <a href="http://localhost:8000/auth/google">
            <Button type="button" style={{ width: "100%" }} color="warning">
              Sign in with Google <GoogleIcon />
            </Button>
          </a>
        </FormGroup>
        <FormGroup className="text-center mt-3">
          <Label>
            Don't have an Account? <a href="/register">Register</a>
          </Label>
        </FormGroup>
      </Form>
      <DevTool control={control} />
    </Container>
  );
}

export default Login;
