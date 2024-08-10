import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  List,
  MenuItem,
  Select,
  ListItem,
  ListItemText,
  ListItemIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  InputAdornment,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import {
  Backup,
  People,
  Timeline,
  Traffic,
  PeopleOutline,
  AttachMoney,
  History,
  NotificationsActive,
  Description,
  ShowChart,
  CardMembership,
  Security,
  Feedback,
  FindInPage,
  Api,
  Campaign,
  Edit,
  Save,
  Search,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  fetchAllSiteUsers,
 
} from "../../services/Admin_services/adminUtils";
import { editUserById } from "../../services/adminDashboard/utils";
// Sample data for charts (unchanged)
const trafficData = [
  { name: "Jan", value: 4000 },
  { name: "Feb", value: 3000 },
  { name: "Mar", value: 5000 },
  { name: "Apr", value: 4500 },
  { name: "May", value: 6000 },
  { name: "Jun", value: 5500 },
];

const viewerData = [
  { name: "Mon", desktop: 4000, mobile: 2400 },
  { name: "Tue", desktop: 3000, mobile: 1398 },
  { name: "Wed", desktop: 2000, mobile: 9800 },
  { name: "Thu", desktop: 2780, mobile: 3908 },
  { name: "Fri", desktop: 1890, mobile: 4800 },
  { name: "Sat", desktop: 2390, mobile: 3800 },
  { name: "Sun", desktop: 3490, mobile: 4300 },
];

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const AdminDashboard = () => {
  const [selectedOption, setSelectedOption] = useState("traffic");
  const [userData, setUserData] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    status: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await fetchAllSiteUsers();
      setUserData(users);
    };
    fetchUsers();
  }, []);

  const handleBackup = () => {
    alert("Backup process started!");
  };

  const handleEditClick = (user) => {
    setEditMode(user._id);
    setFormValues({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      status: user.status || "active",
    });
  };

  const handleSaveClick = async (user) => {
    await editUserById(user._id, formValues);
    const updatedUsers = userData.map((u) =>
      u._id === user._id ? { ...u, ...formValues } : u
    );
    setUserData(updatedUsers);
    setEditMode(null);
  };

  const handleInputChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleStatusChange = (e) => {
    setFormValues({ ...formValues, status: e.target.value });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = userData.filter((user) =>
    Object.values(user).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const renderUserManagementTable = () => (
    <Box>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search users..."
        value={searchTerm}
        onChange={handleSearch}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>First Name</TableCell>
            <TableCell>Last Name</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user._id}>
              <TableCell>{user._id}</TableCell>
              <TableCell>{user?.username}</TableCell>
              <TableCell>
                {editMode === user._id ? (
                  <TextField
                    name="firstName"
                    value={formValues.firstName}
                    onChange={handleInputChange}
                    variant="standard"
                  />
                ) : (
                  user.firstName
                )}
              </TableCell>
              <TableCell>
                {editMode === user._id ? (
                  <TextField
                    name="lastName"
                    value={formValues.lastName}
                    onChange={handleInputChange}
                    variant="standard"
                  />
                ) : (
                  user.lastName
                )}
              </TableCell>
              <TableCell>{user?.role}</TableCell>
              <TableCell>
                {editMode === user._id ? (
                  <Select
                    value={formValues.status}
                    onChange={handleStatusChange}
                    variant="standard"
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="blocked">Blocked</MenuItem>
                  </Select>
                ) : (
                  user.status
                )}
              </TableCell>
              <TableCell>
                {editMode === user._id ? (
                  <IconButton onClick={() => handleSaveClick(user)}>
                    <Save />
                  </IconButton>
                ) : (
                  <IconButton onClick={() => handleEditClick(user)}>
                    <Edit />
                  </IconButton>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );

  const renderChart = () => {
    switch (selectedOption) {
      case "traffic":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trafficData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case "viewers":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={viewerData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="desktop" fill="#8884d8" />
              <Bar dataKey="mobile" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        );
      case "userManagement":
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              User Management
            </Typography>
            {renderUserManagementTable()}
          </Box>
        );
      case "revenue":
        return (
          <Typography variant="h6">Revenue Reports Coming Soon...</Typography>
        );
      case "systemLogs":
        return <Typography variant="h6">System Logs Coming Soon...</Typography>;
      case "notifications":
        return (
          <Typography variant="h6">
            Notifications Management Coming Soon...
          </Typography>
        );
      case "contentManagement":
        return (
          <Typography variant="h6">
            Content Management Coming Soon...
          </Typography>
        );
      case "performanceAnalytics":
        return (
          <Typography variant="h6">
            Performance Analytics Coming Soon...
          </Typography>
        );
      case "subscriptions":
        return (
          <Typography variant="h6">
            Subscription Management Coming Soon...
          </Typography>
        );
      case "security":
        return (
          <Typography variant="h6">Security Settings Coming Soon...</Typography>
        );
      case "feedback":
        return (
          <Typography variant="h6">
            Feedback and Support Coming Soon...
          </Typography>
        );
      case "auditTrail":
        return <Typography variant="h6">Audit Trail Coming Soon...</Typography>;
      case "apiUsage":
        return (
          <Typography variant="h6">
            API Usage Statistics Coming Soon...
          </Typography>
        );
      case "marketing":
        return (
          <Typography variant="h6">
            Marketing Campaigns Coming Soon...
          </Typography>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <List>
              <ListItem button onClick={() => setSelectedOption("traffic")}>
                <ListItemIcon>
                  <Traffic />
                </ListItemIcon>
                <ListItemText primary="Website Traffic" />
              </ListItem>
              <ListItem button onClick={() => setSelectedOption("viewers")}>
                <ListItemIcon>
                  <People />
                </ListItemIcon>
                <ListItemText primary="Viewers" />
              </ListItem>
              <ListItem
                button
                onClick={() => setSelectedOption("userManagement")}
              >
                <ListItemIcon>
                  <PeopleOutline />
                </ListItemIcon>
                <ListItemText primary="User Management" />
              </ListItem>
              <ListItem button onClick={() => setSelectedOption("revenue")}>
                <ListItemIcon>
                  <AttachMoney />
                </ListItemIcon>
                <ListItemText primary="Revenue Reports" />
              </ListItem>
              <ListItem button onClick={() => setSelectedOption("systemLogs")}>
                <ListItemIcon>
                  <History />
                </ListItemIcon>
                <ListItemText primary="System Logs" />
              </ListItem>
              <ListItem
                button
                onClick={() => setSelectedOption("notifications")}
              >
                <ListItemIcon>
                  <NotificationsActive />
                </ListItemIcon>
                <ListItemText primary="Notifications" />
              </ListItem>
              <ListItem
                button
                onClick={() => setSelectedOption("contentManagement")}
              >
                <ListItemIcon>
                  <Description />
                </ListItemIcon>
                <ListItemText primary="Content Management" />
              </ListItem>
              <ListItem
                button
                onClick={() => setSelectedOption("performanceAnalytics")}
              >
                <ListItemIcon>
                  <ShowChart />
                </ListItemIcon>
                <ListItemText primary="Performance Analytics" />
              </ListItem>
              <ListItem
                button
                onClick={() => setSelectedOption("subscriptions")}
              >
                <ListItemIcon>
                  <CardMembership />
                </ListItemIcon>
                <ListItemText primary="Subscriptions" />
              </ListItem>
              <ListItem button onClick={() => setSelectedOption("security")}>
                <ListItemIcon>
                  <Security />
                </ListItemIcon>
                <ListItemText primary="Security" />
              </ListItem>
              <ListItem button onClick={() => setSelectedOption("feedback")}>
                <ListItemIcon>
                  <Feedback />
                </ListItemIcon>
                <ListItemText primary="Feedback & Support" />
              </ListItem>
              <ListItem button onClick={() => setSelectedOption("auditTrail")}>
                <ListItemIcon>
                  <FindInPage />
                </ListItemIcon>
                <ListItemText primary="Audit Trail" />
              </ListItem>
              <ListItem button onClick={() => setSelectedOption("apiUsage")}>
                <ListItemIcon>
                  <Api />
                </ListItemIcon>
                <ListItemText primary="API Usage" />
              </ListItem>
              <ListItem button onClick={() => setSelectedOption("marketing")}>
                <ListItemIcon>
                  <Campaign />
                </ListItemIcon>
                <ListItemText primary="Marketing" />
              </ListItem>
              <ListItem button onClick={handleBackup}>
                <ListItemIcon>
                  <Backup />
                </ListItemIcon>
                <ListItemText primary="Backup" />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={9}>
          <Paper elevation={3} sx={{ p: 2 }}>
            {renderChart()}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;