import { useState } from 'react'
import { Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage';
import ProtectedRoute from './utils/ProtectedRoute';
import Login from './components/approver/Login';
import ApproverLogin from './pages/ApproverLogin';


function App() {

  return (
    <>
      <Routes>
      {/* Public Routes */}
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="/" element={<HomePage />} />
        <Route path="/approver/login" element={<ApproverLogin />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/protected" element={<HomePage />} />
          <Route path="/approver/dashboard" element={<HomePage />} />
        </Route>
      </Routes>

    </>
  )
}

export default App
