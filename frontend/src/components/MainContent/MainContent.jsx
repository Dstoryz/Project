import React, { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import ImageDisplay from './components/ImageDisplay';
import HistoryPanel from './components/HistoryPanel';
import PromptForm from './components/PromptForm';
import Settings from './components/Settings';
import { generationService } from '../../api/generationService';
import './MainContent.css';
import PromptTemplates from './components/PromptTemplates';
import PromptTemplateDialog from './components/PromptTemplateDialog';

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
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [settings, setSettings] = useState({
    model: 'stable-diffusion-v1-5',
    style: 'none',
    n_steps: 75,
    guidance_scale: 7.5,
    seed: '',
    width: 512,
    height: 512,
    color_scheme: 'none'
  });
  const [prompt, setPrompt] = useState('');

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

  const handleSettingsChange = (newSettings) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };

  const handleImageSelect = (item) => {
    const imageUrl = item.generated_image && item.generated_image.startsWith('http')
      ? item.generated_image
      : `http://localhost:8000${item.generated_image}`;

    setSelectedImage(imageUrl);
    
    setSettings({
      model: item.model,
      style: item.style,
      n_steps: item.n_steps,
      guidance_scale: item.guidance_scale,
      seed: item.seed,
      width: item.width,
      height: item.height,
      color_scheme: item.color_scheme,
      negative_prompt: item.negative_prompt,
      sampler: item.sampler,
      clip_skip: item.clip_skip,
      tiling: item.tiling,
      hires_fix: item.hires_fix,
      denoising_strength: item.denoising_strength,
      safety_checker: item.safety_checker
    });

    if (promptFormRef.current) {
      promptFormRef.current.setPrompt(item.original_prompt || item.prompt);
    }
  };

  const handleGenerate = async (promptText) => {
    setLoading(true);
    setError(null);
    try {
      const response = await generationService.generateImage({
        prompt: promptText,
        model: settings.model,
        style: settings.style,
        n_steps: settings.n_steps,
        guidance_scale: settings.guidance_scale,
        seed: settings.seed || undefined,
        width: settings.width,
        height: settings.height,
        color_scheme: settings.color_scheme,
        safety_checker: settings.safety_checker
      });
      setLastGeneration(response);
      setSelectedImage(response.generated_image);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePromptSubmit = (promptText) => {
    setPrompt(promptText);
    handleGenerate(promptText);
  };

  const handleTemplateSelect = (template) => {
    if (promptFormRef.current) {
      promptFormRef.current.setPrompt(template.prompt);
    }
  };

  const handleSaveTemplate = async (templateData) => {
    try {
      // TODO: Добавить вызов API для сохранения шаблона
      console.log('Saving template:', templateData);
      // После успешного сохранения можно обновить список шаблонов
      // await loadTemplates();
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };

  return (
    <Box className="main-content">
      <Box className="content-wrapper">
        <Box className="left-panel">
          <PromptTemplates
            onSelectTemplate={handleTemplateSelect}
            onAddTemplate={() => setTemplateDialogOpen(true)}
            onEditTemplate={(template) => {
              setSelectedTemplate(template);
              setTemplateDialogOpen(true);
            }}
          />
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
              onSubmit={handlePromptSubmit}
              loading={loading}
            />
          </Box>
        </Box>

        <Box className="right-panel">
          <Settings 
            settings={settings}
            onSettingsChange={handleSettingsChange}
          />
        </Box>

        <PromptTemplateDialog
          open={templateDialogOpen}
          template={selectedTemplate}
          onClose={() => {
            setTemplateDialogOpen(false);
            setSelectedTemplate(null);
          }}
          onSave={handleSaveTemplate}
        />
      </Box>
    </Box>
  );
}

export default MainContent;
