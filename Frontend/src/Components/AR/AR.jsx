import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Container, CircularProgress } from '@mui/material';

const ARExperience = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Function to dynamically load the AR.js and A-Frame scripts
    const loadScripts = () => {
      return new Promise((resolve, reject) => {
        // Load AFRAME script
        const aframeScript = document.createElement('script');
        aframeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/aframe/1.2.0/aframe.min.js';
        aframeScript.onload = () => resolve('aframe loaded');
        aframeScript.onerror = (e) => reject(new Error(`Failed to load A-Frame: ${e.message}`));
        document.head.appendChild(aframeScript);
      })
      .then(() => {
        return new Promise((resolve, reject) => {
          // Load AR.js script
          const arScript = document.createElement('script');
          arScript.src = 'https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js';
          arScript.onload = () => resolve('AR.js loaded');
          arScript.onerror = (e) => reject(new Error(`Failed to load AR.js: ${e.message}`));
          document.head.appendChild(arScript);
        });
      })
      .catch((error) => {
        console.error(error);
      });
    };

    // Initialize AR after scripts are loaded
    const initializeAR = () => {
      const arScene = document.createElement('a-scene');
      arScene.setAttribute('arjs', 'sourceType: webcam; debugUIEnabled: false;');
      arScene.setAttribute('renderer', 'logarithmicDepthBuffer: true');
      arScene.setAttribute('vr-mode-ui', 'enabled: false');
      arScene.style.position = 'absolute';
      arScene.style.top = '0';
      arScene.style.left = '0';
      arScene.style.zIndex = '1000';

      const marker = document.createElement('a-marker');
      marker.setAttribute('preset', 'hiro');
      
      const text = document.createElement('a-text');
      text.setAttribute('value', 'EduGainer AR');
      text.setAttribute('position', '0 0.5 0');
      text.setAttribute('rotation', '-90 0 0');
      text.setAttribute('color', '#000');
      text.setAttribute('align', 'center');
      text.setAttribute('scale', '2 2 2');

      const platform = document.createElement('a-cylinder');
      platform.setAttribute('position', '0 0 0');
      platform.setAttribute('radius', '1');
      platform.setAttribute('height', '0.1');
      platform.setAttribute('color', '#00ff00');

      marker.appendChild(text);
      marker.appendChild(platform);
      arScene.appendChild(marker);

      const camera = document.createElement('a-entity');
      camera.setAttribute('camera', '');
      arScene.appendChild(camera);

      document.getElementById('ar-container').appendChild(arScene);
      setLoading(false); // Set loading state to false once AR is ready
    };

    // Load scripts and initialize AR once they are ready
    loadScripts().then(() => {
      initializeAR();
    });

    // Cleanup AR scene when the component is unmounted
    return () => {
      const arScene = document.querySelector('a-scene');
      if (arScene) {
        arScene.parentNode.removeChild(arScene);
      }
    };
  }, []); // Empty dependency array ensures this runs only once when component mounts

  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: 2, 
        my: 4 
      }}>
        <Typography variant="h4" component="h1" gutterBottom>
          EduGainer AR Experience
        </Typography>

        <Box 
          id="ar-container" 
          sx={{
            width: '100%', 
            height: '600px', 
            position: 'relative',
            backgroundColor: '#f5f5f5',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {loading ? (
            <CircularProgress />
          ) : (
            <Typography variant="body1" sx={{ position: 'absolute', bottom: 20 }}>
              Point your camera at a Hiro marker
            </Typography>
          )}
        </Box>

        <Button 
          variant="contained" 
          color="primary"
          onClick={() => window.location.reload()}
        >
          Restart AR Experience
        </Button>
      </Box>
    </Container>
  );
};

export default ARExperience;
