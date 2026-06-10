import React from 'react';
import { Box, Typography } from '@mui/material';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  /** Underline accent color from the theme palette. */
  accent?: 'primary' | 'secondary' | 'gold';
  align?: 'center' | 'left';
}

/**
 * Consistent section title block used across homepage sections.
 */
const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  accent = 'primary',
  align = 'center',
}) => (
  <Box
    sx={{
      textAlign: align,
      mb: { xs: 4, md: 6 },
      maxWidth: align === 'center' ? 640 : 'none',
      mx: align === 'center' ? 'auto' : 0,
    }}
  >
    <Typography
      variant="h2"
      component="h2"
      sx={{
        position: 'relative',
        display: 'inline-block',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: -12,
          left: align === 'center' ? '50%' : 0,
          transform: align === 'center' ? 'translateX(-50%)' : 'none',
          width: 72,
          height: 3,
          borderRadius: 2,
          bgcolor: `${accent}.main`,
        },
      }}
    >
      {title}
    </Typography>
    {subtitle && (
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mt: 3, lineHeight: 1.7 }}
      >
        {subtitle}
      </Typography>
    )}
  </Box>
);

export default SectionHeader;
