import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Box,
  Dialog
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import { generationService } from '../../api/generationService';

function HistoryCard({ item, onDelete }) {
  const [showDialog, setShowDialog] = useState(false);
  const [isFavorite, setIsFavorite] = useState(item.is_favorite);

  const handleDelete = async () => {
    try {
      await generationService.deleteImage(item.id);
      onDelete();
    } catch (error) {
      console.error('Failed to delete image:', error);
    }
  };

  const toggleFavorite = async () => {
    try {
      await generationService.toggleFavorite(item.id);
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  return (
    <Card className="history-card">
      <CardMedia
        component="img"
        image={item.thumbnail_url || item.image_url}
        alt={item.prompt}
        onClick={() => setShowDialog(true)}
      />
      <CardContent>
        <Typography variant="body2" className="history-prompt">
          {item.prompt}
        </Typography>
        <Box className="history-actions">
          <IconButton onClick={toggleFavorite}>
            <StarIcon color={isFavorite ? "primary" : "inherit"} />
          </IconButton>
          <IconButton onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </Box>
      </CardContent>

      <Dialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        maxWidth="lg"
      >
        <img src={item.image_url} alt={item.prompt} style={{ width: '100%' }} />
      </Dialog>
    </Card>
  );
}

export default HistoryCard; 