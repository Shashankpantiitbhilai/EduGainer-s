import React, { useState, useContext } from "react";
import { AdminContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { Button, Form, FormGroup, Label, Input, Container } from "reactstrap";
import GoogleIcon from "@mui/icons-material/Google";
import { registerUser } from "../../services/auth";
import "bootstrap/dist/css/bootstrap.min.css";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";

function Register() {
  const form = useForm();
  const { register, control, handleSubmit, formState } = form;
  const { errors } = formState;

  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const { setIsUserLoggedIn } = useContext(AdminContext);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      // event.preventDefault(); // Prevent form submission
      const response = await registerUser(data.email, data.password);
      console.log(response);
      if (response) {
        setIsUserLoggedIn(response.user);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Registration Error:", error);
      // Handle the error as needed
    }
  };

  return (
    <Container
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <Container className="d-flex justify-content-center align-items-center">
        <Form
          onSubmit={handleSubmit(onSubmit)}
          className="login-form"
          style={{ width: "30%" }}
          noValidate
        >
          <FormGroup className="text-center">
            <h2>Register</h2>
          </FormGroup>

          <FormGroup>
            <Label for="email">Email</Label>
            <Input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              ref={register("email", {
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email",
                },
                // Combine here
              })}
              // value={email}
              // onChange={(e) => setEmail(e.target.value)}
              style={{ borderRadius: "10px" }}
            />

            <p className="error">{errors.email?.message}</p>
          </FormGroup>
          <FormGroup>
            <Label for="password">Create Password</Label>
            <Input
              type="password"
              name="password"
              ref={register("password", {
                required: "Password is required",
              })}
              // value={password}
              // onChange={(e) => setPassword(e.target.value)}
              id="password"
              placeholder="Password"
              className="form-control"
              style={{ borderRadius: "10px" }}
            />
            <p className="error">{errors.password?.message}</p>
          </FormGroup>
          <FormGroup className="text-center">
            <Button
              type="submit"
              style={{ width: "100%", borderRadius: "10px" }}
              color="success"
            >
              Register
            </Button>
          </FormGroup>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "10px",
            }}
          >
            <hr style={{ width: "40%" }} />
            <p style={{ margin: "0 10px" }}>OR</p>
            <hr style={{ width: "40%" }} />
          </div>
          <FormGroup className="text-center">
            <a href="http://localhost:8000/auth/google">
              <Button
                type="button"
                style={{ width: "100%", borderRadius: "10px" }}
                color="primary"
              >
                Sign up with Google <GoogleIcon />
              </Button>
            </a>
          </FormGroup>
          <FormGroup className="text-center">
            <Label>
              Already have an Account? <a href="/login">Login</a>
            </Label>
          </FormGroup>
        </Form>
        <DevTool control={control} />
      </Container>
    </Container>
  );
}

export default Register;
