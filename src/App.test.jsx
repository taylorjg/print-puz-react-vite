import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { App } from "./App";
import { RouterTestComponent } from "./mocks/RouterTestComponent";

const renderPage = () => {
  const routes = [
    { path: "/", element: <App /> },
    { path: "/page2", element: <RouterTestComponent /> },
  ];
  const router = createMemoryRouter(routes);
  return render(<RouterProvider router={router} />);
};

test("App page displays the current puzzle url", async () => {
  renderPage();
  const section = screen.getByTestId("current-puzzle-url");
  expect(
    await within(section).findByDisplayValue("mock-current-puzzle-url")
  ).toBeInTheDocument();
  userEvent.click(within(section).getByRole("button", { name: "View Puzzle" }));

  const expectedPathname = "/page2";
  const expectedState = JSON.stringify({
    puzzleUrl: "mock-current-puzzle-url",
  });

  expect(await screen.findByText("RouterTestComponent")).toBeInTheDocument();
  expect(screen.getByText(`pathname: ${expectedPathname}`)).toBeInTheDocument();
  expect(screen.getByText(`state: ${expectedState}`)).toBeInTheDocument();
});

test("App page displays the first of the list of puzzle urls", async () => {
  renderPage();
  expect(
    await screen.findByDisplayValue("mock-puzzle-url-1")
  ).toBeInTheDocument();
});
