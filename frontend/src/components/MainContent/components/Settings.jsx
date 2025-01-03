import React from 'react';
import { 
  Paper, 
  Typography, 
  Divider, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Slider,
  Box 
} from '@mui/material';

// Настройки из backend (models_config.py)
const MODEL_OPTIONS = [
  { 
    value: 'stable-diffusion-v1-5', 
    label: 'V1 - Анимационные, мультяшные изображения',
    details: 'Стабильная версия для создания мультяшных изображений'
  },
  { 
    value: 'stable-diffusion-2-1', 
    label: 'V2 - Кинематографические сценарии',
    details: 'Улучшенная версия для реалистичных изображений'
  },
  { 
    value: 'openjourney-v4', 
    label: 'V4 - Универсальная модель',
    details: 'Современная версия для разнообразных стилей'
  }
];

const STYLE_OPTIONS = [
  { value: 'none', label: 'Без стиля' },
  { value: 'cartoon', label: 'Мультяшный' },
  { value: 'realistic', label: 'Реализм' },
  { value: 'anime', label: 'Аниме' },
  { value: 'cyberpunk', label: 'Киберпанк' },
  { value: 'steampunk', label: 'Стимпанк' },
  { value: 'portrait', label: 'Портретный' },
  { value: 'dark', label: 'Тёмный' },
  { value: 'cinematic', label: 'Кинематографичный' }
];

const IMAGE_SIZES = [
  { value: '768x896', label: '768x896' },
  { value: '768x1024', label: '768x1024' },
  { value: '896x768', label: '896x768' },
  { value: '1024x1024', label: '1024x1024' }
];

function Settings({ formData, onChange, error }) {
  return (
    <Paper className="content-panel">
      <Typography variant="h6" gutterBottom>
        Настройки генерации
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {/* Выбор модели */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Модель</InputLabel>
        <Select
          name="model"
          value={formData.model}
          onChange={onChange}
          label="Модель"
        >
          {MODEL_OPTIONS.map(option => (
            <MenuItem key={option.value} value={option.value}>
              <Box>
                <Typography variant="subtitle1">{option.label}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {option.details}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Выбор стиля */}
      <FormControl fullWidth sx={{ mb: 3 }}>
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

      {/* Размер изображения */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Размер изображения</InputLabel>
        <Select
          name="size"
          value={formData.size}
          onChange={onChange}
          label="Размер изображения"
        >
          {IMAGE_SIZES.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Количество шагов */}
      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom>
          Количество шагов: {formData.n_steps}
        </Typography>
        <Slider
          name="n_steps"
          value={formData.n_steps}
          onChange={onChange}
          min={20}
          max={150}
          step={1}
          marks={[
            { value: 20, label: '20' },
            { value: 50, label: '50' },
            { value: 100, label: '100' },
            { value: 150, label: '150' }
          ]}
        />
      </Box>

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Paper>
  );
}

export default Settings; 