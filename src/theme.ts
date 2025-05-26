import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF4500', // Orange (from logo)
      light: '#FF6B3D',
      dark: '#CC3700',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#DEB887', // Burlywood
      light: '#F5DEB3', // Wheat
      dark: '#D2691E', // Chocolate
      contrastText: '#000000',
    },
    background: {
      default: '#FFF8DC', // Cornsilk
      paper: '#FFFFFF',
    },
    text: {
      primary: '#3E2723', // Dark Brown
      secondary: '#5D4037', // Brown
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 500,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #DEB887',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#FFF8DC',
          borderRight: '1px solid #DEB887',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(255, 69, 0, 0.1)',
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: '#FF4500',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(255, 69, 0, 0.04)',
          },
        },
      },
    },
  },
});

export default theme; 