import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Box,
  Chip,
  CircularProgress,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';

 const AddMemberDialog = ({
  open,
  handleClose,
  formData,
  handleInputChange,
  handleDateChange,
  handleImageChange,
  handleAddUser,
  loading,
  availablePermissions,
}) => {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Add New Team Member</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Basic Information
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          
          {/* Contact Information */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Contact Information
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              required
              type="email"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>

          {/* Role & Department */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Role & Department
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="employee">Employee</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Department"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>

          {/* Authentication */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Authentication
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              fullWidth
              required
              type="password"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Authentication Strategy</InputLabel>
              <Select
                label="Authentication Strategy"
                name="strategy"
                value={formData.strategy}
                onChange={handleInputChange}
              >
                <MenuItem value="local">Local</MenuItem>
                <MenuItem value="google">Google</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Permissions */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Permissions
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Permissions</InputLabel>
              <Select
                multiple
                value={formData.permissions}
                onChange={(e) => handleInputChange({
                  target: {
                    name: 'permissions',
                    value: e.target.value
                  }
                })}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {availablePermissions.map((permission) => (
                  <MenuItem key={permission.value} value={permission.value}>
                    <Checkbox checked={formData.permissions.includes(permission.value)} />
                    {permission.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Employment Period */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Employment Period
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <DatePicker
              label="Start Date"
              value={formData.startDate}
              onChange={(newValue) => handleDateChange("startDate", newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DatePicker
              label="End Date"
              value={formData.endDate}
              onChange={(newValue) => handleDateChange("endDate", newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                },
              }}
            />
          </Grid>

          {/* Profile Image */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Profile Image
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <input
                accept="image/*"
                type="file"
                onChange={handleImageChange}
                style={{ display: 'none' }}
                id="profile-image-upload"
              />
              <label htmlFor="profile-image-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<Add />}
                >
                  Upload Profile Image
                </Button>
              </label>
              {formData.image && (
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  Selected file: {formData.image.name}
                </Typography>
              )}
            </Box>
          </Grid>

          {/* Team Account Checkbox */}
          <Grid item xs={12}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.isTeamAccount}
                    onChange={(e) => handleInputChange({
                      target: {
                        name: 'isTeamAccount',
                        checked: e.target.checked,
                        type: 'checkbox'
                      }
                    })}
                  />
                }
                label="Is Team Account?"
              />
            </FormGroup>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleAddUser}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} />
          ) : (
            'Add Member'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default AddMemberDialog