import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
  Paper,
  useTheme,
} from '@mui/material';

// Hero section background
const heroImage = '/images/hero-bakery.jpg'; // You'll need to add this image

const Home: React.FC = () => {
  const theme = useTheme();

  // Mock featured products (replace with API data later)
  const featuredProducts = [
    {
      id: 1,
      name: 'Classic Chocolate Cake',
      image: '/images/chocolate-cake.jpg',
      description: 'Rich chocolate layers with smooth ganache',
      price: '₹599',
    },
    {
      id: 2,
      name: 'Butter Cookies',
      image: '/images/butter-cookies.jpg',
      description: 'Crispy, melt-in-mouth butter cookies',
      price: '₹199',
    },
    {
      id: 3,
      name: 'Fresh Bread',
      image: '/images/bread.jpg',
      description: 'Freshly baked whole wheat bread',
      price: '₹49',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: '70vh',
          display: 'flex',
          alignItems: 'center',
          bgcolor: 'grey.800',
          color: 'white',
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              component="h1"
              variant="h2"
              color="inherit"
              gutterBottom
            >
              Welcome to Laxmi Bakery
            </Typography>
            <Typography variant="h5" color="inherit" paragraph>
              Bringing sweetness to your life with our freshly baked delights
            </Typography>
            <Button
              component={RouterLink}
              to="/products"
              variant="contained"
              size="large"
              sx={{ mt: 4 }}
            >
              Explore Our Products
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Featured Products Section */}
      <Container sx={{ py: 8 }} maxWidth="lg">
        <Typography
          component="h2"
          variant="h3"
          align="center"
          color="text.primary"
          gutterBottom
        >
          Featured Products
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {featuredProducts.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: '0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6,
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image}
                  alt={product.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h3">
                    {product.name}
                  </Typography>
                  <Typography color="text.secondary" paragraph>
                    {product.description}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {product.price}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* About Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography component="h2" variant="h3" gutterBottom>
                Our Story
              </Typography>
              <Typography variant="h6" color="text.secondary" paragraph>
                Since 1990, Laxmi Bakery has been serving the community with
                freshly baked goods made from the finest ingredients.
              </Typography>
              <Typography color="text.secondary" paragraph>
                Our commitment to quality and traditional recipes, passed down
                through generations, ensures that every bite brings joy and
                satisfaction to our customers.
              </Typography>
              <Button
                component={RouterLink}
                to="/contact"
                variant="outlined"
                size="large"
                sx={{ mt: 2 }}
              >
                Contact Us
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  bgcolor: 'background.paper',
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="h4" color="primary" gutterBottom>
                      30+
                    </Typography>
                    <Typography variant="subtitle1">Years of Experience</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h4" color="primary" gutterBottom>
                      50+
                    </Typography>
                    <Typography variant="subtitle1">Product Varieties</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h4" color="primary" gutterBottom>
                      1000+
                    </Typography>
                    <Typography variant="subtitle1">Happy Customers</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h4" color="primary" gutterBottom>
                      100%
                    </Typography>
                    <Typography variant="subtitle1">Fresh Ingredients</Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Call to Action Section */}
      <Box
        sx={{
          bgcolor: theme.palette.primary.main,
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" gutterBottom>
            Ready to Place an Order?
          </Typography>
          <Typography variant="subtitle1" paragraph>
            Contact us now to place your order for fresh, delicious baked goods!
          </Typography>
          <Button
            component={RouterLink}
            to="/contact"
            variant="contained"
            size="large"
            sx={{
              mt: 2,
              bgcolor: 'white',
              color: theme.palette.primary.main,
              '&:hover': {
                bgcolor: 'grey.100',
              },
            }}
          >
            Order Now
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 