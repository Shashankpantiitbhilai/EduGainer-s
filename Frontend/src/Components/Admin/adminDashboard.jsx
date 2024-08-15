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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { fetchAllSiteUsers } from "../../services/Admin_services/adminUtils";
import { editUserById } from "../../services/adminDashboard/utils";
// Enhanced sample data for charts
const trafficData = [
  { name: "Jan", pageViews: 4000, uniqueVisitors: 2400, avgTimeOnSite: 120 },
  { name: "Feb", pageViews: 3000, uniqueVisitors: 1800, avgTimeOnSite: 100 },
  { name: "Mar", pageViews: 5000, uniqueVisitors: 3000, avgTimeOnSite: 150 },
  { name: "Apr", pageViews: 4500, uniqueVisitors: 2700, avgTimeOnSite: 130 },
  { name: "May", pageViews: 6000, uniqueVisitors: 3600, avgTimeOnSite: 160 },
  { name: "Jun", pageViews: 5500, uniqueVisitors: 3300, avgTimeOnSite: 140 },
];

const viewerData = [
  { name: "Mon", desktop: 4000, mobile: 2400, tablet: 1000 },
  { name: "Tue", desktop: 3000, mobile: 1398, tablet: 800 },
  { name: "Wed", desktop: 2000, mobile: 9800, tablet: 1200 },
  { name: "Thu", desktop: 2780, mobile: 3908, tablet: 1500 },
  { name: "Fri", desktop: 1890, mobile: 4800, tablet: 1100 },
  { name: "Sat", desktop: 2390, mobile: 3800, tablet: 900 },
  { name: "Sun", desktop: 3490, mobile: 4300, tablet: 1300 },
];

const geographicData = [
  { name: "North America", value: 35 },
  { name: "Europe", value: 30 },
  { name: "Asia", value: 25 },
  { name: "South America", value: 5 },
  { name: "Africa", value: 3 },
  { name: "Oceania", value: 2 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

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

  const renderTrafficStats = () => (
    <Box>
      <Typography variant="h6" gutterBottom>Website Traffic</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trafficData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="pageViews" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line yAxisId="left" type="monotone" dataKey="uniqueVisitors" stroke="#82ca9d" />
              <Line yAxisId="right" type="monotone" dataKey="avgTimeOnSite" stroke="#ffc658" />
            </LineChart>
          </ResponsiveContainer>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="subtitle1">Key Metrics</Typography>
            <Typography>Total Page Views: {trafficData.reduce((sum, item) => sum + item.pageViews, 0)}</Typography>
            <Typography>Avg. Unique Visitors: {Math.round(trafficData.reduce((sum, item) => sum + item.uniqueVisitors, 0) / trafficData.length)}</Typography>
            <Typography>Avg. Time on Site: {Math.round(trafficData.reduce((sum, item) => sum + item.avgTimeOnSite, 0) / trafficData.length)} seconds</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );

  const renderViewerStats = () => (
    <Box>
      <Typography variant="h6" gutterBottom>Viewer Statistics</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={viewerData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="desktop" fill="#8884d8" />
              <Bar dataKey="mobile" fill="#82ca9d" />
              <Bar dataKey="tablet" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="subtitle1">Device Usage</Typography>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={geographicData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {geographicData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <Typography variant="subtitle2" align="center">Geographic Distribution</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );

  const renderChart = () => {
    switch (selectedOption) {
      case "traffic":
        return renderTrafficStats();
      case "viewers":
        return renderViewerStats();
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