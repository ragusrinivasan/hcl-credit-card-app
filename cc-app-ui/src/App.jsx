import { Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage';
import ProtectedRoute from './utils/ProtectedRoute';
import DashboardPage from './pages/DashboardPage';
import ApproverLoginPage from "./pages/ApproverLoginPage";
import ApplicationDetailPage from "./pages/ApplicationDetailPage";
import TrackApplicationPage from "./pages/TrackApplicationPage";


function App() {

  return (
    <>
      <Routes>
      {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/track" element={<TrackApplicationPage />} />
        <Route path="/approver/login" element={<ApproverLoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/protected" element={<HomePage />} />
          <Route path="/approver/dashboard" element={<DashboardPage />} />
          <Route path="/approver/application/:applicationNumber" element={<ApplicationDetailPage />} />
        </Route>
      </Routes>

    </>
  )
}

export default App
