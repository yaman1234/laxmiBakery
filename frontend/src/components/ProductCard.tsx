import React from 'react';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Typography,
} from '@mui/material';
import { WhatsApp as WhatsAppIcon } from '@mui/icons-material';
import { Product } from '../types/product';

interface ProductCardProps {
    product: Product;
    onOrderClick?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onOrderClick }) => {
    const handleOrderClick = () => {
        if (onOrderClick) {
            onOrderClick();
        } else {
            alert("Please use WhatsApp to place your order. We'll respond promptly!");
        }
    };

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 8,
                },
            }}
        >
            {/* Discount Badge */}
            {product.discount > 0 && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        bgcolor: 'error.main',
                        color: 'white',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        zIndex: 2,
                        boxShadow: 2,
                    }}
                >
                    -{product.discount}%
                </Box>
            )}

            {/* Image - Larger and more prominent */}
            <CardMedia
                component="img"
                height="280"
                image={product.images[0] || '/images/placeholder.jpg'}
                alt={product.name}
                sx={{
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                        transform: 'scale(1.05)',
                    },
                }}
            />

            {/* Content - Compact and minimal */}
            <CardContent sx={{ flexGrow: 1, textAlign: 'center', py: 2, px: 2 }}>
                <Typography
                    variant="h6"
                    gutterBottom
                    component="h3"
                    sx={{
                        fontWeight: 600,
                        fontSize: '1.1rem',
                        mb: 1,
                    }}
                >
                    {product.name}
                </Typography>

                {/* Price Section */}
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 1 }}>
                    {product.discount > 0 ? (
                        <>
                            <Typography
                                variant="body2"
                                sx={{
                                    textDecoration: 'line-through',
                                    color: 'text.secondary',
                                    fontSize: '0.9rem',
                                }}
                            >
                                ₹{product.price.toFixed(2)}
                            </Typography>
                            <Typography
                                variant="h6"
                                color="primary"
                                sx={{
                                    fontFamily: 'Lato, sans-serif',
                                    fontWeight: 700,
                                    fontSize: '1.25rem',
                                }}
                            >
                                ₹{(product.price * (1 - product.discount / 100)).toFixed(2)}
                            </Typography>
                        </>
                    ) : (
                        <Typography
                            variant="h6"
                            color="primary"
                            sx={{
                                fontFamily: 'Lato, sans-serif',
                                fontWeight: 600,
                                fontSize: '1.25rem',
                            }}
                        >
                            ₹{product.price.toFixed(2)}
                        </Typography>
                    )}
                </Box>
            </CardContent>

            {/* Order Button */}
            <CardActions sx={{ justifyContent: 'center', pb: 2, pt: 0 }}>
                <Button
                    onClick={handleOrderClick}
                    variant="contained"
                    color="primary"
                    size="medium"
                    startIcon={<WhatsAppIcon />}
                    fullWidth
                    sx={{
                        mx: 2,
                        bgcolor: '#25D366',
                        '&:hover': {
                            bgcolor: '#128C7E',
                        },
                        fontWeight: 600,
                    }}
                >
                    Order Now
                </Button>
            </CardActions>
        </Card>
    );
};

export default ProductCard;
