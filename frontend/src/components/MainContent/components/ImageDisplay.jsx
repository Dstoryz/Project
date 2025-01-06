import React from 'react';
import { Box, CircularProgress, Typography, Paper, Button } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import RefreshIcon from '@mui/icons-material/Refresh';
import ImageControls from './ImageControls';
import './ImageDisplay.css';

function ImageDisplay({ 
  loading, 
  generatedImage, 
  error, 
  onRetry,
  onDownload,
  onShare,
  onFavorite 
}) {
  const handleImageError = (e) => {
    console.error('Image failed to load:', e);
    e.target.src = '';
  };

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
          <Typography color="error" gutterBottom>
            {error}
          </Typography>
          {onRetry && (
            <Button
              startIcon={<RefreshIcon />}
              variant="outlined"
              color="primary"
              onClick={onRetry}
            >
              Попробовать снова
            </Button>
          )}
        </Box>
      ) : generatedImage ? (
        <Box className="image-display-result">
          <img 
            src={generatedImage} 
            alt="Generated" 
            className="generated-image"
            onError={handleImageError}
          />
          <ImageControls 
            onDownload={onDownload}
            onShare={onShare}
            onFavorite={onFavorite}
          />
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