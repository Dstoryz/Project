import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid,
  IconButton, 
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreIcon from '@mui/icons-material/Restore';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import RefreshIcon from '@mui/icons-material/Refresh';
import { generationService } from '../../../api/generationService';
import './HistoryPanel.css';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import ImagePreviewDialog from './ImagePreviewDialog';
import LazyImage from '../../common/LazyImage';

function HistoryPanel({ onRestorePrompt, onImageSelect }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filteredHistory, setFilteredHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    filterAndSortHistory();
  }, [history, searchQuery, sortBy, sortOrder]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading history...');
      const data = await generationService.getHistory();
      console.log('Loaded history:', data);
      setHistory(data);
    } catch (err) {
      console.error('History loading error:', err);
      setError(err.response?.data?.error || 'Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortHistory = () => {
    let filtered = [...history];

    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.prompt.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return sortOrder === 'desc' 
            ? new Date(b.created_at) - new Date(a.created_at)
            : new Date(a.created_at) - new Date(b.created_at);
        case 'prompt':
          return sortOrder === 'desc'
            ? b.prompt.localeCompare(a.prompt)
            : a.prompt.localeCompare(b.prompt);
        default:
          return 0;
      }
    });

    setFilteredHistory(filtered);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  const handleRestore = (item) => {
    onRestorePrompt({
      prompt: item.prompt,
      model: item.model,
      style: item.style,
      n_steps: item.n_steps,
      guidance_scale: item.guidance_scale,
      seed: item.seed
    });
  };

  const handleDelete = async (id) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    try {
      await generationService.deleteFromHistory(deleteId);
      setHistory(history.filter(item => item.id !== deleteId));
      setNotification({
        open: true,
        message: 'Изображение успешно удалено',
        severity: 'success'
      });
    } catch (err) {
      setNotification({
        open: true,
        message: 'Не удалось удалить изображение',
        severity: 'error'
      });
      console.error('Delete error:', err);
    } finally {
      setDeleteId(null);
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handlePreview = (item) => {
    setPreviewImage(item);
  };

  const handleCardClick = (item) => {
    onRestorePrompt({
      prompt: item.prompt,
      model: item.model,
      style: item.style,
      n_steps: item.n_steps,
      guidance_scale: item.guidance_scale,
      seed: item.seed
    });
    onImageSelect(item.generated_image);
  };

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
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={loadHistory}
          startIcon={<RefreshIcon />}
        >
          Попробовать снова
        </Button>
      </Box>
    );
  }

  if (!history.length) {
    return (
      <Box p={3} textAlign="center">
        <Typography color="textSecondary">
          История генераций пуста
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="history-panel">
      <Typography variant="h6" className="history-title">
        История генераций
      </Typography>
      
      <Box className="history-filters">
        <TextField
          size="small"
          placeholder="Поиск по промпту"
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          className="search-field"
        />
        
        <Box className="sort-controls">
          <FormControl size="small">
            <Select
              value={sortBy}
              onChange={handleSortChange}
              displayEmpty
            >
              <MenuItem value="date">По дате</MenuItem>
              <MenuItem value="prompt">По промпту</MenuItem>
            </Select>
          </FormControl>
          
          <Tooltip title="Изменить порядок сортировки">
            <IconButton onClick={toggleSortOrder}>
              <SortIcon className={sortOrder === 'desc' ? 'sort-icon-desc' : 'sort-icon-asc'} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Grid container spacing={2}>
        {filteredHistory.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card 
              className="history-card"
              onClick={() => handleCardClick(item)}
            >
              <CardMedia
                component="div"
                className="history-card-media"
                onClick={() => handlePreview(item)}
              >
                <LazyImage
                  src={item.generated_image}
                  alt={item.prompt}
                  className="history-card-image"
                  onError={(e) => {
                    console.error('Failed to load image:', e);
                  }}
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
                <Typography className="history-card-prompt" title={item.prompt}>
                  {item.prompt}
                </Typography>
                
                <Box className="history-card-details">
                  <Typography variant="caption" className="history-card-info">
                    <span className="info-label">Модель:</span> {item.model}
                  </Typography>
                  <Typography variant="caption" className="history-card-info">
                    <span className="info-label">Seed:</span> {item.seed}
                  </Typography>
                  <Typography variant="caption" className="history-card-info">
                    <span className="info-label">Шаги:</span> {item.n_steps}
                  </Typography>
                  <Typography variant="caption" className="history-card-info">
                    <span className="info-label">CFG:</span> {item.guidance_scale}
                  </Typography>
                </Box>
              </CardContent>

              <CardActions className="history-card-actions">
                <Tooltip title="Восстановить настройки">
                  <IconButton 
                    onClick={() => handleRestore(item)}
                    size="small"
                    className="history-action-button"
                  >
                    <RestoreIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Удалить">
                  <IconButton
                    onClick={() => handleDelete(item.id)}
                    size="small"
                    color="error"
                    className="history-action-button"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <DeleteConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
      
      <ImagePreviewDialog
        open={previewImage !== null}
        image={previewImage}
        onClose={() => setPreviewImage(null)}
      />
      
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
      >
        <Alert severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default HistoryPanel; 