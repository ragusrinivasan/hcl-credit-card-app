import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ApproverLoginPage from "../../pages/ApproverLoginPage";
import api from "../../api/axios";

// Mock API
vi.mock("../../api/axios", () => ({
  default: {
    post: vi.fn(),
  },
}));

// Mock navigation
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("ApproverLoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("renders login form correctly", () => {
    render(
      <MemoryRouter>
        <ApproverLoginPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Approver Login")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  });

  it("shows validation errors for empty submit", async () => {
    render(
      <MemoryRouter>
        <ApproverLoginPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(screen.getByText("Invalid email")).toBeInTheDocument();
      expect(screen.getByText("Minimum 6 characters")).toBeInTheDocument();
    });
  });

  it("shows validation error for invalid email", async () => {
    render(
      <MemoryRouter>
        <ApproverLoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("email"), {
      target: { value: "wrongemail" },
    });

    fireEvent.change(screen.getByPlaceholderText("password"), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(screen.getByText("Invalid email")).toBeInTheDocument();
    });
  });

  it("submits form and logs in successfully", async () => {
    api.post.mockResolvedValue({
      data: {
        token: "mock-jwt-token",
      },
    });

    render(
      <MemoryRouter>
        <ApproverLoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("email"), {
      target: { value: "admin@test.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("password"), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/api/v1/approver/login", {
        email: "admin@test.com",
        password: "123456",
      });
    });

    await waitFor(() => {
      expect(localStorage.getItem("cc-app-token")).toBe("mock-jwt-token");
      expect(mockNavigate).toHaveBeenCalledWith("/approver/dashboard");
    });
  });

  it("displays API error message on login failure", async () => {
    api.post.mockRejectedValue({
      response: {
        data: { message: "Invalid credentials" },
      },
    });

    render(
      <MemoryRouter>
        <ApproverLoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("email"), {
      target: { value: "admin@test.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("password"), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });

  it("falls back to default error message if API gives no message", async () => {
    api.post.mockRejectedValue({});

    render(
      <MemoryRouter>
        <ApproverLoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("email"), {
      target: { value: "admin@test.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("password"), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(screen.getByText("Login failed")).toBeInTheDocument();
    });
  });
});
