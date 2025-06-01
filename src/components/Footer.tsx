import React from 'react';
import { Box, Container, Typography, Link, Grid } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Laxmi Bakery
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Bringing sweetness to your life since 2024
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Quick Links
            </Typography>
            <Link
              component={RouterLink}
              to="/products"
              color="text.secondary"
              display="block"
            >
              Products
            </Link>
            <Link
              component={RouterLink}
              to="/about"
              color="text.secondary"
              display="block"
            >
              About Us
            </Link>
            <Link
              component={RouterLink}
              to="/contact"
              color="text.secondary"
              display="block"
            >
              Contact
            </Link>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2" color="text.secondary">
              123 Baker Street
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Mumbai, Maharashtra
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: info@laxmibakery.com
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Phone: +91 123-456-7890
            </Typography>
          </Grid>
        </Grid>
        
        <Box mt={3}>
          <Typography variant="body2" color="text.secondary" align="center">
            {'© '}
            {new Date().getFullYear()}
            {' Laxmi Bakery. All rights reserved.'}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 