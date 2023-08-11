import React from 'react';
import "./style.css";
import { createRoot } from 'react-dom/client';
import App from './components/App';

const container = document.createElement("div");
const root = createRoot(container);
root.render(<App />);

document.body.appendChild(container);
