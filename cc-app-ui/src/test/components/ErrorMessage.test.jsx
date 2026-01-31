import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ErrorMessage from "../../components/common/ErrorMessage";

describe("ErrorMessage Component", () => {
  it("renders error message", () => {
    const errorText = "Something went wrong";
    render(<ErrorMessage message={errorText} />);
    expect(screen.getByText(errorText)).toBeInTheDocument();
  });

  it("has correct error styling", () => {
    render(<ErrorMessage message="Error" />);
    const errorBox = document.querySelector(".bg-red-100");
    expect(errorBox).toBeInTheDocument();
    expect(errorBox).toHaveClass("border-red-400", "text-red-700");
  });
});
