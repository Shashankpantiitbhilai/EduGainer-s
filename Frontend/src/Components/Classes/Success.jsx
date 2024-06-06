import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, CardImg, CardTitle, CardSubtitle } from "reactstrap";
import {
  sendIdCard,
  fetchUserClassesDataById,
} from "../../services/Class/utils";

import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer, Bounce } from "react-toastify";

const SuccessClasses = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [userImage, setUserImage] = useState("");
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    if (isFetched) return; // Prevents duplicate execution
    const getUserData = async () => {
      try {
        const userData = await fetchUserClassesDataById(id);
        setUserData(userData);
        setUserImage(userData.image.url);
        await sendIdCard(id);
        toast.success("👍 Check your mail for Id card!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        setTimeout(() => {
          const url = `/dashboard/${id}`;
          navigate(url);
        }, 6000);
        setIsFetched(true); // Mark as fetched
      } catch (error) {
        console.error("Error fetching user data or sending ID card:", error);
        toast.error("Error sending ID card. Please try again.");
      }
    };

    getUserData();
  }, [id, navigate, isFetched]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="d-flex justify-content-center align-items-center SuccessClasses-container">
      <Card style={{ width: "80%", padding: "20px", margin: "20px" }}>
        <div style={{ display: "flex" }}>
          <div style={{ flex: "1", paddingRight: "20px" }}>
            <CardTitle tag="h3">{userData.name}</CardTitle>
            <CardSubtitle tag="h5" className="mb-2 text-muted">
              Student
            </CardSubtitle>
            <p style={{ fontSize: "1.2rem" }}>Batch: {userData.Batch}</p>
            <p style={{ fontSize: "1.2rem" }}>Email: {userData.email}</p>
            <p style={{ fontSize: "1.2rem" }}>Mobile: {userData.mobile}</p>
            <p style={{ fontSize: "1.2rem" }}>Address: {userData.address}</p>
          </div>
          <div style={{ flex: "1", height: "100%", overflow: "hidden" }}>
            <CardImg
              top
              width="100%"
              src={userImage}
              alt="User Image"
              style={{ height: "100%" }}
            />
          </div>
        </div>
      </Card>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </Container>
  );
};

export default SuccessClasses;
