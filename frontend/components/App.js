import React from 'react'
import Home from './Home'
import Form from './Form'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

function App() {
  return (
      <BrowserRouter>
    <div id="app">
      <nav>
        {/* NavLinks here */}
        <Link to='/'>Home Screen</Link>&nbsp;
        <Link to='/orders'>Form</Link>&nbsp;

      </nav>
      {/* Route and Routes here */}
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/orders" element={<Form />}/>
      </Routes>
      
      
  
    </div>
      </BrowserRouter>
  )
}

export default App
