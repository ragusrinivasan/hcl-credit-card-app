import StatusBadge from "../common/StatusBadge";

const ApplicationRow = ({ application, onActionClick }) => {
  const getCardTypeIcon = (cardType) => {
    const icons = {
      VISA: "💳",
      MASTER: "💳",
      RUPAY: "💳",
    };
    return icons[cardType] || "💳";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
        {application.applicationNumber}
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900 truncate max-w-[180px]">
          {application.applicant.fullName}
        </div>
        <div className="text-sm text-gray-500 truncate max-w-[180px]">
          {application.applicant.email}
        </div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
        {getCardTypeIcon(application.cardType)} {application.cardType}
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
        {application.creditScore}
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
        ₹{application.creditLimit.toLocaleString("en-IN")}
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <StatusBadge status={application.status} />
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(application.createdAt)}
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-center">
        <button
          onClick={() => onActionClick(application)}
          className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition shadow-sm"
        >
          Update Status
        </button>
      </td>
    </tr>
  );
};

export default ApplicationRow;
