import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  WhatsApp as WhatsAppIcon,
} from '@mui/icons-material';
import { siteConfig } from '../../config/siteConfig';
import { getWhatsAppOrderUrl } from '../../utils/whatsapp';

/** Hero — centered brand, Nepali motto, and theme-styled CTAs. */
const HomeHero: React.FC = () => (
  <Box
    component="section"
    aria-label="Welcome"
    sx={{
      position: 'relative',
      minHeight: { xs: 400, sm: 440, md: 460 },
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: [
        'linear-gradient(to bottom, rgba(15, 5, 22, 0.65) 0%, rgba(15, 5, 22, 0.2) 40%, transparent 60%)',
        'linear-gradient(to top, rgba(50, 15, 45, 0.7) 0%, rgba(76, 29, 76, 0.25) 50%, transparent 80%)',
        'url(/images/hero-image.jpg)',
      ].join(', '),
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}
  >
    <Container
      maxWidth="md"
      sx={{
        position: 'relative',
        zIndex: 1,
        py: { xs: 12, md: 14 },
        px: 2,
      }}
    >
      <Stack spacing={3} alignItems="center" textAlign="center">
        <Typography
          variant="h1"
          component="h1"
          sx={{
            color: '#ffffff',
            fontSize: { xs: '2.25rem', sm: '2.75rem', md: '3rem' },
            textShadow: '0 2px 24px rgba(0,0,0,0.45)',
            lineHeight: 1.15,
            letterSpacing: '0.03em',
          }}
        >
          {siteConfig.businessName}
        </Typography>

        <Typography
          variant="devanagari"
          component="p"
          lang="ne"
          sx={{
            color: 'gold.light',
            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
            textShadow: '0 2px 16px rgba(0,0,0,0.4)',
            maxWidth: 520,
          }}
        >
          {siteConfig.tagline.nepali}
        </Typography>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems="center"
          justifyContent="center"
          sx={{ pt: 0.5 }}
        >
          <Button
            component={RouterLink}
            to="/products"
            variant="contained"
            color="primary"
            size="large"
            endIcon={<ArrowForwardIcon />}
            sx={{ minWidth: { xs: 220, sm: 168 } }}
          >
            View Menu
          </Button>
          <Button
            component="a"
            href={getWhatsAppOrderUrl()}
            target="_blank"
            rel="noopener noreferrer"
            variant="contained"
            color="primary"
            size="large"
            startIcon={<WhatsAppIcon />}
            sx={{ minWidth: { xs: 220, sm: 210 } }}
          >
            Order on WhatsApp
          </Button>
        </Stack>
      </Stack>
    </Container>

    <Box
      sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 40,
        background: 'linear-gradient(transparent, #f9f6f2)',
        pointerEvents: 'none',
      }}
    />
  </Box>
);

export default HomeHero;
