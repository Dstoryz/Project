import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  ListItemButton,
  Divider,
  Typography,
  Box
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import HistoryIcon from '@mui/icons-material/History';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SettingsIcon from '@mui/icons-material/Settings';
import './LeftPanel.css';

function LeftPanel() {
  const menuItems = [
    { icon: <ImageIcon />, text: 'Generate Image', primary: true },
    { icon: <HistoryIcon />, text: 'History' },
    { icon: <FavoriteIcon />, text: 'Favorites' },
    { icon: <SettingsIcon />, text: 'Settings' },
  ];

  return (
    <Box className="left-panel">
      <Typography variant="h6" className="left-panel-title">
        Menu
      </Typography>
      
      <List className="left-panel-list">
        {menuItems.map((item, index) => (
          <React.Fragment key={item.text}>
            <ListItem disablePadding>
              <ListItemButton 
                className={`left-panel-item ${item.primary ? 'primary' : ''}`}
              >
                <ListItemIcon className="left-panel-icon">
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
            {index < menuItems.length - 1 && (
              <Divider className="left-panel-divider" />
            )}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
}

export default LeftPanel; 