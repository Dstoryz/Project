import React from 'react';
import { Paper, TextField, Button, CircularProgress } from '@mui/material';

function PromptForm({ formData, loading, onChange, onSubmit }) {
  return (
    <Paper className="content-panel">
      <form onSubmit={onSubmit}>
        <TextField
          className="text-input form-field"
          fullWidth
          label="Опишите изображение"
          name="prompt"
          value={formData.prompt}
          onChange={onChange}
          multiline
          rows={{ xs: 2, sm: 3 }}
          required
        />
        <Button
          className="submit-button"
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} /> : 'Создать'}
        </Button>
      </form>
    </Paper>
  );
}

export default PromptForm; 