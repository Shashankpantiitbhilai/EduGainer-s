import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Box, 
  CircularProgress,
  Tabs,
  Tab
} from '@mui/material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { fetchTrafficData } from '../../../services/traffic/traffic';

const TrafficDashboard = () => {
  const [trafficData, setTrafficData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const loadTrafficData = async () => {
      try {
        const data = await fetchTrafficData();
        setTrafficData(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch traffic data', error);
        setLoading(false);
      }
    };

    loadTrafficData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!trafficData) {
    return <Typography variant="h6">No traffic data available</Typography>;
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Website Traffic Analytics
      </Typography>

      <Tabs value={activeTab} onChange={handleTabChange} centered>
        <Tab label="Queries" />
        <Tab label="Countries" />
        <Tab label="Devices" />
      </Tabs>

      {activeTab === 0 && (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Top Queries by Clicks</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={trafficData.queries.slice(0, 10)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="query" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="clicks" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Query Click-Through Rates</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trafficData.queries.slice(0, 10)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="query" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="ctr" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Traffic by Country</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={trafficData.countries}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="clicks"
                    >
                      {trafficData.countries.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name, props) => [
                      value, 
                      `${props.payload.country} Clicks`
                    ]} />
                    <Legend 
                      layout="vertical" 
                      verticalAlign="middle" 
                      align="right"
                      formatter={(value, entry) => entry.payload.country}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Country-wise Impressions</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={trafficData.countries}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="country" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="impressions" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 2 && (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Traffic by Device</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={trafficData.devices}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="clicks"
                    >
                      {trafficData.devices.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name, props) => [
                      value, 
                      `${props.payload.device} Clicks`
                    ]} />
                    <Legend 
                      layout="vertical" 
                      verticalAlign="middle" 
                      align="right"
                      formatter={(value, entry) => entry.payload.device}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Overall Traffic Metrics</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 3 }}>
                  <Box textAlign="center">
                    <Typography variant="h6">{trafficData.total.clicks}</Typography>
                    <Typography variant="body2">Total Clicks</Typography>
                  </Box>
                  <Box textAlign="center">
                    <Typography variant="h6">{trafficData.total.impressions}</Typography>
                    <Typography variant="body2">Total Impressions</Typography>
                  </Box>
                  <Box textAlign="center">
                    <Typography variant="h6">{trafficData.total.ctr}%</Typography>
                    <Typography variant="body2">Avg. CTR</Typography>
                  </Box>
                  <Box textAlign="center">
                    <Typography variant="h6">{trafficData.total.position}</Typography>
                    <Typography variant="body2">Avg. Position</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default TrafficDashboard;