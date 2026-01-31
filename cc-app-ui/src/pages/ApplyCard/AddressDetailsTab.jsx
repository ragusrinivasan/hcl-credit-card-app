import { Input, Select } from '../../components/common';

const AddressDetailsTab = ({ formData, setFormData, errors }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  const handleConfirmChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      addressConfirmed: e.target.checked,
    }));
  };

  const stateOptions = [
    { value: 'AN', label: 'Andaman and Nicobar Islands' },
    { value: 'AP', label: 'Andhra Pradesh' },
    { value: 'AR', label: 'Arunachal Pradesh' },
    { value: 'AS', label: 'Assam' },
    { value: 'BR', label: 'Bihar' },
    { value: 'CH', label: 'Chandigarh' },
    { value: 'CT', label: 'Chhattisgarh' },
    { value: 'DL', label: 'Delhi' },
    { value: 'GA', label: 'Goa' },
    { value: 'GJ', label: 'Gujarat' },
    { value: 'HR', label: 'Haryana' },
    { value: 'HP', label: 'Himachal Pradesh' },
    { value: 'JK', label: 'Jammu and Kashmir' },
    { value: 'JH', label: 'Jharkhand' },
    { value: 'KA', label: 'Karnataka' },
    { value: 'KL', label: 'Kerala' },
    { value: 'MP', label: 'Madhya Pradesh' },
    { value: 'MH', label: 'Maharashtra' },
    { value: 'MN', label: 'Manipur' },
    { value: 'ML', label: 'Meghalaya' },
    { value: 'MZ', label: 'Mizoram' },
    { value: 'NL', label: 'Nagaland' },
    { value: 'OR', label: 'Odisha' },
    { value: 'PB', label: 'Punjab' },
    { value: 'RJ', label: 'Rajasthan' },
    { value: 'SK', label: 'Sikkim' },
    { value: 'TN', label: 'Tamil Nadu' },
    { value: 'TG', label: 'Telangana' },
    { value: 'TR', label: 'Tripura' },
    { value: 'UP', label: 'Uttar Pradesh' },
    { value: 'UK', label: 'Uttarakhand' },
    { value: 'WB', label: 'West Bengal' },
  ];

  return (
    <div className="space-y-4">
      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex items-start">
          <svg
            className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p className="text-sm font-medium text-blue-800">
              Dispatch Address
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Your credit card will be dispatched to this address. Please ensure all details are correct.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Address Line 1 */}
        <div className="md:col-span-2">
          <Input
            label="Address Line 1"
            name="line1"
            type="text"
            value={formData.address.line1}
            onChange={handleChange}
            placeholder="House/Flat No., Building Name"
            required
            error={errors?.line1}
          />
        </div>

        {/* Address Line 2 */}
        <div className="md:col-span-2">
          <Input
            label="Address Line 2"
            name="line2"
            type="text"
            value={formData.address.line2}
            onChange={handleChange}
            placeholder="Street, Locality, Landmark"
            error={errors?.line2}
          />
        </div>

        {/* City */}
        <Input
          label="City"
          name="city"
          type="text"
          value={formData.address.city}
          onChange={handleChange}
          placeholder="Enter city"
          required
          error={errors?.city}
        />

        {/* State */}
        <Select
          label="State"
          name="state"
          value={formData.address.state}
          onChange={handleChange}
          options={stateOptions}
          placeholder="Select state"
          required
          error={errors?.state}
        />

        {/* PIN Code */}
        <Input
          label="PIN Code"
          name="pin"
          type="text"
          value={formData.address.pin}
          onChange={handleChange}
          placeholder="6 digit PIN code"
          required
          maxLength={6}
          error={errors?.pin}
        />
      </div>

      {/* Address Confirmation Checkbox */}
      <div className="border-t border-gray-200 pt-4 mt-4">
        <label className="flex items-start cursor-pointer">
          <input
            type="checkbox"
            checked={formData.addressConfirmed || false}
            onChange={handleConfirmChange}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="ml-3 text-sm text-gray-700">
            I confirm that the above address is correct and I authorize LSB Bank to dispatch my credit card to this address.
            <span className="text-red-500 ml-1">*</span>
          </span>
        </label>
        {errors?.addressConfirmed && (
          <p className="text-red-500 text-xs mt-1 ml-7">{errors.addressConfirmed}</p>
        )}
      </div>
    </div>
  );
};

export default AddressDetailsTab;
