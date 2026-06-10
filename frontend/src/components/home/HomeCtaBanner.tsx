import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { siteConfig } from '../../config/siteConfig';

/** Playful closing CTA — light, bouncy, and distinct from the rest of the page. */
const HomeCtaBanner: React.FC = () => (
  <Box
    component="section"
    aria-label="Get in touch"
    sx={{
      py: { xs: 6, md: 9 },
      px: 2,
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    <Container maxWidth="md">
      <Box
        sx={{
          position: 'relative',
          borderRadius: 6,
          px: { xs: 3, md: 6 },
          py: { xs: 5, md: 7 },
          textAlign: 'center',
          bgcolor: 'secondary.light',
          border: '3px dashed',
          borderColor: 'primary.light',
          // Decorative blobs
          '&::before': {
            content: '""',
            position: 'absolute',
            width: 120,
            height: 120,
            borderRadius: '50%',
            bgcolor: 'gold.light',
            opacity: 0.45,
            top: -40,
            right: -30,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            width: 80,
            height: 80,
            borderRadius: '50%',
            bgcolor: 'primary.light',
            opacity: 0.2,
            bottom: -20,
            left: -20,
          },
        }}
      >
        <Typography
          variant="overline"
          sx={{
            color: 'primary.main',
            fontWeight: 800,
            letterSpacing: '0.15em',
            display: 'block',
            mb: 1,
          }}
        >
          Sweet news
        </Typography>
        <Typography
          variant="h3"
          component="h2"
          sx={{
            color: 'primary.dark',
            fontFamily: 'Playfair Display, serif',
            fontSize: { xs: '1.85rem', md: '2.5rem' },
            lineHeight: 1.25,
            mb: 2,
            position: 'relative',
            zIndex: 1,
          }}
        >
          You don&apos;t need a reason
          <Box
            component="span"
            sx={{
              display: 'block',
              color: 'gold.dark',
              fontStyle: 'italic',
            }}
          >
            to order cake.
          </Box>
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'text.primary',
            mb: 4,
            lineHeight: 1.8,
            maxWidth: 440,
            mx: 'auto',
            position: 'relative',
            zIndex: 1,
          }}
        >
          Custom designs, last-minute treats, or &ldquo;just because&rdquo; — we&apos;re at{' '}
          {siteConfig.address.line2} and one WhatsApp away.
        </Typography>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="center"
          sx={{ position: 'relative', zIndex: 1 }}
        >
          <Button
            component={RouterLink}
            to="/order"
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            color="primary"
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 999,
              fontSize: '1rem',
              boxShadow: '0 6px 20px rgba(124,58,106,0.35)',
              '&:hover': {
                transform: 'translateY(-2px)',
              },
            }}
          >
            Design Your Cake
          </Button>
          <Button
            component={RouterLink}
            to="/contact"
            variant="outlined"
            size="large"
            sx={{
              color: 'primary.main',
              borderColor: 'primary.main',
              borderWidth: 2,
              px: 4,
              py: 1.5,
              borderRadius: 999,
              '&:hover': {
                borderWidth: 2,
                bgcolor: 'rgba(124,58,106,0.06)',
              },
            }}
          >
            Find Us on the Map
          </Button>
        </Stack>
      </Box>
    </Container>
  </Box>
);

export default HomeCtaBanner;
