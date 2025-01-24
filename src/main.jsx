import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import { VisitasProvider } from './Context/VisitasContext.jsx';



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <VisitasProvider>
    <App />
    </VisitasProvider>
    
  </StrictMode>
)


