import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import { VisitasProvider } from './Context/VisitasContext.jsx';
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
    <VisitasProvider>
    <App />
    </VisitasProvider>
    </QueryClientProvider>
  </StrictMode>
)


