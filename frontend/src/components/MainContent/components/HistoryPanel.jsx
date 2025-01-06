import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton, 
  Tooltip,
  Typography,
  Chip,
  Collapse,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreIcon from '@mui/icons-material/Restore';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { generationService } from '../../../api/generationService';
import LazyImage from '../../common/LazyImage';
import './HistoryPanel.css';
import { useAuth } from '../../../contexts/AuthContext';

function HistoryPanel({ onRestorePrompt, onImageSelect }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const { isAuthenticated } = useAuth();

  const loadHistory = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await generationService.getHistory();
      setHistory(data);
    } catch (err) {
      console.error('Failed to load history:', err);
      setError(err.message || 'Failed to load history');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      loadHistory();
    }
  }, [isAuthenticated, loadHistory]);

  const handleDelete = async (id) => {
    try {
      setDeleteId(id);
      await generationService.deleteFromHistory(id);
      setHistory(history.filter(item => item.id !== id));
    } catch (err) {
      console.error('Failed to delete item:', err);
    } finally {
      setDeleteId(null);
    }
  };

  const handleRestore = (item) => {
    onRestorePrompt(item);
  };

  const handlePreview = (item) => {
    onImageSelect(item.generated_image);
  };

  if (!isAuthenticated) {
    return (
      <Box p={3} textAlign="center">
        <Typography color="textSecondary">
          Please login to view your history
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box className="history-panel">
      <Grid container spacing={2}>
        {history.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <HistoryCard
              item={item}
              onRestore={handleRestore}
              onDelete={handleDelete}
              onPreview={handlePreview}
              isDeleting={deleteId === item.id}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

function HistoryCard({ item, onRestore, onDelete, onPreview, isDeleting }) {
  const [expanded, setExpanded] = useState(false);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', { 
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="history-card">
      <CardMedia
        component="div"
        className="history-card-media"
        onClick={() => onPreview(item)}
      >
        <LazyImage
          src={item.thumbnail || item.generated_image}
          alt={item.prompt}
          className="history-card-image"
        />
        <Box className="history-card-overlay">
          <Tooltip title="Увеличить">
            <IconButton className="preview-button">
              <ZoomInIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </CardMedia>

      <CardContent className="history-card-content">
        <Box className="history-card-header">
          <Chip 
            size="small" 
            label={item.model.replace('stable-diffusion-', 'SD')}
            className="model-chip"
          />
          <Typography variant="caption" className="history-card-date">
            <AccessTimeIcon fontSize="inherit" />
            {formatDate(item.created_at)}
          </Typography>
        </Box>

        <Typography className="history-card-prompt" variant="body2">
          {item.prompt}
        </Typography>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box className="history-card-details">
            <Typography variant="caption" className="detail-item">
              <span className="detail-label">Seed:</span> {item.seed}
            </Typography>
            <Typography variant="caption" className="detail-item">
              <span className="detail-label">Steps:</span> {item.n_steps}
            </Typography>
            <Typography variant="caption" className="detail-item">
              <span className="detail-label">CFG:</span> {item.guidance_scale}
            </Typography>
          </Box>
        </Collapse>
      </CardContent>

      <CardActions className="history-card-actions">
        <Tooltip title="Показать детали">
          <IconButton 
            size="small"
            onClick={() => setExpanded(!expanded)}
            className={`expand-button ${expanded ? 'expanded' : ''}`}
          >
            <ExpandMoreIcon />
          </IconButton>
        </Tooltip>
        <Box className="action-buttons">
          <Tooltip title="Восстановить настройки">
            <IconButton onClick={() => onRestore(item)} size="small">
              <RestoreIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Удалить">
            <IconButton 
              onClick={() => onDelete(item.id)} 
              size="small"
              disabled={isDeleting}
            >
              {isDeleting ? <CircularProgress size={20} /> : <DeleteIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </CardActions>
    </Card>
  );
}

export default HistoryPanel; 