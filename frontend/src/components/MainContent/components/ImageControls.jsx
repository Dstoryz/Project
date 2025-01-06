import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import FavoriteIcon from '@mui/icons-material/Favorite';
import './ImageControls.css';

function ImageControls({ onDownload, onShare, onFavorite }) {
  return (
    <Box className="image-controls">
      <Tooltip title="Скачать изображение">
        <IconButton onClick={onDownload} color="primary">
          <DownloadIcon />
        </IconButton>
      </Tooltip>
      
      <Tooltip title="Поделиться">
        <IconButton onClick={onShare} color="primary">
          <ShareIcon />
        </IconButton>
      </Tooltip>
      
      <Tooltip title="В избранное">
        <IconButton onClick={onFavorite} color="primary">
          <FavoriteIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

export default ImageControls; 