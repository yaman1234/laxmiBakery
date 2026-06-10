import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
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
  { title: 'Place Order', path: '/order' },
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
      setIsScrolled(window.scrollY > 50);
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
  const isSolidNav = isScrolled || !isHomePage;

  const navLinkSx = {
    my: 1,
    mx: { md: 1.5 },
    fontFamily: 'Lato, sans-serif',
    fontSize: '0.95rem',
    fontWeight: 600,
    letterSpacing: '0.04em',
    textShadow: isSolidNav ? 'none' : '0 1px 6px rgba(0,0,0,0.65)',
    position: 'relative' as const,
    '&::after': {
      content: '""',
      position: 'absolute',
      width: '0%',
      height: '2px',
      bottom: 4,
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'gold.main',
      transition: 'width 0.3s ease',
    },
    '&:hover::after': { width: '80%' },
    '&:hover': {
      backgroundColor: 'transparent',
      color: 'gold.light',
    },
  };

  return (
    <HideOnScroll>
      <AppBar
        position="fixed"
        elevation={isSolidNav ? 4 : 0}
        sx={{
          bgcolor: isSolidNav ? 'primary.main' : 'transparent',
          transition: 'all 0.3s ease-in-out',
          backgroundImage: isSolidNav
            ? 'linear-gradient(45deg, #7c3a6a 30%, #9c5589 90%)'
            : isHomePage
              ? 'linear-gradient(to bottom, rgba(15, 5, 22, 0.88) 0%, rgba(15, 5, 22, 0.45) 55%, transparent 100%)'
              : 'none',
          borderRadius: 0,
        }}
      >
        {/* Full-width bar — logo flush to the left edge */}
        <Toolbar
          disableGutters
          sx={{
            width: '100%',
            py: 1,
            pl: { xs: 2, sm: 3 },
            pr: { xs: 2, sm: 3 },
            gap: 1,
          }}
        >
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              flexShrink: 0,
              fontFamily: 'Playfair Display, serif',
              fontWeight: 700,
              fontSize: { xs: '1.35rem', md: '1.65rem' },
              color: '#ffffff',
              textDecoration: 'none',
              letterSpacing: '.04em',
              textShadow: isSolidNav ? 'none' : '0 2px 8px rgba(0,0,0,0.6)',
              '&:hover': { color: 'gold.light' },
            }}
          >
            Laxmi Bakery
          </Typography>

          <Box sx={{ display: { xs: 'none', lg: 'flex' }, ml: 3 }}>
            {pages.map((page) => (
              <Button
                key={page.title}
                component={RouterLink}
                to={page.path}
                onClick={handleCloseNavMenu}
                sx={{
                  ...navLinkSx,
                  color: location.pathname === page.path ? 'gold.main' : '#ffffff',
                  '&::after': {
                    ...navLinkSx['&::after'],
                    width: location.pathname === page.path ? '80%' : '0%',
                  },
                }}
              >
                {page.title}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <IconButton
            size="large"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            aria-label="Open navigation menu"
            onClick={handleOpenNavMenu}
            color="inherit"
            sx={{
              display: { lg: 'none' },
              color: '#ffffff',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' },
            }}
          >
            <MenuIcon />
          </IconButton>

          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{
              display: { lg: 'none' },
              '& .MuiPaper-root': {
                borderRadius: 2,
                mt: 1,
                minWidth: 200,
                boxShadow: theme.shadows[6],
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
              >
                <Typography
                  sx={{
                    fontFamily: 'Lato, sans-serif',
                    fontWeight: location.pathname === page.path ? 700 : 500,
                    color: location.pathname === page.path ? 'primary.main' : 'text.primary',
                  }}
                >
                  {page.title}
                </Typography>
              </MenuItem>
            ))}
          </Menu>

          <Button
            component={RouterLink}
            to="/admin/login"
            variant="outlined"
            size="small"
            sx={{
              flexShrink: 0,
              color: '#ffffff',
              borderColor: 'rgba(255,255,255,0.55)',
              textTransform: 'none',
              fontSize: { xs: '0.8rem', md: '0.875rem' },
              px: { xs: 1.5, md: 2.5 },
              '&:hover': {
                borderColor: '#ffffff',
                bgcolor: 'rgba(255,255,255,0.12)',
              },
            }}
          >
            Admin
          </Button>
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  );
};

export default Navbar;
