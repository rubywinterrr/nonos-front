import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthProvider'
import { leerTamanioGuardado, aplicarTamanioTexto } from './utils/tamanioTexto'

// aplica el tamaño de letra guardado antes de mostrar la app, así no se ve cambiar al cargar
aplicarTamanioTexto(leerTamanioGuardado())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
    <App />
    </AuthProvider>
  </StrictMode>,
)
