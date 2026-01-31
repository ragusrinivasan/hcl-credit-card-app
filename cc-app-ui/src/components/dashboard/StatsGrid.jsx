import StatsCard from "./StatsCard";

const StatsGrid = ({ applications, filter, onFilterChange }) => {
  const statuses = [
    "ALL",
    "SUBMITTED",
    "CHECK_IN_PROGRESS",
    "APPROVED",
    "REJECTED",
  ];

  const getCount = (status) => {
    if (status === "ALL") return applications.length;
    return applications.filter((app) => app.status === status).length;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
      {statuses.map((status) => (
        <StatsCard
          key={status}
          status={status}
          count={getCount(status)}
          isActive={filter === status}
          onClick={() => onFilterChange(status)}
        />
      ))}
    </div>
  );
};

export default StatsGrid;
