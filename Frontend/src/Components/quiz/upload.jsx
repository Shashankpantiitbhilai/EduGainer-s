import React, { useState } from "react";
import { quizUpload } from "../../services/quiz/utils"; // Adjust the path to your utils file
import {
  TextField,
  Button,
  Typography,
  Container,
  CircularProgress,
} from "@mui/material";

const QuizUploader = () => {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult({}); // Reset result state

    try {
      const response = await quizUpload(url);
      setResult(response);
    } catch (error) {
      setError("Error processing the URL. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <TextField
          label="PDF URL"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          fullWidth
          margin="normal"
          variant="outlined"
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Submit"}
        </Button>
      </form>
      {error && (
        <Typography color="error" variant="body2" marginTop={2}>
          {error}
        </Typography>
      )}
      {result.text && (
        <Typography variant="body1" marginTop={2}>
          {result.text}
        </Typography>
      )}
    </Container>
  );
};

export default QuizUploader;
