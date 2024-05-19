import { React, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardSubtitle,
} from "reactstrap";
import { sendIdCard } from "../../services/utils";
import { fetchUserDataById } from "../../services/utils";
const SuccessPage = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [userImage, setUserImage] = useState(""); // Assuming you'll fetch this as well

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await fetchUserDataById(id);
        setUserData(userData);
        setUserImage(userData.image.url); // Assuming userImage comes from userData
        await sendIdCard(id); // Call sendIdCard immediately after fetching user data
        console.log("ID card sent successfully.");
        // Handle success scenario (navigate to dashboard or show success message)
      } catch (error) {
        console.error("Error fetching user data or sending ID card:", error);
        // Handle error scenario (show error message or retry logic)
      }
    };

    getUserData();
  }, [id]);

  if (!userData) {
    return <div>Loading...</div>; // Placeholder for loading state
  }
  return (
    <Container id="id"className=" d-flex justify-content-center align-items-center SuccessPage-container ">
      <Card style={{ width: "80%", padding: "20px", margin: "20px" }}>
        <div style={{ display: "flex" }}>
          {/* Left Side: Details with Increased Font Size */}
          <div style={{ flex: "1", paddingRight: "20px" }}>
            <CardTitle tag="h3">{userData.name}</CardTitle>
            <CardSubtitle tag="h5" className="mb-2 text-muted">
              Student
            </CardSubtitle>
            <p style={{ fontSize: "1.2rem" }}>Shift: {userData.shift}</p>
            <p style={{ fontSize: "1.2rem" }}>Email: {userData.email}</p>
            <p style={{ fontSize: "1.2rem" }}>Mobile: {userData.mobile}</p>
            <p style={{ fontSize: "1.2rem" }}>Address: {userData.address}</p>
          </div>

          {/* Right Side: Photo */}
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
    </Container>
  );
};

export default SuccessPage;
