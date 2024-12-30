import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import Header from './components/Header/Header';
import LoginPage from './components/Auth/LoginPage';
import RegisterPage from './components/Auth/RegisterPage';
import MainContent from './components/MainContent/MainContent';
import { useAuth } from './hooks/useAuth';
import { theme } from './theme/theme';
import './styles/global.css';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app-container">
        <Header />
        <Container component="main" maxWidth="xl" className="main-content">
          <Routes>
            <Route 
              path="/" 
              element={isAuthenticated ? <MainContent /> : <Navigate to="/login" />} 
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default App;

