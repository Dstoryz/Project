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

function App() {
  useEffect(() => {
    const initApp = async () => {
      try {
        await generationService.initializeCSRF();
      } catch (error) {
        console.warn('CSRF initialization failed:', error);
        // Продолжаем работу даже если CSRF не инициализирован
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
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;

