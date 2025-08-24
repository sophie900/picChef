import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router'
import App from './App.tsx'
import SearchResults from './components/SearchResults.tsx'
import SavedRecipes from './components/SavedRecipes.tsx'
import NavBar from './components/NavBar.tsx'
import Login from './components/Login.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NavBar />  { /* Keep navigation bar static across page loads */}
    <BrowserRouter>
      <Routes>
        <Route index element={<App />} />
        <Route path='/search' element={<SearchResults />} />
        <Route path='/saved' element={<SavedRecipes />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
