import React from 'react';
import { Paper, Tabs, Tab, Box } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import StyleIcon from '@mui/icons-material/Style';
import TuneIcon from '@mui/icons-material/Tune';
import HistoryIcon from '@mui/icons-material/History';
import './TabPanel.css';

const TAB_ITEMS = [
  { label: 'Create', icon: <CreateIcon />, value: 0 },
  { label: 'Style', icon: <StyleIcon />, value: 1 },
  { label: 'Quality', icon: <TuneIcon />, value: 2 },
  { label: 'History', icon: <HistoryIcon />, value: 3 },
];

function TabPanel({ activeTab, onTabChange }) {
  return (
    <Box className="tab-panel-container">
      <Paper className="tab-panel" elevation={0}>
        <Tabs 
          value={activeTab} 
          onChange={onTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          {TAB_ITEMS.map(tab => (
            <Tab 
              key={tab.value}
              className="tab-item" 
              icon={tab.icon}
              label={tab.label}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Paper>
    </Box>
  );
}

export default TabPanel; 