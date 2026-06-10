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
import { formatCurrency, getEffectivePrice, getWhatsAppOrderUrl } from '../utils/whatsapp';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const effectivePrice = getEffectivePrice(product.price, product.discount);
    const whatsappOrderUrl = getWhatsAppOrderUrl(product.name, effectivePrice);

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

            <CardMedia
                component="img"
                height="280"
                image={product.images[0] || '/images/placeholder.jpg'}
                alt={product.name}
                loading="lazy"
                sx={{
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                        transform: 'scale(1.05)',
                    },
                }}
            />

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

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mb: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: '40px',
                        fontSize: '0.875rem',
                    }}
                >
                    {product.description}
                </Typography>

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
                                {formatCurrency(product.price)}
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
                                {formatCurrency(effectivePrice)}
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
                            {formatCurrency(product.price)}
                        </Typography>
                    )}
                </Box>
            </CardContent>

            <CardActions sx={{ justifyContent: 'center', pb: 2, pt: 0 }}>
                <Button
                    component="a"
                    href={whatsappOrderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="contained"
                    color="primary"
                    size="medium"
                    startIcon={<WhatsAppIcon />}
                    fullWidth
                    sx={{ mx: 2 }}
                >
                    Order Now
                </Button>
            </CardActions>
        </Card>
    );
};

export default ProductCard;
