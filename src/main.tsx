import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { loadAllFunctionPacks } from './utils/functionPacks'
import mathPack from './functionPacks/mathPack'
import stringPack from './functionPacks/stringPack'

// Load function packs
loadAllFunctionPacks([mathPack, stringPack]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)