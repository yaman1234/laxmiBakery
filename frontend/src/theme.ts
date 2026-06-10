import { createTheme } from '@mui/material/styles';
import { orange, grey } from '@mui/material/colors';

declare module '@mui/material/styles' {
  interface Palette {
    gold: Palette['primary'];
    whatsapp: Palette['primary'];
  }
  interface PaletteOptions {
    gold?: PaletteOptions['primary'];
    whatsapp?: PaletteOptions['primary'];
  }
  interface TypographyVariants {
    devanagari: React.CSSProperties;
  }
  interface TypographyVariantsOptions {
    devanagari?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    devanagari: true;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    gold: true;
    whatsapp: true;
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#7c3a6a',
      light: '#9c5589',
      dark: '#5c1d4c',
      contrastText: '#fff',
    },
    secondary: {
      main: '#e7b8a3',
      light: '#ffebd7',
      dark: '#b48873',
      contrastText: '#4e342e',
    },
    background: {
      default: '#f9f6f2',
      paper: '#fff',
    },
    text: {
      primary: '#4e342e',
      secondary: '#7c3a6a',
    },
    error: {
      main: orange[400],
    },
    gold: {
      main: '#c9a063',
      light: '#dbb77d',
      dark: '#b68d4c',
      contrastText: '#fff',
    },
    whatsapp: {
      main: '#25D366',
      light: '#3de07a',
      dark: '#1da851',
      contrastText: '#fff',
    },
    grey: grey,
  },
  typography: {
    fontFamily: ['Lato', 'Arial', 'sans-serif'].join(','),
    h1: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 700,
      fontSize: '3.5rem',
      color: '#7c3a6a',
      letterSpacing: '0.02em',
      lineHeight: 1.2,
    },
    h2: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 700,
      fontSize: '2.75rem',
      color: '#7c3a6a',
      letterSpacing: '0.02em',
      lineHeight: 1.3,
    },
    h3: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 700,
      fontSize: '2.25rem',
      color: '#7c3a6a',
      letterSpacing: '0.01em',
      lineHeight: 1.4,
    },
    h4: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 700,
      fontSize: '1.75rem',
      color: '#7c3a6a',
      letterSpacing: '0.01em',
      lineHeight: 1.4,
    },
    h5: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 700,
      fontSize: '1.5rem',
      color: '#7c3a6a',
      letterSpacing: '0.01em',
    },
    h6: {
      fontFamily: 'Lato, sans-serif',
      fontWeight: 700,
      fontSize: '1.25rem',
      color: '#4e342e',
      letterSpacing: '0.02em',
    },
    devanagari: {
      fontFamily: '"Noto Serif Devanagari", serif',
      fontWeight: 700,
      fontSize: '1.75rem',
      lineHeight: 1.5,
      letterSpacing: '0.02em',
    },
    subtitle1: {
      fontFamily: 'Lato, sans-serif',
      fontSize: '1.125rem',
      letterSpacing: '0.02em',
      lineHeight: 1.6,
    },
    body1: {
      fontFamily: 'Lato, sans-serif',
      fontSize: '1rem',
      letterSpacing: '0.01em',
      lineHeight: 1.7,
    },
    body2: {
      fontFamily: 'Lato, sans-serif',
      fontSize: '0.875rem',
      letterSpacing: '0.01em',
      lineHeight: 1.6,
    },
    button: {
      fontFamily: 'Lato, sans-serif',
      fontWeight: 700,
      fontSize: '1rem',
      letterSpacing: '0.05em',
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 18,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 700,
          padding: '10px 24px',
          boxShadow: '0 2px 8px rgba(124,58,106,0.12)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(124,58,106,0.2)',
          },
        },
        // Solid primary plum — matches theme palette primary.main (#7c3a6a)
        containedPrimary: ({ theme: muiTheme }) => ({
          backgroundColor: muiTheme.palette.primary.main,
          color: muiTheme.palette.primary.contrastText,
          backgroundImage: 'none',
          '&:hover': {
            backgroundColor: muiTheme.palette.primary.dark,
            backgroundImage: 'none',
          },
        }),
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          boxShadow: '0 4px 24px rgba(124,58,106,0.08)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 32px rgba(124,58,106,0.12)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 24,
        },
        elevation1: {
          boxShadow: '0 2px 12px rgba(124,58,106,0.08)',
        },
        elevation2: {
          boxShadow: '0 4px 16px rgba(124,58,106,0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 14,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#7c3a6a',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontFamily: 'Lato, sans-serif',
          fontWeight: 600,
        },
      },
    },
  },
});

export { theme };
