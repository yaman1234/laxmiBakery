import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Skeleton,
  Rating,
  Avatar,
  useTheme,
  Paper,
  Divider,
  TextField,
  IconButton,
  useMediaQuery,
  Alert,
  Snackbar,
} from '@mui/material';
import { ArrowForward as ArrowForwardIcon, WhatsApp as WhatsAppIcon } from '@mui/icons-material';
import { productService } from '../services/productService';
import { Product } from '../types/product';
import categoryService, { Category } from '../services/categoryService'; // Import category service and type
import { useNavigate } from 'react-router-dom'; // For navigation on card click
import { API_BASE_URL } from '../config'; // Import API base URL for image helper
import 'slick-carousel/slick/slick.css'; // Import slick-carousel base CSS
import 'slick-carousel/slick/slick-theme.css'; // Import slick-carousel theme CSS
import ShopByFlavor from '../components/ShopByFlavor'; // Import ShopByFlavor component

// SVG Wave Divider Component
const WaveDivider = () => (
  <Box
    sx={{
      width: '100%',
      height: '50px',
      overflow: 'hidden',
      position: 'relative',
    }}
  >
    <svg
      viewBox="0 0 500 150"
      preserveAspectRatio="none"
      style={{ height: '100%', width: '100%' }}
    >
      <path
        d="M0.00,49.98 C149.99,150.00 349.20,-49.98 500.00,49.98 L500.00,150.00 L0.00,150.00 Z"
        style={{ stroke: 'none', fill: '#f9f6f2' }}
      />
    </svg>
  </Box>
);

// Remove testimonials data

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [openAlert, setOpenAlert] = useState(false);
  // State for categories
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const navigate = useNavigate(); // For navigation

  // Fetch featured products
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await productService.getProducts(1, 3);
        setFeaturedProducts(response.items);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedProducts();
  }, []);

  // Fetch categories for the Categories section
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        setCategoryError(null);
        const response = await categoryService.getCategories();
        setCategories(response.items);
      } catch (error) {
        setCategoryError('Failed to load categories');
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Handle click on a category card
  const handleCategoryClick = (categoryName: string) => {
    // Navigate to /products with selected category in navigation state
    navigate('/products', { state: { category: categoryName } });
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

  // Helper to get full image URL for category images
  const getImageUrl = (imgPath: string | undefined) => {
    if (!imgPath) return '/images/placeholder.jpg';
    if (imgPath.startsWith('http')) return imgPath;
    // Prepend backend API URL for /uploads/ paths
    return `${API_BASE_URL}${imgPath}`;
  };

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          minHeight: '40vh',
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(rgba(124,58,106,0.7), rgba(124,58,106,0.4)), url(/images/hero-image.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat',
          color: 'white',
          pt: { xs: '64px', md: '72px' },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%)',
            zIndex: 1,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '100px',
            background: 'linear-gradient(transparent, rgba(249,246,242,1))',
            zIndex: 1,
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8} lg={6}>
              <Box
                sx={{
                  p: { xs: 3, md: 6 },
                  textAlign: { xs: 'center', md: 'left' },
                }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    color: 'white',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                    mb: 2,
                  }}
                >
                  Artisanal Baking Excellence
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: 'white',
                    mb: 4,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                    fontFamily: 'Lato, sans-serif',
                    lineHeight: 1.6,
                  }}
                >
                  Discover our handcrafted breads, exquisite pastries, and celebration cakes.
                  Each creation tells a story of tradition, innovation, and pure indulgence.
                </Typography>
                <Button
                  component={RouterLink}
                  to="/products"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    bgcolor: 'gold.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'gold.dark',
                    },
                  }}
                >
                  Explore Our Collection
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Shop by Flavor Section */}
      <ShopByFlavor />

      {/* Featured Products */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h2"
            gutterBottom
            sx={{
              position: 'relative',
              display: 'inline-block',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -16,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 80,
                height: 2,
                bgcolor: 'primary.main',
              },
            }}
          >
            Signature Creations
          </Typography>
        </Box>
        <Grid container spacing={3}>
          {loading ? (
            // Loading skeletons
            [1, 2, 3, 4].map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item}>
                <Card sx={{ height: '100%' }}>
                  <Skeleton variant="rectangular" height={240} />
                  <CardContent>
                    <Skeleton variant="text" height={32} />
                    <Skeleton variant="text" />
                    <Skeleton variant="text" width="60%" />
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            // Actual products
            featuredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product._id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={product.images[0] || '/images/placeholder.jpg'}
                    alt={product.name}
                    sx={{
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center', py: 2 }}>
                    <Typography variant="h6" gutterBottom component="h3">
                      {product.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {product.description}
                    </Typography>
                    <Typography
                      variant="h6"
                      color="primary"
                      sx={{ fontFamily: 'Lato, sans-serif' }}
                    >
                      ₹{product.price.toFixed(2)}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <Button
                      onClick={handleOrderClick}
                      variant="contained"
                      color="primary"
                      size="large"
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
          )}
        </Grid>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            component={RouterLink}
            to="/products"
            variant="outlined"
            color="primary"
            size="large"
            endIcon={<ArrowForwardIcon />}
            sx={{
              px: 4,
              py: 1.5,
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
              },
            }}
          >
            View More Creations
          </Button>
        </Box>
      </Container>

      {/* Categories Section - Now placed below Signature Creations */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h2"
            gutterBottom
            sx={{
              position: 'relative',
              display: 'inline-block',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -16,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 80,
                height: 2,
                bgcolor: 'secondary.main',
              },
            }}
          >
            Categories
          </Typography>
        </Box>
        {loadingCategories ? (
          <Grid container spacing={3}>
            {[1, 2, 3, 4].map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item}>
                <Card sx={{ height: 280 }}>
                  <Skeleton variant="rectangular" height={220} />
                  <CardContent>
                    <Skeleton variant="text" height={32} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : categoryError ? (
          <Alert severity="error">{categoryError}</Alert>
        ) : (
          <Grid container spacing={3}>
            {categories.map((category) => (
              <Grid item xs={12} sm={6} md={3} key={category._id}>
                {/* Category Card: rectangular, name below image, no description */}
                <Box
                  className="category-card-hover"
                  sx={{
                    position: 'relative',
                    borderRadius: 1, // Less border radius for rectangular look
                    overflow: 'hidden',
                    boxShadow: 6,
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-8px) scale(1.04)',
                      boxShadow: 12,
                    },
                  }}
                  onClick={() => handleCategoryClick(category.name)}
                >
                  {/* Emphasized Image (edge-to-edge, rectangular) */}
                  <Box sx={{ position: 'relative', width: '100%', height: 220, overflow: 'hidden' }}>
                    <img
                      src={getImageUrl(category.images && category.images[0])}
                      alt={category.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)',
                        boxShadow: '0 8px 32px rgba(124,58,106,0.12)',
                      }}
                    />
                  </Box>
                  {/* Category Name below the image, not overlayed, no description */}
                  <Box
                    sx={{
                      width: '100%',
                      bgcolor: 'background.paper',
                      color: 'text.primary',
                      py: 2,
                      px: 2,
                      textAlign: 'center',
                      zIndex: 3,
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 1 }}>{category.name}</Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Remove About Section (Our Heritage) and Testimonials Section (Customer Experiences) */}

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

      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </Box>
  );
};

export default Home; 