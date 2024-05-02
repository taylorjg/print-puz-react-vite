import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { rest } from "msw";

import { RouterTestComponent } from "@app/mocks/RouterTestComponent";
import { server } from "@app/mocks/server";

import { HomePage } from "./HomePage";

const renderPage = () => {
  const routes = [
    { path: "/", element: <HomePage /> },
    { path: "/puzzle", element: <RouterTestComponent /> },
  ];
  const router = createMemoryRouter(routes);
  return render(<RouterProvider router={router} />);
};

const waitForNetworkCallsToComplete = async ({
  waitForScrapePuzzleUrl = true,
  waitForListPuzzles = true,
} = {}) => {
  if (waitForScrapePuzzleUrl) {
    expect(
      await screen.findByDisplayValue(
        "http://website.com/mock-current-puzzle.puz"
      )
    ).toBeInTheDocument();
  }

  if (waitForListPuzzles) {
    expect(
      await screen.findByText("mock-puzzle-3.puz (Fri Mar 03 2023)")
    ).toBeInTheDocument();
  }
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
    userEvent.click(
      within(listbox).getByText("mock-puzzle-2.puz (Thu Feb 02 2023)")
    );

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

describe("HomePage error scenarios", () => {
  it("failure of scrapePuzzleUrl", async () => {
    server.use(
      rest.get(/\/scrape-puzzle-url$/, (_req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: "Unit test error" }));
      })
    );

    renderPage();
    await waitForNetworkCallsToComplete({ waitForScrapePuzzleUrl: false });

    const section = screen.getByTestId("current-puzzle");

    expect(await within(section).findByTestId("ErrorIcon")).toBeInTheDocument();

    expect(
      within(section).getByTitle("Request failed with status code 500")
    ).toBeInTheDocument();
  });

  it("failure of listPuzzles", async () => {
    server.use(
      rest.get(/\/list-puzzles$/, (_req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: "Unit test error" }));
      })
    );

    renderPage();
    await waitForNetworkCallsToComplete({ waitForListPuzzles: false });

    const section = screen.getByTestId("puzzle-list");

    expect(await within(section).findByTestId("ErrorIcon")).toBeInTheDocument();

    expect(
      within(section).getByTitle("Request failed with status code 500")
    ).toBeInTheDocument();
  });
});
