// index.js

import React from 'react';

import App from './App';

// Use createRoot from "react-dom/client" instead of ReactDOM.createRoot
import { createRoot } from 'react-dom/client';



// Use createRoot instead of ReactDOM.render
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

// Render your app using createRoot
root.render(<App />);
