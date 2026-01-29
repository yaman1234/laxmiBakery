import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  TextField,
  MenuItem,
  Skeleton,
  Alert,
  Snackbar,
  useTheme,
  CircularProgress,
} from '@mui/material';
import { productService } from '../services/productService';
import categoryService from '../services/categoryService';
import { Product } from '../types/product';
import { Category } from '../services/categoryService';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const Products: React.FC = () => {
  const theme = useTheme();
  const location = useLocation();
  const observerTarget = useRef<HTMLDivElement>(null);

  // Read initial category from navigation state if present, else default to 'All'
  const initialCategory = location.state && location.state.category ? location.state.category : 'All';
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [openAlert, setOpenAlert] = useState(false);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        setCategoryError(null);
        const response = await categoryService.getCategories();
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

  // If navigation state changes, update selectedCategory
  useEffect(() => {
    if (location.state && location.state.category) {
      setSelectedCategory(location.state.category);
    }
  }, [location.state]);

  // Reset products when category changes
  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
  }, [selectedCategory]);

  // Fetch products
  const fetchProducts = useCallback(async (pageNum: number, isInitial: boolean = false) => {
    try {
      if (isInitial) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const limit = 12; // Load 12 products at a time
      const response = await (selectedCategory === "All"
        ? productService.getProducts(pageNum, limit)
        : productService.getProductsByCategory(selectedCategory, pageNum, limit)
      );

      if (isInitial) {
        setProducts(response.items);
      } else {
        setProducts(prev => [...prev, ...response.items]);
      }

      setHasMore(response.pagination.has_next);
    } catch (error) {
      console.error('Error fetching products:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [selectedCategory]);

  // Initial load
  useEffect(() => {
    fetchProducts(1, true);
  }, [fetchProducts]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          setPage(prev => {
            const nextPage = prev + 1;
            fetchProducts(nextPage, false);
            return nextPage;
          });
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading, loadingMore, fetchProducts]);

  const filteredProducts = products?.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
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
            }}
          />
        </Box>

        {/* Products Grid */}
        <Grid container spacing={3}>
          {loading ? (
            // Initial loading skeletons
            [...Array(12)].map((_, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box sx={{ height: '100%' }}>
                  <Skeleton variant="rectangular" height={280} />
                  <Box sx={{ p: 2 }}>
                    <Skeleton variant="text" height={32} />
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="rectangular" height={40} sx={{ mt: 2 }} />
                  </Box>
                </Box>
              </Grid>
            ))
          ) : filteredProducts && filteredProducts.length > 0 ? (
            <>
              {filteredProducts.map((product) => (
                <Grid item xs={12} sm={6} md={3} key={product._id}>
                  <ProductCard product={product} onOrderClick={handleOrderClick} />
                </Grid>
              ))}

              {/* Loading more indicator */}
              {loadingMore && (
                <>
                  {[...Array(4)].map((_, index) => (
                    <Grid item xs={12} sm={6} md={3} key={`loading-${index}`}>
                      <Box sx={{ height: '100%' }}>
                        <Skeleton variant="rectangular" height={280} />
                        <Box sx={{ p: 2 }}>
                          <Skeleton variant="text" height={32} />
                          <Skeleton variant="text" width="60%" />
                          <Skeleton variant="rectangular" height={40} sx={{ mt: 2 }} />
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </>
              )}
            </>
          ) : (
            <Grid item xs={12}>
              <Typography variant="h6" align="center" color="text.secondary">
                No products found
              </Typography>
            </Grid>
          )}
        </Grid>

        {/* Intersection Observer Target */}
        <div ref={observerTarget} style={{ height: '20px', margin: '20px 0' }} />

        {/* End of products indicator */}
        {!loading && !hasMore && products.length > 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              You've reached the end of the products list
            </Typography>
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