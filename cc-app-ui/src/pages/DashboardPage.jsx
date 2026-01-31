import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
  Loader,
  ErrorMessage,
  Header,
  StatsGrid,
  ApplicationsTable,
  SearchBar,
  Pagination,
} from "../components";

const DashboardPage = () => {
  const [applications, setApplications] = useState([]);
  const [allApplications, setAllApplications] = useState([]); // For stats count
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [cardType, setCardType] = useState("ALL");
  const [selectedApplication, setSelectedApplication] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const navigate = useNavigate();

  // Track if stats have been fetched
  const [statsFetched, setStatsFetched] = useState(false);

  // Fetch all applications for stats (without filters)
  const fetchAllApplicationsForStats = useCallback(async (token) => {
    try {
      const response = await api.get("/api/v1/application/fetch", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setAllApplications(response.data.data);
        setStatsFetched(true);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  }, []);

  // Fetch filtered applications from backend
  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("cc-app-token");
      if (!token) {
        navigate("/approver/login");
        return;
      }

      // Build query params
      const params = new URLSearchParams();
      if (filter && filter !== "ALL") {
        params.append("status", filter);
      }
      if (searchTerm && searchTerm.trim()) {
        params.append("search", searchTerm.trim());
      }
      if (cardType && cardType !== "ALL") {
        params.append("cardType", cardType);
      }
      // Pagination params
      params.append("page", currentPage);
      params.append("limit", limit);

      const queryString = params.toString();
      const url = `/api/v1/application/fetch${queryString ? `?${queryString}` : ""}`;

      const response = await api.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setApplications(response.data.data);
        setTotalCount(response.data.totalCount);
        setTotalPages(response.data.totalPages);
        // Also fetch all applications for stats on initial load
        if (!statsFetched) {
          await fetchAllApplicationsForStats(token);
        }
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
  }, [
    filter,
    searchTerm,
    cardType,
    currentPage,
    limit,
    navigate,
    statsFetched,
    fetchAllApplicationsForStats,
  ]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleSearch = (term) => {
    setCurrentPage(1); // Reset to first page on search
    setSearchTerm(term);
  };

  const handleCardTypeChange = (type) => {
    setCurrentPage(1); // Reset to first page on filter change
    setCardType(type);
  };

  const handleFilterChange = (newFilter) => {
    setCurrentPage(1); // Reset to first page on filter change
    setFilter(newFilter);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setCurrentPage(1); // Reset to first page when changing limit
  };

  const handleLogout = () => {
    localStorage.removeItem("cc-app-token");
    navigate("/approver/login");
  };

  const handleActionClick = (application) => {
    console.log("Action clicked for application:", application);
    setSelectedApplication(application);
    navigate(`/approver/application/${application.applicationNumber}`);
  };

  if (loading && applications.length === 0) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header
        title="Credit Card Applications Dashboard"
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <SearchBar
          onSearch={handleSearch}
          onCardTypeChange={handleCardTypeChange}
          cardType={cardType}
        />

        {/* Stats Grid - uses all applications for accurate counts */}
        <StatsGrid
          applications={allApplications}
          filter={filter}
          onFilterChange={handleFilterChange}
        />

        {/* Results Info */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {applications.length} application
            {applications.length !== 1 ? "s" : ""}
            {searchTerm && (
              <span className="ml-1">for &quot;{searchTerm}&quot;</span>
            )}
            {cardType !== "ALL" && <span className="ml-1">• {cardType}</span>}
            {filter !== "ALL" && (
              <span className="ml-1">• {filter.replace("_", " ")}</span>
            )}
          </p>
          {loading && (
            <span className="text-sm text-blue-600 flex items-center">
              <svg className="animate-spin h-4 w-4 mr-1" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Loading...
            </span>
          )}
        </div>

        <ApplicationsTable
          applications={applications}
          onActionClick={handleActionClick}
        />

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          limit={limit}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      </main>
    </div>
  );
};

export default DashboardPage;
