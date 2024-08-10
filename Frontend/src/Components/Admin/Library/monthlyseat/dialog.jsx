import React, { useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import { useForm } from "react-hook-form";

const shifts = [
  "6:30 AM to 2 PM",
  "2 PM to 9:30 PM",
  "6:30 PM to 11 PM",
  "9:30 PM to 6:30 AM",
  "2 PM to 11 PM",
  "6:30 AM to 6:30 PM",
  "24*7",
];

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
    setValue,
  } = useForm();

  useEffect(() => {
    if (open) {
      Object.keys(defaultValues).forEach((key) => {
        setValue(key, defaultValues[key]);
      });
    }
  }, [open, defaultValues, setValue]);

  const onSubmit = (data) => {
    handleSubmitForm(data);
    reset();
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          {defaultValues
            ? `Edit Booking ${defaultValues.name}`
            : "Add New Booking"}
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
                {...register("website")}
                label="Website"
                fullWidth
                error={!!errors.website}
                helperText={errors.website?.message}
                defaultValue={defaultValues?.website || ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register("regFee")}
                label="RegFee"
                fullWidth
                error={!!errors.regFee}
                helperText={errors.regFee?.message}
                defaultValue={defaultValues?.regFee || ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register("seat")}
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
                {...register("cash", {
                  required: "Cash is required",
                  valueAsNumber: true,
                })}
                label="Cash"
                type="number"
                fullWidth
                error={!!errors.cash}
                helperText={errors.cash?.message}
                defaultValue={defaultValues?.cash || 0}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register("online", {
                  required: "Online is required",
                  valueAsNumber: true,
                })}
                label="Online"
                type="number"
                fullWidth
                error={!!errors.online}
                helperText={errors.online?.message}
                defaultValue={defaultValues?.online || 0}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.shift}>
                <InputLabel id="shift-label">Shift</InputLabel>
                <Select
                  labelId="shift-label"
                  {...register("shift", { required: "Shift is required" })}
                  defaultValue={defaultValues?.shift || ""}
                >
                  {shifts.map((shift, index) => (
                    <MenuItem key={index} value={shift}>
                      {shift}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.shift?.message}</FormHelperText>
              </FormControl>
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
                select
                error={!!errors.status}
                helperText={errors.status?.message}
                defaultValue={defaultValues?.status || ""}
              >
                <MenuItem value="Paid">Paid</MenuItem>
                <MenuItem value="Confirmed">Confirmed</MenuItem>
                <MenuItem value="discontinue">Discontinue</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register("nextMonthStatus")}
                label="nextMonthStatus"
                fullWidth
                select
                error={!!errors.nextMonthStatus}
                helperText={errors.nextMonthStatus?.message}
                defaultValue={defaultValues?.nextMonthStatus || ""}
              >
                <MenuItem value="Confirmed">Confirmed</MenuItem>
                <MenuItem value="discontinue">Discontinue</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register("due", {
                  required: "Due is required",
                  valueAsNumber: true,
                })}
                label="Due"
                type="number"
                fullWidth
                error={!!errors.due}
                helperText={errors.due?.message}
                defaultValue={defaultValues?.due || 0}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register("advance", {
                  required: "Advance is required",
                  valueAsNumber: true,
                })}
                label="Advance"
                type="number"
                fullWidth
                error={!!errors.advance}
                helperText={errors.advance?.message}
                defaultValue={defaultValues?.advance || 0}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register("receipt")}
                label="Receipt"
                fullWidth
                defaultValue={defaultValues?.receipt || ""}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register("TotalMoney", { valueAsNumber: true })}
                label="Total Money"
                type="number"
                fullWidth
                error={!!errors.TotalMoney}
                helperText={errors.TotalMoney?.message}
                defaultValue={defaultValues?.TotalMoney || 0}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                {...register("Payment_detail.razorpay_order_id")}
                label="Razorpay Order ID"
                fullWidth
                defaultValue={
                  defaultValues?.Payment_detail?.razorpay_order_id || ""
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register("Payment_detail.razorpay_payment_id")}
                label="Razorpay Payment ID"
                fullWidth
                defaultValue={
                  defaultValues?.Payment_detail?.razorpay_payment_id || ""
                }
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
