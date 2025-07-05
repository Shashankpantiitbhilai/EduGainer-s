import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  alpha,
  Stack,
  Paper,
} from '@mui/material';
import {
  Close as CloseIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  AttachMoney as MoneyIcon,
  People as PeopleIcon,
  AccessTime as AccessTimeIcon,
  Business as BusinessIcon,
  CheckCircle as CheckIcon,
  Assignment as AssignmentIcon,
  EmojiObjects as BenefitsIcon,
  Code as CodeIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { designTokens } from '../../theme/enterpriseTheme';

const JobDetailsModal = ({ open, onClose, job }) => {
  const theme = useTheme();

  if (!job) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: designTokens.borderRadius.xl,
          maxHeight: '90vh',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          color: theme.palette.primary.contrastText,
          p: 3,
          position: 'relative',
          overflow: 'hidden',
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
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, position: 'relative', zIndex: 1 }}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
            }}
          >
            <BusinessIcon sx={{ fontSize: 28 }} />
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: designTokens.typography.fontWeight.bold,
                mb: 1,
                lineHeight: 1.2,
              }}
            >
              {job.title}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                opacity: 0.9,
                fontWeight: designTokens.typography.fontWeight.medium,
                mb: 2,
              }}
            >
              {job.department} • EduGainer's
            </Typography>
            
            {/* Quick Info */}
            <Stack direction="row" spacing={3} sx={{ flexWrap: 'wrap', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <LocationIcon sx={{ fontSize: 16 }} />
                <Typography variant="body2">{job.location}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ScheduleIcon sx={{ fontSize: 16 }} />
                <Typography variant="body2">{job.duration}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <MoneyIcon sx={{ fontSize: 16 }} />
                <Typography variant="body2">{job.stipend}</Typography>
              </Box>
            </Stack>
          </Box>
          <IconButton
            onClick={onClose}
            sx={{
              color: 'inherit',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 3 }}>
          {/* Job Meta Information */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <Chip
              label={job.type}
              sx={{
                backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                color: theme.palette.secondary.main,
                fontWeight: designTokens.typography.fontWeight.semibold,
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AccessTimeIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                Posted {job.posted}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <PeopleIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                {job.applications} applicants
              </Typography>
            </Box>
          </Box>

          {/* Description */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              backgroundColor: alpha(theme.palette.primary.main, 0.02),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              borderRadius: designTokens.borderRadius.lg,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: designTokens.typography.fontWeight.semibold,
                color: theme.palette.text.primary,
              }}
            >
              About This Role
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.secondary,
                lineHeight: 1.7,
              }}
            >
              {job.description}
            </Typography>
          </Paper>

          {/* Tech Stack */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <CodeIcon sx={{ color: theme.palette.primary.main }} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: designTokens.typography.fontWeight.semibold,
                  color: theme.palette.text.primary,
                }}
              >
                Technology Stack
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {job.techStack.map((tech, index) => (
                <Chip
                  key={index}
                  label={tech}
                  variant="outlined"
                  sx={{
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                    color: theme.palette.text.primary,
                    fontWeight: designTokens.typography.fontWeight.medium,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                      borderColor: theme.palette.primary.main,
                    },
                  }}
                />
              ))}
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Requirements */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <CheckIcon sx={{ color: theme.palette.primary.main }} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: designTokens.typography.fontWeight.semibold,
                  color: theme.palette.text.primary,
                }}
              >
                Requirements
              </Typography>
            </Box>
            <List dense>
              {job.requirements.map((requirement, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckIcon
                      sx={{
                        fontSize: 16,
                        color: theme.palette.primary.main,
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={requirement}
                    primaryTypographyProps={{
                      variant: 'body2',
                      sx: { color: theme.palette.text.secondary, lineHeight: 1.6 },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Responsibilities */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <AssignmentIcon sx={{ color: theme.palette.primary.main }} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: designTokens.typography.fontWeight.semibold,
                  color: theme.palette.text.primary,
                }}
              >
                Responsibilities
              </Typography>
            </Box>
            <List dense>
              {job.responsibilities.map((responsibility, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <AssignmentIcon
                      sx={{
                        fontSize: 16,
                        color: theme.palette.secondary.main,
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={responsibility}
                    primaryTypographyProps={{
                      variant: 'body2',
                      sx: { color: theme.palette.text.secondary, lineHeight: 1.6 },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Benefits */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <BenefitsIcon sx={{ color: theme.palette.primary.main }} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: designTokens.typography.fontWeight.semibold,
                  color: theme.palette.text.primary,
                }}
              >
                What You'll Get
              </Typography>
            </Box>
            <List dense>
              {job.benefits.map((benefit, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <BenefitsIcon
                      sx={{
                        fontSize: 16,
                        color: theme.palette.success.main,
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={benefit}
                    primaryTypographyProps={{
                      variant: 'body2',
                      sx: { color: theme.palette.text.secondary, lineHeight: 1.6 },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          borderTop: `1px solid ${theme.palette.divider}`,
          backgroundColor: alpha(theme.palette.background.default, 0.5),
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: theme.palette.divider,
            color: theme.palette.text.secondary,
          }}
        >
          Close
        </Button>
        <Button
          component="a"
          href="https://docs.google.com/forms/d/1bwNTtIG-xP8QJWjUFRSY8zMtaEFWTIvDyZHDcNeKA9E/viewform"
          target="_blank"
          rel="noopener noreferrer"
          variant="contained"
          endIcon={<SendIcon />}
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            fontWeight: designTokens.typography.fontWeight.semibold,
            px: 3,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          Apply Now
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default JobDetailsModal;
