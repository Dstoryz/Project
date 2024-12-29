import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import Header from './components/Header/Header';
import { theme } from './theme/theme';
import './styles/global.css';

// Временные компоненты для тестирования
const HomePage = () => <div>Home Page</div>;
const LoginPage = () => <div>Login Page</div>;

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app-container">
          <Header />
          <Container component="main" maxWidth="xl" className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </Container>
        </div>
      </ThemeProvider>
    </>
  );
}

export default App;

