import { Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage';
import ProtectedRoute from './utils/ProtectedRoute';
import DashboardPage from './pages/DashboardPage';
import ApproverLogin from './pages/ApproverLogin';
import ApplicationDetail from "./pages/ApplicationDetail";


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
          <Route path="/approver/dashboard" element={<DashboardPage />} />
          <Route path="/approver/application/:applicationNumber" element={<ApplicationDetail />} />
        </Route>
      </Routes>

    </>
  )
}

export default App
