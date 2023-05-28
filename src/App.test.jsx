import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { App } from "./App";

const myRender = () => {
  const routes = [{ path: "/", element: <App /> }];
  const router = createMemoryRouter(routes);
  return render(<RouterProvider router={router} />);
};

test("basic App test", () => {
  myRender();
  expect(screen.getByText("Hello from App")).toBeInTheDocument();
});
