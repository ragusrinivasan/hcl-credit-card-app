import { useNavigate } from 'react-router-dom';
import { Modal, Button } from '../../components/common';

const SuccessPopup = ({ isOpen, onClose, applicationData }) => {
  const navigate = useNavigate();

  const handleTrackApplication = () => {
    onClose();
    // Navigate to track application page (if implemented)
    // navigate('/track');
  };

  const handleBackToHome = () => {
    onClose();
    navigate('/');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={false}
      size="md"
    >
      <div className="text-center">
        {/* Success Icon */}
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Success Message */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Application Submitted!
        </h2>
        <p className="text-gray-600 mb-6">
          Your credit card application has been submitted successfully.
        </p>

        {/* Application Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Application ID:</span>
              <span className="text-sm font-semibold text-blue-700">
                {applicationData?.applicationId || 'LBG-2024-XXXXX'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Applicant Name:</span>
              <span className="text-sm font-medium text-gray-800">
                {applicationData?.fullName || '-'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Status:</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                PENDING
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Submitted On:</span>
              <span className="text-sm text-gray-800">
                {new Date().toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Info Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 text-left">
          <p className="text-xs text-blue-700">
            <span className="font-medium">Note:</span> You will receive an email and SMS notification regarding your application status.
            The approval process typically takes 2-3 business days.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={handleTrackApplication}
            fullWidth
          >
            Track Application
          </Button>
          <Button
            variant="primary"
            onClick={handleBackToHome}
            fullWidth
          >
            Back to Home
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SuccessPopup;
