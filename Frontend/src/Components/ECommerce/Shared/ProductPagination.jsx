import React from 'react';
import {
  Box,
  Typography,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme
} from '@mui/material';

const ProductPagination = ({
  currentPage = 1,
  totalPages = 1,
  pageSize = 12,
  totalItems = 0,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [12, 24, 48],
  showPageSize = true,
  showItemCount = true,
  variant = 'outlined' // 'outlined', 'text'
}) => {
  const theme = useTheme();

  const handlePageChange = (event, page) => {
    onPageChange && onPageChange(page);
  };

  const handlePageSizeChange = (event) => {
    onPageSizeChange && onPageSizeChange(event.target.value);
  };

  const getItemRange = () => {
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalItems);
    return { start, end };
  };

  const { start, end } = getItemRange();

  if (totalItems === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2,
        py: 2,
        px: 1
      }}
    >
      {/* Item count and page size selector */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        {showItemCount && (
          <Typography variant="body2" color="text.secondary">
            Showing {start}-{end} of {totalItems} products
          </Typography>
        )}

        {showPageSize && (
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Per page</InputLabel>
            <Select
              value={pageSize}
              onChange={handlePageSizeChange}
              label="Per page"
              variant={variant}
            >
              {pageSizeOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          variant={variant}
          color="primary"
          size="medium"
          showFirstButton
          showLastButton
          sx={{
            '& .MuiPaginationItem-root': {
              fontWeight: 500
            },
            '& .MuiPaginationItem-page.Mui-selected': {
              backgroundColor: theme.palette.primary.main,
              color: 'white',
              '&:hover': {
                backgroundColor: theme.palette.primary.dark
              }
            }
          }}
        />
      )}
    </Box>
  );
};

export { ProductPagination };
export default ProductPagination;
