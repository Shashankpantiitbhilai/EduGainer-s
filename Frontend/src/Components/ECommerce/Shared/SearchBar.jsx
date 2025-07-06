import React, { useState } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Autocomplete,
  Paper,
  Typography,
  Chip,
  useTheme
} from '@mui/material';
import {
  Search,
  Clear,
  History,
  TrendingUp
} from '@mui/icons-material';
import { debounce } from '../../../utils/ecommerce/helpers';
import { userProductService } from '../../../services/ecommerce';

const SearchBar = ({
  onSearch,
  onSuggestionClick,
  placeholder = "Search for courses, books, software...",
  variant = 'outlined',
  size = 'medium',
  fullWidth = true,
  showSuggestions = true,
  showHistory = true
}) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // Debounced search function
  const debouncedSearch = debounce(async (query) => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await userProductService.searchProducts(query, {
        limit: 5,
        suggestions: true
      });
      
      if (response.success) {
        setSuggestions(response.data.suggestions || []);
      }
    } catch (error) {
      console.error('Search suggestions error:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, 300);

  const handleInputChange = (event, value) => {
    setSearchTerm(value);
    if (showSuggestions) {
      debouncedSearch(value);
    }
  };

  const handleSearch = (searchValue = searchTerm) => {
    if (!searchValue.trim()) return;

    // Add to search history
    if (showHistory) {
      const newHistory = [searchValue, ...searchHistory.filter(item => item !== searchValue)].slice(0, 5);
      setSearchHistory(newHistory);
      localStorage.setItem('edugainer_search_history', JSON.stringify(newHistory));
    }

    onSearch && onSearch(searchValue);
    setOpen(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.name || suggestion);
    onSuggestionClick && onSuggestionClick(suggestion);
    handleSearch(suggestion.name || suggestion);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSuggestions([]);
    setOpen(false);
  };

  // Load search history on component mount
  React.useEffect(() => {
    if (showHistory) {
      const savedHistory = localStorage.getItem('edugainer_search_history');
      if (savedHistory) {
        setSearchHistory(JSON.parse(savedHistory));
      }
    }
  }, [showHistory]);

  const renderSuggestions = () => {
    const items = [];

    // Add search history
    if (showHistory && searchHistory.length > 0 && !searchTerm) {
      items.push(
        <Box key="history-header" sx={{ p: 2, pb: 1 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <History fontSize="small" />
            Recent Searches
          </Typography>
        </Box>
      );

      searchHistory.forEach((item, index) => {
        items.push(
          <Box
            key={`history-${index}`}
            sx={{
              p: 2,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: theme.palette.action.hover
              }
            }}
            onClick={() => handleSuggestionClick(item)}
          >
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <History fontSize="small" color="action" />
              {item}
            </Typography>
          </Box>
        );
      });
    }

    // Add search suggestions
    if (suggestions.length > 0) {
      if (items.length > 0) {
        items.push(<Box key="divider" sx={{ borderTop: `1px solid ${theme.palette.divider}`, mx: 2 }} />);
      }

      items.push(
        <Box key="suggestions-header" sx={{ p: 2, pb: 1 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUp fontSize="small" />
            Suggestions
          </Typography>
        </Box>
      );

      suggestions.forEach((suggestion, index) => {
        items.push(
          <Box
            key={`suggestion-${index}`}
            sx={{
              p: 2,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: theme.palette.action.hover
              }
            }}
            onClick={() => handleSuggestionClick(suggestion)}
          >
            <Typography variant="body2">
              {suggestion.name || suggestion}
            </Typography>
            {suggestion.category && (
              <Chip
                label={suggestion.category}
                size="small"
                variant="outlined"
                sx={{ mt: 0.5, fontSize: '0.7rem', height: 20 }}
              />
            )}
          </Box>
        );
      });
    }

    return items;
  };

  return (
    <Box sx={{ position: 'relative', width: fullWidth ? '100%' : 'auto' }}>
      <Autocomplete
        freeSolo
        open={open && (suggestions.length > 0 || (showHistory && searchHistory.length > 0))}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        inputValue={searchTerm}
        onInputChange={handleInputChange}
        options={[]}
        loading={loading}
        PaperComponent={({ children, ...props }) => (
          <Paper {...props} sx={{ mt: 1, maxHeight: 400, overflow: 'auto' }}>
            {renderSuggestions()}
          </Paper>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={placeholder}
            variant={variant}
            size={size}
            fullWidth={fullWidth}
            onKeyPress={handleKeyPress}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {searchTerm && (
                    <IconButton
                      size="small"
                      onClick={clearSearch}
                      edge="end"
                    >
                      <Clear />
                    </IconButton>
                  )}
                  <IconButton
                    size="small"
                    onClick={() => handleSearch()}
                    edge="end"
                    sx={{ ml: 0.5 }}
                  >
                    <Search />
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                backgroundColor: theme.palette.background.paper,
                '&:hover': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main
                  }
                }
              }
            }}
          />
        )}
      />
    </Box>
  );
};

export { SearchBar };
export default SearchBar;
