import { Input, Select, RadioGroup } from '../../components/common';

const CustomerDetailsTab = ({ formData, setFormData, errors }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested profession fields
    if (name === 'professionType') {
      setFormData((prev) => ({
        ...prev,
        profession: {
          ...prev.profession,
          type: value,
          company: value === 'SELF_EMPLOYED' ? 'NOT_APPLIED' : prev.profession.company,
        },
      }));
    } else if (name === 'company') {
      setFormData((prev) => ({
        ...prev,
        profession: {
          ...prev.profession,
          company: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const professionOptions = [
    { value: 'SALARIED', label: 'Salaried' },
    { value: 'SELF_EMPLOYED', label: 'Self Employed' },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <Input
          label="Full Name"
          name="fullName"
          type="text"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Enter full name as per PAN"
          required
          error={errors?.fullName}
        />

        {/* Date of Birth */}
        <Input
          label="Date of Birth"
          name="dob"
          type="date"
          value={formData.dob}
          onChange={handleChange}
          required
          error={errors?.dob}
        />

        {/* PAN Card */}
        <Input
          label="PAN Card Number"
          name="pan"
          type="text"
          value={formData.pan}
          onChange={handleChange}
          placeholder="ABCDE1234F"
          required
          maxLength={10}
          error={errors?.pan}
          className="uppercase"
        />

        {/* Annual Income */}
        <Input
          label="Annual Income (INR)"
          name="annualIncome"
          type="number"
          value={formData.annualIncome}
          onChange={handleChange}
          placeholder="Enter annual income"
          required
          error={errors?.annualIncome}
        />

        {/* Email */}
        <Input
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="example@email.com"
          required
          error={errors?.email}
        />

        {/* Phone */}
        <Input
          label="Phone Number"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="10 digit mobile number"
          required
          maxLength={10}
          error={errors?.phone}
        />
      </div>

      {/* Profession Section */}
      <div className="border-t border-gray-200 pt-4 mt-4">
        <h4 className="text-md font-medium text-gray-800 mb-3">
          Employment Details
        </h4>

        <RadioGroup
          label="Profession Type"
          name="professionType"
          value={formData.profession.type}
          onChange={handleChange}
          options={professionOptions}
          required
          error={errors?.professionType}
        />

        {/* Company Name - Only show for Salaried */}
        {formData.profession.type === 'SALARIED' && (
          <Input
            label="Company Name"
            name="company"
            type="text"
            value={formData.profession.company === 'NOT_APPLIED' ? '' : formData.profession.company}
            onChange={handleChange}
            placeholder="Enter company name"
            required
            error={errors?.['profession.company']}
          />
        )}

        {formData.profession.type === 'SELF_EMPLOYED' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
            As a self-employed individual, additional documents may be required during verification.
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDetailsTab;
