import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Header from "../../components/common/Header";

describe("Header Component", () => {
  it("renders title correctly", () => {
    render(<Header title="Test Dashboard" onLogout={() => {}} />);
    expect(screen.getByText("Test Dashboard")).toBeInTheDocument();
  });

  it("renders logout button", () => {
    render(<Header title="Test" onLogout={() => {}} />);
    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
  });

  it("calls onLogout when logout button is clicked", () => {
    const mockLogout = vi.fn();
    render(<Header title="Test" onLogout={mockLogout} />);

    fireEvent.click(screen.getByRole("button", { name: /logout/i }));
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
