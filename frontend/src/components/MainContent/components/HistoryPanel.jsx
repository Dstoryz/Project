import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { generationService } from '../../../api/generationService';
import './HistoryPanel.css';

function HistoryPanel({ onImageSelect, newGeneration }) {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
      setIsLoading(true);
      const data = await generationService.getHistory();
      // Сортировка истории по времени создания
      const sortedHistory = [...data].sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      );
      setHistory(sortedHistory);
    } catch (error) {
      console.error('Error loading history:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemClick = (item) => {
    onImageSelect({
      generated_image: item.generated_image,
      prompt: item.prompt,
      model: item.model,
      style: item.style,
      n_steps: item.n_steps,
      guidance_scale: item.guidance_scale,
      seed: item.seed
    });
  };

  if (isLoading) {
    return <Typography className="loading-message">Loading history...</Typography>;
  }

  if (error) {
    return <Typography className="error-message">Error loading history: {error}</Typography>;
  }

  if (!history.length) {
    return <Typography>No history available.</Typography>;
  }

  return (
    <Box className="history">
      <Typography variant="h6" className="history-title">
        Your Generated Images
      </Typography>
      <Box className="history-grid">
        {history.map((item) => (
          <Box 
            key={item.id} 
            className="history-item"
            onClick={() => handleItemClick(item)}
          >
            <img
              src={item.generated_image && item.generated_image.startsWith('http')
                ? item.generated_image
                : `http://localhost:8000${item.generated_image}`}
              alt={item.prompt}
              className="history-image"
            />
            <Typography className="history-prompt">{item.prompt}</Typography>
            <Typography className="history-timestamp">
              {new Date(item.created_at).toLocaleString()}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default HistoryPanel; 