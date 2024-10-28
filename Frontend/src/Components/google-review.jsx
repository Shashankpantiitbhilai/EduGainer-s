import React, { useState } from "react";
import { Card, CardContent, Box, Button } from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";

const GoogleReviews = () => {
  const [showFullReviews, setShowFullReviews] = useState(false);

  const toggleReviews = () => {
    setShowFullReviews((prev) => !prev);
  };

  return (
    <Card
      sx={{
        width: "100%",
        maxHeight: showFullReviews ? "100vh" : "80vh",
        border: "1px solid #ddd",
        borderRadius: "12px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f8f9fa",
        boxShadow: 3, // Add a subtle box shadow
        transition: "max-height 0.3s ease-in-out", // Add transition for smooth height change
      }}
    >
      <CardContent
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0, // Remove the default padding
        }}
      >
        <iframe
          src="https://widgets.sociablekit.com/google-reviews/iframe/25480748"
          frameBorder="0"
          width="100%"
          height={showFullReviews ? "100%" : "600px"}
          scrolling="no"
          title="Google Reviews"
          style={{ border: "none", transition: "height 0.3s ease-in-out" }} // Add transition for smooth height change
        ></iframe>
      </CardContent>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          p: 2,
          backgroundColor: "rgba(248, 249, 250, 0.8)", // Semi-transparent background
        }}
      >
        <Button
          variant="text"
          color="primary"
          onClick={toggleReviews}
          startIcon={showFullReviews ? <ExpandLess /> : <ExpandMore />}
          sx={{
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.8)",
            },
          }}
        >
          {showFullReviews ? "Show Less" : "Show More"}
        </Button>
      </Box>
    </Card>
  );
};

export default GoogleReviews;
