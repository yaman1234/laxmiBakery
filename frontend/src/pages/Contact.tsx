import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  IconButton,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  phone: Yup.string().required('Phone number is required'),
  message: Yup.string().required('Message is required'),
  orderDetails: Yup.string(),
  preferredDate: Yup.date(),
});

const Contact: React.FC = () => {
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
      orderDetails: '',
      preferredDate: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // Handle form submission here
      console.log('Form values:', values);
    },
  });

  return (
    <Container maxWidth="md" sx={{ py: 4, mt: { xs: 8, md: 10 } }}>


      <Grid container spacing={4} alignItems="flex-start" sx={{ mb: 4 }}>
        {/* Visit Our Store (Left) */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', bgcolor: 'background.paper', boxShadow: '0 4px 24px rgba(124,58,106,0.08)' }}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ color: 'primary.main', fontWeight: 700 }}>
              Visit Our Store
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <span role="img" aria-label="location" style={{ marginRight: 8 }}>📍</span>
                Thecho Dhapakhel-Dobato, Godawari-12, Lalitpur, Nepal
              </Typography>
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <span role="img" aria-label="phone" style={{ marginRight: 8 }}>📞</span>
                01-5571246, 9860368155
              </Typography>
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <span role="img" aria-label="email" style={{ marginRight: 8 }}>✉️</span>
                yamanmaharjan00@gmail.com
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              <strong>Follow us on:</strong>
           
            </Typography>
            <Box>
              <IconButton
                color="inherit"
                aria-label="Facebook"
                component="a"
                href="https://facebook.com/yourpage"
                target="_blank"
                rel="noopener"
                sx={{ mr: 1 }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                color="inherit"
                aria-label="Instagram"
                component="a"
                href="https://instagram.com/yourpage"
                target="_blank"
                rel="noopener"
                sx={{ mr: 1 }}
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                color="inherit"
                aria-label="WhatsApp"
                component="a"
                href="https://wa.me/yourwhatsapplink"
                target="_blank"
                rel="noopener"
              >
                <WhatsAppIcon />
              </IconButton>
            </Box>
          </Paper>
        </Grid>
        {/* Google Map (Right) */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 0, height: '100%', minHeight: 320, overflow: 'hidden', bgcolor: 'background.paper', boxShadow: '0 4px 24px rgba(124,58,106,0.08)' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d8408.136728990214!2d85.31270438676202!3d27.618754957991946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb17040c80c42b%3A0xecf61ae204f5dcf1!2sLaxmi%20Bakery!5e0!3m2!1sen!2snp!4v1752846011242!5m2!1sen!2snp"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Laxmi Bakery Map"
            ></iframe>
          </Paper>
        </Grid>
      </Grid>

      {/* Contact Form at the Bottom */}
      <Paper elevation={3} sx={{ p: 4, mt: 6 }}>
        <Typography variant="body1" align="center" paragraph sx={{ mb: 3 }}>
          Have a question or want to place an order? We'd love to hear from you!
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Your Name"
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
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="orderDetails"
                name="orderDetails"
                label="Order Details (Optional)"
                multiline
                rows={3}
                value={formik.values.orderDetails}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="preferredDate"
                name="preferredDate"
                label="Preferred Delivery Date"
                type="date"
                value={formik.values.preferredDate}
                onChange={formik.handleChange}
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
                label="Message"
                multiline
                rows={4}
                value={formik.values.message}
                onChange={formik.handleChange}
                error={formik.touched.message && Boolean(formik.errors.message)}
                helperText={formik.touched.message && formik.errors.message}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
              >
                Send Message
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Contact; 