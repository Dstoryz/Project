import React from 'react';
import { Paper, Box, Typography, Divider, IconButton, Tooltip, CircularProgress } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';

function ImageDisplay({ loading, generatedImage }) {
  return (
    <Paper className="content-panel">
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2,
        flexWrap: 'wrap',
        gap: 1
      }}>
        <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
          Результат генерации
        </Typography>
        <Tooltip title="Настройки">
          <IconButton className="settings-button">
            <SettingsIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <Divider className="divider" />
      <Box className="image-container">
        {loading ? (
          <CircularProgress sx={{ color: '#4CAF50' }} />
        ) : generatedImage ? (
          <img
            src={generatedImage}
            alt="Generated"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
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