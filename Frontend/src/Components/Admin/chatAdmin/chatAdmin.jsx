import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  Paper,
  Grid,
  Divider,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Fab,
  Badge,
  useMediaQuery,
  IconButton,
  Tooltip,
  Chip,
  Box,
  CircularProgress,
  Drawer,
  AppBar,
  Toolbar,
  useTheme,
  Menu,
  MenuItem,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Send as SendIcon,
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Notifications as NotificationsIcon,
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  Archive as ArchiveIcon,
  Settings as SettingsIcon,
  Refresh as RefreshIcon,
  EmojiEmotions as EmojiIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import io from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminContext } from '../../../App';
import {
  postChatMessages,
  fetchAdminCredentials,fetchUnseenMessages,updateSeenMessage
} from "../../../services/chat/utils";
import { Popover } from '@mui/material';
import {
  fetchAllChats,
  fetchAllSiteUsers,
} from "../../../services/Admin_services/adminUtils";

const EMOJI_LIST = [
  '😊', '😂', '🤣', '❤️', '😍', 
  '👍', '🎉', '✨', '🌟', '💪',
  '🤝', '👋', '🙏', '💯', '🔥',
  '⭐', '💡', '💬', '📨', '✅',
  '⚡', '🎯', '🎨', '🎵', '📱',
  '💻', '🌈', '☀️', '🌙', '⏰',
  '📝', '📚', '✍️', '🤔', '🎊'
];

const ChatContainer = styled(Paper)(({ theme }) => ({
  width: '100%',
  height: '85vh',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  backgroundColor: theme.palette.background.paper
}));

const ChatHeader = styled(AppBar)(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.palette.mode === 'dark' ? '#1E1E1E' : '#f5f5f5',
  color: theme.palette.text.primary,
  boxShadow: 'none',
  borderBottom: `1px solid ${theme.palette.divider}`
}));

const SidebarContainer = styled(Box)(({ theme }) => ({
  width: 320,
  borderRight: `1px solid ${theme.palette.divider}`,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.mode === 'dark' ? '#121212' : '#ffffff'
}));

const MessageList = styled(List)(({ theme }) => ({
  flexGrow: 1,
  overflowY: 'auto',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.mode === 'dark' ? '#1A1A1A' : '#f8f9fa'
}));

const MessageBubble = styled(motion.div)(({ theme, isOwn }) => ({
  backgroundColor: isOwn ? theme.palette.primary.main : theme.palette.secondary.main,
  color: isOwn ? theme.palette.primary.contrastText : theme.palette.secondary.contrastText,
  padding: theme.spacing(1.5, 2),
  borderRadius: 16,
  maxWidth: '70%',
  marginBottom: theme.spacing(1),
  position: 'relative',
  alignSelf: isOwn ? 'flex-end' : 'flex-start',
  '&::before': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    [isOwn ? 'right' : 'left']: -8,
    borderStyle: 'solid',
    borderWidth: '8px 8px 0 8px',
    borderColor: `${isOwn ? theme.palette.primary.main : theme.palette.secondary.main} transparent transparent transparent`
  }
}));

const InputContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderTop: `1px solid ${theme.palette.divider}`
}));

const SearchContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`
}));

const UserListItem = styled(ListItem)(({ theme, selected }) => ({
  borderRadius: theme.shape.borderRadius,
  margin: theme.spacing(0.5, 1),
  '&:hover': {
    backgroundColor: theme.palette.action.hover
  },
  ...(selected && {
    backgroundColor: theme.palette.primary.light,
    '&:hover': {
      backgroundColor: theme.palette.primary.light
    }
  })
}));

const AdminChat = () => {
  const theme = useTheme();
  const { IsUserLoggedIn } = useContext(AdminContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [adminRoomId, setAdminRoomId] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [announcementMessages, setAnnouncementMessages] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [showSidebar, setShowSidebar] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
    const [emojiAnchorEl, setEmojiAnchorEl] = useState(null);
  const socketRef = useRef();
  const messageEndRef = useRef(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
 const handleEmojiClick = (emoji) => {
    setInput(prevInput => prevInput + emoji);
    setEmojiAnchorEl(null);
  };

  const handleEmojiButtonClick = (event) => {
    setEmojiAnchorEl(event.currentTarget);
  };
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [adminData, usersData, unseenMessages] = await Promise.all([
          fetchAdminCredentials(),
          fetchAllSiteUsers(),
          fetchUnseenMessages()
        ]);

        if (usersData) {
          setUsers(usersData);
          const unseenCounts = {};
          unseenMessages.forEach(message => {
            if (message.messages && 
                message.messages[0]?.sender !== IsUserLoggedIn._id && 
                !message.messages[0]?.seen) {
              const userId = message.user;
              unseenCounts[userId] = (unseenCounts[userId] || 0) + 1;
            }
          });
          setUnreadCounts(unseenCounts);
        }

        if (adminData) {
          setAdminRoomId(adminData._id);
          setupSocket(adminData._id);
        }
      } catch (error) {
        console.error('Error fetching resources:', error);
        setSnackbar({
          open: true,
          message: 'Error loading chat data',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const setupSocket = (adminId) => {
    const url = process.env.NODE_ENV === 'production'
      ? process.env.REACT_APP_BACKEND_PROD
      : process.env.REACT_APP_BACKEND_DEV;
      
    const socket = io(url, {
      query: {
        sender: IsUserLoggedIn._id,
        admin: adminId,
      },
    });

    socketRef.current = socket;

    socket.on('receiveMessage', (message, roomId, sender) => {
   
      handleNewMessage(message, roomId, sender);
    });

    socket.on('connect', () => {
      setSnackbar({
        open: true,
        message: 'Connected to chat server',
        severity: 'success'
      });
    });

    socket.on('disconnect', () => {
      setSnackbar({
        open: true,
        message: 'Disconnected from chat server',
        severity: 'warning'
      });
    });
  };

  const handleNewMessage = (message, roomId, sender) => {
    if (sender === selectedRoom) {
      if (roomId === adminRoomId) {
        setAnnouncementMessages(prev => [...prev, message]);
      } else {
        setMessages(prev => [...prev, message]);
      }
    }

    if (roomId !== selectedRoom && sender !== adminRoomId) {
      setUnreadCounts(prev => ({
        ...prev,
        [roomId]: (prev[roomId] || 0) + 1,
      }));
    }
    playNotificationSound();
  };

  const playNotificationSound = () => {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, context.currentTime);
    gainNode.gain.setValueAtTime(0.2, context.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start();
    oscillator.stop(context.currentTime + 0.2);
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, announcementMessages]);

  const handleSendMessage = async () => {
    if (!input.trim() || !selectedRoom) return;
console.log(selectedRoom,adminRoomId,"d")
   const receiver = selectedRoom && selectedRoom !== adminRoomId ? selectedRoom : "All";

const messageData = {
    messages: [{
        sender: IsUserLoggedIn?._id,
        receiver: receiver,  // Use the defined `receiver` variable
        content: input,
    }],
    user: selectedRoom,
    timestamp: new Date(),
};

    try {
      if (socketRef.current) {
        socketRef.current.emit('sendMessage', messageData, selectedRoom, adminRoomId);
      }
      setInput('');
      await postChatMessages(messageData);
      
      if (selectedRoom === adminRoomId) {
        setAnnouncementMessages(prev => [...prev, messageData]);
      } else {
        setMessages(prev => [...prev, messageData]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setSnackbar({
        open: true,
        message: 'Failed to send message',
        severity: 'error'
      });
    }
  };

  const handleUserSelect = async (userId) => {
    try {
      setSelectedRoom(userId);
      await updateSeenMessage(userId);
      setUnreadCounts(prev => ({
        ...prev,
        [userId]: 0,
      }));
      
      const response = await fetchAllChats(userId);
    
      if (userId === adminRoomId) {
        setAnnouncementMessages(response);
      } else {
        setMessages(response);
      }

      if (socketRef.current) {
        socketRef.current.emit('joinRoom', userId);
      }

      if (isMobile) {
        setShowSidebar(false);
      }
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      setSnackbar({
        open: true,
        message: 'Error loading chat history',
        severity: 'error'
      });
    }
  };

  const handleMenuClick = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const filteredUsers = users.filter(user => 
    user._id !== IsUserLoggedIn._id &&
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSelectedUserName = () => {
    if (selectedRoom === adminRoomId) return 'Announcement Room';
    const selectedUser = users.find(user => user._id === selectedRoom);
    return selectedUser ? selectedUser.username : '';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ChatContainer elevation={3}>
      <ChatHeader>
        <Toolbar>
          {isMobile && !showSidebar && (
            <IconButton edge="start" color="inherit" onClick={() => setShowSidebar(true)}>
              <ArrowBackIcon />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {getSelectedUserName() || 'Admin Chat'}
          </Typography>
          <Tooltip title="Refresh">
            <IconButton color="inherit" onClick={() => window.location.reload()}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <IconButton color="inherit" onClick={handleMenuClick}>
            <MoreVertIcon />
          </IconButton>
        </Toolbar>
      </ChatHeader>

      <Box display="flex" flexGrow={1} overflow="hidden">
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={showSidebar}
          onClose={() => setShowSidebar(false)}
          sx={{
            width: 320,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 320,
              position: 'relative',
              height: '100%'
            }
          }}
        >
          <SidebarContainer>
            <SearchContainer>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon color="action" />,
                  endAdornment: searchQuery && (
                    <IconButton size="small" onClick={() => setSearchQuery('')}>
                      <DeleteIcon />
                    </IconButton>
                  )
                }}
              />
            </SearchContainer>

            <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
              <UserListItem
                button
                selected={selectedRoom === adminRoomId}
                onClick={() => handleUserSelect(adminRoomId)}
              >
                <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                  <NotificationsIcon />
                </Avatar>
                <ListItemText
                  primary="Announcement Room"
                  secondary="Broadcast messages"
                  sx={{ ml: 2 }}
                />
              </UserListItem>

              <Divider sx={{ my: 1 }} />

              {filteredUsers.map(user => (
                <UserListItem
                  button
                  key={user._id}
                  selected={selectedRoom === user._id}
                  onClick={() => handleUserSelect(user._id)}
                >
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={unreadCounts[user._id] || 0}
                    color="error"
                  >
                    <Avatar alt={user.username} src={user.avatarUrl}>
                      {user.username[0].toUpperCase()}
                    </Avatar>
                  </Badge>
                  <ListItemText
                    primary={user.username}
                    secondary={`Last active: ${new Date().toLocaleDateString()}`}
                    sx={{ ml: 2 }}
                  />
                  {user.online && (
                    <Chip
                      size="small"
                      label="Online"
                      color="success"
                      sx={{ ml: 1 }}
                    
                    














                    />
                  )}
                </UserListItem>
              ))}
            </List>
          </SidebarContainer>
        </Drawer>

        <Box flexGrow={1} display="flex" flexDirection="column">
          <MessageList>
            <AnimatePresence>
              {(selectedRoom === adminRoomId ? announcementMessages : messages).map((msg, index) => {
                const isOwn = msg.messages[0].sender === IsUserLoggedIn._id;
                const messageTime = new Date(msg.timestamp).toLocaleTimeString();
                
                return (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isOwn ? 'flex-end' : 'flex-start',
                      mb: 2
                    }}
                  >
                    <MessageBubble
                      isOwn={isOwn}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Typography variant="body1">
                        {msg.messages[0].content}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          display: 'block',
                          mt: 0.5,
                          opacity: 0.7,
                          textAlign: isOwn ? 'right' : 'left'
                        }}
                      >
                        {messageTime}
                      </Typography>
                    </MessageBubble>
                  </Box>
                );
              })}
            </AnimatePresence>
            <div ref={messageEndRef} />
          </MessageList>

        <InputContainer>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Tooltip title="Add emoji">
              <IconButton 
                color="primary"
                onClick={handleEmojiButtonClick}
                disabled={!selectedRoom}
              >
                <EmojiIcon />
              </IconButton>
            </Tooltip>
            <Popover
              open={Boolean(emojiAnchorEl)}
              anchorEl={emojiAnchorEl}
              onClose={() => setEmojiAnchorEl(null)}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              <Box
                sx={{
                  p: 2,
                  width: 280,
                  maxHeight: 400,
                  overflowY: 'auto'
                }}
              >
                <Grid container spacing={1}>
                  {EMOJI_LIST.map((emoji, index) => (
                    <Grid item key={index}>
                      <IconButton
                        onClick={() => handleEmojiClick(emoji)}
                        sx={{
                          fontSize: '1.5rem',
                          '&:hover': {
                            backgroundColor: theme => theme.palette.action.hover
                          }
                        }}
                      >
                        {emoji}
                      </IconButton>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Popover>
          </Grid>
              <Grid item xs>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder={selectedRoom ? "Type your message..." : "Select a chat to start messaging"}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  disabled={!selectedRoom}
                  multiline
                  maxRows={4}
                  InputProps={{
                    sx: {
                      borderRadius: 3
                    }
                  }}
                />
              </Grid>
              <Grid item>
                <Tooltip title="Send message">
                  <span>
                    <Fab
                      color="primary"
                      size="medium"
                      onClick={handleSendMessage}
                      disabled={!input.trim() || !selectedRoom}
                    >
                      <SendIcon />
                    </Fab>
                  </span>
                </Tooltip>
              </Grid>
            </Grid>
          </InputContainer>
        </Box>
      </Box>

      {/* Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <ListItemText 
            primary="Settings"
            secondary="Configure chat preferences"
          />
          <SettingsIcon sx={{ ml: 2 }} />
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemText 
            primary="Archive Chat"
            secondary="Save conversation history"
          />
          <ArchiveIcon sx={{ ml: 2 }} />
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemText 
            primary="Clear History"
            secondary="Delete all messages"
          />
          <DeleteIcon sx={{ ml: 2 }} />
        </MenuItem>
      </Menu>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ChatContainer>
  );
};

export default AdminChat;
                    

                    
                    