import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#8B4513', // Saddle Brown - representing university/education
      light: '#A0522D', // Sienna
      dark: '#654321', // Dark Brown
    },
    secondary: {
      main: '#DAA520', // Goldenrod - representing trade/commerce
      light: '#FFD700', // Gold
      dark: '#B8860B', // Dark Goldenrod
    },
    background: {
      default: '#FFFAF0', // Floral White - warm, inviting background
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2C1810', // Dark Brown - for better readability
      secondary: '#5C4033', // Brown - for secondary text
    },
    error: {
      main: '#DC3545',
      light: '#FF6B6B',
      dark: '#C82333',
    },
    warning: {
      main: '#FFC107',
      light: '#FFE082',
      dark: '#FFA000',
    },
    success: {
      main: '#28A745',
      light: '#48C774',
      dark: '#218838',
    },
    info: {
      main: '#17A2B8',
      light: '#4DD4E7',
      dark: '#117A8B',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Inter", "Roboto", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 500,
    },
    subtitle2: {
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(139, 69, 19, 0.15)',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 2px 12px rgba(139, 69, 19, 0.08)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(139, 69, 19, 0.08)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 4px 20px rgba(139, 69, 19, 0.12)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#8B4513',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#8B4513',
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&:hover': {
            backgroundColor: 'rgba(139, 69, 19, 0.05)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          backgroundImage: 'none',
          boxShadow: '0 2px 12px rgba(139, 69, 19, 0.08)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            backgroundColor: 'rgba(139, 69, 19, 0.05)',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: 'none',
          boxShadow: '2px 0 12px rgba(139, 69, 19, 0.08)',
          backgroundColor: '#FFFAF0',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(139, 69, 19, 0.1)',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease-in-out',
          backgroundColor: '#8B4513',
        },
      },
    },
  },
});

export default theme; 