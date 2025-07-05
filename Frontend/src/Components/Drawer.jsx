import React from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Drawer,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge,
  useTheme,
  IconButton,
  Divider,
  alpha,
} from '@mui/material';
import {
  Close as CloseIcon,
 
  School as SchoolIcon,
  Chat as ChatIcon,
  Store as StoreIcon,
  Help as HelpIcon,
  Info as InfoIcon,
  Event as EventIcon,
  Transform as TransformIcon,
  AdminPanelSettings as AdminIcon,
  Dashboard as DashboardIcon,
  Feedback as FeedbackIcon,
  Policy as PolicyIcon,
  Inventory as ResourcesIcon,
  Work as CareersIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { colors, designTokens, glassMorphism } from '../theme/enterpriseTheme';
import LibraryIcon from '@mui/icons-material/LibraryBooks';


const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    boxSizing: 'border-box',
    width: 300,
    maxWidth: '85vw',
    backgroundColor: theme.palette.background.paper,
    borderRight: `1px solid ${theme.palette.divider}`,
    backdropFilter: 'blur(20px)',
    background: theme.palette.mode === 'dark' 
      ? `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`
      : `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
    boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, theme.palette.mode === 'dark' ? 0.4 : 0.15)}`,
  }
}));

const DrawerHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 2),
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
  color: theme.palette.primary.contrastText,
  borderBottom: `1px solid ${theme.palette.divider}`,
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  margin: `${designTokens.spacing.xs}px ${designTokens.spacing.sm}px`,
  borderRadius: designTokens.borderRadius.lg,
  transition: `all ${designTokens.animation.duration.normal} ${designTokens.animation.easing.default}`,
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' 
      ? alpha(theme.palette.primary.main, 0.1)
      : alpha(theme.palette.primary.main, 0.08),
    transform: 'translateX(8px)',
    '&::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: 4,
      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
      borderRadius: '0 4px 4px 0',
    },
    '& .MuiTypography-root': {
      color: theme.palette.primary.main,
      fontWeight: designTokens.typography.fontWeight.semibold,
    },
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.main,
      transform: 'scale(1.1)',
    }
  },
  '& .MuiTypography-root': {
    color: theme.palette.text.primary,
    fontWeight: designTokens.typography.fontWeight.medium,
    transition: `all ${designTokens.animation.duration.normal} ${designTokens.animation.easing.default}`,
  },
  '& .MuiListItemIcon-root': {
    color: theme.palette.text.secondary,
    minWidth: 40,
    transition: `all ${designTokens.animation.duration.normal} ${designTokens.animation.easing.default}`,
  }
}));

const getIconForPage = (pageName) => {
  const iconMap = {
    'Library': LibraryIcon,
    'Classes': SchoolIcon,
    'AdminChat': ChatIcon,
    'Query': ChatIcon,
    'MeriStationary': StoreIcon,
    'Resources': ResourcesIcon,
    'Feedback': FeedbackIcon,
    'Privacy': PolicyIcon,
    'Events': EventIcon,
    'Doc-Convert': TransformIcon,
    'Dashboard': DashboardIcon,
    'Careers': CareersIcon,
  };
  
  const IconComponent = iconMap[pageName] || InfoIcon;
  return <IconComponent sx={{ fontSize: 20 }} />;
};

const CustomDrawer = ({ open, onClose, pages, unseenMessageCount }) => {
  const theme = useTheme();

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <DrawerHeader>
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: designTokens.typography.fontWeight.bold,
              fontSize: '1.2rem',
              mb: 0.5,
            }}
          >
            EduGainer's
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              opacity: 0.9,
              fontSize: '0.8rem',
            }}
          >
            Excellence in Education
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: 'inherit',
            position: 'relative',
            zIndex: 1,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DrawerHeader>
      
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List sx={{ padding: designTokens.spacing.sm }}>
          {pages.map((page, index) => (
            <StyledListItem
              key={page.name}
              component={Link}
              to={page.link}
              onClick={onClose}
              sx={{ 
                textAlign: 'left',
                py: 1.5,
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <ListItemIcon>
                {getIconForPage(page.name)}
              </ListItemIcon>
              <Badge
                badgeContent={page.showBadge ? unseenMessageCount : 0}
                color="error"
                invisible={!page.showBadge || unseenMessageCount === 0}
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: theme.palette.secondary.main,
                    color: theme.palette.secondary.contrastText,
                    fontWeight: designTokens.typography.fontWeight.bold,
                    fontSize: '0.7rem',
                    minWidth: 18,
                    height: 18,
                  }
                }}
              >
                <ListItemText 
                  primary={page.name}
                  primaryTypographyProps={{
                    sx: {
                      fontWeight: designTokens.typography.fontWeight.medium,
                      fontSize: '0.95rem',
                    }
                  }}
                />
              </Badge>
            </StyledListItem>
          ))}
        </List>
      </Box>

      {/* Footer */}
      <Box sx={{ 
        p: 2, 
        borderTop: `1px solid ${theme.palette.divider}`,
        background: alpha(theme.palette.background.default, 0.5),
      }}>
        <Typography 
          variant="caption" 
          sx={{ 
            color: theme.palette.text.secondary,
            textAlign: 'center',
            display: 'block',
            fontSize: '0.7rem',
          }}
        >
          © 2025 EduGainer's Platform
        </Typography>
      </Box>
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
        display: { xs: 'block', md: 'none' },
        '& .MuiBackdrop-root': {
          backgroundColor: alpha(theme.palette.common.black, 0.5),
          backdropFilter: 'blur(4px)',
        }
      }}
    >
      {drawerContent}
    </StyledDrawer>
  );
};

export default CustomDrawer;