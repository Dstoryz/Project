import React, { useState } from 'react';
import { 
  Paper, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Slider,
  Box,
  TextField,
  Tooltip,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert
} from '@mui/material';
import { STYLE_OPTIONS, MODEL_OPTIONS } from '../constants';
import InfoIcon from '@mui/icons-material/Info';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RefreshIcon from '@mui/icons-material/Refresh';
import './Settings.css';

function Settings({ formData, onChange }) {
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const handleSliderChange = (name) => (event, newValue) => {
    onChange({ target: { name, value: newValue } });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    onChange({ target: { name, value } });
  };

  const handleCopySeed = async () => {
    try {
      await navigator.clipboard.writeText(formData.seed);
      setNotification({
        open: true,
        message: 'Seed скопирован в буфер обмена',
        severity: 'success'
      });
    } catch (err) {
      setNotification({
        open: true,
        message: 'Не удалось скопировать seed',
        severity: 'error'
      });
    }
  };

  const generateRandomSeed = () => {
    const newSeed = Math.floor(Math.random() * 1000000);
    onChange({ target: { name: 'seed', value: newSeed } });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Paper className="settings-panel" elevation={0}>
      <Typography variant="h6" className="settings-title">
        Generation Settings
      </Typography>

      <FormControl fullWidth className="settings-control">
        <InputLabel>Model</InputLabel>
        <Select
          name="model"
          value={formData.model}
          onChange={onChange}
          label="Model"
        >
          {MODEL_OPTIONS.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth className="settings-control">
        <InputLabel>Style</InputLabel>
        <Select
          name="style"
          value={formData.style}
          onChange={onChange}
          label="Style"
        >
          {STYLE_OPTIONS.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box className="settings-slider">
        <Typography gutterBottom>
          Steps: {formData.n_steps}
        </Typography>
        <Slider
          value={formData.n_steps}
          onChange={handleSliderChange('n_steps')}
          min={50}
          max={150}
          step={1}
          marks={[
            { value: 50, label: '50' },
            { value: 100, label: '100' },
            { value: 150, label: '150' }
          ]}
        />
      </Box>

      <Box className="settings-slider">
        <Typography gutterBottom>
          Guidance Scale: {formData.guidance_scale}
        </Typography>
        <Slider
          value={formData.guidance_scale}
          onChange={handleSliderChange('guidance_scale')}
          min={1}
          max={20}
          step={0.1}
          marks={[
            { value: 1, label: '1' },
            { value: 10, label: '10' },
            { value: 20, label: '20' }
          ]}
        />
      </Box>

      <Box className="settings-group">
        <Typography variant="subtitle2" className="settings-subtitle">
          Seed
          <Tooltip title="Seed определяет начальное состояние генерации. Одинаковый seed и промпт дадут похожий результат">
            <IconButton size="small">
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Typography>
        <TextField
          fullWidth
          name="seed"
          type="number"
          value={formData.seed || ''}
          onChange={handleChange}
          size="small"
          placeholder="Случайное значение"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Сгенерировать случайный seed">
                  <IconButton
                    onClick={generateRandomSeed}
                    edge="end"
                    size="small"
                  >
                    <RefreshIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Скопировать seed">
                  <span>
                    <IconButton
                      onClick={handleCopySeed}
                      edge="end"
                      size="small"
                      disabled={!formData.seed}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}

export default Settings; 