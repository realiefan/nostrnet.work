// index.js

import React from 'react';

import App from './App';

// Use createRoot from "react-dom/client" instead of ReactDOM.createRoot
import { createRoot } from 'react-dom/client';

// Register the service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}

// Use createRoot instead of ReactDOM.render
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

// Render your app using createRoot
root.render(<App />);
