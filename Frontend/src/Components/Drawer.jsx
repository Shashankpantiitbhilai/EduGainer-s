import React from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Drawer,
  Typography,
  List,
  ListItem,
  ListItemText,
  Badge,
  useTheme
} from '@mui/material';
import { Link } from 'react-router-dom';

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    boxSizing: 'border-box',
    width: 240,
    backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff',
    borderRight: `1px solid ${theme.palette.mode === 'dark' ? '#333333' : '#e0e0e0'}`,
  }
}));

const DrawerHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.mode === 'dark' ? '#006400' : '#008000',
  color: '#ffffff'
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  borderRadius: theme.spacing(1),
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#333333' : '#f5f5f5',
    '& .MuiTypography-root': {
      color: '#FFA500'
    }
  },
  '& .MuiTypography-root': {
    color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
    transition: 'color 0.3s ease'
  }
}));

const CustomDrawer = ({ open, onClose, pages, unseenMessageCount }) => {
  const theme = useTheme();

  const drawerContent = (
    <Box>
      <DrawerHeader>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          EduGainer's
        </Typography>
      </DrawerHeader>
      
      <List sx={{ padding: 2 }}>
        {pages.map((page) => (
          <StyledListItem
            key={page.name}
            component={Link}
            to={page.link}
            onClick={onClose}
            sx={{ textAlign: 'center' }}
          >
            <Badge
              badgeContent={page.showBadge ? unseenMessageCount : 0}
              color="error"
              invisible={!page.showBadge || unseenMessageCount === 0}
              sx={{
                '& .MuiBadge-badge': {
                  backgroundColor: '#FFA500',
                  color: '#ffffff'
                }
              }}
            >
              <ListItemText 
                primary={page.name}
                primaryTypographyProps={{
                  sx: {
                    fontWeight: 500,
                    fontSize: '1rem'
                  }
                }}
              />
            </Badge>
          </StyledListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <StyledDrawer
      variant="temporary"
      anchor="left"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        display: { xs: 'block', md: 'none' }
      }}
    >
      {drawerContent}
    </StyledDrawer>
  );
};

export default CustomDrawer;