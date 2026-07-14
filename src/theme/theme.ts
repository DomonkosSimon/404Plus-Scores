import { createTheme } from '@mui/material/styles';
import { glassBorder, glassSurface } from './glass';

const APPLE_SYSTEM_FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", Roboto, system-ui, sans-serif';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#007AFF' }, // iOS system blue
    secondary: { main: '#8E8E93' }, // iOS system gray
    error: { main: '#FF3B30' }, // iOS system red
    background: { default: '#F2F2F7', paper: '#FFFFFF' }, // iOS grouped background
    text: { primary: '#1C1C1E', secondary: '#6E6E73' },
    divider: 'rgba(60, 60, 67, 0.13)',
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: APPLE_SYSTEM_FONT,
    h4: { fontWeight: 600, letterSpacing: -0.3 },
    h5: { fontWeight: 600, letterSpacing: -0.2 },
    h6: { fontWeight: 600, letterSpacing: -0.1 },
    subtitle1: { fontWeight: 500 },
    button: { fontWeight: 500 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { textTransform: 'none', borderRadius: 12, paddingTop: 10, paddingBottom: 10 },
        contained: {
          backgroundImage:
            'linear-gradient(180deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 55%)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiCard: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: {
        root: { borderColor: 'rgba(60, 60, 67, 0.13)' },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255, 255, 255, 0.4)',
          ...glassSurface,
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          ...glassSurface,
          backgroundColor: 'rgba(255, 255, 255, 0.82)',
          backgroundImage: 'none',
          border: glassBorder,
          boxShadow:
            '0 20px 60px rgba(0,0,0,0.25), 0 4px 16px rgba(0,0,0,0.12)',
        },
      },
    },
    MuiTextField: {
      defaultProps: { fullWidth: true },
    },
    MuiSwitch: {
      defaultProps: { color: 'primary' },
    },
  },
});
