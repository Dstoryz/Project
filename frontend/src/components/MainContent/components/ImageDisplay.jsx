import React from 'react';
import { Paper, Box, Typography, Divider, IconButton, Tooltip, CircularProgress } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';

function ImageDisplay({ loading, generatedImage }) {
  return (
    <Paper 
      className="content-panel"
      sx={{
        width: '100%',         // Полная ширина
        maxWidth: '1024px',    // Максимальная ширина
        margin: '20px auto',   // Центрирование и отступы
        backgroundColor: '#2d2d2d'
      }}
    >
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2,
        padding: '16px 20px'
      }}>
        <Typography variant="h6">
          Результат генерации
        </Typography>
        <Tooltip title="Настройки">
          <IconButton className="settings-button">
            <SettingsIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <Divider />
      <Box 
        className="image-container"
        sx={{
          height: '720px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
          backgroundColor: '#1a1a1a'
        }}
      >
        {loading ? (
          <CircularProgress sx={{ color: '#4CAF50' }} />
        ) : generatedImage ? (
          <img
            src={generatedImage}
            alt="Generated"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain'
            }}
          />
        ) : (
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            Здесь появится сгенерированное изображение
          </Typography>
        )}
      </Box>
    </Paper>
  );
}

export default ImageDisplay; 