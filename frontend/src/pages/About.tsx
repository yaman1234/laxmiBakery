import React from 'react';
import { Box, Container, Typography, Grid, Button, Paper, Avatar, Rating } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

// Testimonials data
const testimonials = [
  {
    name: "Priya Sharma",
    role: "Wedding Planner",
    image: "/images/testimonials/priya.jpg",
    rating: 5,
    comment: "Their wedding cakes are works of art. The attention to detail and taste are unmatched. Every bride I've worked with has been delighted!"
  },
  {
    name: "Rahul Patel",
    role: "Culinary Expert",
    image: "/images/testimonials/rahul.jpg",
    rating: 5,
    comment: "The French pastries here rival those I've tasted in Paris. Their croissants are perfectly flaky, and the macarons are simply divine."
  },
  {
    name: "Meera Desai",
    role: "Corporate Events Manager",
    image: "/images/testimonials/meera.jpg",
    rating: 5,
    comment: "From business meetings to grand corporate events, their artisanal desserts and premium packaging always impress our clients."
  }
];

const About: React.FC = () => {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 6 }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          minHeight: '30vh',
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(rgba(124,58,106,0.7), rgba(124,58,106,0.4)), url(/images/about-image.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          color: 'white',
          mb: 6,
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Typography variant="h2" sx={{ color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.3)', mb: 2 }}>
            About Us
          </Typography>
          <Typography variant="h6" sx={{ color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.2)', fontFamily: 'Lato, sans-serif', lineHeight: 1.6 }}>
            Discover the story, passion, and people behind Laxmi Bakery.
          </Typography>
        </Container>
      </Box>

      {/* Our Heritage Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Grid container spacing={8} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="/images/about-image.jpg"
              alt="Our bakery"
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 4,
                boxShadow: '0 20px 40px rgba(124,58,106,0.1)',
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h3" gutterBottom>
              Our Heritage
            </Typography>
            <Typography variant="subtitle1" sx={{ color: 'primary.main', mb: 3, fontStyle: 'italic' }}>
              Three generations of artisanal baking excellence since 1990
            </Typography>
            <Typography variant="body1" paragraph>
              At Laxmi Bakery, we blend time-honored traditions with contemporary artistry. Our master bakers start each day before dawn, crafting everything from rustic sourdough loaves to intricate French pastries. We source only the finest ingredients - from local organic grains to premium Belgian chocolate.
            </Typography>
            <Typography variant="body1" paragraph>
              Every creation that leaves our ovens reflects our commitment to excellence. Whether it's our signature celebration cakes, artisanal bread, or delicate pastries, each item is crafted with precision, passion, and the finest attention to detail.
            </Typography>
            <Button component={RouterLink} to="/contact" variant="contained" color="primary" size="large" sx={{ mt: 3 }}>
              Contact Us
            </Button>
          </Grid>
        </Grid>
      </Container>

      {/* Customer Experiences Section */}
      <Box sx={{ py: { xs: 6, md: 12 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h2" gutterBottom>
              Customer Experiences
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              The joy of our craft reflected in our customers' celebrations
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 4,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    '&::before': {
                      content: '"“"',
                      position: 'absolute',
                      top: 20,
                      left: 20,
                      fontSize: '4rem',
                      color: 'primary.light',
                      opacity: 0.2,
                      fontFamily: 'Playfair Display',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar
                      src={testimonial.image}
                      alt={testimonial.name}
                      sx={{
                        width: 64,
                        height: 64,
                        mr: 2,
                        border: '2px solid',
                        borderColor: 'primary.main',
                      }}
                    />
                    <Box>
                      <Typography variant="h6" component="h3">
                        {testimonial.name}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        sx={{ fontStyle: 'italic' }}
                      >
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Box>
                  <Rating
                    value={testimonial.rating}
                    readOnly
                    sx={{ mb: 2, color: 'gold.main' }}
                  />
                  <Typography
                    variant="body1"
                    paragraph
                    sx={{
                      flexGrow: 1,
                      fontStyle: 'italic',
                      color: 'text.secondary',
                    }}
                  >
                    "{testimonial.comment}"
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Team Section Placeholder */}
      <Container maxWidth="lg">
        <Typography variant="h3" align="center" gutterBottom>
          Meet Our Team
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" paragraph>
          Our dedicated team of bakers, pastry chefs, and staff are the heart of Laxmi Bakery. (Add team profiles here...)
        </Typography>
      </Container>
    </Box>
  );
};

export default About; 