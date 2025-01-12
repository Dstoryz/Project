import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { generationService } from '../../api/generationService';
import HistoryCard from './HistoryCard';
import './History.css';

function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [filters, setFilters] = useState({
    model: '',
    style: '',
    dateRange: 'all',
    searchQuery: ''
  });

  useEffect(() => {
    loadHistory();
  }, [filters]);

  const loadHistory = async () => {
    try {
      const data = await generationService.getHistory(filters);
      setHistory(data);
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  };

  return (
    <Box className="history-page">
      <Typography variant="h4" className="history-title">
        Generation History
      </Typography>

      <Box className="history-filters">
        <TextField
          label="Search prompts"
          value={filters.searchQuery}
          onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
        />
        <FormControl>
          <InputLabel>Model</InputLabel>
          <Select
            value={filters.model}
            onChange={(e) => setFilters({ ...filters, model: e.target.value })}
          >
            <MenuItem value="">All Models</MenuItem>
            {/* Add model options */}
          </Select>
        </FormControl>
        {/* Add other filters */}
      </Box>

      <Grid container spacing={3} className="history-grid">
        {history.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <HistoryCard item={item} onDelete={loadHistory} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default HistoryPage; 