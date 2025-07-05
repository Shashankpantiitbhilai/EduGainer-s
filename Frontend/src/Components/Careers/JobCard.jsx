import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Button,
  Avatar,
  useTheme,
  alpha,
  Stack,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  AttachMoney as MoneyIcon,
  People as PeopleIcon,
  AccessTime as AccessTimeIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { designTokens } from '../../theme/enterpriseTheme';

const JobCard = ({ job, onJobClick }) => {
  const theme = useTheme();

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: designTokens.borderRadius.lg,
        transition: `all ${designTokens.animation.duration.normal}`,
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: `0 16px 48px ${alpha(theme.palette.primary.main, 0.15)}`,
          borderColor: theme.palette.primary.main,
          '& .job-card-header': {
            backgroundColor: alpha(theme.palette.primary.main, 0.05),
          },
          '& .apply-button': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
          },
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        },
      }}
      onClick={() => onJobClick(job)}
    >
      <CardContent sx={{ flex: 1, p: 3 }}>
        {/* Header */}
        <Box
          className="job-card-header"
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 2,
            mb: 3,
            p: 2,
            borderRadius: designTokens.borderRadius.md,
            backgroundColor: alpha(theme.palette.background.default, 0.5),
            transition: `all ${designTokens.animation.duration.normal}`,
          }}
        >
          <Avatar
            sx={{
              width: 48,
              height: 48,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
            }}
          >
            <BusinessIcon />
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: designTokens.typography.fontWeight.bold,
                mb: 0.5,
                color: theme.palette.text.primary,
                lineHeight: 1.3,
              }}
            >
              {job.title}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: designTokens.typography.fontWeight.medium,
              }}
            >
              {job.department}
            </Typography>
          </Box>
          <Chip
            label={job.type}
            size="small"
            sx={{
              backgroundColor: alpha(theme.palette.secondary.main, 0.1),
              color: theme.palette.secondary.main,
              fontWeight: designTokens.typography.fontWeight.semibold,
              borderRadius: designTokens.borderRadius.md,
            }}
          />
        </Box>

        {/* Job Details */}
        <Stack spacing={2} sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationIcon
              sx={{
                fontSize: 18,
                color: theme.palette.text.secondary,
              }}
            />
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: designTokens.typography.fontWeight.medium,
              }}
            >
              {job.location}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ScheduleIcon
              sx={{
                fontSize: 18,
                color: theme.palette.text.secondary,
              }}
            />
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: designTokens.typography.fontWeight.medium,
              }}
            >
              {job.duration}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MoneyIcon
              sx={{
                fontSize: 18,
                color: theme.palette.text.secondary,
              }}
            />
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: designTokens.typography.fontWeight.medium,
              }}
            >
              {job.stipend}
            </Typography>
          </Box>
        </Stack>

        {/* Description */}
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            mb: 3,
            lineHeight: 1.6,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {job.description}
        </Typography>

        {/* Tech Stack */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.text.secondary,
              fontWeight: designTokens.typography.fontWeight.semibold,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              mb: 1,
              display: 'block',
            }}
          >
            Tech Stack
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {job.techStack.slice(0, 4).map((tech, index) => (
              <Chip
                key={index}
                label={tech}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: '0.7rem',
                  height: 24,
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                  color: theme.palette.text.secondary,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  },
                }}
              />
            ))}
            {job.techStack.length > 4 && (
              <Chip
                label={`+${job.techStack.length - 4} more`}
                size="small"
                sx={{
                  fontSize: '0.7rem',
                  height: 24,
                  backgroundColor: alpha(theme.palette.text.secondary, 0.1),
                  color: theme.palette.text.secondary,
                }}
              />
            )}
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AccessTimeIcon sx={{ fontSize: 14, color: theme.palette.text.secondary }} />
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                {job.posted}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <PeopleIcon sx={{ fontSize: 14, color: theme.palette.text.secondary }} />
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                {job.applications} applicants
              </Typography>
            </Box>
          </Box>

          <Button
            className="apply-button"
            variant="outlined"
            size="small"
            sx={{
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              fontWeight: designTokens.typography.fontWeight.semibold,
              transition: `all ${designTokens.animation.duration.normal}`,
              '&:hover': {
                borderColor: theme.palette.primary.main,
              },
            }}
          >
            View Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default JobCard;
