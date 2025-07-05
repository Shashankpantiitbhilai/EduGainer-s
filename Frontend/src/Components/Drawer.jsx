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
import { colors, designTokens, glassMorphism } from '../theme/enterpriseTheme';

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    boxSizing: 'border-box',
    width: 280,
    backgroundColor: theme.palette.mode === 'dark' ? colors.neutral[800] : colors.background.default,
    borderRight: `1px solid ${colors.border.light}`,
    backdropFilter: 'blur(10px)',
  }
}));

const DrawerHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  background: colors.primary.gradient,
  color: colors.text.inverse,
  borderBottom: `1px solid ${colors.border.light}`,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  margin: `${designTokens.spacing.xs}px ${designTokens.spacing.md}px`,
  borderRadius: designTokens.borderRadius.lg,
  transition: `all ${designTokens.animation.duration.normal} ${designTokens.animation.easing.default}`,
  '&:hover': {
    backgroundColor: colors.background.subtle,
    transform: 'translateX(8px)',
    '& .MuiTypography-root': {
      color: colors.primary.main,
      fontWeight: designTokens.typography.fontWeight.semibold,
    }
  },
  '& .MuiTypography-root': {
    color: theme.palette.mode === 'dark' ? colors.text.inverse : colors.text.primary,
    fontWeight: designTokens.typography.fontWeight.medium,
    transition: `all ${designTokens.animation.duration.normal} ${designTokens.animation.easing.default}`,
  }
}));

const CustomDrawer = ({ open, onClose, pages, unseenMessageCount }) => {
  const theme = useTheme();

  const drawerContent = (
    <Box>
      <DrawerHeader>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: designTokens.typography.fontWeight.bold,
            position: 'relative',
            zIndex: 1,
          }}
        >
          EduGainer's
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            opacity: 0.8,
            position: 'relative',
            zIndex: 1,
          }}
        >
          Excellence in Education
        </Typography>
      </DrawerHeader>
      
      <List sx={{ padding: designTokens.spacing.md }}>
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
                  backgroundColor: colors.secondary.main,
                  color: colors.text.primary,
                  fontWeight: designTokens.typography.fontWeight.bold,
                }
              }}
            >
              <ListItemText 
                primary={page.name}
                primaryTypographyProps={{
                  sx: {
                    fontWeight: designTokens.typography.fontWeight.medium,
                    fontSize: designTokens.typography.fontSize.base,
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