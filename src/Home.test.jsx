import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { Home } from "./Home";
import { RouterTestComponent } from "./mocks/RouterTestComponent";

const renderPage = () => {
  const routes = [
    { path: "/", element: <Home /> },
    { path: "/puzzle", element: <RouterTestComponent /> },
  ];
  const router = createMemoryRouter(routes);
  return render(<RouterProvider router={router} />);
};

const checkPageNavigation = async (section, puzzleUrl) => {
  const viewPuzzleButton = within(section).getByRole("button", {
    name: "View Puzzle",
  });
  userEvent.click(viewPuzzleButton);

  const expectedPathname = "/puzzle";
  const expectedState = JSON.stringify({ puzzleUrl });

  expect(await screen.findByText("RouterTestComponent")).toBeInTheDocument();
  expect(screen.getByText(`pathname: ${expectedPathname}`)).toBeInTheDocument();
  expect(screen.getByText(`state: ${expectedState}`)).toBeInTheDocument();

  return true;
};

describe("happy path scenarios", () => {
  test("Home page: Current Puzzle Url section", async () => {
    renderPage();

    const section = screen.getByTestId("current-puzzle-url");

    expect(
      await within(section).findByDisplayValue(
        "http://website.com/mock-current-puzzle.puz"
      )
    ).toBeInTheDocument();

    await expect(
      checkPageNavigation(section, "http://website.com/mock-current-puzzle.puz")
    ).resolves.toBeTruthy();
  });

  test("Home page: Puzzle List section", async () => {
    renderPage();

    const section = screen.getByTestId("puzzle-list");

    expect(
      await within(section).findByDisplayValue("mock-puzzle-1.puz")
    ).toBeInTheDocument();

    userEvent.selectOptions(
      within(section).getByLabelText("Puzzles"),
      "mock-puzzle-2.puz"
    );

    await expect(
      checkPageNavigation(section, "http://website.com/mock-puzzle-2.puz")
    ).resolves.toBeTruthy();
  });

  test("Home page: Explicit Puzzle Url section", async () => {
    renderPage();

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
