import React from 'react';
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Switch,
  FormControlLabel,
  Slider,
  Tooltip,
  InputAdornment,
  IconButton,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { 
  SAMPLER_OPTIONS, 
  ADVANCED_SETTINGS 
} from '../constants';

function AdvancedSettings({ settings, onChange }) {
  const generateRandomSeed = () => {
    const newSeed = Math.floor(Math.random() * 2147483647);
    onChange({ seed: newSeed });
  };

  return (
    <Box className="advanced-settings">
      <FormControl fullWidth margin="normal">
        <Typography>Seed</Typography>
        <TextField
          value={settings.seed || ''}
          onChange={(e) => onChange({ seed: e.target.value })}
          type="number"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Generate Random Seed">
                  <IconButton onClick={generateRandomSeed} edge="end">
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          }}
          placeholder="Enter seed or leave empty for random"
        />
      </FormControl>

      <Box>
        <Typography>Steps ({settings.n_steps})</Typography>
        <Slider
          value={settings.n_steps}
          min={20}
          max={150}
          step={1}
          onChange={(e, value) => onChange({ n_steps: value })}
          valueLabelDisplay="auto"
          marks={[
            { value: 20, label: '20' },
            { value: 50, label: '50' },
            { value: 100, label: '100' },
            { value: 150, label: '150' }
          ]}
        />
      </Box>

      <Box>
        <Typography>Guidance Scale ({settings.guidance_scale})</Typography>
        <Slider
          value={settings.guidance_scale}
          min={1}
          max={20}
          step={0.5}
          onChange={(e, value) => onChange({ guidance_scale: value })}
          valueLabelDisplay="auto"
          marks={[
            { value: 1, label: '1' },
            { value: 7.5, label: '7.5' },
            { value: 15, label: '15' },
            { value: 20, label: '20' }
          ]}
        />
      </Box>


      <FormControl fullWidth margin="normal">
        <Typography>Sampler</Typography>
        <Select
          value={settings.sampler}
          onChange={(e) => onChange({ sampler: e.target.value })}
        >
          {SAMPLER_OPTIONS.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        multiline
        rows={2}
        margin="normal"
        label="Negative Prompt"
        value={settings.negative_prompt}
        onChange={(e) => onChange({ negative_prompt: e.target.value })}
      />

      <Box>
        <Typography>Denoising Strength</Typography>
        <Slider
          value={settings.denoising_strength}
          min={0}
          max={1}
          step={0.05}
          onChange={(e, value) => onChange({ denoising_strength: value })}
        />
      </Box>

      {Object.entries(ADVANCED_SETTINGS).map(([key, setting]) => (
        <Tooltip key={key} title={setting.description}>
          <FormControlLabel
            control={
              <Switch
                checked={settings[key]}
                onChange={(e) => onChange({ [key]: e.target.checked })}
              />
            }
            label={setting.label}
          />
        </Tooltip>
      ))}
    </Box>
  );
}

export default AdvancedSettings; 