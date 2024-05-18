import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Container, Form, FormGroup, Label, input, Button } from "reactstrap";
import { sendFormData } from "../../services/utils.js";
function NewReg() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const setFileToBase64 = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImageBase64(reader.result);
    };
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    // console.log(file);
    setImage(file);
    setFileToBase64(file);
  };

  const onSubmit = async (formData) => {
    setLoading(true);

    // Prepare form data including imageBase64
    const formDataWithImage = {
      ...formData,
      image: imageBase64,
    };
    // console.log(formDataWithImage);
    try {
      console.log(formDataWithImage);
      const result = await sendFormData(formDataWithImage);
      console.log("Form data sent successfully:", result);
      // Handle success case: show success message, redirect, etc.
      // Optionally reset the form after successful submission
    } catch (error) {
      console.error("Error sending form data:", error);
      // Handle error case: show error message, retry logic, etc.
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center NewReg-container"
      style={{ height: "100vh" }}
    >
      <Form
        onSubmit={handleSubmit(onSubmit)}
        className="NewReg-form"
        style={{ width: "30%" }}
        noValidate
      >
        <FormGroup className="text-center mt-3">
          <h2>Registration Form</h2>
        </FormGroup>

        <FormGroup className="mb-3">
          <Label for="name">Name</Label>
          <input
            type="text"
            name="name"
            id="name"
            className="form-control"
            {...register("name", { required: "Name is required" })}
            placeholder="Enter your name"
          />
          <p className="error">{errors.name?.message}</p>
        </FormGroup>

        <FormGroup className="mb-3">
          <Label for="shift">Shift Chosen</Label>
          <select
            type="select"
            name="shift"
            id="shift"
            {...register("shift", { required: "Shift selection is required" })}
            className="form-control"
          >
            <option value="">Select Shift</option>
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="evening">Evening</option>

            <p className="error">{errors.shift?.message}</p>
          </select>
        </FormGroup>

        <FormGroup className="mb-3">
          <Label for="email">Email Address</Label>
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
          <Label for="mobile">Mobile Number</Label>
          <input
            type="tel"
            name="mobile"
            id="mobile"
            {...register("mobile", {
              required: "Mobile number is required",
              pattern: {
                value: /^\d{10}$/,
                message: "Please enter a valid 10-digit mobile number",
              },
            })}
            placeholder="Enter mobile number"
            className="form-control"
          />
          <p className="error">{errors.mobile?.message}</p>
        </FormGroup>

        <FormGroup className="mb-3">
          <Label for="address">Address</Label>
          <input
            type="text"
            name="address"
            id="address"
            {...register("address", { required: "Address is required" })}
            placeholder="Enter address"
            className="form-control"
          />
          <p className="error">{errors.address?.message}</p>
        </FormGroup>

        <FormGroup className="mb-3">
          <Label for="image">Upload Image</Label>
          <input
            type="file"
            name="image"
            id="image"
            onChange={handleImage}
            accept="image/*"
            className="form-control"
            // {...register("image", { required: "Image is required" })}
          />
          <p className="error">{errors.image?.message}</p>
        </FormGroup>

        <FormGroup className="text-center">
          <Button
            type="submit"
            className="btn btn-warning"
            style={{ width: "100%" }}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </FormGroup>
      </Form>
    </Container>
  );
}

export default NewReg;
