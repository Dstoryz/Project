import { createTheme } from '@mui/material';

// Определяем константы для цветов
const COLORS = {
  PRIMARY: '#1976d2',
  SECONDARY: '#dc004e',
};

export const theme = createTheme({
  palette: {
    primary: {
      main: COLORS.PRIMARY,
    },
    secondary: {
      main: COLORS.SECONDARY,
    },
  },
}); 