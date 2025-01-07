import React from 'react';
import { Box, CircularProgress, Typography, Paper } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import ImageControls from './ImageControls';
import './ImageDisplay.css';

function ImageDisplay({ image, loading, error }) {
  return (
    <Paper className="image-display" elevation={0}>
      {loading ? (
        <Box className="image-display-loading">
          <CircularProgress size={48} />
          <Typography variant="body1" color="text.secondary">
            Генерация изображения может занять несколько минут...
          </Typography>
        </Box>
      ) : error ? (
        <Box className="image-display-error">
          <Typography color="error">
            {error}
          </Typography>
        </Box>
      ) : image ? (
        <Box className="image-display-result">
          <img 
            src={image} 
            alt="Generated" 
            className="generated-image"
          />
          <ImageControls />
        </Box>
      ) : (
        <Box className="image-display-placeholder">
          <ImageIcon sx={{ fontSize: 64, color: 'text.disabled' }} />
          <Typography variant="body1" color="text.secondary">
            Здесь появится ваше сгенерированное изображение
          </Typography>
        </Box>
      )}
    </Paper>
  );
}

export default ImageDisplay; 