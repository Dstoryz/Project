import React from 'react';
import { Paper, Tabs, Tab } from '@mui/material';

const TAB_ITEMS = [
  { label: 'Создать', value: 0 },
  { label: 'Стиль', value: 1 },
  { label: 'Качество', value: 2 },
  { label: 'История', value: 3 },
];

function TabPanel({ activeTab, onTabChange }) {
  return (
    <Paper className="tab-panel">
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
            label={tab.label} 
          />
        ))}
      </Tabs>
    </Paper>
  );
}

export default TabPanel; 