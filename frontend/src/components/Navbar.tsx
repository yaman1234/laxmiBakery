import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
  useScrollTrigger,
  Slide,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

interface Props {
  window?: () => Window;
  children: React.ReactElement;
}

function HideOnScroll(props: Props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const pages = [
  { title: 'Home', path: '/' },
  { title: 'Products', path: '/products' },
  { title: 'Contact', path: '/contact' },
  { title: 'About Us', path: '/about' },
];

const Navbar = () => {
  const theme = useTheme();
  const location = useLocation();
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const isHomePage = location.pathname === '/';

  return (
    <HideOnScroll>
      <AppBar 
        position="fixed"
        elevation={isScrolled ? 4 : 0}
        sx={{
          bgcolor: isScrolled || !isHomePage ? 'primary.main' : 'transparent',
          transition: 'all 0.3s ease-in-out',
          backgroundImage: isScrolled || !isHomePage 
            ? 'linear-gradient(45deg, #7c3a6a 30%, #9c5589 90%)'
            : 'none',
          borderRadius: 0,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ py: 1 }}>
            {/* Desktop Logo */}
            <Typography
              variant="h6"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'Playfair Display, serif',
                fontWeight: 700,
                fontSize: '1.8rem',
                color: 'inherit',
                textDecoration: 'none',
                letterSpacing: '.05em',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  transition: 'transform 0.3s ease',
                },
              }}
            >
              Laxmi Bakery
            </Typography>

            {/* Mobile Menu */}
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
                sx={{
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                  '& .MuiPaper-root': {
                    borderRadius: 0,
                    mt: 1,
                    boxShadow: theme.shadows[4],
                  },
                }}
              >
                {pages.map((page) => (
                  <MenuItem 
                    key={page.title} 
                    onClick={handleCloseNavMenu}
                    component={RouterLink}
                    to={page.path}
                    selected={location.pathname === page.path}
                    sx={{
                      bgcolor: location.pathname === page.path ? 'rgba(255,215,64,0.15)' : undefined,
                      '&:hover': {
                        bgcolor: 'rgba(124,58,106,0.08)',
                      },
                    }}
                  >
                    <Typography textAlign="center" sx={{ fontFamily: 'Lato, sans-serif', color: location.pathname === page.path ? 'gold.main' : 'inherit' }}>
                      {page.title}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            {/* Mobile Logo */}
            <Typography
              variant="h6"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'Playfair Display, serif',
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
                fontSize: '1.5rem',
                letterSpacing: '.05em',
              }}
            >
              Laxmi Bakery
            </Typography>

            {/* Desktop Menu */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
              {pages.map((page) => (
                <Button
                  key={page.title}
                  component={RouterLink}
                  to={page.path}
                  onClick={handleCloseNavMenu}
                  sx={{
                    my: 2,
                    mx: 2,
                    color: location.pathname === page.path ? 'gold.main' : 'white',
                    display: 'block',
                    position: 'relative',
                    fontFamily: 'Lato, sans-serif',
                    fontSize: '1rem',
                    fontWeight: 500,
                    letterSpacing: '0.05em',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      width: location.pathname === page.path ? '80%' : '0%',
                      height: '2px',
                      bottom: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: 'gold.main',
                      transition: 'width 0.3s ease',
                    },
                    '&:hover::after': {
                      width: '80%',
                    },
                    '&:hover': {
                      backgroundColor: 'transparent',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  {page.title}
                </Button>
              ))}
            </Box>

            {/* Admin Login Button */}
            <Box sx={{ flexGrow: 0 }}>
              <Button
                component={RouterLink}
                to="/admin/login"
                variant="outlined"
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.5)',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                  px: 3,
                  py: 1,
                  borderRadius: 0,
                  textTransform: 'none',
                  fontSize: '0.9rem',
                  letterSpacing: '0.05em',
                }}
              >
                Admin Login
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  );
};

export default Navbar; 