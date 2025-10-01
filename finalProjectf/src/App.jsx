import React from 'react'
import { Route, Routes } from "react-router-dom";
import Home from './Pages/Home'
import Tracer from './Pages/Tracer';
import Analytics from './Pages/Analytics';
import Config from './Pages/Config';
import './Style/index.css'

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/tracer' element={<Tracer/>}/>
        <Route path='/analytics' element={<Analytics/>}/>
        <Route path='/config' element={<Config/>}/>
      </Routes>

    </div>
  )
}

export default App
