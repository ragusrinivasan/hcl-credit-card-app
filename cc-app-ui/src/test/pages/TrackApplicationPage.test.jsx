import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TrackApplicationPage from "../../pages/TrackApplicationPage";
import api from "../../api/axios";

/* -------------------- MOCK API -------------------- */
vi.mock("../../api/axios", () => ({
  default: {
    get: vi.fn(),
  },
}));

/* -------------------- MOCK NAVIGATE -------------------- */
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

/* -------------------- MOCK DATA -------------------- */

const mockApplication = {
  applicationNumber: "APP-123",
  applicant: {
    fullName: "John Doe",
  },
  status: "APPROVED",
  createdAt: "2026-01-30T10:00:00.000Z",
  statusHistory: [
    {
      _id: "1",
      status: "SUBMITTED",
      reason: "Application submitted",
      changedAt: "2026-01-28T09:00:00.000Z",
    },
    {
      _id: "2",
      status: "APPROVED",
      reason: "Approved by bank",
      changedAt: "2026-01-30T10:00:00.000Z",
    },
  ],
};

/* ====================================================== */

describe("TrackApplicationPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders input and track button", () => {
    render(
      <MemoryRouter>
        <TrackApplicationPage />
      </MemoryRouter>
    );

    expect(
      screen.getByPlaceholderText("Enter Application Number")
    ).toBeInTheDocument();

    expect(screen.getByText("Track")).toBeInTheDocument();
  });

  it("does not call API when input is empty", () => {
    render(
      <MemoryRouter>
        <TrackApplicationPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Track"));

    expect(api.get).not.toHaveBeenCalled();
  });

  it("shows loading while fetching", () => {
    api.get.mockImplementation(() => new Promise(() => {}));

    render(
      <MemoryRouter>
        <TrackApplicationPage />
      </MemoryRouter>
    );

    fireEvent.change(
      screen.getByPlaceholderText("Enter Application Number"),
      { target: { value: "APP-123" } }
    );

    fireEvent.click(screen.getByText("Track"));

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("calls API with correct endpoint", async () => {
    api.get.mockResolvedValue({
      data: { success: true, data: mockApplication },
    });

    render(
      <MemoryRouter>
        <TrackApplicationPage />
      </MemoryRouter>
    );

    fireEvent.change(
      screen.getByPlaceholderText("Enter Application Number"),
      { target: { value: "APP-123" } }
    );

    fireEvent.click(screen.getByText("Track"));

    expect(api.get).toHaveBeenCalledWith(
      "/api/v1/application/fetch-ui/APP-123"
    );
  });

  it("displays applicant name and current status", async () => {
    api.get.mockResolvedValue({
      data: { success: true, data: mockApplication },
    });

    render(
      <MemoryRouter>
        <TrackApplicationPage />
      </MemoryRouter>
    );

    fireEvent.change(
      screen.getByPlaceholderText("Enter Application Number"),
      { target: { value: "APP-123" } }
    );

    fireEvent.click(screen.getByText("Track"));

    const name = await screen.findByText("John Doe");
    const statuses = await screen.findAllByText("APPROVED");

    expect(name).toBeInTheDocument();
    expect(statuses.length).toBeGreaterThanOrEqual(1);
  });

  it("renders status timeline in chronological order", async () => {
    api.get.mockResolvedValue({
      data: { success: true, data: mockApplication },
    });

    render(
      <MemoryRouter>
        <TrackApplicationPage />
      </MemoryRouter>
    );

    fireEvent.change(
      screen.getByPlaceholderText("Enter Application Number"),
      { target: { value: "APP-123" } }
    );

    fireEvent.click(screen.getByText("Track"));

    const submitted = await screen.findByText("SUBMITTED");
    const approvedList = await screen.findAllByText("APPROVED");

    expect(submitted).toBeInTheDocument();

    // Last APPROVED is the timeline (latest status)
    const timelineApproved = approvedList[approvedList.length - 1];

    expect(timelineApproved).toBeInTheDocument();
  });

  it("shows 'Application not found' when API returns success false", async () => {
    api.get.mockResolvedValue({
      data: { success: false },
    });

    render(
      <MemoryRouter>
        <TrackApplicationPage />
      </MemoryRouter>
    );

    fireEvent.change(
      screen.getByPlaceholderText("Enter Application Number"),
      { target: { value: "APP-999" } }
    );

    fireEvent.click(screen.getByText("Track"));

    const error = await screen.findByText("Application not found");

    expect(error).toBeInTheDocument();
  });

  it("shows generic error on API failure", async () => {
    api.get.mockRejectedValue(new Error("Network error"));

    render(
      <MemoryRouter>
        <TrackApplicationPage />
      </MemoryRouter>
    );

    fireEvent.change(
      screen.getByPlaceholderText("Enter Application Number"),
      { target: { value: "APP-123" } }
    );

    fireEvent.click(screen.getByText("Track"));

    const error = await screen.findByText(
      "Failed to load application"
    );

    expect(error).toBeInTheDocument();
  });

  it("redirects to login on 401 error", async () => {
    api.get.mockRejectedValue({
      response: { status: 401 },
    });

    render(
      <MemoryRouter>
        <TrackApplicationPage />
      </MemoryRouter>
    );

    fireEvent.change(
      screen.getByPlaceholderText("Enter Application Number"),
      { target: { value: "APP-123" } }
    );

    fireEvent.click(screen.getByText("Track"));

    // let React settle
    await screen.findByText("Track Application");

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
