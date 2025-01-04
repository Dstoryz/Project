import React from 'react';
import { Box } from '@mui/material';
import './MainContent.css';

function MainContentDev() {
  return (
    <Box className="main-container">
      <div className="main-grid-container">
        <div className="main-left-panel">
          <h2>Левая панель</h2>
          <p>Содержимое для тестирования.</p>
        </div>

        <div className="main-content-area">
          <h1>Центральный контент</h1>
          <p>Сюда можно добавить основные компоненты, такие как формы или изображения.</p>
        </div>

        <div className="main-settings-panel">
          <h2>Панель настроек</h2>
          <p>Здесь размещаются параметры или другие элементы управления.</p>
        </div>
      </div>
    </Box>
  );
}

export default MainContentDev;
