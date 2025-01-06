import React, { useState } from 'react';
import { Box, Paper } from '@mui/material';
import TabPanel from './components/TabPanel';
import ImageDisplay from './components/ImageDisplay';
import PromptForm from './components/PromptForm';
import Settings from './components/Settings';
import LeftPanel from './components/LeftPanel';
import { useAuth } from '../../hooks/useAuth';
import { generationService } from '../../api/generationService';
import './MainContent.css';
import HistoryPanel from './components/HistoryPanel';

function MainContent() {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const { isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    prompt: '',
    model: 'stable-diffusion-v1-5',
    style: 'base',
    n_steps: 20,
    guidance_scale: 7.5,
    seed: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError('Please login to generate images');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const currentSeed = formData.seed || Math.floor(Math.random() * 1000000);
      
      const result = await generationService.generateImage({
        ...formData,
        seed: currentSeed
      });
      
      if (result.generated_image) {
        setGeneratedImage(result.generated_image);
        if (!formData.seed) {
          setFormData(prev => ({
            ...prev,
            seed: currentSeed
          }));
        }
      } else {
        throw new Error('No image was generated');
      }
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to generate image');
      console.error('Image generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    if (formData.prompt) {
      handleSubmit(new Event('submit'));
    }
  };

  const handleDownload = async () => {
    if (!generatedImage) return;
    
    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download image:', err);
      setError('Failed to download image');
    }
  };

  const handleShare = async () => {
    if (!generatedImage) return;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My Generated Image',
          text: 'Check out this AI-generated image!',
          url: generatedImage
        });
      } else {
        await navigator.clipboard.writeText(generatedImage);
        // Здесь можно добавить уведомление о копировании ссылки
      }
    } catch (err) {
      console.error('Failed to share image:', err);
    }
  };

  const handleFavorite = async () => {
    if (!generatedImage) return;
    
    try {
      // TODO: Добавить API для сохранения в избранное
      console.log('Adding to favorites:', generatedImage);
      // Здесь можно добавить уведомление
    } catch (err) {
      console.error('Failed to add to favorites:', err);
      setError('Failed to add to favorites');
    }
  };

  const handleRestorePrompt = (settings) => {
    setFormData(settings);
  };

  const handleImageSelect = (image) => {
    setGeneratedImage(image);
    // Сбрасываем ошибки если они были
    setError(null);
  };

  return (
    <Box className="main-container">
      <TabPanel activeTab={activeTab} onTabChange={handleTabChange} />
      
      <div className="main-grid-container">
        <Paper className="main-left-panel" elevation={0}>
          <HistoryPanel 
            onRestorePrompt={handleRestorePrompt}
            onImageSelect={handleImageSelect}
          />
        </Paper>

        <Paper className="main-content-area" elevation={0}>
          <ImageDisplay 
            loading={loading} 
            generatedImage={generatedImage}
            error={error}
            onRetry={handleRetry}
            onDownload={handleDownload}
            onShare={handleShare}
            onFavorite={handleFavorite}
          />
          <PromptForm
            formData={formData}
            loading={loading}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
        </Paper>

        <Paper className="main-settings-panel" elevation={0}>
          <Settings
            formData={formData}
            onChange={handleChange}
          />
        </Paper>
      </div>
    </Box>
  );
}

export default MainContent;
