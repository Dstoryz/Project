import React, { useState, useEffect, useCallback } from 'react';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Pagination,
  Box,
  Chip,
  Rating
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import { formatDistanceToNow } from 'date-fns';
import './HistoryPanel.css';

function HistoryPanel() {
  const [history, setHistory] = useState({ items: [], total: 0 });
  const [page, setPage] = useState(1);
  const [filters] = useState({});
  const pageSize = 12;

  const fetchHistory = useCallback(async () => {
    try {
      const queryParams = new URLSearchParams({
        page: page,
        page_size: pageSize,
        ...filters
      });
      
      const response = await fetch(`/api/history?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch history');
      }
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  }, [page, filters, pageSize]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  if (!history.items.length) {
    return (
      <Box className="history-panel" display="flex" justifyContent="center" alignItems="center">
        <Typography variant="h6" color="textSecondary">
          No images in history yet
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="history-panel">
      <Grid container spacing={2}>
        {history.items.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
            <Card className="history-card">
              <CardMedia
                component="img"
                height="200"
                image={item.thumbnail_url || '/placeholder.png'}
                alt={item.prompt}
                className="history-image"
                onClick={() => window.open(item.image_url, '_blank')}
              />
              <CardContent>
                <Typography variant="body2" className="history-prompt" title={item.prompt}>
                  {item.prompt}
                </Typography>
                <Box className="history-details">
                  <Chip 
                    label={item.model} 
                    size="small" 
                    className="history-chip"
                  />
                  <Chip 
                    label={item.style} 
                    size="small" 
                    className="history-chip"
                  />
                  <Typography variant="caption" color="textSecondary">
                    {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                  </Typography>
                </Box>
                <Box className="history-metrics">
                  <Box className="history-stat">
                    <IconButton size="small">
                      <FavoriteIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="caption">{item.favorite_count}</Typography>
                  </Box>
                  <Box className="history-stat">
                    <IconButton size="small">
                      <CommentIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="caption">{item.comment_count}</Typography>
                  </Box>
                  <Rating 
                    value={item.avg_rating || 0} 
                    precision={0.5} 
                    size="small" 
                    readOnly 
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {history.total > pageSize && (
        <Box className="history-pagination">
          <Pagination 
            count={Math.ceil(history.total / pageSize)} 
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
}

export default HistoryPanel; 