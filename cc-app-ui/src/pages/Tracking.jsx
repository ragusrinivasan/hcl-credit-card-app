import React, { useState } from "react";

const steps = [
  { id: 1, name: "Applied", description: "Your credit card application has been submitted." },
  { id: 2, name: "Processing", description: "Your application is being reviewed by the bank." },
  { id: 3, name: "Shipped", description: "Your credit card has been shipped to your address." },
  { id: 4, name: "Delivered", description: "Your credit card has been delivered successfully." },
];

function Tracking() {
  const [status, setStatus] = useState(steps);
  const [refNo, setRefNo] = useState("");
  const [showTimeline, setShowTimeline] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // Default first step

  function handleSubmit() {
    if (!refNo) {
      alert("Please enter a reference number!");
      return;
    }

    // Example: dynamically set current step based on refNo
    // For demo, just randomly pick a step
    const step = Math.min(Math.floor(Math.random() * 4) + 1, 4);
    setCurrentStep(step);

    // Show timeline
    setShowTimeline(true);
  }

  return (
    <>
      {/* Centered Input Section */}
      {!showTimeline && (
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <div className="flex flex-col items-center gap-4 bg-white p-6 rounded shadow-md">
            <p className="text-lg font-semibold">Track Your Credit Card Application</p>
            <input
              type="text"
              id="refno"
              placeholder="Enter Reference Number"
              value={refNo}
              onChange={(e) => setRefNo(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSubmit}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded shadow transition-colors duration-200"
            >
              Track
            </button>
          </div>
        </div>
      )}

      {/* Timeline Section */}
      {showTimeline && (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Credit Card Status Tracker</h1>

            <div className="relative border-l-4 border-gray-300 ml-6">
              {status.map((step) => {
                const isCompleted = step.id < currentStep;
                const isCurrent = step.id === currentStep;

                return (
                  <div key={step.id} className="mb-8 relative">
                    <span
                      className={`absolute -left-5 flex items-center justify-center w-10 h-10 rounded-full font-bold 
                        ${isCompleted ? "bg-blue-500 text-white" : isCurrent ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-500"}`}
                    >
                      {step.id}
                    </span>
                    <h2 className={`ml-6 text-lg font-semibold ${isCurrent ? "text-blue-500" : "text-gray-800"}`}>
                      {step.name}
                    </h2>
                    <p className="ml-6 text-gray-500">{step.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Tracking;
