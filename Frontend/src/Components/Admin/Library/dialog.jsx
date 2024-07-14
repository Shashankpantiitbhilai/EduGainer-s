import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Grid,
} from "@mui/material";
import { useForm } from "react-hook-form";

const BookingDialog = ({
  open,
  handleClose,
  handleSubmitForm,
  defaultValues,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: defaultValues || {},
  });

  // Handle form submission
  const onSubmit = (data) => {
    handleSubmitForm(data);
    reset(); // Reset form after submission
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          {defaultValues ? "Edit Booking" : "Add New Booking"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register("reg", { required: "Registration is required" })}
                label="Registration"
                fullWidth
                error={!!errors.reg}
                helperText={errors.reg?.message}
                defaultValue={defaultValues?.reg || ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register("name", { required: "Name is required" })}
                label="Name"
                fullWidth
                error={!!errors.name}
                helperText={errors.name?.message}
                defaultValue={defaultValues?.name || ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register("seat", { required: "Seat is required" })}
                label="Seat"
                fullWidth
                error={!!errors.seat}
                helperText={errors.seat?.message}
                defaultValue={defaultValues?.seat || ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register("date", { required: "Date is required" })}
                label="Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={!!errors.date}
                helperText={errors.date?.message}
                defaultValue={defaultValues?.date || ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register("cash", { required: "Cash is required" })}
                label="Cash"
                type="number"
                fullWidth
                error={!!errors.cash}
                helperText={errors.cash?.message}
                defaultValue={defaultValues?.cash || ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register("online", { required: "Online is required" })}
                label="Online"
                type="number"
                fullWidth
                error={!!errors.online}
                helperText={errors.online?.message}
                defaultValue={defaultValues?.online || ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register("shift", { required: "Shift is required" })}
                label="Shift"
                fullWidth
                error={!!errors.shift}
                helperText={errors.shift?.message}
                defaultValue={defaultValues?.shift || ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register("fee", { required: "Fee is required" })}
                label="Fee"
                type="number"
                fullWidth
                error={!!errors.fee}
                helperText={errors.fee?.message}
                defaultValue={defaultValues?.fee || ""}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register("remarks")}
                label="Remarks"
                fullWidth
                multiline
                rows={2}
                defaultValue={defaultValues?.remarks || ""}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register("status", { required: "Status is required" })}
                label="Status"
                fullWidth
                error={!!errors.status}
                helperText={errors.status?.message}
                defaultValue={defaultValues?.status || ""}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {defaultValues ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default BookingDialog;
