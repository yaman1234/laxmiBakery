import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Box,
  TextField,
  MenuItem,
  Skeleton,
  Pagination,
  Button,
  CardActions,
  Alert,
  Snackbar,
  useTheme,
  CircularProgress,
  Chip,
  Rating,
} from '@mui/material';
import { 
  WhatsApp as WhatsAppIcon,
  ShoppingCart as CartIcon,
} from '@mui/icons-material';
import { productService } from '../services/productService';
import categoryService from '../services/categoryService';
import { Product, PaginatedProducts } from '../types/product';
import { Category } from '../services/categoryService';
import { useLocation } from 'react-router-dom'; // <-- Import useLocation
import { API_BASE_URL } from '../config'; // Import API base URL for image helper

// Helper to get full image URL for images
const getImageUrl = (imgPath: string | undefined) => {
  if (!imgPath) return '/images/placeholder.jpg';
  if (imgPath.startsWith('http')) return imgPath;
  // Prepend backend API URL for /uploads/ paths
  return `${API_BASE_URL}${imgPath}`;
};

const Products: React.FC = () => {
  const theme = useTheme();
  const location = useLocation(); // <-- Get location object
  // Read initial category from navigation state if present, else default to 'All'
  const initialCategory = location.state && location.state.category ? location.state.category : 'All';
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [openAlert, setOpenAlert] = useState(false);
  const [pagination, setPagination] = useState<PaginatedProducts['pagination']>({
    page: 1,
    limit: 8,
    total_items: 0,
    total_pages: 0,
    has_next: false,
    has_prev: false
  });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        setCategoryError(null);
        console.log('Fetching categories...');
        const response = await categoryService.getCategories();
        console.log('Categories fetched:', response);
        setCategories(response.items);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategoryError('Failed to load categories');
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // If navigation state changes (e.g., user navigates from Home with a category), update selectedCategory
  useEffect(() => {
    if (location.state && location.state.category) {
      setSelectedCategory(location.state.category);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        console.log('Fetching products with category:', selectedCategory);
        const response = await (selectedCategory === "All"
          ? productService.getProducts(page, pagination.limit)
          : productService.getProductsByCategory(selectedCategory, page, pagination.limit)
        );
        console.log('Products fetched:', response);
        setProducts(response.items);
        setPagination(response.pagination);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, page]);

  const filteredProducts = products?.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleCategoryChange = (category: string) => {
    console.log('Category changed to:', category);
    setSelectedCategory(category);
    setPage(1);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleOrderClick = () => {
    setOpenAlert(true);
  };

  const handleCloseAlert = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
  };

  if (loading) {
    return (
      <Box sx={{ bgcolor: 'background.default', pt: { xs: '80px', md: '100px' } }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Grid container spacing={3}>
            {[...Array(8)].map((_, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ borderRadius: 0 }}>
                  <Skeleton variant="rectangular" height={240} />
                  <CardContent>
                    <Skeleton />
                    <Skeleton width="60%" />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    );
  }

  if (categoryError) {
    return (
      <Box sx={{ bgcolor: 'background.default', pt: { xs: '80px', md: '100px' } }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {categoryError}
          </Alert>
          <Grid container spacing={3}>
            {products?.map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product._id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    borderRadius: 0,
                    boxShadow: theme.shadows[4],
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: theme.shadows[8],
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    height={300}
                    image={getImageUrl(product.images[0])}
                    alt={product.name}
                    sx={{ 
                      objectFit: 'cover',
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1, p: 2 }}>
                    <Typography gutterBottom variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                      {product.name}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {product.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                        NRs. {product.price.toFixed(2)}
                      </Typography>
                      {product.discount > 0 && (
                        <Chip
                          label={`${product.discount}% OFF`}
                          color="secondary"
                          size="small"
                        />
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Category: {product.category}
                    </Typography>
                    {product.tags && product.tags.length > 0 && (
                      <Box sx={{ mt: 1 }}>
                        {product.tags.map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ))}
                      </Box>
                    )}
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleOrderClick}
                      startIcon={<WhatsAppIcon />}
                      sx={{
                        bgcolor: '#25D366',
                        '&:hover': {
                          bgcolor: '#128C7E',
                        },
                      }}
                    >
                      Order Now
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', pt: { xs: '80px', md: '100px' } }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Filters */}
        <Box
          sx={{ 
            mb: 4, 
            display: 'flex', 
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' },
          }}
        >
          <TextField
            select
            label="Category"
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            disabled={loadingCategories}
            error={!!categoryError}
            helperText={categoryError}
            sx={{ 
              minWidth: { xs: '100%', sm: 200 },
              bgcolor: 'background.paper',
              '& .MuiOutlinedInput-root': {
                borderRadius: 0,
              },
            }}
          >
            <MenuItem value="All">All Categories</MenuItem>
            {loadingCategories ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              categories.map((category) => (
                <MenuItem key={category._id} value={category.name}>
                  {category.name}
                </MenuItem>
              ))
            )}
          </TextField>
          
          <TextField
            label="Search Products"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ 
              flexGrow: 1,
              bgcolor: 'background.paper',
              '& .MuiOutlinedInput-root': {
                borderRadius: 0,
              },
            }}
          />
        </Box>

        {/* Products Grid */}
        <Grid container spacing={3}>
          {filteredProducts && filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product._id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    borderRadius: 0,
                    boxShadow: theme.shadows[4],
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: theme.shadows[8],
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={getImageUrl(product.images[0])}
                    alt={product.name}
                  />
                  <CardContent sx={{ flexGrow: 1, p: 2 }}>
                    <Typography gutterBottom variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                      {product.name}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {product.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                        NRs. {product.price.toFixed(2)}
                      </Typography>
                      {product.discount > 0 && (
                        <Chip
                          label={`${product.discount}% OFF`}
                          color="secondary"
                          size="small"
                        />
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Category: {product.category}
                    </Typography>
                    {product.tags && product.tags.length > 0 && (
                      <Box sx={{ mt: 1 }}>
                        {product.tags.map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ))}
                      </Box>
                    )}
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleOrderClick}
                      startIcon={<WhatsAppIcon />}
                      sx={{
                        bgcolor: '#25D366',
                        '&:hover': {
                          bgcolor: '#128C7E',
                        },
                      }}
                    >
                      Order Now
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="h6" align="center" color="text.secondary">
                No products found
              </Typography>
            </Grid>
          )}
        </Grid>

        {/* Pagination */}
        {!loading && pagination.total_pages > 1 && (
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              count={pagination.total_pages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
              sx={{
                '& .MuiPaginationItem-root': {
                  fontSize: '1rem',
                },
              }}
            />
          </Box>
        )}

        {/* WhatsApp Alert */}
        <Snackbar
          open={openAlert}
          autoHideDuration={6000}
          onClose={handleCloseAlert}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseAlert}
            severity="info"
            variant="filled"
            sx={{
              width: '100%',
              bgcolor: 'primary.main',
              '& .MuiAlert-icon': {
                color: 'white',
              },
            }}
          >
            Please use WhatsApp to place your order. We'll respond promptly!
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default Products; 