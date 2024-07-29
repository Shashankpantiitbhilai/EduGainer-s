import React, { useState, useEffect ,useContext} from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Grid,
} from "@mui/material";
import { AdminContext } from "../../App";
function EdugainerClasses() {
  const [comingSoonText, setComingSoonText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { IsUserLoggedIn } = useContext(AdminContext);
  console.log(IsUserLoggedIn,"ppppppppp")
  useEffect(() => {
    const text = "Coming Soon";
    let index = 0;
    const interval = setInterval(() => {
      if (index <= text.length) {
        setComingSoonText(text.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
        setIsLoading(false);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <Container maxWidth="lg" style={{ marginTop: "2rem" }}>
      <Box textAlign="center" marginBottom="2rem">
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to EduGainer Classes
        </Typography>
        <Typography variant="h6" component="p" color="textSecondary">
          Empowering Education Through Innovation
        </Typography>
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              minHeight: 200,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CardContent>
              <Typography variant="h5" component="h3" gutterBottom>
                Online Classes
              </Typography>
              {isLoading ? (
                <CircularProgress />
              ) : (
                <>
                  <Typography variant="h4" color="primary" gutterBottom>
                    {comingSoonText}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Stay tuned for our upcoming offerings!!
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ minHeight: 200 }}>
            <CardContent>
              <Typography variant="h5" component="h3" gutterBottom>
                Offline Classes Available
              </Typography>
              <Typography variant="body1" paragraph>
                We currently support offline Procedure . Visit us at our center!
              </Typography>
              <Typography variant="body1" paragraph>
                Address: Uttarkashi near Court Road
              </Typography>
              <Typography variant="body1" paragraph>
                Contact us:
              </Typography>
              <Typography variant="body1">
                Phone: 9997999768 / 8126857111 /9997999765
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default EdugainerClasses;
