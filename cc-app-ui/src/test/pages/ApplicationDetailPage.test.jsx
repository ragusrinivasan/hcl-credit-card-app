import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ApplicationDetailPage from "../../pages/ApplicationDetailPage";
import api from "../../api/axios";

// Mock API
vi.mock("../../api/axios", () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
  },
}));

// Mock navigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockApplication = {
  applicationNumber: "APP-100",
  status: "SUBMITTED",
  creditScore: 740,
  creditLimit: 120000,
  cardType: "VISA",
  applicant: {
    fullName: "John Doe",
    dob: "1995-01-01",
    pan: "ABCDE1234F",
    email: "john@test.com",
    phone: "9999999999",
    annualIncome: 800000,
    profession: { type: "Software Engineer" },
    address: {
      line1: "Street 1",
      line2: "Area",
      city: "Bangalore",
      state: "KA",
      pin: "560001",
    },
  },
  statusHistory: [
    {
      _id: "1",
      status: "SUBMITTED",
      reason: "Initial",
      changedAt: "2026-01-30T10:00:00Z",
    },
  ],
};

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={["/applications/APP-100"]}>
      <Routes>
        <Route
          path="/applications/:applicationNumber"
          element={<ApplicationDetailPage />}
        />
      </Routes>
    </MemoryRouter>
  );

describe("ApplicationDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("cc-app-token", "mock-token");
  });

  it("shows loading initially", () => {
    api.get.mockImplementation(() => new Promise(() => {}));

    renderPage();

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("redirects if token missing", async () => {
    localStorage.removeItem("cc-app-token");

    api.get.mockResolvedValue({ data: { success: true, data: mockApplication } });

    renderPage();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/approver/login");
    });
  });

  it("renders application details after fetch", async () => {
    api.get.mockResolvedValue({
      data: { success: true, data: mockApplication },
    });

    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Application #APP-100")).toBeInTheDocument();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("VISA")).toBeInTheDocument();
      expect(screen.getByText("740")).toBeInTheDocument();
    });
  });

  it("handles fetch error", async () => {
    api.get.mockRejectedValue(new Error("fail"));

    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Failed to load application")).toBeInTheDocument();
    });
  });

  it("redirects on 401 response", async () => {
    api.get.mockRejectedValue({
      response: { status: 401 },
    });

    renderPage();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/approver/login");
    });
  });

  it("opens approve modal", async () => {
    api.get.mockResolvedValue({
      data: { success: true, data: mockApplication },
    });

    renderPage();

    fireEvent.click(await screen.findByText("Approve"));

    expect(screen.getByText("Approve Application?")).toBeInTheDocument();
  });

  it("approves application", async () => {
    api.get.mockResolvedValue({
      data: { success: true, data: mockApplication },
    });

    api.put.mockResolvedValue({});

    renderPage();

    fireEvent.click(await screen.findByText("Approve"));
    fireEvent.click(screen.getByText("Confirm"));

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith(
        "/api/v1/application/APP-100/status",
        {
          status: "APPROVED",
          rejectionReason: null,
          creditLimit: 120000,
        },
        {
          headers: { Authorization: "Bearer mock-token" },
        }
      );
    });
  });

  it("opens reject modal and submits reason", async () => {
    api.get.mockResolvedValue({
      data: { success: true, data: mockApplication },
    });

    api.put.mockResolvedValue({});

    renderPage();

    // first Reject button (page)
    fireEvent.click((await screen.findAllByText("Reject"))[0]);

    fireEvent.change(
      screen.getByPlaceholderText("Enter rejection reason..."),
      { target: { value: "Low creditworthiness" } }
    );

    // second Reject button (modal)
    fireEvent.click(screen.getAllByText("Reject")[1]);

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith(
        "/api/v1/application/APP-100/status",
        {
          status: "REJECTED",
          rejectionReason: "Low creditworthiness",
        },
        {
          headers: { Authorization: "Bearer mock-token" },
        }
      );
    });
  });

  it("dispatches card when approved", async () => {
    api.get.mockResolvedValue({
      data: {
        success: true,
        data: { ...mockApplication, status: "APPROVED" },
      },
    });

    api.put.mockResolvedValue({});

    renderPage();

    fireEvent.click(await screen.findByText("Dispatch Card"));

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith(
        "/api/v1/application/APP-100/status",
        {
          status: "DISPATCHED",
          rejectionReason: null,
        },
        {
          headers: { Authorization: "Bearer mock-token" },
        }
      );
    });
  });

  it("sends auth header in fetch", async () => {
    api.get.mockResolvedValue({
      data: { success: true, data: mockApplication },
    });

    renderPage();

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith(
        "/api/v1/application/fetch/APP-100",
        {
          headers: { Authorization: "Bearer mock-token" },
        }
      );
    });
  });
});
