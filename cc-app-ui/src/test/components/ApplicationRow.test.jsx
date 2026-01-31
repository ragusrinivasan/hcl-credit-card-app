import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ApplicationRow from "../../components/dashboard/ApplicationRow";

const mockApplication = {
  applicationNumber: "APP-2026-001",
  applicant: {
    fullName: "John Doe",
    email: "john.doe@example.com",
  },
  cardType: "VISA",
  creditScore: 750,
  creditLimit: 150000,
  status: "SUBMITTED",
  createdAt: "2026-01-31T10:00:00.000Z",
};

describe("ApplicationRow Component", () => {
  it("renders application number", () => {
    render(
      <table>
        <tbody>
          <ApplicationRow
            application={mockApplication}
            onActionClick={() => {}}
          />
        </tbody>
      </table>,
    );
    expect(screen.getByText("APP-2026-001")).toBeInTheDocument();
  });

  it("renders applicant name and email", () => {
    render(
      <table>
        <tbody>
          <ApplicationRow
            application={mockApplication}
            onActionClick={() => {}}
          />
        </tbody>
      </table>,
    );
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
  });

  it("renders card type with icon", () => {
    render(
      <table>
        <tbody>
          <ApplicationRow
            application={mockApplication}
            onActionClick={() => {}}
          />
        </tbody>
      </table>,
    );
    expect(screen.getByText(/💳 VISA/)).toBeInTheDocument();
  });

  it("renders credit score", () => {
    render(
      <table>
        <tbody>
          <ApplicationRow
            application={mockApplication}
            onActionClick={() => {}}
          />
        </tbody>
      </table>,
    );
    expect(screen.getByText("750")).toBeInTheDocument();
  });

  it("renders formatted credit limit", () => {
    render(
      <table>
        <tbody>
          <ApplicationRow
            application={mockApplication}
            onActionClick={() => {}}
          />
        </tbody>
      </table>,
    );
    expect(screen.getByText("₹1,50,000")).toBeInTheDocument();
  });

  it("renders status badge", () => {
    render(
      <table>
        <tbody>
          <ApplicationRow
            application={mockApplication}
            onActionClick={() => {}}
          />
        </tbody>
      </table>,
    );
    expect(screen.getByText("SUBMITTED")).toBeInTheDocument();
  });

  it("renders formatted date", () => {
    render(
      <table>
        <tbody>
          <ApplicationRow
            application={mockApplication}
            onActionClick={() => {}}
          />
        </tbody>
      </table>,
    );
    expect(screen.getByText("31 Jan 2026")).toBeInTheDocument();
  });

  it("renders Update Status button", () => {
    render(
      <table>
        <tbody>
          <ApplicationRow
            application={mockApplication}
            onActionClick={() => {}}
          />
        </tbody>
      </table>,
    );
    expect(
      screen.getByRole("button", { name: /update status/i }),
    ).toBeInTheDocument();
  });

  it("calls onActionClick when Update Status button is clicked", () => {
    const mockActionClick = vi.fn();
    render(
      <table>
        <tbody>
          <ApplicationRow
            application={mockApplication}
            onActionClick={mockActionClick}
          />
        </tbody>
      </table>,
    );

    fireEvent.click(screen.getByRole("button", { name: /update status/i }));
    expect(mockActionClick).toHaveBeenCalledWith(mockApplication);
  });
});
