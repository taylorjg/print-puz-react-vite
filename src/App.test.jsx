import { render, screen } from "@testing-library/react";
import {
  createMemoryRouter,
  RouterProvider,
} from "react-router-dom";
import { App } from "./App";

const myRender = (initialEntry = "/") => {
  const routes = [
    { path: "/", element: <App /> }
  ];
  const opts = { initialEntries: [initialEntry] };
  const router = createMemoryRouter(routes, opts);
  return render(<RouterProvider router={router} />);
};

test("basic App test", () => {
  myRender();
  screen.getByText("Hello from App");
});
