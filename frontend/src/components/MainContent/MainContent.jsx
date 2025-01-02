import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import api from '../../utils/axios';

const MODEL_OPTIONS = [
  { value: 'stable-diffusion-v1-5', label: 'Stable Diffusion v1.5' },
  { value: 'stable-diffusion-2-1', label: 'Stable Diffusion v2.1' },
  { value: 'openjourney-v4', label: 'OpenJourney v4' },
];

const STYLE_OPTIONS = [
  { value: 'realistic', label: 'Realistic' },
  { value: 'anime', label: 'Anime' },
  { value: 'digital-art', label: 'Digital Art' },
  { value: 'oil-painting', label: 'Oil Painting' },
];

function MainContent() {
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    prompt: '',
    model: 'stable-diffusion-v1-5',
    style: 'realistic',
    n_steps: 50,
  });
  const [generatedImage, setGeneratedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError('Please login to generate images');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/api/generation/generate/', formData);
      setGeneratedImage(response.data.generated_image);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Форма ввода */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Generate Image
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Enter your prompt"
                name="prompt"
                value={formData.prompt}
                onChange={handleChange}
                multiline
                rows={4}
                margin="normal"
                required
              />
              
              <FormControl fullWidth margin="normal">
                <InputLabel>Model</InputLabel>
                <Select
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  label="Model"
                >
                  {MODEL_OPTIONS.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>Style</InputLabel>
                <Select
                  name="style"
                  value={formData.style}
                  onChange={handleChange}
                  label="Style"
                >
                  {STYLE_OPTIONS.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                type="number"
                label="Number of Steps"
                name="n_steps"
                value={formData.n_steps}
                onChange={handleChange}
                margin="normal"
                inputProps={{ min: 20, max: 100 }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                sx={{ mt: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Generate'}
              </Button>

              {error && (
                <Typography color="error" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              )}
            </form>
          </Paper>
        </Grid>

        {/* Область отображения изображения */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h5" gutterBottom>
              Generated Image
            </Typography>
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: 'grey.100',
                borderRadius: 1,
                minHeight: 400,
              }}
            >
              {loading ? (
                <CircularProgress />
              ) : generatedImage ? (
                <img
                  src={generatedImage}
                  alt="Generated"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                  }}
                />
              ) : (
                <Typography color="text.secondary">
                  Generated image will appear here
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default MainContent; 