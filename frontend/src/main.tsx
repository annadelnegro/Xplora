import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

console.log('VITE_NODE_ENV:', import.meta.env.VITE_NODE_ENV);
console.log('VITE_BASE_URL:', import.meta.env.VITE_BASE_URL);
console.log('VITE_PROD_URL:', import.meta.env.VITE_PROD_URL);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
