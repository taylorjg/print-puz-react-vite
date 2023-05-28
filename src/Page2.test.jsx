import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { Page2 } from "./Page2";

const myRender = (initialRoute = "/page2", initialState) => {
  const routes = [{ path: "/page2", element: <Page2 /> }];
  const initialEntries = [
    {
      pathname: initialRoute,
      state: initialState,
    },
  ];
  const opts = { initialEntries };
  const router = createMemoryRouter(routes, opts);
  return render(<RouterProvider router={router} />);
};

test("basic Page2 test", () => {
  myRender();
  expect(screen.getByText("Page 2")).toBeInTheDocument();
});
