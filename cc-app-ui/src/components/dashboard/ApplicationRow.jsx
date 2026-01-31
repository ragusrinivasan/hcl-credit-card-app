import StatusBadge from "../common/StatusBadge";

const ApplicationRow = ({ application }) => {
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
    <tr className="hover:bg-gray-50 cursor-pointer">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
        {application.applicationNumber}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          {application.applicant.fullName}
        </div>
        <div className="text-sm text-gray-500">
          {application.applicant.email}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {getCardTypeIcon(application.cardType)} {application.cardType}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {application.creditScore}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        ₹{application.creditLimit.toLocaleString("en-IN")}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={application.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(application.createdAt)}
      </td>
    </tr>
  );
};

export default ApplicationRow;
