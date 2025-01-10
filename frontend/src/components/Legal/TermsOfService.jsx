import React from 'react';
import { Box, Typography, Container, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Legal.css';

function TermsOfService() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" className="terms-container">
      <Paper elevation={3} className="terms-paper">
        <Typography variant="h4" gutterBottom className="terms-title">
          Пользовательское соглашение
        </Typography>

        <Box className="terms-content">
          <Typography variant="h5" gutterBottom>1. Общие положения</Typography>
          <Typography paragraph>
            1.1. Настоящее Пользовательское соглашение регулирует отношения между сервисом Image Generator (далее — «Сервис») и пользователем сети Интернет (далее — «Пользователь»), возникающие при использовании Сервиса.
          </Typography>
          <Typography paragraph>
            1.2. Начиная использовать Сервис, Пользователь подтверждает, что принимает условия настоящего Соглашения, а также Политики конфиденциальности Сервиса.
          </Typography>

          <Typography variant="h5" gutterBottom>
            2. Предмет соглашения
          </Typography>
          <Typography paragraph>
            2.1. Сервис предоставляет Пользователю возможность генерации изображений с использованием искусственного интеллекта на основе текстовых описаний (промптов).
          </Typography> 
          <Typography variant="h5" gutterBottom>
          3. Права и обязанности пользователя
          </Typography>

          {/* Добавьте остальные разделы соглашения */}

          <Typography variant="h5" gutterBottom>10. Заключительные положения</Typography>
          <Typography paragraph>
            10.1. К настоящему Соглашению применяется законодательство Российской Федерации.
          </Typography>
          <Typography paragraph>
            10.2. Все споры разрешаются путем переговоров.
          </Typography>

          <Typography variant="caption" display="block" className="terms-date">
            Дата последнего обновления: {new Date().toLocaleDateString()}
          </Typography>
        </Box>

        <Box className="terms-actions">
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => navigate(-1)}
          >
            Назад
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default TermsOfService; 