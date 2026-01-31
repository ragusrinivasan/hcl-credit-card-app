import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
  Loader,
  ErrorMessage,
  Header,
  StatsGrid,
  ApplicationsTable,
} from "../components";

const DashboardPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("cc-app-token");
      if (!token) {
        navigate("/approver/login");
        return;
      }

      const response = await api.get("/api/v1/application/fetch", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setApplications(response.data.data);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("cc-app-token");
        navigate("/approver/login");
      } else {
        setError(err.response?.data?.message || "Failed to fetch applications");
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications =
    filter === "ALL"
      ? applications
      : applications.filter((app) => app.status === filter);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/approver/login");
  };

  const handleActionClick = (application) => {
    console.log("Action clicked for application:", application);
    setSelectedApplication(application);
    navigate(`/approver/application/${application.applicationNumber}`);
  };

  

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header
        title="Credit Card Applications Dashboard"
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StatsGrid
          applications={applications}
          filter={filter}
          onFilterChange={setFilter}
        />

        <ApplicationsTable
          applications={filteredApplications}
          onActionClick={handleActionClick}
        />
      </main>

    </div>
  );
};

export default DashboardPage;
