import { useState } from 'react';
import CustomerDetailsTab from './CustomerDetailsTab';
import AddressDetailsTab from './AddressDetailsTab';
import SuccessPopup from './SuccessPopup';
import { Button } from '../../components/common';
import {
  customerDetailsSchema,
  addressDetailsSchema,
  useFormValidation
} from '../../components/common/validation';
import api from '../../api/axios';

const ApplyCardPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    pan: '',
    annualIncome: '',
    email: '',
    phone: '',
    profession: {
      type: 'SALARIED',
      company: '',
    },
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      pin: '',
    },
    addressConfirmed: false,
  });

  const [submittedData, setSubmittedData] = useState(null);

  // Use Zod validation hooks for each tab
  const customerValidation = useFormValidation(customerDetailsSchema);
  const addressValidation = useFormValidation(addressDetailsSchema);

  const tabs = [
    { id: 0, label: 'Customer Details', icon: 'user' },
    { id: 1, label: 'Address Details', icon: 'location' },
  ];

  const handleNext = () => {
    // Validate Tab 1 using Zod before moving to Tab 2
    const { isValid, errors } = customerValidation.validate(formData);
    console.log('Validation Result:', { isValid, errors, formData });

    if (isValid) {
      setActiveTab(1);
    }
  };

  const handleBack = () => {
    setActiveTab(0);
  };

  const handleSubmit = async () => {
    // Validate Tab 2 using Zod before submit
    const { isValid } = addressValidation.validate(formData);

    if (!isValid) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post('/application', formData);

      if (response.data.success) {
        setSubmittedData({
          applicationId: response.data.data.applicationId,
          fullName: response.data.data.fullName,
          status: response.data.data.status,
          creditScore: response.data.data.creditScore,
          creditLimit: response.data.data.creditLimit,
        });
        setShowSuccessPopup(true);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSuccessPopup = () => {
    setShowSuccessPopup(false);
    // Reset form after closing popup
    setFormData({
      fullName: '',
      dob: '',
      pan: '',
      annualIncome: '',
      email: '',
      phone: '',
      profession: {
        type: 'SALARIED',
        company: '',
      },
      address: {
        line1: '',
        line2: '',
        city: '',
        state: '',
        pin: '',
      },
      addressConfirmed: false,
    });
    setActiveTab(0);
    customerValidation.clearErrors();
    addressValidation.clearErrors();
  };

  const renderTabIcon = (icon, isActive) => {
    const iconClass = `w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`;

    if (icon === 'user') {
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      );
    }

    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    );
  };

  // Get current errors based on active tab
  const currentErrors = activeTab === 0 ? customerValidation.errors : addressValidation.errors;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-600 rounded-t-xl p-6 text-white">
          <h1 className="text-2xl font-bold">Credit Card Application</h1>
          <p className="text-blue-100 mt-1">
            Fill in your details to apply for LBG Credit Card
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white border-b border-gray-200">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === 1) {
                    // Validate Tab 1 before switching to Tab 2
                    const { isValid } = customerValidation.validate(formData);
                    if (isValid) setActiveTab(tab.id);
                  } else {
                    setActiveTab(tab.id);
                  }
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {renderTabIcon(tab.icon, activeTab === tab.id)}
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">
                  {tab.id === 0 ? 'Details' : 'Address'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-xl shadow-lg p-6">
          {/* Progress Indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span>Step {activeTab + 1} of 2</span>
              <span>{activeTab === 0 ? '50%' : '100%'} Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-600 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: activeTab === 0 ? '50%' : '100%' }}
              />
            </div>
          </div>

          {/* Form Content */}
          {activeTab === 0 && (
            <CustomerDetailsTab
              formData={formData}
              setFormData={setFormData}
              errors={currentErrors}
            />
          )}

          {activeTab === 1 && (
            <AddressDetailsTab
              formData={formData}
              setFormData={setFormData}
              errors={currentErrors}
            />
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-4 border-t border-gray-200">
            {activeTab === 0 ? (
              <>
                <div />
                <Button variant="primary" onClick={handleNext}>
                  Next
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Button>
              </>
            ) : (
              <>
                <Button variant="secondary" onClick={handleBack}>
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Back
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Success Popup */}
      <SuccessPopup
        isOpen={showSuccessPopup}
        onClose={handleCloseSuccessPopup}
        applicationData={submittedData}
      />
    </div>
  );
};

export default ApplyCardPage;