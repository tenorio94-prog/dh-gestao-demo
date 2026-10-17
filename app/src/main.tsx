import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

// Links antigos usavam rota por "#" (ex.: /#/estoque). Levam para o aplicativo em /app/...
const legacy = window.location.hash.match(/^#\/(estoque|mes)?\/?$/)
if (legacy) {
  window.history.replaceState(null, '', `/app${legacy[1] ? `/${legacy[1]}` : ''}`)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
