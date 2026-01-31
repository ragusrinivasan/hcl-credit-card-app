import { describe, it, expect,  } from "vitest";
import { render, screen } from "@testing-library/react";
import ApplicationsTable from "../../components/dashboard/ApplicationsTable";

const mockApplications = [
  {
    applicationNumber: "APP-001",
    applicant: { fullName: "John Doe", email: "john@example.com" },
    cardType: "VISA",
    creditScore: 750,
    creditLimit: 150000,
    status: "SUBMITTED",
    createdAt: "2026-01-31T10:00:00.000Z",
  },
  {
    applicationNumber: "APP-002",
    applicant: { fullName: "Jane Smith", email: "jane@example.com" },
    cardType: "MASTER",
    creditScore: 680,
    creditLimit: 100000,
    status: "APPROVED",
    createdAt: "2026-01-30T10:00:00.000Z",
  },
];

describe("ApplicationsTable Component", () => {
  it("renders table headers", () => {
    render(
      <ApplicationsTable
        applications={mockApplications}
        onActionClick={() => {}}
      />,
    );

    expect(screen.getByText("Application #")).toBeInTheDocument();
    expect(screen.getByText("Applicant")).toBeInTheDocument();
    expect(screen.getByText("Card Type")).toBeInTheDocument();
    expect(screen.getByText("Credit Score")).toBeInTheDocument();
    expect(screen.getByText("Credit Limit")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Applied On")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("renders all applications", () => {
    render(
      <ApplicationsTable
        applications={mockApplications}
        onActionClick={() => {}}
      />,
    );

    expect(screen.getByText("APP-001")).toBeInTheDocument();
    expect(screen.getByText("APP-002")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  it('renders "No applications found" when empty', () => {
    render(<ApplicationsTable applications={[]} onActionClick={() => {}} />);
    expect(screen.getByText("No applications found")).toBeInTheDocument();
  });

  it("renders correct number of rows", () => {
    render(
      <ApplicationsTable
        applications={mockApplications}
        onActionClick={() => {}}
      />,
    );
    const rows = screen.getAllByRole("row");
    // 1 header row + 2 data rows
    expect(rows).toHaveLength(3);
  });

  it("renders Update Status buttons for each row", () => {
    render(
      <ApplicationsTable
        applications={mockApplications}
        onActionClick={() => {}}
      />,
    );
    const buttons = screen.getAllByRole("button", { name: /update status/i });
    expect(buttons).toHaveLength(2);
  });
});
