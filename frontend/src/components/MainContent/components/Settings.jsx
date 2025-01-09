import React from 'react';
import {
  Paper,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Box,
} from '@mui/material';
import {
  MODEL_OPTIONS,
  STYLE_OPTIONS,
  QUALITY_PRESETS,
  SAMPLER_OPTIONS,
  RESOLUTION_OPTIONS,
} from '../constants';
import AdvancedSettings from './AdvancedSettings';
import './Settings.css';

function Settings({ settings, onSettingsChange }) {
  const [activeTab, setActiveTab] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleResolutionChange = (event) => {
    const selectedResolution = RESOLUTION_OPTIONS.find(opt => opt.value === event.target.value);
    onSettingsChange({
      width: selectedResolution.width,
      height: selectedResolution.height
    });
  };

  return (
    <Paper className="settings-panel">
      <Typography variant="h6" className="settings-title">
        Generation Settings
      </Typography>

      <Tabs value={activeTab} onChange={handleTabChange}>
        <Tab label="Basic" />
        <Tab label="Advanced" />
      </Tabs>

      <Box className="settings-content">
        {activeTab === 0 ? (
          // Базовые настройки
          <>
            <FormControl fullWidth margin="normal">
              <Typography>Model</Typography>
              <Select
                value={settings.model}
                onChange={(e) => onSettingsChange({ model: e.target.value })}
              >
                {MODEL_OPTIONS.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <Typography>Style</Typography>
              <Select
                value={settings.style}
                onChange={(e) => onSettingsChange({ style: e.target.value })}
              >
                {STYLE_OPTIONS.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <Typography>Quality Preset</Typography>
              <Select
                value={settings.quality_preset}
                onChange={(e) => {
                  const preset = QUALITY_PRESETS.find(p => p.value === e.target.value);
                  onSettingsChange({
                    quality_preset: e.target.value,
                    n_steps: preset.steps,
                    guidance_scale: preset.guidance
                  });
                }}
              >
                {QUALITY_PRESETS.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <Typography>Resolution</Typography>
              <Select
                value={`${settings.width}x${settings.height}`}
                onChange={handleResolutionChange}
              >
                {RESOLUTION_OPTIONS.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        ) : (
          // Расширенные настройки
          <AdvancedSettings 
            settings={settings} 
            onChange={onSettingsChange} 
          />
        )}
      </Box>
    </Paper>
  );
}

export default Settings; 