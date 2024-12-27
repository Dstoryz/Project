import { Paper, Grid } from '@mui/material';

function MainContent() {
  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {/* Здесь будет форма генерации */}
        </Grid>
        <Grid item xs={12}>
          {/* Здесь будет результат генерации */}
        </Grid>
      </Grid>
    </Paper>
  );
}

export default MainContent; 