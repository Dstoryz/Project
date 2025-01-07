import React, { useState, useEffect, useRef } from 'react';
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

  const promptFormRef = useRef();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No authentication token found');
          return;
        }
        console.log('Auth token present:', token);
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };

    checkAuth();
  }, []);

  const handleSettingsChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageSelect = (item) => {
    const imageUrl = item.generated_image && item.generated_image.startsWith('http')
      ? item.generated_image
      : `http://localhost:8000${item.generated_image}`;

    setSelectedImage(imageUrl);
    setFormData({
      model: item.model || 'stable-diffusion-v1-5',
      style: item.style || 'none',
      n_steps: item.n_steps || 75,
      guidance_scale: item.guidance_scale || 7.5,
      seed: item.seed || ''
    });

    if (promptFormRef.current) {
      promptFormRef.current.setPrompt(item.prompt);
    }
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
        <Box className="left-panel">
          <HistoryPanel 
            onImageSelect={handleImageSelect}
            newGeneration={lastGeneration}
          />
        </Box>

        <Box className="center-panel">
          <Box className="image-section">
            <ImageDisplay 
              image={selectedImage}
              loading={loading}
              error={error}
            />
          </Box>
          <Box className="prompt-section">
            <PromptForm 
              ref={promptFormRef}
              onSubmit={handleGenerate} 
              loading={loading} 
            />
          </Box>
        </Box>

        <Box className="right-panel">
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
