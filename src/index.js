import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import Login from './pages/Login/Login';

// Use createRoot from "react-dom/client"
const root = createRoot(document.getElementById('root'));
root.render(<App />);