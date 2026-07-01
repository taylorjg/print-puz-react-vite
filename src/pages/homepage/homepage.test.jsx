import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { http, HttpResponse } from "msw";

import { RouterTestComponent } from "@app/mocks/router-test-component";
import { server } from "@app/mocks/server";
import { renderWithTheme } from "@app/test-utils";

import { HomePage } from "@app/pages/homepage";

let user;

beforeEach(() => {
  user = userEvent.setup();
});

const renderPage = async ({
  waitForScrapePuzzleUrl = true,
  waitForListPuzzles = true,
} = {}) => {
  const routes = [
    { path: "/", element: <HomePage /> },
    { path: "/puzzle2", element: <RouterTestComponent /> },
  ];
  const router = createMemoryRouter(routes);
  const view = renderWithTheme(<RouterProvider router={router} />);
  await waitForNetworkCallsToComplete({
    waitForScrapePuzzleUrl,
    waitForListPuzzles,
  });
  return view;
};

const waitForNetworkCallsToComplete = async ({
  waitForScrapePuzzleUrl = true,
  waitForListPuzzles = true,
} = {}) => {
  if (waitForScrapePuzzleUrl) {
    await screen.findByDisplayValue(
      "http://website.com/mock-current-puzzle.puz"
    );
  }

  if (waitForListPuzzles) {
    await screen.findByText("mock-puzzle-3.puz (Fri Mar 03 2023)");
  }

  await waitFor(() => {
    expect(screen.queryAllByRole("progressbar")).toHaveLength(0);
  });
};

const checkPageNavigation = async (section, puzzleUrl) => {
  const viewPuzzleButton = within(section).getByText("View Puzzle");
  await user.click(viewPuzzleButton);

  const expectedPathname = "/puzzle2";
  const expectedState = JSON.stringify({ puzzleUrl });

  expect(await screen.findByText("RouterTestComponent")).toBeInTheDocument();
  expect(screen.getByText(`pathname: ${expectedPathname}`)).toBeInTheDocument();
  expect(screen.getByText(`state: ${expectedState}`)).toBeInTheDocument();

  return true;
};

describe("HomePage happy path scenarios", () => {
  test("current puzzle section", async () => {
    await renderPage();

    const section = screen.getByTestId("current-puzzle");

    await expect(
      checkPageNavigation(section, "http://website.com/mock-current-puzzle.puz")
    ).resolves.toBeTruthy();
  });

  test("puzzle list section", async () => {
    await renderPage();

    const section = screen.getByTestId("puzzle-list");

    await user.click(
      within(section).getByRole("combobox", { name: "Puzzles" })
    );
    const listbox = await screen.findByRole("listbox");
    await user.click(
      within(listbox).getByText("mock-puzzle-2.puz (Thu Feb 02 2023)")
    );

    await expect(
      checkPageNavigation(section, "http://website.com/mock-puzzle-2.puz")
    ).resolves.toBeTruthy();
  });

  test("explicit puzzle url section", async () => {
    await renderPage();

    const section = screen.getByTestId("explicit-puzzle-url");

    await user.type(
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
      http.get("*/scrape-puzzle-url", () => {
        return HttpResponse.json({ error: "Unit test error" }, { status: 500 });
      })
    );

    await renderPage({ waitForScrapePuzzleUrl: false });

    const section = screen.getByTestId("current-puzzle");

    expect(await within(section).findByTestId("ErrorIcon")).toBeInTheDocument();

    expect(
      within(section).getByTitle("Request failed with status code 500")
    ).toBeInTheDocument();
  });

  it("failure of listPuzzles", async () => {
    server.use(
      http.get("*/list-puzzles", () => {
        return HttpResponse.json({ error: "Unit test error" }, { status: 500 });
      })
    );

    await renderPage({ waitForListPuzzles: false });

    const section = screen.getByTestId("puzzle-list");

    expect(await within(section).findByTestId("ErrorIcon")).toBeInTheDocument();

    expect(
      within(section).getByTitle("Request failed with status code 500")
    ).toBeInTheDocument();
  });
});
