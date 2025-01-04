import React from 'react';
import { Paper, Box, Typography, Divider, IconButton, Tooltip, CircularProgress } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import './ImageDisplay.css';

function ImageDisplay({ loading, generatedImage }) {
  return (
    <Paper className="content-panel">
      <Box className="header-box">
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
      <Box className="image-container">
        {loading ? (
          <CircularProgress className="progress-indicator" />
        ) : generatedImage ? (
          <img
            src={generatedImage}
            alt="Generated"
            className="generated-image"
          />
        ) : (
          <Typography className="placeholder-text">
            Здесь появится сгенерированное изображение
          </Typography>
        )}
      </Box>
    </Paper>
  );
}

export default ImageDisplay; 