import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Alert,
  Stack,
} from '@mui/material';
import { PersonAdd, Group } from '@mui/icons-material';
import { addUser, deleteUserById,fetchAllTeamAccounts } from '../../../services/Admin_services/Teams/ManageTeams';

import { AdminContext } from '../../../App';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AddMemberDialog from './addMember';
import TeamTable from './TeamTable';

 const TeamManagement = () => {
  // ... Keep all the state and handler functions from the original component ...
   const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'user',
    password: '',
    isTeamAccount: true,
    permissions: [],
    phoneNumber: '',
    department: '',
    startDate: null,
    endDate: null,
    image: null,
    address: '',
    bio: '',
    strategy: 'local',
    status: 'active',
    faceAuthEnabled: true,
  });

  const availablePermissions = [
    { value: 'library', label: 'Library Access' },
    { value: 'classes', label: 'Classes Access' },
    { value: 'stationery', label: 'Stationery Access' },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const { IsUserLoggedIn } = useContext(AdminContext);
  const adminId = IsUserLoggedIn?._id;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetchAllTeamAccounts();
      const teamUsers = response.data || [];
      setUsers(teamUsers);
    } catch (error) {
      setError('Failed to fetch team members');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      role: 'user',
      password: '',
      isTeamAccount: true,
      permissions: [],
      phoneNumber: '',
      department: '',
      startDate: null,
      endDate: null,
      image: null,
      address: '',
      bio: '',
      strategy: 'local',
      status: 'active',
      faceAuthEnabled: false,
    });
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleDateChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      image: file,
    }));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'permissions') {
        formData.permissions.forEach((permission) => formDataToSend.append('permissions', permission));
      } else if (key === 'image' && formData[key]) {
        formDataToSend.append('photoUpload', formData[key]);
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      await addUser(formData, adminId);
      setSuccess('Team member added successfully!');
      handleClose();
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add team member');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      try {
        await deleteUserById(userId);
        setSuccess('Team member deleted successfully!');
        fetchUsers();
      } catch (err) {
        setError('Failed to delete team member');
      }
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 3 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
            <Box>
              <Typography variant="h5" component="h2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Group color="primary" />
                Team Management
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Manage your team members and their roles
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              onClick={handleOpen}
              color="primary"
              sx={{ px: 3, py: 1 }}
            >
              Add New Team Member
            </Button>
          </Stack>

          {(error || success) && (
            <Alert
              severity={error ? "error" : "success"}
              sx={{ mb: 2 }}
              onClose={() => {
                setError('');
                setSuccess('');
              }}
            >
              {error || success}
            </Alert>
          )}

          <TeamTable 
            users={users}
            loading={loading}
            page={page}
            rowsPerPage={rowsPerPage}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            handleDeleteUser={handleDeleteUser}
            getStatusColor={getStatusColor}
          />

          <AddMemberDialog 
            open={open}
            handleClose={handleClose}
            formData={formData}
            handleInputChange={handleInputChange}
            handleDateChange={handleDateChange}
            handleImageChange={handleImageChange}
            handleAddUser={handleAddUser}
            loading={loading}
            availablePermissions={availablePermissions}
          />
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default TeamManagement;
                      