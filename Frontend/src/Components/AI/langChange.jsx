import React, { useState } from 'react';
import { 
  Button,
 
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
 
  Box,
  Fade
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import CheckIcon from '@mui/icons-material/Check';

const LanguageSelector = ({ onLanguageChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const open = Boolean(anchorEl);

const languages = [
  { code: 'en', name: 'English', label: '🇮🇳 English' },
  { code: 'hi', name: 'हिंदी', label: '🇮🇳 हिंदी' },
  { code: 'bn', name: 'Bengali', label: '🇮🇳 বাংলা' },
  { code: 'te', name: 'Telugu', label: '🇮🇳 తెలుగు' },
  { code: 'mr', name: 'Marathi', label: '🇮🇳 मराठी' },
  { code: 'ta', name: 'Tamil', label: '🇮🇳 தமிழ்' },
  { code: 'ur', name: 'Urdu', label: '🇮🇳 اردو' },
  { code: 'gu', name: 'Gujarati', label: '🇮🇳 ગુજરાતી' },
  { code: 'pa', name: 'Punjabi', label: '🇮🇳 ਪੰਜਾਬੀ' },
  { code: 'kn', name: 'Kannada', label: '🇮🇳 ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', label: '🇮🇳 മലയാളം' },
  { code: 'or', name: 'Odia', label: '🇮🇳 ଓଡ଼ିଆ' },
  { code: 'as', name: 'Assamese', label: '🇮🇳 অসমীয়া' },
  { code: 'ma', name: 'Maithili', label: '🇮🇳 मैथिली' },
  { code: 'bh', name: 'Bhojpuri', label: '🇮🇳 भोजपुरी' },
  { code: 'si', name: 'Sinhala', label: '🇱🇰 සිංහල' },
  { code: 'sd', name: 'Sindhi', label: '🇮🇳 سنڌي' },
  { code: 'ne', name: 'Nepali', label: '🇮🇳 नेपाली' },
  { code: 'km', name: 'Konkani', label: '🇮🇳 कोंकणी' },
  { code: 'ks', name: 'Kashmiri', label: '🇮🇳 कश्मीरी' },
  { code: 'sa', name: 'Sanskrit', label: '🇮🇳 संस्कृत' },
  { code: 'z', name: 'Santali', label: '🇮🇳 ସାନ୍ତାଳୀ' },
  { code: 'bo', name: 'Bodo', label: '🇮🇳 बोडो' },
  { code: 'br', name: 'Braj', label: '🇮🇳 ब्रज' },
  { code: 'v', name: 'Vysya', label: '🇮🇳 व्यास' },
  { code: 'de', name: 'Dogri', label: '🇮🇳 डोगरी' },
  { code: 'l', name: 'Ladakhi', label: '🇮🇳 लद्दाखी' }
];

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language.name);
    if (onLanguageChange) {
      onLanguageChange(language.code);
    }
    handleClose();
  };

  return (
    <Box>
      <Button
        id="language-button"
        aria-controls={open ? 'language-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        startIcon={<LanguageIcon />}
        sx={{
          minWidth: 140,
          justifyContent: 'flex-start',
          textTransform: 'none',
          color: 'text.primary',
          '&:hover': {
            backgroundColor: 'action.hover',
          }
        }}
      >
        {selectedLanguage}
      </Button>
      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
        MenuListProps={{
          'aria-labelledby': 'language-button',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          elevation: 3,
          sx: {
            minWidth: 200,
            mt: 1,
          }
        }}
      >
        {languages.map((language) => (
          <MenuItem
            key={language.code}
            selected={selectedLanguage === language.name}
            onClick={() => handleLanguageSelect(language)}
            sx={{
              minHeight: 48,
              px: 2,
              '&.Mui-selected': {
                backgroundColor: 'primary.lighter',
                '&:hover': {
                  backgroundColor: 'primary.light',
                },
              },
            }}
          >
            <ListItemText 
              primary={language.label}
              sx={{ mr: 2 }}
            />
            {selectedLanguage === language.name && (
              <ListItemIcon sx={{ minWidth: 'auto' }}>
                <CheckIcon fontSize="small" color="primary" />
              </ListItemIcon>
            )}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default LanguageSelector;