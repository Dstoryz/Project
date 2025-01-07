import React, { useState } from 'react';
import { Box } from '@mui/material';
import ImageDisplay from './components/ImageDisplay';
import HistoryPanel from './components/HistoryPanel';
import PromptForm from './components/PromptForm';
import Settings from './components/Settings';
import { generationService } from '../../api/generationService';
import './MainContent.css';

function MainContent() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [lastGeneration, setLastGeneration] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    model: 'stable-diffusion-v1-5',
    style: 'none',
    n_steps: 75,
    guidance_scale: 7.5,
    seed: ''
  });

  const handleSettingsChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageSelect = (item) => {
    setSelectedImage(item.generated_image);
  };

  const handleGenerate = async (promptData) => {
    setLoading(true);
    setError(null);
    try {
      const requestData = {
        prompt: promptData.prompt,
        model: formData.model,
        style: formData.style,
        n_steps: parseInt(formData.n_steps),
        guidance_scale: parseFloat(formData.guidance_scale),
        seed: formData.seed ? parseInt(formData.seed) : null
      };

      const result = await generationService.generateImage(requestData);
      setLastGeneration(result);
      setSelectedImage(result.generated_image);
    } catch (err) {
      console.error('Generation error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="main-content">
      <Box className="content-wrapper">
        <Box className="history-section">
          <HistoryPanel 
            onImageSelect={handleImageSelect}
            newGeneration={lastGeneration}
          />
        </Box>
        <Box className="center-section">
          <PromptForm onSubmit={handleGenerate} loading={loading} />
          <ImageDisplay 
            image={selectedImage}
            loading={loading}
            error={error}
          />
        </Box>
        <Box className="settings-section">
          <Settings 
            formData={formData}
            onChange={handleSettingsChange}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default MainContent;
