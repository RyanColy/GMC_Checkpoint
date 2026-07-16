import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the counter heading", () => {
  render(<App />);
  expect(screen.getByRole("heading", { name: /counter/i })).toBeInTheDocument();
});

test("renders the counter starting at zero", () => {
  render(<App />);
  expect(screen.getByTestId("counter-value")).toHaveTextContent("0");
});
