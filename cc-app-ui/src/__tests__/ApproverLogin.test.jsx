import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import api from "../api/axios"
import Login from "../pages/ApproverLogin.jsx"
// mock navigate
const mockNavigate = jest.fn()

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}))

// mock axios instance
jest.mock("../api/axios")

describe("Login Component", () => {

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("renders login form", () => {
    render(<Login />)

    expect(screen.getByText("Approver Login")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("email")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("password")).toBeInTheDocument()
  })

  test("shows validation errors", async () => {
    render(<Login />)

    fireEvent.click(screen.getByText("Login"))

    expect(await screen.findByText("Invalid email")).toBeInTheDocument()
    expect(await screen.findByText("Minimum 6 characters")).toBeInTheDocument()
  })

  test("successful login redirects", async () => {
    api.post.mockResolvedValueOnce({
      data: { token: "fake-token" }
    })

    render(<Login />)

    fireEvent.change(screen.getByPlaceholderText("email"), {
      target: { value: "test@example.com" },
    })

    fireEvent.change(screen.getByPlaceholderText("password"), {
      target: { value: "123456" },
    })

    fireEvent.click(screen.getByText("Login"))

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        "/api/v1/approver/login",
        {
          email: "test@example.com",
          password: "123456"
        }
      )
    })

    expect(localStorage.getItem("cc-app-token")).toBe("fake-token")
    expect(mockNavigate).toHaveBeenCalledWith("/approver/dashboard")
  })

  test("shows API error on failed login", async () => {
    api.post.mockRejectedValueOnce({
      response: {
        data: { message: "Invalid credentials" }
      }
    })

    render(<Login />)

    fireEvent.change(screen.getByPlaceholderText("email"), {
      target: { value: "wrong@test.com" },
    })

    fireEvent.change(screen.getByPlaceholderText("password"), {
      target: { value: "123456" },
    })

    fireEvent.click(screen.getByText("Login"))

    expect(await screen.findByText("Invalid credentials")).toBeInTheDocument()
  })
})
