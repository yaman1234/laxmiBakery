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
  Chip,
  useTheme,
  useMediaQuery,
  Alert,
} from '@mui/material';
import { ArrowForward as ArrowForwardIcon, WhatsApp as WhatsAppIcon } from '@mui/icons-material';
import { productService } from '../services/productService';
import { Product } from '../types/product';

const ShopByFlavor: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFlavor, setSelectedFlavor] = useState<string>('');

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch products (backend max limit is 50)
        const response = await productService.getProducts(1, 50);
        setProducts(response.items);

        // Set the first flavor as default if available
        if (response.items.length > 0) {
          const flavors = getUniqueFlavors(response.items);
          if (flavors.length > 0) {
            setSelectedFlavor(flavors[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Extract unique flavors from products
  const getUniqueFlavors = (productList: Product[]): string[] => {
    const flavors = productList
      .map(p => p.flavour)
      .filter((flavor): flavor is string => !!flavor && flavor.trim() !== '');
    return Array.from(new Set(flavors));
  };

  // Get products for the selected flavor (limit to 8)
  const getFilteredProducts = (): Product[] => {
    if (!selectedFlavor) return [];
    return products
      .filter(p => p.flavour === selectedFlavor)
      .slice(0, 8);
  };

  const uniqueFlavors = getUniqueFlavors(products);
  const filteredProducts = getFilteredProducts();

  const handleFlavorClick = (flavor: string) => {
    setSelectedFlavor(flavor);
  };

  const handleOrderClick = () => {
    // Could show a snackbar or modal
    alert('Please use WhatsApp to place your order. We\'ll respond promptly!');
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Skeleton variant="text" width={300} height={60} sx={{ mx: 'auto' }} />
        </Box>
        <Box sx={{ display: 'flex', gap: 1, mb: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[1, 2, 3, 4].map((item) => (
            <Skeleton key={item} variant="rectangular" width={100} height={40} sx={{ borderRadius: 2 }} />
          ))}
        </Box>
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item}>
              <Card sx={{ height: '100%' }}>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton variant="text" height={32} />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" width="60%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (uniqueFlavors.length === 0) {
    return null; // Don't show section if no flavors available
  }

  return (
    <Box sx={{ bgcolor: '#f9f6f2', py: { xs: 4, md: 8 } }}>
      <Container maxWidth="lg">
        {/* Section Header */}
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
            Shop by Flavor
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mt: 3, maxWidth: 600, mx: 'auto' }}
          >
            Explore our delicious creations organized by your favorite flavors
          </Typography>
        </Box>

        {/* Flavor Tabs */}
        <Box
          sx={{
            display: 'flex',
            gap: 1.5,
            mb: 5,
            justifyContent: 'center',
            flexWrap: 'wrap',
            overflowX: isMobile ? 'auto' : 'visible',
            pb: isMobile ? 1 : 0,
          }}
        >
          {uniqueFlavors.map((flavor) => (
            <Chip
              key={flavor}
              label={flavor}
              onClick={() => handleFlavorClick(flavor)}
              color={selectedFlavor === flavor ? 'primary' : 'default'}
              variant={selectedFlavor === flavor ? 'filled' : 'outlined'}
              sx={{
                fontSize: '1rem',
                fontWeight: selectedFlavor === flavor ? 600 : 400,
                py: 2.5,
                px: 1,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 2,
                },
                ...(selectedFlavor === flavor && {
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                }),
              }}
            />
          ))}
        </Box>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <Grid container spacing={3}>
            {filteredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product._id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 8,
                    },
                  }}
                >
                  {/* Discount Badge */}
                  {product.discount > 0 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        bgcolor: 'error.main',
                        color: 'white',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        zIndex: 1,
                      }}
                    >
                      -{product.discount}%
                    </Box>
                  )}

                  <CardMedia
                    component="img"
                    height="200"
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
                        mb: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: '40px',
                      }}
                    >
                      {product.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                      {product.discount > 0 ? (
                        <>
                          <Typography
                            variant="body2"
                            sx={{
                              textDecoration: 'line-through',
                              color: 'text.secondary',
                            }}
                          >
                            ₹{product.price.toFixed(2)}
                          </Typography>
                          <Typography
                            variant="h6"
                            color="primary"
                            sx={{ fontFamily: 'Lato, sans-serif', fontWeight: 700 }}
                          >
                            ₹{(product.price * (1 - product.discount / 100)).toFixed(2)}
                          </Typography>
                        </>
                      ) : (
                        <Typography
                          variant="h6"
                          color="primary"
                          sx={{ fontFamily: 'Lato, sans-serif' }}
                        >
                          ₹{product.price.toFixed(2)}
                        </Typography>
                      )}
                    </Box>
                  </CardContent>

                  <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <Button
                      onClick={handleOrderClick}
                      variant="contained"
                      color="primary"
                      size="medium"
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
        ) : (
          <Alert severity="info">No products available for this flavor.</Alert>
        )}

        {/* View All Button */}
        {filteredProducts.length === 8 && (
          <Box sx={{ textAlign: 'center', mt: 5 }}>
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
              View All Products
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default ShopByFlavor;
