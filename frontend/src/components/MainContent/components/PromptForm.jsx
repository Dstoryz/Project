import React from 'react';
import { Paper, TextField, Button, Box, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import './PromptForm.css';

function PromptForm({ formData, loading, onChange, onSubmit }) {
  return (
    <Paper className="prompt-form">
      <Typography variant="h6" className="prompt-form-title">
        Создать изображение
      </Typography>
      
      <form onSubmit={onSubmit}>
        <TextField
          className="prompt-input"
          fullWidth
          label="Опишите изображение"
          name="prompt"
          value={formData.prompt}
          onChange={onChange}
          multiline
          rows={4}
          required
          variant="outlined"
          placeholder="Например: космический корабль в стиле киберпанк"
        />
        
        <Box className="prompt-form-actions">
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            endIcon={<SendIcon />}
            className="submit-button"
          >
            {loading ? 'Создаем...' : 'Создать'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
}

export default PromptForm; 