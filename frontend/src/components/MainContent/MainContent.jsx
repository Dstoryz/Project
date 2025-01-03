import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import api from '../../utils/axios';
import TabPanel from './components/TabPanel';
import ImageDisplay from './components/ImageDisplay';
import PromptForm from './components/PromptForm';
import Settings from './components/Settings';
import './MainContent.css';

function MainContent() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    prompt: '',
    model: 'stable-diffusion-v1-5',
    style: 'none',
    n_steps: 50,
    size: '1024x1024',
  });
  const [generatedImage, setGeneratedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

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
      setError('Пожалуйста, войдите в систему для генерации изображений');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/api/generation/generate/', formData);
      setGeneratedImage(response.data.generated_image);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка генерации изображения');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="main-container">
      <TabPanel activeTab={activeTab} onTabChange={handleTabChange} />
      
      <div className="grid-container">
        <div className="left-panel">
          <div style={{ padding: '20px', color: 'white' }}>
            Левая панель
          </div>
        </div>

        <div className="main-content">
          <ImageDisplay 
            loading={loading} 
            generatedImage={generatedImage} 
          />
          <PromptForm
            formData={formData}
            loading={loading}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
        </div>

        <div className="settings-panel">
          <Settings
            formData={formData}
            onChange={handleChange}
            error={error}
          />
        </div>
      </div>
    </Box>
  );
}

export default MainContent; 