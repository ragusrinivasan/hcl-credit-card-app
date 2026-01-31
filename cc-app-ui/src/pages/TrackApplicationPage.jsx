import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function TrackApplicationPage() {
  const navigate = useNavigate();

  const [applicationNumber, setApplicationNumber] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const statusColor = (status) => {
    switch (status) {
      case "SUBMITTED":
        return "bg-gray-400";
      case "APPROVED":
        return "bg-green-500";
      case "REJECTED":
        return "bg-red-500";
      case "DISPATCHED":
        return "bg-blue-600";
      default:
        return "bg-gray-400";
    }
  };

  const fetchApplication = async () => {
    if (!applicationNumber.trim()) return;

    try {
      setError(null);
      setLoading(true);

      const res = await api.get(
        `/api/v1/application/fetch-ui/${applicationNumber}`
      );

      if (res.data.success) {
        setData(res.data.data);
      } else {
        setError("Application not found");
        setData(null);
      }
    } catch (err) {
      console.log(err);
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        setError("Failed to load application");
        setData(null);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-6 space-y-4">

        <h1 className="text-2xl font-bold text-gray-800">
          Track Application
        </h1>

        <div className="flex gap-2">
          <input
            value={applicationNumber}
            onChange={(e) => setApplicationNumber(e.target.value)}
            placeholder="Enter Application Number"
            className="border rounded-lg p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={fetchApplication}
            disabled={!applicationNumber}
            className="bg-blue-600 disabled:opacity-50 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            Track
          </button>
        </div>

        {loading && <p className="text-gray-500">Loading...</p>}

        {error && <p className="text-red-500">{error}</p>}

        {data && (
          <div className="mt-4 bg-gray-50 rounded-xl p-5 space-y-5">

            {/* Applicant Info */}
            <div>
              <p className="text-xl font-semibold text-gray-800">
                {data.applicant.fullName}
              </p>
              <p className="text-sm text-gray-500">
                Applied on{" "}
                {new Date(data.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Current Status */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Current Status:</span>
              <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-sm font-semibold">
                {data.status}
              </span>
            </div>

            {/* Status Timeline */}
            <div className="mt-4 border-l-2 border-gray-300 pl-4 space-y-4">

              {[...data.statusHistory]
                .sort(
                  (a, b) =>
                    new Date(a.changedAt) - new Date(b.changedAt)
                )
                .map((item, index, arr) => {

                  const isLatest = index === arr.length - 1;

                  return (
                    <div key={item._id} className="relative">

                      {/* Dot */}
                      <span
                        className={`absolute -left-[10px] top-1.5 w-4 h-4 rounded-full ${statusColor(
                          item.status
                        )}`}
                      />

                      {/* Card */}
                      <div
                        className={`bg-white rounded-lg p-3 shadow-sm ${
                          isLatest ? "ring-2 ring-blue-400" : ""
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <p className="font-semibold text-gray-800">
                            {item.status}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(
                              item.changedAt
                            ).toLocaleString()}
                          </p>
                        </div>

                        <p className="text-sm text-gray-600 mt-1">
                          {item.reason}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TrackApplicationPage;
