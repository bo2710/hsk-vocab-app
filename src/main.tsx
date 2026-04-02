import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// CRITICAL FIX: Phải có dòng import này thì Tailwind mới hoạt động
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);