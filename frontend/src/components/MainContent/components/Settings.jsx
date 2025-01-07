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
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const generateRandomSeed = () => {
    const randomSeed = Math.floor(Math.random() * 1000000);
    onChange({ target: { name: 'seed', value: randomSeed } });
  };

  const handleCopySeed = () => {
    if (formData.seed) {
      navigator.clipboard.writeText(formData.seed.toString());
      setNotification({
        open: true,
        message: 'Seed скопирован в буфер обмена',
        severity: 'success'
      });
    }
  };

  return (
    <Paper className="settings-panel">
      <Typography variant="h6" className="settings-title">
        Настройки генерации
      </Typography>

      <Box className="settings-control">
        <FormControl fullWidth>
          <InputLabel>Модель</InputLabel>
          <Select
            value={formData.model}
            onChange={onChange}
            name="model"
            label="Модель"
          >
            {MODEL_OPTIONS.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box className="settings-control">
        <FormControl fullWidth>
          <InputLabel>Стиль</InputLabel>
          <Select
            value={formData.style}
            onChange={onChange}
            name="style"
            label="Стиль"
          >
            {STYLE_OPTIONS.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box className="settings-group">
        <Box className="settings-subtitle">
          <Typography variant="subtitle2">
            Количество шагов
            <Tooltip title="Большее количество шагов может улучшить качество, но увеличит время генерации">
              <IconButton size="small">
                <InfoIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Typography>
        </Box>
        <Box className="settings-slider">
          <Slider
            value={formData.n_steps}
            onChange={(e, value) => onChange({ target: { name: 'n_steps', value } })}
            min={20}
            max={150}
            step={1}
            marks={[
              { value: 20, label: '20' },
              { value: 75, label: '75' },
              { value: 150, label: '150' }
            ]}
            valueLabelDisplay="auto"
          />
        </Box>
      </Box>

      <Box className="settings-group">
        <Box className="settings-subtitle">
          <Typography variant="subtitle2">
            Guidance Scale
            <Tooltip title="Контролирует насколько точно модель следует промпту. Высокие значения дают более точные, но менее креативные результаты">
              <IconButton size="small">
                <InfoIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Typography>
        </Box>
        <Box className="settings-slider">
          <Slider
            value={formData.guidance_scale}
            onChange={(e, value) => onChange({ target: { name: 'guidance_scale', value } })}
            min={1}
            max={20}
            step={0.1}
            marks={[
              { value: 1, label: '1' },
              { value: 7.5, label: '7.5' },
              { value: 20, label: '20' }
            ]}
            valueLabelDisplay="auto"
          />
        </Box>
      </Box>

      <Box className="settings-group">
        <Box className="settings-subtitle">
          <Typography variant="subtitle2">
            Seed
            <Tooltip title="Seed определяет начальный шум для генерации. Одинаковый seed с теми же настройками даст похожий результат">
              <IconButton size="small">
                <InfoIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Typography>
        </Box>
        <TextField
          fullWidth
          name="seed"
          type="number"
          value={formData.seed || ''}
          onChange={onChange}
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