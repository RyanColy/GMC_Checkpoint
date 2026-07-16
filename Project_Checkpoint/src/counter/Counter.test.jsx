import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Counter from "./Counter";

test("increments and decrements by the current step", () => {
  render(<Counter />);

  userEvent.click(screen.getByRole("button", { name: "+ 1" }));
  expect(screen.getByTestId("counter-value")).toHaveTextContent("1");

  userEvent.click(screen.getByRole("button", { name: "− 1" }));
  expect(screen.getByTestId("counter-value")).toHaveTextContent("0");
});

test("resets the count back to zero", () => {
  render(<Counter />);

  userEvent.click(screen.getByRole("button", { name: "+ 1" }));
  userEvent.click(screen.getByRole("button", { name: "Reset" }));

  expect(screen.getByTestId("counter-value")).toHaveTextContent("0");
});

test("respects the max bound and disables the increment button", () => {
  render(<Counter min={0} max={1} />);

  const incrementButton = screen.getByRole("button", { name: "+ 1" });
  userEvent.click(incrementButton);

  expect(screen.getByTestId("counter-value")).toHaveTextContent("1");
  expect(incrementButton).toBeDisabled();
});

test("changing the step updates increment amount", () => {
  render(<Counter />);

  const stepInput = screen.getByLabelText(/step/i);
  userEvent.clear(stepInput);
  userEvent.type(stepInput, "5");

  userEvent.click(screen.getByRole("button", { name: "+ 5" }));
  expect(screen.getByTestId("counter-value")).toHaveTextContent("5");
});

test("logs actions in the history", () => {
  render(<Counter />);

  userEvent.click(screen.getByRole("button", { name: "+ 1" }));

  const history = screen.getByLabelText(/action history/i);
  expect(history).toHaveTextContent("+1");
  expect(history).toHaveTextContent("0");
  expect(history).toHaveTextContent("1");
});
