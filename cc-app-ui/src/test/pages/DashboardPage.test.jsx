import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DashboardPage from "../../pages/DashboardPage";
import api from "../../api/axios";

// Mock the api module
vi.mock("../../api/axios", () => ({
  default: {
    get: vi.fn(),
    patch: vi.fn(),
  },
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

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

describe("DashboardPage", () => {
  beforeEach(() => {
    localStorage.setItem("cc-app-token", "mock-token");
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("shows loader while fetching applications", () => {
    api.get.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    );

    expect(document.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("redirects to login if no token", async () => {
    localStorage.removeItem("cc-app-token");
    api.get.mockResolvedValue({ data: { success: true, data: [] } });

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/approver/login");
    });
  });

  it("displays applications after successful fetch", async () => {
    api.get.mockResolvedValue({
      data: { success: true, data: mockApplications },
    });

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("APP-001")).toBeInTheDocument();
      expect(screen.getByText("APP-002")).toBeInTheDocument();
    });
  });

  it("displays error message on fetch failure", async () => {
    api.get.mockRejectedValue({
      response: { status: 500, data: { message: "Server error" } },
    });

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Server error")).toBeInTheDocument();
    });
  });

  it("redirects to login on 401 error", async () => {
    api.get.mockRejectedValue({
      response: { status: 401 },
    });

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/approver/login");
    });
  });

  it("renders header with correct title", async () => {
    api.get.mockResolvedValue({
      data: { success: true, data: mockApplications },
    });

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        screen.getByText("Credit Card Applications Dashboard"),
      ).toBeInTheDocument();
    });
  });

  it("renders stats grid with correct counts", async () => {
    api.get.mockResolvedValue({
      data: { success: true, data: mockApplications },
    });

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      // ALL count should be 2
      const allCard = screen.getByText("ALL").closest("div");
      expect(allCard).toHaveTextContent("2");
    });
  });

  it("sends correct headers with API request", async () => {
    api.get.mockResolvedValue({
      data: { success: true, data: mockApplications },
    });

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith("/api/v1/application/fetch", {
        headers: { Authorization: "Bearer mock-token" },
      });
    });
  });
});
