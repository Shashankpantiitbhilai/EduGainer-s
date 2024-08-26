import React from "react";

const FeedbackForm = () => {
  return (
    <div
      style={{ textAlign: "center", margin: "20px auto", maxWidth: "800px" }}
    >
      <h2>Share Your Thoughts with EduGainer's</h2>
      <p>
        We appreciate your input! Help us improve your experience by providing
        feedback on our website and our facilities.
      </p>
      <iframe
        src="https://docs.google.com/forms/d/e/1FAIpQLScFfbN_g08SZJ-obkAv8Ib2-7YP5wcfMgHGir1qkonynkMCuA/viewform?embedded=true"
        width="100%"
        height="800"
      
        style={{
          border: "none",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
        title="EduGainers Feedback Form"
      >
        Loading…
      </iframe>
    </div>
  );
};

export default FeedbackForm;
