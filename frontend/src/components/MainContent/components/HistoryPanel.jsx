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
      original_prompt: item.original_prompt,
      model: item.model || 'stable-diffusion-v1-5',
      style: item.style || 'none',
      n_steps: parseInt(item.n_steps) || 50,
      guidance_scale: parseFloat(item.guidance_scale) || 7.5,
      seed: item.seed !== null ? item.seed.toString() : '',
      width: parseInt(item.width) || 512,
      height: parseInt(item.height) || 512,
      color_scheme: item.color_scheme || 'none',
      negative_prompt: item.negative_prompt || '',
      sampler: item.sampler || 'DPM++ 2M Karras',
      clip_skip: parseInt(item.clip_skip) || 1,
      tiling: Boolean(item.tiling),
      hires_fix: Boolean(item.hires_fix),
      denoising_strength: parseFloat(item.denoising_strength) || 0.7,
      safety_checker: item.safety_checker !== false
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
            <Typography className="history-prompt">
              {item.original_prompt}
            </Typography>
            <Typography className="history-prompt-translated" variant="caption">
              EN: {item.prompt}
            </Typography>
            <Box className="history-details">
              <Typography className="history-timestamp">
                {new Date(item.created_at).toLocaleString()}
              </Typography>
              <Typography className="history-seed" variant="caption">
                Seed: {item.seed || 'Random'}
              </Typography>
              <Typography className="history-color-scheme" variant="caption">
                Color: {item.color_scheme || 'None'}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default HistoryPanel; 