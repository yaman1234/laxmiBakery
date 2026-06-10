import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
} from '@mui/material';
import { siteConfig } from '../config/siteConfig';
import SocialLinks from './SocialLinks';

/** Gold accent styling for footer column headings on the plum background. */
const footerTitleSx = {
  color: 'gold.light',
  fontWeight: 700,
  letterSpacing: '0.06em',
  textTransform: 'uppercase' as const,
  fontSize: '0.95rem',
  position: 'relative' as const,
  display: 'inline-block',
  pb: 1,
  mb: 1,
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 40,
    height: 2,
    borderRadius: 1,
    bgcolor: 'gold.main',
  },
};

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" component="h2" sx={footerTitleSx}>
              About {siteConfig.businessName}
            </Typography>
            <Typography variant="body2">
              Serving delicious baked goods since 1990. We take pride in creating
              fresh, high-quality products for our valued customers.
            </Typography>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="h6" component="h2" sx={footerTitleSx}>
              Quick Links
            </Typography>
            <Link
              component={RouterLink}
              to="/"
              color="inherit"
              display="block"
              sx={{ mb: 1 }}
            >
              Home
            </Link>
            <Link
              component={RouterLink}
              to="/products"
              color="inherit"
              display="block"
              sx={{ mb: 1 }}
            >
              Products
            </Link>
            <Link
              component={RouterLink}
              to="/contact"
              color="inherit"
              display="block"
              sx={{ mb: 1 }}
            >
              Contact Us
            </Link>
            <Link
              component={RouterLink}
              to="/about"
              color="inherit"
              display="block"
            >
              About Us
            </Link>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="h6" component="h2" sx={footerTitleSx}>
              Contact Us
            </Typography>
            <Typography variant="body2" paragraph>
              {siteConfig.address.line1}
              <br />
              {siteConfig.address.line2}
            </Typography>
            <Typography variant="body2" paragraph>
              Phone: {siteConfig.phoneDisplay}
              <br />
              Email: {siteConfig.email}
            </Typography>
            <SocialLinks />
          </Grid>
        </Grid>

        <Typography
          variant="body2"
          align="center"
          sx={{ mt: 4, opacity: 0.7 }}
        >
          © {new Date().getFullYear()} {siteConfig.businessName}. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
