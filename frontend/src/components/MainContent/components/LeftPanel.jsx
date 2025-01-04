import React from 'react';
import { Paper, Typography, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CollectionsIcon from '@mui/icons-material/Collections';
import './LeftPanel.css';

function LeftPanel() {
  return (
    <Paper className="left-panel">
      <Typography variant="h6" className="left-panel-title">
        Мои изображения
      </Typography>
      <Divider sx={{ mb: 2 }} />
      
      <List>
        <ListItem button className="left-panel-item">
          <ListItemIcon>
            <HistoryIcon />
          </ListItemIcon>
          <ListItemText primary="История" />
        </ListItem>
        
        <ListItem button className="left-panel-item">
          <ListItemIcon>
            <FavoriteIcon />
          </ListItemIcon>
          <ListItemText primary="Избранное" />
        </ListItem>
        
        <ListItem button className="left-panel-item">
          <ListItemIcon>
            <CollectionsIcon />
          </ListItemIcon>
          <ListItemText primary="Коллекции" />
        </ListItem>
      </List>
    </Paper>
  );
}

export default LeftPanel; 