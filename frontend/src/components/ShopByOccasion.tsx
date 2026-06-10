import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Button,
    Container,
    Grid,
    Skeleton,
    Chip,
    useTheme,
    useMediaQuery,
    Alert,
    IconButton,
} from '@mui/material';
import {
    ArrowForward as ArrowForwardIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { productService } from '../services/productService';
import { Product } from '../types/product';
import ProductCard from './ProductCard';
import SectionHeader from './home/SectionHeader';

const ShopByOccasion: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedOccasion, setSelectedOccasion] = useState<string>('');
    const [occasionStartIndex, setOccasionStartIndex] = useState(0);

    // Number of occasions to show at once
    const occasionsPerView = isMobile ? 3 : 5;

    // Fetch all products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                // Fetch products (backend max limit is 50)
                const response = await productService.getProducts(1, 50);
                setProducts(response.items);

                // Set the first occasion as default if available
                if (response.items.length > 0) {
                    const occasions = getUniqueOccasions(response.items);
                    if (occasions.length > 0) {
                        setSelectedOccasion(occasions[0]);
                    }
                }
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to load products. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Extract unique occasions from products' tags field and sort by product count
    const getUniqueOccasions = (productList: Product[]): string[] => {
        const counts: { [key: string]: number } = {};
        productList.forEach(p => {
            if (p.tags) {
                p.tags.forEach(tag => {
                    if (tag && tag.trim() !== '') {
                        counts[tag] = (counts[tag] || 0) + 1;
                    }
                });
            }
        });

        return Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
    };

    // Get products for the selected occasion (limit to 8)
    const getFilteredProducts = (): Product[] => {
        if (!selectedOccasion) return [];
        return products
            .filter(p => p.tags && p.tags.includes(selectedOccasion))
            .slice(0, 8);
    };

    const uniqueOccasions = getUniqueOccasions(products);
    const filteredProducts = getFilteredProducts();

    // Get visible occasions for carousel
    const visibleOccasions = uniqueOccasions.slice(
        occasionStartIndex,
        occasionStartIndex + occasionsPerView
    );

    const handleOccasionClick = (occasion: string) => {
        setSelectedOccasion(occasion);
    };

    const handlePrevClick = () => {
        const currentIndex = uniqueOccasions.indexOf(selectedOccasion);
        if (currentIndex > 0) {
            const newIndex = currentIndex - 1;
            const newOccasion = uniqueOccasions[newIndex];
            setSelectedOccasion(newOccasion);

            // Adjust start index if the new occasion is out of view
            if (newIndex < occasionStartIndex) {
                setOccasionStartIndex(newIndex);
            }
        }
    };

    const handleNextClick = () => {
        const currentIndex = uniqueOccasions.indexOf(selectedOccasion);
        if (currentIndex < uniqueOccasions.length - 1) {
            const newIndex = currentIndex + 1;
            const newOccasion = uniqueOccasions[newIndex];
            setSelectedOccasion(newOccasion);

            // Adjust start index if the new occasion is out of view
            if (newIndex >= occasionStartIndex + occasionsPerView) {
                setOccasionStartIndex(newIndex - occasionsPerView + 1);
            }
        }
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Skeleton variant="text" width={300} height={60} sx={{ mx: 'auto' }} />
                </Box>
                <Box sx={{ display: 'flex', gap: 1, mb: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
                    {[1, 2, 3, 4].map((item) => (
                        <Skeleton key={item} variant="rectangular" width={100} height={40} sx={{ borderRadius: 2 }} />
                    ))}
                </Box>
                <Grid container spacing={3}>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                        <Grid item xs={12} sm={6} md={3} key={item}>
                            <Box sx={{ height: '100%' }}>
                                <Skeleton variant="rectangular" height={280} />
                                <Box sx={{ p: 2 }}>
                                    <Skeleton variant="text" height={32} />
                                    <Skeleton variant="text" width="60%" />
                                    <Skeleton variant="rectangular" height={40} sx={{ mt: 2 }} />
                                </Box>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    if (uniqueOccasions.length === 0) {
        return null; // Don't show section if no occasions available
    }

    return (
        <Box component="section" aria-label="Shop by occasion" sx={{ bgcolor: 'background.paper', py: { xs: 6, md: 8 } }}>
            <Container maxWidth="lg">
                <SectionHeader
                    title="Shop by Occasion"
                    subtitle="Find the perfect treats for every special moment and celebration."
                    accent="secondary"
                />

                {/* Occasion Carousel with Navigation */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        mb: 5,
                        justifyContent: 'center',
                    }}
                >
                    {/* Previous Button */}
                    <IconButton
                        onClick={handlePrevClick}
                        disabled={uniqueOccasions.indexOf(selectedOccasion) <= 0}
                        aria-label="Previous occasion"
                        sx={{
                            bgcolor: 'background.paper',
                            boxShadow: 2,
                            '&:hover': {
                                bgcolor: 'primary.light',
                                color: 'white',
                            },
                            '&.Mui-disabled': {
                                bgcolor: 'action.disabledBackground',
                            },
                        }}
                    >
                        <ChevronLeftIcon />
                    </IconButton>

                    {/* Occasion Chips */}
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 1.5,
                            flexWrap: 'nowrap',
                            overflow: 'hidden',
                            justifyContent: 'center',
                            flex: 1,
                            maxWidth: isMobile ? '70%' : '80%',
                        }}
                    >
                        {visibleOccasions.map((occasion) => (
                            <Chip
                                key={occasion}
                                label={occasion}
                                onClick={() => handleOccasionClick(occasion)}
                                color={selectedOccasion === occasion ? 'primary' : 'default'}
                                variant={selectedOccasion === occasion ? 'filled' : 'outlined'}
                                sx={{
                                    fontSize: '1rem',
                                    fontWeight: selectedOccasion === occasion ? 600 : 400,
                                    py: 2.5,
                                    px: 1,
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    whiteSpace: 'nowrap',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: 2,
                                    },
                                    ...(selectedOccasion === occasion && {
                                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                    }),
                                }}
                            />
                        ))}
                    </Box>

                    {/* Next Button */}
                    <IconButton
                        onClick={handleNextClick}
                        disabled={uniqueOccasions.indexOf(selectedOccasion) >= uniqueOccasions.length - 1}
                        aria-label="Next occasion"
                        sx={{
                            bgcolor: 'background.paper',
                            boxShadow: 2,
                            '&:hover': {
                                bgcolor: 'primary.light',
                                color: 'white',
                            },
                            '&.Mui-disabled': {
                                bgcolor: 'action.disabledBackground',
                            },
                        }}
                    >
                        <ChevronRightIcon />
                    </IconButton>
                </Box>

                {/* Product Grid */}
                {filteredProducts.length > 0 ? (
                    <Grid container spacing={3}>
                        {filteredProducts.map((product) => (
                            <Grid item xs={12} sm={6} md={3} key={product._id}>
                                <ProductCard product={product} />
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Alert severity="info">No products available for this occasion.</Alert>
                )}

                {/* View All Button */}
                {filteredProducts.length === 8 && (
                    <Box sx={{ textAlign: 'center', mt: 5 }}>
                        <Button
                            component={RouterLink}
                            to="/products"
                            variant="outlined"
                            color="primary"
                            size="large"
                            endIcon={<ArrowForwardIcon />}
                            sx={{
                                px: 4,
                                py: 1.5,
                                borderWidth: 2,
                                '&:hover': {
                                    borderWidth: 2,
                                },
                            }}
                        >
                            View All Products
                        </Button>
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default ShopByOccasion;
