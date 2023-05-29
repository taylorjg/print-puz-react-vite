import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { App } from "./App";

const myRender = () => {
  const routes = [{ path: "/", element: <App /> }];
  const router = createMemoryRouter(routes);
  return render(<RouterProvider router={router} />);
};

test("App page renders", () => {
  myRender();
  expect(screen.getByText("Hello from App")).toBeInTheDocument();
});

test("App page displays the current puzzle url", async () => {
  myRender();
  expect(
    await screen.findByDisplayValue("mock-current-puzzle-url")
  ).toBeInTheDocument();
});

test("App page displays the first of the list of puzzle urls", async () => {
  myRender();
  expect(
    await screen.findByDisplayValue("mock-puzzle-url-1")
  ).toBeInTheDocument();
});
