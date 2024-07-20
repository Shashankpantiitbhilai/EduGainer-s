import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Avatar,
  Chip,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(15),
  height: theme.spacing(15),
  margin: "auto",
  cursor: "pointer",
  border: `4px solid ${theme.palette.primary.main}`,
  "&:hover": {
    boxShadow: `0 0 0 4px ${theme.palette.primary.light}`,
  },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

const DetailedPersonDialog = ({ open, onClose, selectedPerson }) => {
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

  const renderValue = (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (key === "image" && value.url) {
        return (
          <StyledAvatar
            src={value.url}
            alt={selectedPerson?.name || "Student"}
            onClick={() => setImageDialogOpen(true)}
          />
        );
      }
      if (key === "Payment_detail") {
        return (
          <Box>
            {Object.entries(value).map(([subKey, subValue]) => (
              <StyledChip
                key={subKey}
                label={`${subKey}: ${subValue}`}
                variant="outlined"
              />
            ))}
          </Box>
        );
      }
      return JSON.stringify(value);
    }
    if (key === "consent") {
      return (
        <Chip label={value} color={value === "Agreed" ? "success" : "error"} />
      );
    }
    return value;
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h5" color="primary">
            {selectedPerson?.name}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <StyledPaper elevation={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} display="flex" justifyContent="center">
                {selectedPerson?.image &&
                  renderValue("image", selectedPerson.image)}
              </Grid>
              {selectedPerson &&
                Object.entries(selectedPerson).map(([key, value]) => {
                  if (
                    key !== "name" &&
                    key !== "_id" &&
                    key !== "__v" &&
                    key !== "image"
                  ) {
                    return (
                      <Grid item xs={12} sm={6} key={key}>
                        <Typography variant="subtitle1" color="textSecondary">
                          {key.charAt(0).toUpperCase() + key.slice(1)}:
                        </Typography>
                        <Typography variant="body1">
                          {renderValue(key, value)}
                        </Typography>
                      </Grid>
                    );
                  }
                  return null;
                })}
            </Grid>
          </StyledPaper>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        maxWidth="md"
      >
        <DialogContent>
          <img
            src={selectedPerson?.image?.url}
            alt={selectedPerson?.name || "Student"}
            style={{ width: "100%", height: "auto" }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setImageDialogOpen(false)}
            color="primary"
            variant="contained"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DetailedPersonDialog;
