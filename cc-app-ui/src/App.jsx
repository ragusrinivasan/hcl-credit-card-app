import { useState } from 'react'
import { Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage';
import Tracking from './pages/Tracking';
import ProtectedRoute from './utils/ProtectedRoute';
import Login from './components/approver/Login';


function App() {

  return (
    <>
      <Routes>
      {/* Public Routes */}
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="/" element={<HomePage />} />
        <Route path="/approver/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/protected" element={<HomePage />} />
        </Route>
        <Route path="/tracking" element={<Tracking />} />
      </Routes>
    </>
  )
}

export default App
