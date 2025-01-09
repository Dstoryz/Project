import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import Header from './components/Header/Header';
import LoginPage from './components/Auth/LoginPage';
import RegisterPage from './components/Auth/RegisterPage';
import MainContent from './components/MainContent/MainContent';
import { AuthProvider } from './contexts/AuthContext';
import { theme } from './theme/theme';
import './styles/global.css';
import ProtectedRoute from './components/ProtectedRoute';
import { generationService } from './api/generationService';
import TermsOfService from './components/Legal/TermsOfService';

function App() {
  useEffect(() => {
    const initApp = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          console.log('Found existing token');
        }
      } catch (error) {
        console.warn('App initialization error:', error);
      }
    };
    
    initApp();
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app-container">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={
                <ProtectedRoute>
                  <MainContent />
                </ProtectedRoute>
              } />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/terms" element={<TermsOfService />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;

