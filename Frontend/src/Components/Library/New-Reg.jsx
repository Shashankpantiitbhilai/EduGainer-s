import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Container, Form, FormGroup, Label, Input, Button } from "reactstrap";
import { sendFormData } from "../../services/utils.js";
import axios from "axios";
import { useNavigate, redirect } from "react-router-dom";

function NewReg() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [imageBase64, setImageBase64] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setIsRazorpayLoaded(true);
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

    const formDataWithImage = {
      ...formData,
      image: imageBase64,
    };

    try {
      const result = await sendFormData(formDataWithImage);
      const { key, order, user } = result;

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
          const callbackUrl = `http://localhost:8000/payment-verification/${user._id}`;

          try {
            const verificationResponse = await axios.post(callbackUrl, {
              order_id: razorpay_order_id,
              payment_id: razorpay_payment_id,
              signature: razorpay_signature,
              user_id: user._id,
            });
            const id = user._id;
            console.log(verificationResponse.data.success);
            if (verificationResponse.data.success) {
              const url = `/success/${id}`;
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
            className="form-control"
            {...register("shift", { required: "Shift selection is required" })}
            className="form-control"
          >
            <option value="">Select Shift</option>
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="evening">Evening</option>
          </select>
          <p className="error">{errors.shift?.message}</p>
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

export default NewReg;
