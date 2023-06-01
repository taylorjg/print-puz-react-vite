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

const checkPageNavigation = async (section, puzzleUrl) => {
  const viewPuzzleButton = within(section).getByRole("button", {
    name: "View Puzzle",
  });
  userEvent.click(viewPuzzleButton);

  const expectedPathname = "/page2";
  const expectedState = JSON.stringify({ puzzleUrl });

  expect(await screen.findByText("RouterTestComponent")).toBeInTheDocument();
  expect(screen.getByText(`pathname: ${expectedPathname}`)).toBeInTheDocument();
  expect(screen.getByText(`state: ${expectedState}`)).toBeInTheDocument();

  return true;
};

test("App page: Current Puzzle Url section", async () => {
  renderPage();

  const section = screen.getByTestId("current-puzzle-url");

  expect(
    await within(section).findByDisplayValue("mock-current-puzzle-url")
  ).toBeInTheDocument();

  await expect(
    checkPageNavigation(section, "mock-current-puzzle-url")
  ).resolves.toBeTruthy();
});

test("App page: Puzzle List section", async () => {
  renderPage();

  const section = screen.getByTestId("puzzle-list");

  expect(
    await within(section).findByDisplayValue("mock-puzzle-url-1")
  ).toBeInTheDocument();

  await expect(
    checkPageNavigation(section, "mock-puzzle-url-1")
  ).resolves.toBeTruthy();
});

test("App page: Explicit Puzzle Url section", async () => {
  renderPage();

  const section = screen.getByTestId("explicit-puzzle-url");

  await userEvent.type(
    within(section).getByLabelText("Puzzle Url:"),
    "my-explicit-puzzle-url"
  );

  await expect(
    checkPageNavigation(section, "my-explicit-puzzle-url")
  ).resolves.toBeTruthy();
});
