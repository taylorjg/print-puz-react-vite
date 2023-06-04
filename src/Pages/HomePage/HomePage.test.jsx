import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router-dom";

import { RouterTestComponent } from "@app/mocks/RouterTestComponent";

import { HomePage } from "./HomePage";

const renderPage = () => {
  const routes = [
    { path: "/", element: <HomePage /> },
    { path: "/puzzle", element: <RouterTestComponent /> },
  ];
  const router = createMemoryRouter(routes);
  return render(<RouterProvider router={router} />);
};

const waitForNetworkCallsToComplete = async () => {
  expect(
    await screen.findByDisplayValue(
      "http://website.com/mock-current-puzzle.puz"
    )
  ).toBeInTheDocument();

  expect(await screen.findByText("mock-puzzle-1.puz")).toBeInTheDocument();
};

const checkPageNavigation = async (section, puzzleUrl) => {
  const viewPuzzleButton = within(section).getByText("View Puzzle");
  userEvent.click(viewPuzzleButton);

  const expectedPathname = "/puzzle";
  const expectedState = JSON.stringify({ puzzleUrl });

  expect(await screen.findByText("RouterTestComponent")).toBeInTheDocument();
  expect(screen.getByText(`pathname: ${expectedPathname}`)).toBeInTheDocument();
  expect(screen.getByText(`state: ${expectedState}`)).toBeInTheDocument();

  return true;
};

describe("HomePage happy path scenarios", () => {
  test("current puzzle section", async () => {
    renderPage();
    await waitForNetworkCallsToComplete();

    const section = screen.getByTestId("current-puzzle");

    await expect(
      checkPageNavigation(section, "http://website.com/mock-current-puzzle.puz")
    ).resolves.toBeTruthy();
  });

  test("puzzle list section", async () => {
    renderPage();
    await waitForNetworkCallsToComplete();

    const section = screen.getByTestId("puzzle-list");

    const selectComponent = within(section).getByLabelText("Puzzles");
    fireEvent.mouseDown(within(selectComponent).getByRole("button"));
    const listbox = screen.getByRole("listbox");
    userEvent.click(within(listbox).getByText("mock-puzzle-2.puz"));

    await expect(
      checkPageNavigation(section, "http://website.com/mock-puzzle-2.puz")
    ).resolves.toBeTruthy();
  });

  test("explicit puzzle url section", async () => {
    renderPage();
    await waitForNetworkCallsToComplete();

    const section = screen.getByTestId("explicit-puzzle-url");

    await userEvent.type(
      within(section).getByLabelText("Puzzle Url"),
      "http://website.com/mock-explicit-puzzle.puz"
    );

    await expect(
      checkPageNavigation(
        section,
        "http://website.com/mock-explicit-puzzle.puz"
      )
    ).resolves.toBeTruthy();
  });
});
