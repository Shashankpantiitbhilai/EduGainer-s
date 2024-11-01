import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  IconButton,
  Chip,
  Tooltip,
  CircularProgress,
  Alert,
  Box,
  Stack,
  Badge,
  Card,
  CardHeader,
  CardContent,
  TextField,
  MenuItem,
  Grid,
  Collapse,
  ButtonGroup,
  Button,
  Drawer,
  Divider
} from '@mui/material';
import {
  Storage as DatabaseIcon,
  Add as InsertIcon,
  Edit as UpdateIcon,
  Delete as DeleteIcon,
  Settings as SystemIcon,
  Refresh as RefreshIcon,
  ErrorOutline as ErrorIcon,
  FilterList as FilterIcon,
  Timeline as TimelineIcon,
  Info as InfoIcon,
  KeyboardArrowDown as ExpandMoreIcon,
  KeyboardArrowUp as ExpandLessIcon
} from '@mui/icons-material';
import { fetchLogs } from '../../services/Admin_services/db-event';

const OperationInfo = {
  insert: { icon: <InsertIcon color="success" />, color: 'success', label: 'Insert' },
  update: { icon: <UpdateIcon color="primary" />, color: 'primary', label: 'Update' },
  delete: { icon: <DeleteIcon color="error" />, color: 'error', label: 'Delete' },
  replace: { icon: <UpdateIcon color="warning" />, color: 'warning', label: 'Replace' },
  system: { icon: <SystemIcon color="info" />, color: 'info', label: 'System' }
};

const DbLogsViewer = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [filters, setFilters] = useState({
    operationType: 'all',
    timeRange: 'all',
    search: ''
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expandedLog, setExpandedLog] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    byType: {}
  });

  const loadLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchLogs();
      setLogs(data);
      setLastRefresh(new Date());
      
      // Calculate stats
      const typeStats = data.reduce((acc, log) => {
        acc[log.operationType] = (acc[log.operationType] || 0) + 1;
        return acc;
      }, {});
      
      setStats({
        total: data.length,
        byType: typeStats
      });
    } catch (err) {
      setError('Failed to fetch logs. Please try again later.');
      console.error('Error loading logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
    const interval = setInterval(loadLogs, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const filterLogs = () => {
    return logs.filter(log => {
      const matchesType = filters.operationType === 'all' || log.operationType === filters.operationType;
      const matchesSearch = log.message.toLowerCase().includes(filters.search.toLowerCase()) ||
                          log.user.toLowerCase().includes(filters.search.toLowerCase()) ||
                          (log.modelName && log.modelName.toLowerCase().includes(filters.search.toLowerCase()));
      
      let matchesTime = true;
      const logTime = new Date(log.timestamp);
      const now = new Date();
      
      switch(filters.timeRange) {
        case 'hour':
          matchesTime = now - logTime <= 3600000;
          break;
        case 'day':
          matchesTime = now - logTime <= 86400000;
          break;
        case 'week':
          matchesTime = now - logTime <= 604800000;
          break;
        default:
          matchesTime = true;
      }
      
      return matchesType && matchesSearch && matchesTime;
    });
  };

  const toggleLogExpansion = (logId) => {
    setExpandedLog(expandedLog === logId ? null : logId);
  };

  if (loading && logs.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3, height: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Paper>
    );
  }

  const filteredLogs = filterLogs();

  return (
    <Card elevation={3} sx={{ height: "100%" }}>
      <CardHeader
        avatar={<DatabaseIcon color="primary" fontSize="large" />}
        title={
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="h6">Database Logs</Typography>
            <Badge badgeContent={stats.total} color="primary" />
          </Stack>
        }
        action={
          <ButtonGroup variant="outlined" size="small">
            <Tooltip title="Refresh logs">
              <IconButton onClick={loadLogs}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Filter logs">
              <IconButton onClick={() => setDrawerOpen(true)}>
                <FilterIcon />
              </IconButton>
            </Tooltip>
          </ButtonGroup>
        }
      />

      <Divider />

      <CardContent>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {Object.entries(OperationInfo).map(([type, info]) => (
            <Grid item xs={4} sm={2} key={type}>
              <Card variant="outlined" sx={{ textAlign: 'center', p: 1 }}>
                {info.icon}
                <Typography variant="caption" display="block">
                  {info.label}
                </Typography>
                <Typography variant="h6">
                  {stats.byType[type] || 0}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Typography variant="caption" color="text.secondary" display="block" mb={2}>
          Last updated: {lastRefresh.toLocaleString()}
        </Typography>

        <List sx={{ maxHeight: '500px', overflow: 'auto' }}>
          {filteredLogs.map((log, index) => (
            <ListItem
              key={log._id || index}
              sx={{
                flexDirection: 'column',
                alignItems: 'stretch',
                bgcolor: 'background.paper',
                mb: 1,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center" width="100%">
                {OperationInfo[log.operationType].icon}
                <Box flex={1}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body1">{log.message}</Typography>
                    <Chip
                      label={log.operationType}
                      size="small"
                      color={OperationInfo[log.operationType].color}
                    />
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    {formatTimestamp(log.timestamp)}
                  </Typography>
                </Box>
                <IconButton
                  onClick={() => toggleLogExpansion(log._id)}
                  size="small"
                >
                  {expandedLog === log._id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Stack>

              <Collapse in={expandedLog === log._id}>
                <Box sx={{ mt: 2, ml: 6, mb: 1 }}>
                  <Stack spacing={1}>
                    <Typography variant="body2">
                      <strong>User:</strong> {log.user}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Model:</strong> {log.modelName || 'N/A'}
                    </Typography>
                   
                  </Stack>
                </Box>
              </Collapse>
            </ListItem>
          ))}
        </List>

        {filteredLogs.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <ErrorIcon color="action" sx={{ fontSize: 40, mb: 1 }} />
            <Typography color="text.secondary">
              No logs match your filters
            </Typography>
          </Box>
        )}
      </CardContent>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 300, p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Filter Logs
          </Typography>
          <Stack spacing={3}>
            <TextField
              label="Search"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              fullWidth
              size="small"
            />
            <TextField
              select
              label="Operation Type"
              value={filters.operationType}
              onChange={(e) => setFilters(prev => ({ ...prev, operationType: e.target.value }))}
              fullWidth
              size="small"
            >
              <MenuItem value="all">All Operations</MenuItem>
              {Object.entries(OperationInfo).map(([type, info]) => (
                <MenuItem value={type} key={type}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    {info.icon}
                    <span>{info.label}</span>
                  </Stack>
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Time Range"
              value={filters.timeRange}
              onChange={(e) => setFilters(prev => ({ ...prev, timeRange: e.target.value }))}
              fullWidth
              size="small"
            >
              <MenuItem value="all">All Time</MenuItem>
              <MenuItem value="hour">Last Hour</MenuItem>
              <MenuItem value="day">Last 24 Hours</MenuItem>
              <MenuItem value="week">Last Week</MenuItem>
            </TextField>
          </Stack>
        </Box>
      </Drawer>
    </Card>
  );
};

export default DbLogsViewer;