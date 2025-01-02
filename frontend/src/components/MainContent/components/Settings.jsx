import React from 'react';
import { Paper, Typography, Divider, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { STYLE_OPTIONS, MODEL_OPTIONS, IMAGE_SIZES } from '../constants';

function Settings({ formData, onChange, error }) {
  return (
    <Paper className="content-panel">
      <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
        Настройки
      </Typography>
      <Divider className="divider" />
      
      <FormControl fullWidth className="form-control">
        <InputLabel>Стиль</InputLabel>
        <Select
          name="style"
          value={formData.style}
          onChange={onChange}
          label="Стиль"
        >
          {STYLE_OPTIONS.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Аналогично для model и size */}
      
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Paper>
  );
}

export default Settings; 