import React from 'react';
import { Box, Typography } from '@mui/material';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { resolveImageUrl } from '../../utils/imageUrl';

interface CategoryCardProps {
  name: string;
  imagePath?: string;
  onClick: () => void;
  /** Fixed width for carousel slides; omit for fluid grid layouts. */
  width?: number | string;
}

/**
 * Category tile — image on top, name on a solid label bar for reliable readability.
 */
const CategoryCard: React.FC<CategoryCardProps> = ({ name, imagePath, onClick, width }) => (
  <Box
    onClick={onClick}
    onKeyDown={(e) => e.key === 'Enter' && onClick()}
    role="button"
    tabIndex={0}
    aria-label={`Browse ${name}`}
    sx={{
      width: width ?? '100%',
      flexShrink: 0,
      borderRadius: 3,
      overflow: 'hidden',
      cursor: 'pointer',
      bgcolor: 'background.paper',
      boxShadow: '0 8px 32px rgba(124,58,106,0.12)',
      transition: 'transform 0.35s ease, box-shadow 0.35s ease',
      '&:hover': {
        transform: 'translateY(-6px)',
        boxShadow: '0 16px 48px rgba(124,58,106,0.2)',
        '& .category-card__image': {
          transform: 'scale(1.06)',
        },
      },
      '@media (prefers-reduced-motion: reduce)': {
        transition: 'none',
        '&:hover': { transform: 'none' },
      },
    }}
  >
    <Box sx={{ height: { xs: 180, sm: 200, md: 220 }, overflow: 'hidden' }}>
      <Box
        component="img"
        className="category-card__image"
        src={resolveImageUrl(imagePath)}
        alt=""
        loading="lazy"
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
    </Box>
    {/* Solid label bar — high contrast, always readable */}
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1,
        px: 2,
        py: 1.75,
        bgcolor: 'primary.main',
      }}
    >
      <Typography
        variant="subtitle1"
        component="span"
        sx={{
          color: '#ffffff',
          fontWeight: 700,
          letterSpacing: '0.03em',
          fontSize: '1rem',
          lineHeight: 1.3,
        }}
      >
        {name}
      </Typography>
      <ArrowForwardIcon sx={{ color: 'gold.light', fontSize: 20, flexShrink: 0 }} />
    </Box>
  </Box>
);

export default CategoryCard;
