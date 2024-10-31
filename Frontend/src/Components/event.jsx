import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Box, 
  Container, 
  Grid, 
  Card, 
  Typography, 
  Button, 
  Stepper, 
  Step, 
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Chip,
  styled,
  useTheme,
} from "@mui/material";
import { 
  Close as CloseIcon, 
  Login, 
  Celebration,
  EventAvailable,
  CalendarToday,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { AdminContext } from "../App";
import { getAllEvents } from "../services/Admin_services/admin_event";

// Styled components for the event cards
const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: theme.shape.borderRadius * 3,
  boxShadow: theme.shadows[3],
  overflow: "hidden",
  transition: theme.transitions.create(['transform', 'box-shadow'], {
    duration: theme.transitions.duration.standard,
  }),
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: theme.shadows[6],
  },
}));

const ImageOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: 0,
  left: 0,
  width: "100%",
  background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
  color: theme.palette.common.white,
  padding: theme.spacing(2),
}));

const EventTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.common.white,
  fontWeight: "bold",
  textShadow: "1px 1px 2px black",
}));

const PageTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: "bold",
  marginBottom: theme.spacing(6),
  textAlign: "center",
  fontSize: {
    xs: "2.5rem",
    md: "3.5rem",
  },
}));

const EventCard = ({ event, onDetailsClick }) => {
  const theme = useTheme();
  
  return (
    <StyledCard>
      <Box sx={{ height: 200, overflow: "hidden", position: "relative" }}>
        <Box
          component="img"
          src={event?.image?.url || "/placeholder-image.jpg"}
          alt={event?.title}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <ImageOverlay>
          <EventTitle variant="h6">{event?.title}</EventTitle>
        </ImageOverlay>
      </Box>
      <Box sx={{ p: 2, flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Typography variant="body2" sx={{ flexGrow: 1, mb: 2 }}>
          {event?.description?.length > 100 
            ? `${event?.description.substring(0, 100)}...` 
            : event?.description}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Chip 
            icon={<CalendarToday />} 
            label={`Ends: ${formatDate(event.endDate)}`} 
            color="primary" 
            variant="outlined"
          />
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => onDetailsClick(event)}
            startIcon={<EventAvailable />}
          >
            View Details
          </Button>
        </Box>
      </Box>
    </StyledCard>
  );
};

// Main component with the 'Show All Events' button and Events section
function EventsPage({ showDialog = false }) {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { IsUserLoggedIn } = useContext(AdminContext);
  const theme = useTheme();
  const eventsSectionRef = useRef(null); // Ref to scroll to events section
    const navigate = useNavigate();
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsData = await getAllEvents();
        const currentDate = new Date().toISOString().split("T")[0];

        const currentEvents = eventsData.filter(event => {
          if (!event.endDate || typeof event.endDate !== "string") {
            console.warn("Event with invalid or missing endDate:", event);
            return false;
          }
          return event.endDate.split("T")[0] >= currentDate;
        });

        setEvents(currentEvents);

        if (showDialog && currentEvents.length > 0) {
          setSelectedEvent(currentEvents[0]);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        toast.error("Failed to load events");
      }
    };
    fetchEvents();
  }, [showDialog]);

  const handleViewClick = (url) => {
    if (IsUserLoggedIn) {
      window.open(url, "_blank");
    } else {
      navigate("/login")
    }
  };

    const scrollToEventsSection = () => {
     setSelectedEvent(null)
    eventsSectionRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <PageTitle variant="h2">
           Current Events
        </PageTitle>
        
      

        <Box ref={eventsSectionRef}> {/* Events section */}
          {events.length === 0 ? (
            <Typography variant="h6" sx={{ textAlign: "center", mb: 4 }}>
              No upcoming events at the moment
            </Typography>
          ) : (
            <Grid container spacing={4}>
              {events.map((event) => (
                <Grid item xs={12} sm={6} md={4} key={event._id}>
                  <EventCard 
                    event={event} 
                    onDetailsClick={setSelectedEvent} 
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        <Dialog
          open={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle 
            sx={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              bgcolor: 'background.paper',
            }}
          >
            <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: "bold" }}>
              {selectedEvent?.title}
            </Typography>
            <IconButton onClick={() => setSelectedEvent(null)}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ bgcolor: 'background.paper' }}>
            {selectedEvent && (
              <Box>
                <Box
                  component="img"
                  src={selectedEvent.image?.url || "/placeholder-image.jpg"}
                  alt={selectedEvent.title}
                  sx={{
                    width: "100%",
                    maxHeight: 400,
                    objectFit: "cover",
                    borderRadius: theme.shape.borderRadius,
                    mb: 2,
                  }}
                />
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedEvent.description}
                </Typography>
                <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                  <Chip 
                    icon={<CalendarToday />} 
                    label={`Start: ${formatDate(selectedEvent.startDate)}`} 
                    color="primary" 
                  />
                  <Chip 
                    icon={<CalendarToday />} 
                    label={`End: ${formatDate(selectedEvent.endDate)}`} 
                    color="secondary" 
                  />
                </Box>
                <Stepper activeStep={0} alternativeLabel>
                  {[{ label: "Login", icon: <Login /> }, { label: "Fill Form", icon: <Celebration /> }]
                    .map((step) => (
                      <Step key={step.label}>
                        <StepLabel>{step.label}</StepLabel>
                      </Step>
                    ))}
                </Stepper>
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3, gap: 2 }}>
                  {selectedEvent?.googleFormLink && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleViewClick(selectedEvent?.googleFormLink)}
                      endIcon={<Celebration />}
                    >
                      Fill The Form
                    </Button>
                  )}
                </Box>
                          </Box>
                          
                      )}
                        <Button 
          variant="contained" 
          color="secondary" 
          onClick={scrollToEventsSection}
          sx={{ mb: 4 }}
        >
          Show All Events
        </Button>
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
}
// Helper function for date formatting
const formatDate = (dateString) => {
  if (!dateString || typeof dateString !== "string") {
    return "Date not available";
  }
  const [year, month, day] = dateString.split("T")[0].split("-");
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  return `${months[parseInt(month, 10) - 1]} ${parseInt(day, 10)}, ${year}`;
};

export default EventsPage;
