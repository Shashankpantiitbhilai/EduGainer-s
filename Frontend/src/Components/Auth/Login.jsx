import React, { useState, useContext } from "react";
import { AdminContext } from "../../App";
import { Button, Form, FormGroup, Label, Input, Container } from "reactstrap";
import GoogleIcon from "@mui/icons-material/Google";
import { loginUser } from "../../services/auth";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
// let FormFields = {
//   email: string;
//   password: string;
// };
function Login() {
  const form = useForm();
  const { register, control, handleSubmit, formState } = form;
  const { errors } = formState;
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const { setIsUserLoggedIn } = useContext(AdminContext);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await loginUser(data.email, data.password);
      console.log(response);
      if (response) {
        setIsUserLoggedIn(response.user);
        navigate("/dashboard");
      } else {
        if (response.message === "User not found") {
          alert("User not found. Please register first.");
        } else {
          alert("Incorrect username or password.");
        }
      }
    } catch (error) {
      // Handle login error, e.g., network issues, etc.
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
          <Input
            type="email"
            name="email"
            id="email"
            {...register("email", {
              required: {
                value: true,
                message: "required",
              },
            })}
            placeholder="Enter email"
            // value={email}
            className="form-control"
          />
          <p className="error">{errors.email?.message}</p>
        </FormGroup>
        <FormGroup className="mb-3">
          <Label for="password">Password</Label>
          <Input
            type="password"
            name="password"
            id="password"
            {...register("password", {
              required: "Password is required",
            })}
            placeholder="Enter password"
            // value={password}
            className="form-control"
          />
          <p className="error">{errors.password?.message}</p>
        </FormGroup>
        <FormGroup className="mb-3">
          <div className="custom-control custom-checkbox">
            <Input
              type="checkbox"
              className="custom-control-input"
              id="customCheck1"
            />
            <Label className="custom-control-label" htmlFor="customCheck1">
              Remember me
            </Label>
          </div>
        </FormGroup>
        <FormGroup className="text-center">
          <Button
            type="submit"
            className="btn btn-warning"
            style={{ width: "100%" }}
          >
            Submit
          </Button>
        </FormGroup>
        <FormGroup className="text-right">
          <p className="forgot-password">
            Forgot <a href="#">password?</a>
          </p>
        </FormGroup>
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
