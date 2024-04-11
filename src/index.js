import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import Login from './pages/Login/Login';
import Modal from 'react-modal';

Modal.setAppElement('#root');

// Use createRoot from "react-dom/client"
const root = createRoot(document.getElementById('root'));
root.render(<App />);