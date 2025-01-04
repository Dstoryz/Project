import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import api from '../../utils/axios';
import TabPanel from './components/TabPanel';
import ImageDisplay from './components/ImageDisplay';
import PromptForm from './components/PromptForm';
import Settings from './components/Settings';
import LeftPanel from './components/LeftPanel';
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

  // Обработчик переключения вкладок
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Обработчик изменений в форме
  const handleChange = (e) => {
    const { name, value } = e.target || {};
    if (name) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Обработчик отправки формы
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
      setGeneratedImage(response?.data?.generated_image);
    } catch (err) {
      setError(err?.response?.data?.message || 'Ошибка генерации изображения');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="main-container">
      <TabPanel activeTab={activeTab} onTabChange={handleTabChange} />
      
      <div className="main-grid-container">
        <div className="main-left-panel">
          <LeftPanel />
        </div>

        <div className="main-content-area">
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

        <div className="main-settings-panel">
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
