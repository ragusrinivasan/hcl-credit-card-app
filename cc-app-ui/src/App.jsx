import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import { ApplyCardPage } from './pages/ApplyCard';
import ProtectedRoute from './utils/ProtectedRoute';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/apply" element={<ApplyCardPage />} />

        {/* Protected Routes (for future use) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<div>Dashboard</div>} />
          <Route path="/track" element={<div>Track Application</div>} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
