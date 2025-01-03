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
          rows={6}
          required
          InputProps={{
            style: {
              fontSize: '16px',
              lineHeight: '1.5',
              padding: '12px'
            }
          }}
          InputLabelProps={{
            style: {
              fontSize: '14px'
            }
          }}
        />
        <div style={{ textAlign: 'center' }}>
          <Button
            className="submit-button"
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Создать'}
          </Button>
        </div>
      </form>
    </Paper>
  );
}

export default PromptForm; 