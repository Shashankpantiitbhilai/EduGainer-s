import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { Container, Form, FormGroup, Label, Button } from "reactstrap";
import { sendFormData } from "../../services/Class/utils.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../../App.js";

function ClassesRegistration() {
  const { IsUserLoggedIn, setIsUserLoggedIn } = useContext(AdminContext);
  console.log(IsUserLoggedIn._id);
  const id = IsUserLoggedIn._id;
  console.log(id);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [imageBase64, setImageBase64] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

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

  const onSubmit = async (formData) => {
    setLoading(true);

    console.log(formData);
    const formDataWithImage = {
      ...formData,
      image: imageBase64,
      userId: id, // Add the userId to the form data
    };

    try {
      const result = await sendFormData(formDataWithImage);
      const { key, order, user } = result;
      console.log(user.userId);
      const options = {
        key,
        amount: order.amount,
        currency: "INR",
        name: "Library Management",
        description: "Library Registration Fee",
        image: "https://example.com/logo.png",
        order_id: order.id,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.mobile,
        },
        notes: {
          address: formData.address,
        },
        theme: {
          color: "#3399cc",
        },
        handler: async (response) => {
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
            response;
          const callbackUrl = `http://localhost:8000/classes/payment-verification/${user.userId}`;

          try {
            const verificationResponse = await axios.post(callbackUrl, {
              order_id: razorpay_order_id,
              payment_id: razorpay_payment_id,
              signature: razorpay_signature,
            });
            const id = user.userId;
            console.log(id);
            console.log(verificationResponse.data.success);
            if (verificationResponse.data.success) {
              const url = `/classes/success/${id}`;
              navigate(url); // Navigate to success page
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (error) {
            console.error("Error verifying payment:", error);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            console.error("Payment popup closed");
          },
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Error processing payment:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container
      className="d-flex justify-content-center align-items-center ClassesRegistration-container"
      style={{ height: "100vh" }}
    >
      <Form
        onSubmit={handleSubmit(onSubmit)}
        className="ClassesRegistration-form"
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
          <Label for="Batch">Select Class</Label>
          <select
            name="Batch"
            id="Batch"
            className={`form-control ${errors.class ? "is-invalid" : ""}`}
            {...register("Batch", { required: "Class selection is required" })}
          >
            <option value="">Select Class</option>
            <option value="Class 6">Class 6</option>
            <option value="Class 7">Class 7</option>
            <option value="Class 8">Class 8</option>
            <option value="Class 9">Class 9</option>
          </select>
          <p className="error">{errors.class?.message}</p>
        </FormGroup>

        <FormGroup className="mb-3">
          <Label for="amount">Amount</Label>
          <input
            type="number"
            name="amount"
            id="amount"
            {...register("amount", { required: "Amount is required" })}
            placeholder="Enter amount"
            className="form-control"
          />
          <p className="error">{errors.amount?.message}</p>
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
          />
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

export default ClassesRegistration;
