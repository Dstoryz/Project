import { Container, Box, Grid } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import MainContent from './components/MainContent/MainContent';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Box sx={{ flexGrow: 1 }}>
          <Header />
          <Container maxWidth="xl">
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} md={3}>
                <Sidebar />
              </Grid>
              <Grid item xs={12} md={9}>
                <MainContent />
              </Grid>
            </Grid>
          </Container>
        </Box>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

