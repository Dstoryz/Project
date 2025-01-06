import React from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function ImagePreviewDialog({ open, image, onClose }) {
  if (!image) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="lg"
      fullWidth
    >
      <Box className="preview-dialog-header">
        <Typography variant="h6" className="preview-dialog-title">
          {image.prompt}
        </Typography>
        <IconButton onClick={onClose} color="inherit">
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent className="preview-dialog-content">
        <img
          src={image.generated_image}
          alt={image.prompt}
          className="preview-dialog-image"
        />
      </DialogContent>
    </Dialog>
  );
}

export default ImagePreviewDialog; 