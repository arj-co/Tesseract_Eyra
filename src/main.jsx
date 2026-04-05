import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Landing from './pages/Landing'
import HowItWorks from './pages/HowItWorks'
import About from './pages/About'
import EyraApp from './pages/App'
import DemoBoard from './pages/DemoBoard'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/about" element={<About />} />
        <Route path="/app" element={<EyraApp />} />
        <Route path="/demo" element={<DemoBoard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
