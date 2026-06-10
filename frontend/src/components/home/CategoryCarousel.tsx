import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Box, IconButton, Skeleton } from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { Category } from '../../services/categoryService';
import CategoryCard from './CategoryCard';

interface CategoryCarouselProps {
  categories: Category[];
  loading: boolean;
  onCategoryClick: (name: string) => void;
}

/** Horizontal scroll carousel for category browsing with arrow navigation. */
const CategoryCarousel: React.FC<CategoryCarouselProps> = ({
  categories,
  loading,
  onCategoryClick,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  useEffect(() => {
    updateScrollButtons();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollButtons);
    window.addEventListener('resize', updateScrollButtons);
    return () => {
      el.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, [categories, loading, updateScrollButtons]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector('[data-category-slide]')?.clientWidth ?? 280;
    el.scrollBy({ left: direction === 'left' ? -cardWidth - 16 : cardWidth + 16, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', gap: 2, overflow: 'hidden' }}>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} variant="rounded" width={280} height={260} sx={{ borderRadius: 3, flexShrink: 0 }} />
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative' }}>
      {canScrollLeft && (
        <IconButton
          onClick={() => scroll('left')}
          aria-label="Previous categories"
          sx={{
            position: 'absolute',
            left: { xs: 4, md: -20 },
            top: '42%',
            transform: 'translateY(-50%)',
            zIndex: 2,
            bgcolor: 'background.paper',
            boxShadow: 3,
            '&:hover': { bgcolor: 'primary.main', color: 'white' },
          }}
        >
          <ChevronLeftIcon />
        </IconButton>
      )}

      <Box
        ref={scrollRef}
        sx={{
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth',
          pb: 1,
          px: { xs: 0.5, md: 0 },
          // Hide scrollbar but keep touch swipe
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {categories.map((category) => (
          <Box
            key={category._id}
            data-category-slide
            sx={{
              scrollSnapAlign: 'start',
              width: { xs: '78vw', sm: 280, md: 300 },
              maxWidth: 300,
            }}
          >
            <CategoryCard
              name={category.name}
              imagePath={category.images?.[0]}
              onClick={() => onCategoryClick(category.name)}
            />
          </Box>
        ))}
      </Box>

      {canScrollRight && (
        <IconButton
          onClick={() => scroll('right')}
          aria-label="Next categories"
          sx={{
            position: 'absolute',
            right: { xs: 4, md: -20 },
            top: '42%',
            transform: 'translateY(-50%)',
            zIndex: 2,
            bgcolor: 'background.paper',
            boxShadow: 3,
            '&:hover': { bgcolor: 'primary.main', color: 'white' },
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      )}
    </Box>
  );
};

export default CategoryCarousel;
