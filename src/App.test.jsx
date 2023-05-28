import { render, screen } from "@testing-library/react";
import { App } from "./App";

test("basic App test", () => {
  render(<App />);
  screen.getByText("Hello from App");
});
