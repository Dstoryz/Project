import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { generationService } from '../../../api/generationService';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import LazyImage from '../../common/LazyImage';
import './HistoryPanel.css';

function HistoryPanel({ onImageSelect, newGeneration }) {
  const [history, setHistory] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    if (newGeneration) {
      setHistory(prev => [newGeneration, ...prev]);
    }
  }, [newGeneration]);

  const loadHistory = async () => {
    try {
      const data = await generationService.getHistory();
      setHistory(data);
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await generationService.deleteFromHistory(selectedItemId);
      setHistory(history.filter(item => item.id !== selectedItemId));
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  return (
    <Box className="history-panel">
      <Typography variant="h6" className="history-title">
        История генераций
      </Typography>
      <Box className="history-list">
        {history.map((item) => (
          <Box key={item.id} className="history-item">
            <Box 
              className="history-image-container"
              onClick={() => onImageSelect(item)}
            >
              <LazyImage
                src={item.generated_image}
                alt={item.prompt}
                className="history-image"
              />
            </Box>
            <Box className="history-item-info">
              <Typography variant="body2" className="history-prompt">
                {item.prompt}
              </Typography>
              <IconButton
                size="small"
                onClick={() => {
                  setSelectedItemId(item.id);
                  setDeleteDialogOpen(true);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Box>
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
      />
    </Box>
  );
}

export default HistoryPanel; 