import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Slider,
  Rating,
  Chip,
  Button,
  Divider,
  useTheme,
  useMediaQuery,
  Drawer,
  IconButton
} from '@mui/material';
import {
  ExpandMore,
  Clear,
  Category,
  AttachMoney,
  Star,
  Inventory,
  Close
} from '@mui/icons-material';
import { formatCurrency } from '../../../utils/ecommerce/helpers';
import { PRODUCT_TYPES } from '../../../utils/ecommerce/constants';

const ProductFilters = ({
  filters = {},
  onFiltersChange,
  categories = [],
  priceRange = { min: 0, max: 10000 },
  showClearAll = true,
  compact = false,
  isDrawer = false,
  onClose
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [localFilters, setLocalFilters] = useState({
    categories: [],
    priceRange: [priceRange.min, priceRange.max],
    rating: 0,
    productTypes: [],
    inStock: false,
    ...filters
  });

  const [expanded, setExpanded] = useState({
    categories: true,
    price: true,
    rating: true,
    type: true,
    availability: true
  });

  useEffect(() => {
    onFiltersChange && onFiltersChange(localFilters);
  }, [localFilters, onFiltersChange]);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(prev => ({
      ...prev,
      [panel]: isExpanded
    }));
  };

  const handleCategoryChange = (categoryId) => {
    setLocalFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  const handlePriceChange = (event, newValue) => {
    setLocalFilters(prev => ({
      ...prev,
      priceRange: newValue
    }));
  };

  const handleRatingChange = (event, newValue) => {
    setLocalFilters(prev => ({
      ...prev,
      rating: newValue
    }));
  };

  const handleProductTypeChange = (type) => {
    setLocalFilters(prev => ({
      ...prev,
      productTypes: prev.productTypes.includes(type)
        ? prev.productTypes.filter(t => t !== type)
        : [...prev.productTypes, type]
    }));
  };

  const handleStockChange = (event) => {
    setLocalFilters(prev => ({
      ...prev,
      inStock: event.target.checked
    }));
  };

  const clearAllFilters = () => {
    setLocalFilters({
      categories: [],
      priceRange: [priceRange.min, priceRange.max],
      rating: 0,
      productTypes: [],
      inStock: false
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (localFilters.categories.length > 0) count++;
    if (localFilters.priceRange[0] > priceRange.min || localFilters.priceRange[1] < priceRange.max) count++;
    if (localFilters.rating > 0) count++;
    if (localFilters.productTypes.length > 0) count++;
    if (localFilters.inStock) count++;
    return count;
  };

  const renderCategoryFilter = () => (
    <Accordion 
      expanded={expanded.categories} 
      onChange={handleAccordionChange('categories')}
      elevation={0}
    >
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Category color="action" />
          <Typography variant="subtitle1" fontWeight={600}>
            Categories
          </Typography>
          {localFilters.categories.length > 0 && (
            <Chip 
              label={localFilters.categories.length} 
              size="small" 
              color="primary" 
            />
          )}
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <FormGroup>
          {categories.map((category) => (
            <FormControlLabel
              key={category._id}
              control={
                <Checkbox
                  checked={localFilters.categories.includes(category._id)}
                  onChange={() => handleCategoryChange(category._id)}
                  size="small"
                />
              }
              label={
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <Typography variant="body2">{category.name}</Typography>
                  {category.productCount && (
                    <Typography variant="caption" color="text.secondary">
                      ({category.productCount})
                    </Typography>
                  )}
                </Box>
              }
              sx={{ width: '100%', mr: 0 }}
            />
          ))}
        </FormGroup>
      </AccordionDetails>
    </Accordion>
  );

  const renderPriceFilter = () => (
    <Accordion 
      expanded={expanded.price} 
      onChange={handleAccordionChange('price')}
      elevation={0}
    >
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AttachMoney color="action" />
          <Typography variant="subtitle1" fontWeight={600}>
            Price Range
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ px: 1 }}>
          <Slider
            value={localFilters.priceRange}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => formatCurrency(value)}
            min={priceRange.min}
            max={priceRange.max}
            step={100}
            marks={[
              { value: priceRange.min, label: formatCurrency(priceRange.min) },
              { value: priceRange.max, label: formatCurrency(priceRange.max) }
            ]}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {formatCurrency(localFilters.priceRange[0])}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatCurrency(localFilters.priceRange[1])}
            </Typography>
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );

  const renderRatingFilter = () => (
    <Accordion 
      expanded={expanded.rating} 
      onChange={handleAccordionChange('rating')}
      elevation={0}
    >
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Star color="action" />
          <Typography variant="subtitle1" fontWeight={600}>
            Rating
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {[4, 3, 2, 1].map((rating) => (
            <FormControlLabel
              key={rating}
              control={
                <Checkbox
                  checked={localFilters.rating === rating}
                  onChange={() => handleRatingChange(null, rating)}
                  size="small"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Rating value={rating} readOnly size="small" />
                  <Typography variant="body2">& above</Typography>
                </Box>
              }
            />
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );

  const renderTypeFilter = () => (
    <Accordion 
      expanded={expanded.type} 
      onChange={handleAccordionChange('type')}
      elevation={0}
    >
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Category color="action" />
          <Typography variant="subtitle1" fontWeight={600}>
            Product Type
          </Typography>
          {localFilters.productTypes.length > 0 && (
            <Chip 
              label={localFilters.productTypes.length} 
              size="small" 
              color="primary" 
            />
          )}
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <FormGroup>
          {Object.values(PRODUCT_TYPES).map((type) => (
            <FormControlLabel
              key={type}
              control={
                <Checkbox
                  checked={localFilters.productTypes.includes(type)}
                  onChange={() => handleProductTypeChange(type)}
                  size="small"
                />
              }
              label={
                <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                  {type.replace('_', ' ')}
                </Typography>
              }
            />
          ))}
        </FormGroup>
      </AccordionDetails>
    </Accordion>
  );

  const renderAvailabilityFilter = () => (
    <Accordion 
      expanded={expanded.availability} 
      onChange={handleAccordionChange('availability')}
      elevation={0}
    >
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Inventory color="action" />
          <Typography variant="subtitle1" fontWeight={600}>
            Availability
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={localFilters.inStock}
                onChange={handleStockChange}
                size="small"
              />
            }
            label="In Stock Only"
          />
        </FormGroup>
      </AccordionDetails>
    </Accordion>
  );

  return (
    <Paper 
      sx={{ 
        p: compact ? 1 : 2, 
        height: 'fit-content',
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight={700}>
          Filters
          {getActiveFiltersCount() > 0 && (
            <Chip 
              label={getActiveFiltersCount()} 
              size="small" 
              color="primary" 
              sx={{ ml: 1 }}
            />
          )}
        </Typography>
        {showClearAll && getActiveFiltersCount() > 0 && (
          <Button
            size="small"
            startIcon={<Clear />}
            onClick={clearAllFilters}
            color="secondary"
          >
            Clear All
          </Button>
        )}
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Filter Sections */}
      <Box sx={{ '& .MuiAccordion-root': { boxShadow: 'none', border: 'none' } }}>
        {renderCategoryFilter()}
        {renderPriceFilter()}
        {renderRatingFilter()}
        {renderTypeFilter()}
        {renderAvailabilityFilter()}
      </Box>
    </Paper>
  );
};

export { ProductFilters };
export default ProductFilters;
