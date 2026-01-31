import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useParams, useNavigate } from "react-router-dom";

function ApplicationDetailPage() {
  const { applicationNumber } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const [editableLimit, setEditableLimit] = useState("");

  useEffect(() => {
    fetchApplication();
  }, []);

  const fetchApplication = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("cc-app-token");
      if (!token) return navigate("/approver/login");

      const res = await api.get(
        `/api/v1/application/fetch-ind/${applicationNumber}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setData(res.data.data);
        setEditableLimit(res.data.data.creditLimit);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("cc-app-token");
        navigate("/approver/login");
      } else {
        setError("Failed to load application");
      }
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status, reason = null) => {
    try {
      const token = localStorage.getItem("cc-app-token");

      const payload = {
        status,
        rejectionReason: reason,
      };

      if (status === "APPROVED") {
        payload.creditLimit = Number(editableLimit);
      }

      await api.put(
        `/api/v1/application/${applicationNumber}/status`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowApproveModal(false);
      setShowRejectModal(false);
      setRejectReason("");
      fetchApplication();
    } catch {
      alert("Status update failed");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!data) return null;

  const { applicant } = data;

  const canEditLimit = applicant.annualIncome > 500000;

  const statusColor = {
    SUBMITTED: "bg-yellow-100 text-yellow-700",
    APPROVED: "bg-green-100 text-green-700",
    DISPATCHED: "bg-blue-100 text-blue-700",
    REJECTED: "bg-red-100 text-red-700",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Application #{data.applicationNumber}
          </h1>
          <span
            className={`px-4 py-1 rounded-full text-sm font-semibold ${statusColor[data.status]}`}
          >
            {data.status}
          </span>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Applicant */}
          <div className="bg-white rounded-xl shadow p-6 space-y-2">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">
              Applicant Info
            </h3>
            <p><b>Name:</b> {applicant.fullName}</p>
            <p><b>DOB:</b> {new Date(applicant.dob).toLocaleDateString()}</p>
            <p><b>PAN:</b> {applicant.pan}</p>
            <p><b>Email:</b> {applicant.email}</p>
            <p><b>Phone:</b> {applicant.phone}</p>
            <p><b>Profession:</b> {applicant.profession.type}</p>
            <p><b>Income:</b> ₹{applicant.annualIncome.toLocaleString()}</p>
          </div>

          {/* Credit */}
          <div className="bg-white rounded-xl shadow p-6 space-y-3">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">
              Credit Details
            </h3>

            <p><b>Score:</b> {data.creditScore}</p>

            {/* Editable credit limit if income > 5L */}
            <div>
              <b>Limit:</b>

              {canEditLimit && data.status === "SUBMITTED" ? (
                <input
                  type="number"
                  className="ml-2 border rounded-lg px-3 py-1 w-40 focus:ring-2 focus:ring-blue-500"
                  value={editableLimit}
                  onChange={(e) =>
                    setEditableLimit(
                      Math.max(0, parseInt(e.target.value || 0))
                    )
                  }
                />
              ) : (
                <span className="ml-2">
                  ₹{data.creditLimit.toLocaleString()}
                </span>
              )}
            </div>

            <p><b>Card Type:</b> {data.cardType}</p>

            {canEditLimit && (
              <p className="text-sm text-gray-500">
                (Income above ₹5L — credit limit can be adjusted)
              </p>
            )}
          </div>

          {/* Address */}
          <div className="bg-white rounded-xl shadow p-6 md:col-span-2">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">
              Address
            </h3>
            <p>
              {applicant.address.line1}, {applicant.address.line2}
            </p>
            <p>
              {applicant.address.city}, {applicant.address.state} - {applicant.address.pin}
            </p>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl shadow p-6 md:col-span-2">
            <h3 className="text-lg font-semibold text-blue-600 mb-4">
              Status Timeline
            </h3>
            <div className="space-y-3">
              {data.statusHistory.map((s) => (
                <div
                  key={s._id}
                  className="flex justify-between border-l-4 border-blue-500 pl-4"
                >
                  <div>
                    <p className="font-semibold">{s.status}</p>
                    <p className="text-sm text-gray-500">{s.reason}</p>
                  </div>
                  <p className="text-sm text-gray-400">
                    {new Date(s.changedAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-4 pt-4">
          {data.status === "SUBMITTED" && (
            <>
              <button
                onClick={() => setShowApproveModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow"
              >
                Approve
              </button>

              <button
                onClick={() => setShowRejectModal(true)}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg shadow"
              >
                Reject
              </button>
            </>
          )}

          {data.status === "APPROVED" && (
            <button
              onClick={() => updateStatus("DISPATCHED")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow"
            >
              Dispatch Card
            </button>
          )}
        </div>
      </div>

      {/* APPROVE MODAL */}
      {showApproveModal && (
        <Modal>
          <h3 className="text-lg font-semibold mb-4">Approve Application?</h3>

          {canEditLimit && (
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">
                Final Credit Limit
              </label>
              <input
                type="number"
                className="w-full border rounded-lg px-3 py-2"
                value={editableLimit}
                onChange={(e) =>
                  setEditableLimit(
                    Math.max(0, parseInt(e.target.value || 0))
                  )
                }
              />
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowApproveModal(false)}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              onClick={() => updateStatus("APPROVED")}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Confirm
            </button>
          </div>
        </Modal>
      )}

      {/* REJECT MODAL */}
      {showRejectModal && (
        <Modal>
          <h3 className="text-lg font-semibold mb-4">Reject Application</h3>
          <textarea
            className="w-full border rounded-lg p-3 mb-4 focus:ring-2 focus:ring-blue-500"
            rows="4"
            placeholder="Enter rejection reason..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowRejectModal(false)}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              disabled={!rejectReason}
              onClick={() => updateStatus("REJECTED", rejectReason)}
              className="bg-red-500 disabled:opacity-50 text-white px-4 py-2 rounded"
            >
              Reject
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default ApplicationDetailPage;

function Modal({ children }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        {children}
      </div>
    </div>
  );
}
