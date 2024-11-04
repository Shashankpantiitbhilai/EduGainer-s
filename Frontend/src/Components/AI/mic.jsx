import React, { useState, useRef } from 'react';
import {
  Box,
  IconButton,
  Drawer,
  Typography,
  CircularProgress,
  Paper,
  Fade,
  styled,
  Tooltip
} from '@mui/material';
import {
  Mic as MicIcon,
  Close as CloseIcon,
  Stop as StopIcon
} from '@mui/icons-material';
import { processAudioInput } from "../../services/ai/chatbot";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
  width: 300,
  margin: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
}));

const AnimatedMicButton = styled(IconButton)(({ theme }) => ({
  width: 80,
  height: 80,
  backgroundColor: '#1a237e',
  color: 'white',
  '&:hover': {
    backgroundColor: '#000051',
  },
  '&.recording': {
    animation: 'pulse 1.5s infinite',
  },
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(1)',
      boxShadow: '0 0 0 0 rgba(26, 35, 126, 0.7)',
    },
    '70%': {
      transform: 'scale(1.1)',
      boxShadow: '0 0 0 10px rgba(26, 35, 126, 0)',
    },
    '100%': {
      transform: 'scale(1)',
      boxShadow: '0 0 0 0 rgba(26, 35, 126, 0)',
    },
  },
}));

const WaveVisualizer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  height: 40,
  '& .wave-bar': {
    width: 3,
    backgroundColor: '#1a237e',
    borderRadius: 1.5,
    animation: 'wave 1s infinite',
  },
  '@keyframes wave': {
    '0%': { height: 3 },
    '50%': { height: 30 },
    '100%': { height: 3 },
  },
}));

const AudioInput = ({ onInputReceived }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMimeType, setSelectedMimeType] = useState(null);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  // Function to get supported MIME types
  const getSupportedMimeTypes = () => {
    const possibleTypes = [
      'audio/webm',
      'audio/webm;codecs=opus',
      'audio/ogg',
      'audio/ogg;codecs=opus',
      'audio/mp4',
      'audio/mp4;codecs=opus',
      'audio/wav',
      'audio/aac'
    ];
    
    return possibleTypes.filter(type => MediaRecorder.isTypeSupported(type));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 44100,
          sampleSize: 16,
          volume: 1.0
        } 
      });

      // Get supported MIME types and select the first available one
      const supportedTypes = getSupportedMimeTypes();
      if (supportedTypes.length === 0) {
        throw new Error('No supported audio MIME types found');
      }
      
      const mimeType = supportedTypes[0];
      setSelectedMimeType(mimeType);

      mediaRecorder.current = new MediaRecorder(stream, {
        mimeType: mimeType,
        audioBitsPerSecond: 128000
      });
      
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = async () => {
        if (audioChunks.current.length > 0) {
            const audioBlob = new Blob(audioChunks.current, { type: selectedMimeType });
            console.log(audioBlob,"blob")
          await handleAudioSubmit(audioBlob);
        } else {
          setError("No audio data was recorded. Please try again.");
        }
      };

      // Request data every 1 second instead of waiting until stop
      mediaRecorder.current.start(1000);
      setIsRecording(true);
      setError(null);
    } catch (err) {
      setError(err.message || "Microphone access denied or not available");
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const handleAudioSubmit = async (audioBlob) => {
    setIsProcessing(true);
    try {
      // Create a FormData object to send the audio file
        const formData = new FormData();
        
      formData.append('audio', audioBlob, `recording.${selectedMimeType.split('/')[1]}`);
     
      const { text } = await processAudioInput(audioBlob);
      onInputReceived(text);
      setIsOpen(false);
    } catch (err) {
      setError("Failed to process audio. Please try again.");
      console.error("Error processing audio:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (isRecording) {
      stopRecording();
    }
    setIsOpen(false);
    setError(null);
    setIsProcessing(false);
  };

  const WaveAnimation = () => (
    <WaveVisualizer>
      {[...Array(8)].map((_, i) => (
        <Box
          key={i}
          className="wave-bar"
          sx={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </WaveVisualizer>
  );

  return (
    <>
      <Tooltip title="Voice Input" placement="top">
        <IconButton
          onClick={() => setIsOpen(true)}
          sx={{
            color: '#1a237e',
            '&:hover': {
              bgcolor: 'rgba(26, 35, 126, 0.04)',
            },
          }}
        >
          <MicIcon />
        </IconButton>
      </Tooltip>

      <Drawer
        anchor="bottom"
        open={isOpen}
        onClose={handleClose}
        PaperProps={{
          sx: {
            alignItems: 'center',
            bgcolor: 'transparent',
            boxShadow: 'none',
          }
        }}
      >
        <Fade in={isOpen}>
          <StyledPaper elevation={3}>
            <IconButton
              onClick={handleClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: 'text.secondary',
              }}
            >
              <CloseIcon />
            </IconButton>

            <Typography variant="h6" sx={{ mb: 1 }}>
              {isProcessing ? "Processing..." : isRecording ? "Listening..." : "Start Speaking"}
            </Typography>

            {error && (
              <Typography color="error" variant="body2" sx={{ mb: 1 }}>
                {error}
              </Typography>
            )}

            {selectedMimeType && (
              <Typography variant="caption" color="text.secondary">
                Recording format: {selectedMimeType}
              </Typography>
            )}

            {isProcessing ? (
              <CircularProgress size={60} sx={{ color: '#1a237e' }} />
            ) : (
              <AnimatedMicButton
                className={isRecording ? 'recording' : ''}
                onClick={isRecording ? stopRecording : startRecording}
              >
                {isRecording ? <StopIcon /> : <MicIcon />}
              </AnimatedMicButton>
            )}

            {isRecording && <WaveAnimation />}

            <Typography variant="body2" color="text.secondary">
              {isRecording
                ? "Click stop when you're done"
                : "Click the microphone to start"}
            </Typography>
          </StyledPaper>
        </Fade>
      </Drawer>
    </>
  );
};

export default AudioInput;