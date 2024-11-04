import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { 
  Button, 
  Typography, 
  CircularProgress, 
  Box, 
  Paper,
  IconButton,
  Alert,
  Chip,
  Card,
  CardContent,
  Tooltip,
  Fade,
  Backdrop
} from '@mui/material';
import { 
  Camera, 
  FlipCameraIos, 
  CheckCircle,
  Warning 
} from '@mui/icons-material';
import { analyzeImage } from '../../services/vision/auth';

const EduGainerFaceRecognition = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [labels, setLabels] = useState([]);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState("user");
  const [isCameraActive, setIsCameraActive] = useState(true);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Theme configuration
  const themeColors = {
    primary: theme.palette.primary.main, // Use app theme primary color
    secondary: theme.palette.secondary.main, // Use app theme secondary color
    background: theme.palette.background.default,
    paper: theme.palette.background.paper,
    text: theme.palette.text.primary
  };

  useEffect(() => {
    if (isCameraActive) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [facingMode, isCameraActive]);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const startCamera = async () => {
    try {
      stopCamera();
      
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
      setError("");
    } catch (err) {
      setError("Failed to access camera. Please ensure camera permissions are granted.");
      console.error("Camera access error:", err);
    }
  };

  const switchCamera = () => {
    setFacingMode(prevMode => prevMode === "user" ? "environment" : "user");
  };

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    try {
      setLoading(true);
      setError("");

      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);

      const base64Image = canvas.toDataURL('image/jpeg').split(',')[1];
      setImagePreview(canvas.toDataURL('image/jpeg'));

      const detectedLabels = await analyzeImage(base64Image);
      setLabels(detectedLabels);
    } catch (err) {
      setError("Failed to analyze the image");
      console.error("Capture error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        gap: 2, 
        mt: 4,
        backgroundColor: themeColors.background,
        minHeight: '100vh'
      }}
    >
      <Paper 
        elevation={6} 
        sx={{ 
          padding: 4, 
          borderRadius: 3, 
          textAlign: 'center', 
          maxWidth: '800px', 
          width: '100%',
          backgroundColor: themeColors.paper,
          color: themeColors.text
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 600, color: themeColors.primary, mb: 2 }}>
          Edugainer Face Recognition System
        </Typography>

        <Card 
          elevation={3} 
          sx={{ 
            backgroundColor: themeColors.paper,
            mb: 3,
            position: 'relative'
          }}
        >
          <CardContent>
            <Box sx={{ position: 'relative', width: '100%', mb: 2 }}>
              {isCameraActive && (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{
                    width: '100%',
                    maxHeight: '400px',
                    borderRadius: '8px',
                    display: imagePreview ? 'none' : 'block'
                  }}
                />
              )}
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              
              {imagePreview && (
                <Fade in={true}>
                  <Box sx={{ mt: 2 }}>
                    <img 
                      src={imagePreview} 
                      alt="Captured" 
                      style={{ 
                        maxWidth: "100%", 
                        height: "auto", 
                        borderRadius: "8px",
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                      }} 
                    />
                  </Box>
                </Fade>
              )}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
              {!imagePreview ? (
                <>
                  <Tooltip title="Capture your face">
                    <Button
                      variant="contained"
                      startIcon={<Camera />}
                      onClick={captureImage}
                      disabled={loading}
                      sx={{ 
                        backgroundColor: themeColors.primary,
                        '&:hover': {
                          backgroundColor: themeColors.secondary
                        }
                      }}
                    >
                      Capture
                    </Button>
                  </Tooltip>
                  <Tooltip title="Switch camera">
                    <IconButton 
                      onClick={switchCamera}
                      sx={{ color: themeColors.primary }}
                      disabled={loading}
                    >
                      <FlipCameraIos />
                    </IconButton>
                  </Tooltip>
                </>
              ) : (
                <Button
                  variant="contained"
                  onClick={() => {
                    setImagePreview("");
                    setLabels([]);
                  }}
                  sx={{ 
                    backgroundColor: themeColors.secondary,
                    '&:hover': {
                      backgroundColor: themeColors.primary
                    }
                  }}
                >
                  Take New Photo
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>

        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        
        {error && (
          <Alert 
            severity="error" 
            sx={{ mt: 2 }}
            icon={<Warning sx={{ color: themeColors.secondary }} />}
          >
            {error}
          </Alert>
        )}

        {!loading && labels.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h5" sx={{ color: themeColors.primary, mb: 2 }}>
              Recognition Results
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
              {labels.map((label, index) => (
                <Chip
                  key={index}
                  label={label}
                  icon={<CheckCircle />}
                  sx={{ 
                    backgroundColor: themeColors.primary,
                    color: 'white',
                    '& .MuiChip-icon': {
                      color: 'white'
                    }
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default EduGainerFaceRecognition;