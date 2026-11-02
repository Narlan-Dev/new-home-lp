import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// styles
import './index.css';

// project-imports
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container!);

// ==============================|| MAIN - REACT DOM RENDER  ||============================== //

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
