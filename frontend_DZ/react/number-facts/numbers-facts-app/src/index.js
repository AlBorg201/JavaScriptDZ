import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Опционально, если у вас есть глобальные стили

// Создаем корневой элемент для рендеринга
const root = ReactDOM.createRoot(document.getElementById('root'));

// Рендерим приложение
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);