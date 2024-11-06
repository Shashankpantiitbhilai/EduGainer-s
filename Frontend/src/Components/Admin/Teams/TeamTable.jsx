import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Avatar,
  Stack,
  Chip,
  Tooltip,
  Box,
  CircularProgress,
  TablePagination,
} from '@mui/material';
import { Delete, AccountCircle } from '@mui/icons-material';

 const TeamTable = ({
  users,
  loading,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  handleDeleteUser,
  getStatusColor,s
}) => {
  return (
    <TableContainer component={Paper} elevation={0}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Profile</TableCell>
                <TableCell>Basic Info</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Role & Status</TableCell>
                <TableCell>Authentication</TableCell>
                <TableCell>Dates</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <Avatar
                        src={user.photoUpload || user.faceData?.url}
                        alt={`${user.firstName} ${user.lastName}`}
                        sx={{ width: 50, height: 50 }}
                      >
                        <AccountCircle />
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">
                        {`${user.firstName} ${user.lastName}`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user.bio || 'No bio available'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{user.email}</Typography>
                      <Typography variant="body2">{user.phoneNumber}</Typography>
                      <Typography variant="body2">{user.address}</Typography>
                    </TableCell>
                    <TableCell>
                      <Stack spacing={1}>
                        <Chip
                          label={user.role}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                        <Chip
                          label={user.status}
                          size="small"
                          color={getStatusColor(user.status)}
                          variant="outlined"
                        />
                        <Typography variant="caption">
                          Department: {user.department}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack spacing={1}>
                        <Chip
                          label={`Strategy: ${user.strategy}`}
                          size="small"
                          color="info"
                          variant="outlined"
                        />
                        <Chip
                          label={`Face Auth: ${user.faceAuthEnabled ? 'Enabled' : 'Disabled'}`}
                          size="small"
                          color={user.faceAuthEnabled ? 'success' : 'default'}
                          variant="outlined"
                        />
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" display="block">
                        Start: {user.startDate ? new Date(user.startDate).toLocaleDateString() : '-'}
                      </Typography>
                      <Typography variant="caption" display="block">
                        End: {user.endDate ? new Date(user.endDate).toLocaleDateString() : '-'}
                      </Typography>
                      <Typography variant="caption" display="block">
                        Created: {new Date(user.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Delete User">
                        <IconButton onClick={() => handleDeleteUser(user._id)}>
                          <Delete color="error" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={users.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </TableContainer>
  );
};
export default TeamTable