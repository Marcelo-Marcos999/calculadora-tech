import React from 'react';
import { createRoot } from 'react-dom/client';
import Calculator from './components/calculator.jsx';
import './styles/style.css';

const container = document.getElementById('root');

createRoot(container).render(
  <React.StrictMode>
    <Calculator />
  </React.StrictMode>
);
