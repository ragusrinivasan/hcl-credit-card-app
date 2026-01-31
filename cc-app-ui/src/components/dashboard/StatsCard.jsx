const StatsCard = ({ status, count, isActive, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer p-4 rounded-lg shadow transition ${
        isActive ? "bg-blue-600 text-white" : "bg-white hover:bg-gray-50"
      }`}
    >
      <p className="text-sm font-medium">{status.replace("_", " ")}</p>
      <p className="text-2xl font-bold">{count}</p>
    </div>
  );
};

export default StatsCard;
