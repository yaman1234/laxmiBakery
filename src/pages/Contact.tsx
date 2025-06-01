import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Paper,
  Snackbar,
  Alert,
  Divider,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  phone: yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .required('Phone number is required'),
  address: yup.string().required('Address is required'),
  message: yup.string(),
  orderDetails: yup.string().required('Order details are required'),
});

const Contact: React.FC = () => {
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      message: '',
      orderDetails: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        // Here you would typically send the form data to your backend
        console.log('Form submitted:', values);
        setSnackbar({
          open: true,
          message: 'Your message and order have been sent successfully! We will contact you soon.',
          severity: 'success',
        });
        formik.resetForm();
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Failed to send message. Please try again.',
          severity: 'error',
        });
      }
    },
  });

  return (
    <Container maxWidth="md">
      <Box py={4}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Contact & Order
        </Typography>
        
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
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
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
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
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="address"
                  name="address"
                  label="Delivery Address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  error={formik.touched.address && Boolean(formik.errors.address)}
                  helperText={formik.touched.address && formik.errors.address}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Order Details
                  </Typography>
                </Divider>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="orderDetails"
                  name="orderDetails"
                  label="Order Details"
                  multiline
                  rows={4}
                  placeholder="Please specify your order details (items, quantities, any special requirements)"
                  value={formik.values.orderDetails}
                  onChange={formik.handleChange}
                  error={formik.touched.orderDetails && Boolean(formik.errors.orderDetails)}
                  helperText={formik.touched.orderDetails && formik.errors.orderDetails}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="message"
                  name="message"
                  label="Additional Message (Optional)"
                  multiline
                  rows={3}
                  value={formik.values.message}
                  onChange={formik.handleChange}
                  error={formik.touched.message && Boolean(formik.errors.message)}
                  helperText={formik.touched.message && formik.errors.message}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Button
                  fullWidth
                  size="large"
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  Send Message & Place Order
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>

        {/* Contact Information */}
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Contact Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Address:</strong><br />
                123 Baker Street<br />
                Mumbai, Maharashtra
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Phone:</strong><br />
                +91 123-456-7890
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                <strong>Email:</strong><br />
                info@laxmibakery.com
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Contact; 