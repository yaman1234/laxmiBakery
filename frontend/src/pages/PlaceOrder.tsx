import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    TextField,
    Button,
    Grid,
    MenuItem,
    Alert,
    CircularProgress,
    Snackbar,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { orderService, OrderData } from '../services/orderService';
import { menuService, MenuEntry } from '../services/menuService';

// Form validation schema
const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
    cakeType: Yup.string().required('Please select a cake type'),
    weight: Yup.string().required('Please select cake weight'),
    flavour: Yup.string(),
    occasion: Yup.string(),
    preferredDate: Yup.date().required('Preferred delivery date is required').min(new Date(), 'Date cannot be in the past'),
    message: Yup.string(),
    captcha: Yup.string().required('Please solve the math puzzle'),
});

const weights = ['0.5 kg', '1 kg', '1.5 kg', '2 kg', '3 kg', '5 kg+', 'Other'];

const PlaceOrder: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
        open: false,
        message: '',
        severity: 'success'
    });
    const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, result: 0 });
    const [menuItems, setMenuItems] = useState<MenuEntry[]>([]);
    const [fetchingMenu, setFetchingMenu] = useState(true);

    // Generate a simple math problem
    const generateCaptcha = () => {
        const num1 = Math.floor(Math.random() * 9) + 1;
        const num2 = Math.floor(Math.random() * 9) + 1;
        setCaptcha({ num1, num2, result: num1 + num2 });
    };

    const fetchMenu = async () => {
        try {
            const data = await menuService.getMenu(true); // Active only
            setMenuItems(data);
        } catch (err) {
            console.error('Failed to fetch menu:', err);
        } finally {
            setFetchingMenu(false);
        }
    };

    useEffect(() => {
        generateCaptcha();
        fetchMenu();
    }, []);

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            phone: '',
            cakeType: '',
            weight: '',
            flavour: '',
            occasion: '',
            preferredDate: '',
            message: '',
            captcha: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            if (parseInt(values.captcha) !== captcha.result) {
                formik.setFieldError('captcha', 'Incorrect answer. Please try again.');
                return;
            }

            setLoading(true);
            try {
                const { captcha: _, ...orderData } = values;
                await orderService.placeOrder(orderData as OrderData);
                setNotification({
                    open: true,
                    message: 'Order placed successfully! We will contact you soon.',
                    severity: 'success'
                });
                formik.resetForm();
                generateCaptcha();
            } catch (error) {
                setNotification({
                    open: true,
                    message: 'Failed to place order. Please try again later or contact us directly.',
                    severity: 'error'
                });
            } finally {
                setLoading(false);
            }
        },
    });

    const handleCloseNotification = () => {
        setNotification({ ...notification, open: false });
    };

    return (
        <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 }, mt: { xs: 8, md: 10 } }}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography variant="h2" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                    Place Your Order
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                    Design your perfect cake! Fill out the form below and we'll get back to you with a confirmation and price estimate.
                </Typography>
            </Box>

            <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, borderRadius: 2 }}>
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={3}>
                        {/* Personal Info */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                id="name"
                                name="name"
                                label="Full Name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                id="email"
                                name="email"
                                label="Email Address"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="phone"
                                name="phone"
                                label="Phone Number"
                                value={formik.values.phone}
                                onChange={formik.handleChange}
                                error={formik.touched.phone && Boolean(formik.errors.phone)}
                                helperText={formik.touched.phone && formik.errors.phone}
                            />
                        </Grid>

                        {/* Cake Details */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                id="cakeType"
                                name="cakeType"
                                label="Select Cake Type"
                                value={formik.values.cakeType}
                                onChange={formik.handleChange}
                                error={formik.touched.cakeType && Boolean(formik.errors.cakeType)}
                                helperText={formik.touched.cakeType && formik.errors.cakeType}
                            >
                                {fetchingMenu ? (
                                    <MenuItem disabled>
                                        <CircularProgress size={20} sx={{ mr: 1 }} /> Loading types...
                                    </MenuItem>
                                ) : (
                                    menuItems.map((item) => (
                                        <MenuItem key={item._id} value={item.cake_type}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                                <span>{item.cake_type}</span>
                                                <Typography variant="caption" color="text.secondary">
                                                    Rs. {item.base_price}/kg
                                                </Typography>
                                            </Box>
                                        </MenuItem>
                                    ))
                                )}
                                {!fetchingMenu && menuItems.length === 0 && (
                                    <MenuItem value="Other">Other</MenuItem>
                                )}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                id="weight"
                                name="weight"
                                label="Cake Weight"
                                value={formik.values.weight}
                                onChange={formik.handleChange}
                                error={formik.touched.weight && Boolean(formik.errors.weight)}
                                helperText={formik.touched.weight && formik.errors.weight}
                            >
                                {weights.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                id="flavour"
                                name="flavour"
                                label="Preferred Flavour (Optional)"
                                value={formik.values.flavour}
                                onChange={formik.handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                id="occasion"
                                name="occasion"
                                label="Occasion (Optional)"
                                value={formik.values.occasion}
                                onChange={formik.handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="preferredDate"
                                name="preferredDate"
                                label="Preferred Delivery Date"
                                type="date"
                                value={formik.values.preferredDate}
                                onChange={formik.handleChange}
                                error={formik.touched.preferredDate && Boolean(formik.errors.preferredDate)}
                                helperText={formik.touched.preferredDate && formik.errors.preferredDate}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="message"
                                name="message"
                                label="Special Instructions / Message on Cake"
                                multiline
                                rows={4}
                                value={formik.values.message}
                                onChange={formik.handleChange}
                            />
                        </Grid>

                        {/* Validation Captcha */}
                        <Grid item xs={12} sm={6}>
                            <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: 1, textAlign: 'center', mb: { xs: 2, sm: 0 } }}>
                                <Typography variant="body1">
                                    Validation: What is <strong>{captcha.num1} + {captcha.num2}</strong>?
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                id="captcha"
                                name="captcha"
                                label="Enter Result"
                                type="number"
                                value={formik.values.captcha}
                                onChange={formik.handleChange}
                                error={formik.touched.captcha && Boolean(formik.errors.captcha)}
                                helperText={formik.touched.captcha && formik.errors.captcha}
                            />
                        </Grid>

                        {/* Submit Button */}
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                size="large"
                                fullWidth
                                disabled={loading}
                                sx={{
                                    py: 2,
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    boxShadow: '0 4px 14px 0 rgba(124,58,106,0.39)',
                                }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Confirm Order'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>

            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </Container >
    );
};

export default PlaceOrder;
