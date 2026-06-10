import React from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import LocalFloristOutlinedIcon from '@mui/icons-material/LocalFloristOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';

const highlights = [
  {
    icon: CakeOutlinedIcon,
    title: 'Custom Celebration Cakes',
    description: 'Designed for birthdays, weddings, and every special moment.',
  },
  {
    icon: LocalFloristOutlinedIcon,
    title: 'Fresh Daily Baking',
    description: 'Premium ingredients, crafted from scratch every morning.',
  },
  {
    icon: ChatOutlinedIcon,
    title: 'Quick WhatsApp Orders',
    description: 'Message us anytime for fast replies and custom cake requests.',
  },
];

/** Compact trust/value row directly below the hero. */
const ValueStrip: React.FC = () => (
  <Box
    component="section"
    aria-label="Why choose us"
    sx={{
      bgcolor: 'background.paper',
      py: { xs: 4, md: 5 },
      mt: 0,
      position: 'relative',
      zIndex: 1,
    }}
  >
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        {highlights.map(({ icon: Icon, title, description }) => (
          <Grid item xs={12} md={4} key={title}>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                alignItems: 'flex-start',
                p: 2.5,
                borderRadius: 3,
                height: '100%',
                bgcolor: 'background.default',
                border: '1px solid',
                borderColor: 'secondary.light',
              }}
            >
              <Box
                sx={{
                  p: 1.25,
                  borderRadius: 2,
                  bgcolor: 'primary.main',
                  color: 'white',
                  display: 'flex',
                  flexShrink: 0,
                }}
              >
                <Icon fontSize="small" />
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {description}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);

export default ValueStrip;
