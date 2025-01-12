import React from 'react';
import { Box, Container, Typography, Link, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <Box component="footer" className="footer">
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" className="footer-title">
              Image Generator
            </Typography>
            <Typography variant="body2" className="footer-description">
              Создавайте уникальные изображения с помощью искусственного интеллекта
            </Typography>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="h6" className="footer-title">
              Документация
            </Typography>
            <Box className="footer-links">
              <Link onClick={() => navigate('/terms')} className="footer-link">
                Пользовательское соглашение
              </Link>
              <Link onClick={() => navigate('/privacy')} className="footer-link">
                Политика конфиденциальности
              </Link>
              <Link onClick={() => navigate('/faq')} className="footer-link">
                FAQ
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="h6" className="footer-title">
              Контакты
            </Typography>
            <Box className="footer-links">
              <Link href="mailto:support@imagegen.com" className="footer-link">
                support@imagegen.com
              </Link>
              <Link href="https://github.com/yourusername" className="footer-link" target="_blank">
                GitHub
              </Link>
            </Box>
          </Grid>
        </Grid>

        <Box className="footer-bottom">
          <Typography variant="body2" className="footer-copyright">
            © {currentYear} Image Generator. Все права защищены.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer; 