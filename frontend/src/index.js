import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles/variables.css';
import './styles/global.css';
import App from './App';

// Добавим проверку наличия root элемента
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Failed to find the root element');
}

const root = createRoot(rootElement);

// Добавим обработку ошибок
try {
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
} catch (error) {
  console.error('Error rendering app:', error);
}
