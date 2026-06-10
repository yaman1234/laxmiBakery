import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Skeleton,
  Alert,
} from '@mui/material';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { productService } from '../services/productService';
import { Product } from '../types/product';
import categoryService, { Category } from '../services/categoryService';
import ShopByFlavor from '../components/ShopByFlavor';
import ShopByOccasion from '../components/ShopByOccasion';
import ProductCard from '../components/ProductCard';
import HomeHero from '../components/home/HomeHero';
import ValueStrip from '../components/home/ValueStrip';
import SectionHeader from '../components/home/SectionHeader';
import CategoryCarousel from '../components/home/CategoryCarousel';
import HomeCtaBanner from '../components/home/HomeCtaBanner';

const FEATURED_COUNT = 4;

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await productService.getProducts(1, FEATURED_COUNT);
        setFeaturedProducts(response.items);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        setCategoryError(null);
        const response = await categoryService.getCategories();
        setCategories(response.items);
      } catch (error) {
        setCategoryError('Failed to load categories');
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    navigate('/products', { state: { category: categoryName } });
  };

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      <HomeHero />
      <ValueStrip />

      <Box component="section" aria-label="Product categories" sx={{ py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <SectionHeader
            title="Browse by Category"
            subtitle="Swipe through our range — tap any category to see what's inside."
            accent="secondary"
          />
          {categoryError ? (
            <Alert severity="error">{categoryError}</Alert>
          ) : (
            <CategoryCarousel
              categories={categories}
              loading={loadingCategories}
              onCategoryClick={handleCategoryClick}
            />
          )}
        </Container>
      </Box>

      <Box
        component="section"
        aria-label="Featured products"
        sx={{ py: { xs: 6, md: 8 }, bgcolor: 'background.paper' }}
      >
        <Container maxWidth="lg">
          <SectionHeader
            title="Signature Creations"
            subtitle="Customer favourites and bakery classics, fresh from our ovens."
            accent="primary"
          />
          <Grid container spacing={3}>
            {loading
              ? [1, 2, 3, 4].map((item) => (
                  <Grid item xs={12} sm={6} md={3} key={item}>
                    <Box>
                      <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 3 }} />
                      <Box sx={{ p: 2 }}>
                        <Skeleton variant="text" height={32} />
                        <Skeleton variant="text" width="60%" />
                        <Skeleton variant="rectangular" height={40} sx={{ mt: 2 }} />
                      </Box>
                    </Box>
                  </Grid>
                ))
              : featuredProducts.map((product) => (
                  <Grid item xs={12} sm={6} md={3} key={product._id}>
                    <ProductCard product={product} />
                  </Grid>
                ))}
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 5 }}>
            <Button
              component={RouterLink}
              to="/products"
              variant="outlined"
              color="primary"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{ px: 4, py: 1.5, borderWidth: 2, '&:hover': { borderWidth: 2 } }}
            >
              View Full Menu
            </Button>
          </Box>
        </Container>
      </Box>

      <ShopByFlavor />
      <ShopByOccasion />
      <HomeCtaBanner />
    </Box>
  );
};

export default Home;
