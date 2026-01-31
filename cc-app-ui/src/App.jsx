import { Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import { ApplyCardPage } from './pages/ApplyCard';
import ProtectedRoute from './utils/ProtectedRoute';
import DashboardPage from './pages/DashboardPage';
import ApproverLoginPage from "./pages/ApproverLoginPage";
import ApplicationDetailPage from "./pages/ApplicationDetailPage";
import TrackApplicationPage from "./pages/TrackApplicationPage";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
    
      <Routes>
      {/* Public Routes */}
        <Route path="/track" element={<TrackApplicationPage />} />
        <Route path="/" element={<ApplyCardPage />} />
        <Route path="/approver/login" element={<ApproverLoginPage />} />
        <Route path="/apply" element={<ApplyCardPage />} />
        <Route element={<ProtectedRoute />}>
    
          <Route path="/approver/dashboard" element={<DashboardPage />} />
          <Route path="/approver/application/:applicationNumber" element={<ApplicationDetailPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
