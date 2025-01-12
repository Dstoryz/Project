import React from 'react';
import { Paper, Tabs, Tab, Box } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import StyleIcon from '@mui/icons-material/Style';
import TuneIcon from '@mui/icons-material/Tune';
import HistoryIcon from '@mui/icons-material/History';
import { useNavigate } from 'react-router-dom';
import './TabPanel.css';

const TAB_ITEMS = [
  { label: 'Create', icon: <CreateIcon />, value: 0 },
  { label: 'Style', icon: <StyleIcon />, value: 1 },
  { label: 'Quality', icon: <TuneIcon />, value: 2 },
  { 
    label: 'History', 
    icon: <HistoryIcon />, 
    value: 3,
    onClick: (navigate) => navigate('/history')
  },
];

function TabPanel({ activeTab, onTabChange }) {
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    const tab = TAB_ITEMS.find(tab => tab.value === newValue);
    if (tab.onClick) {
      tab.onClick(navigate);
    } else {
      onTabChange(event, newValue);
    }
  };

  return (
    <Box className="tab-panel-container">
      <Paper className="tab-panel" elevation={0}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
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