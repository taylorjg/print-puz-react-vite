import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router-dom";

import { RouterTestComponent } from "@app/mocks/RouterTestComponent";

import { PuzzlePage2 } from "./PuzzlePage2";

let user;

beforeEach(() => {
  user = userEvent.setup();
});

const myRender = (initialState) => {
  const routes = [
    { path: "/", element: <RouterTestComponent /> },
    { path: "/puzzle2", element: <PuzzlePage2 /> },
  ];
  const initialEntries = [
    {
      pathname: "/puzzle2",
      state: initialState,
    },
  ];
  const router = createMemoryRouter(routes, { initialEntries });
  return render(<RouterProvider router={router} />);
};

const renderPuzzlePage2 = async (initialState) => {
  myRender(initialState);

  if (!initialState?.puzzleUrl) {
    await screen.findByRole("alert");
  }
};

describe("PuzzlePage2 happy path scenarios", () => {
  test("displays generated PDF", async () => {
    await renderPuzzlePage2({
      puzzleUrl:
        "https://www.private-eye.co.uk/pictures/crossword/download/753.puz",
    });
    expect(
      await screen.findByTitle("Crossword puzzle PDF")
    ).toBeInTheDocument();
  });
});

describe("PuzzlePage2 error scenarios", () => {
  it("no puzzle specified", async () => {
    await renderPuzzlePage2();
    const alert = screen.getByRole("alert");
    expect(within(alert).getByText("No puzzle specified.")).toBeInTheDocument();
    await user.click(within(alert).getByText("Return Home"));
    expect(await screen.findByText("RouterTestComponent")).toBeInTheDocument();
  });

  it("read or parse failure", async () => {
    await renderPuzzlePage2({
      puzzleUrl:
        "https://www.private-eye.co.uk/pictures/crossword/download/bogus.puz",
    });
    expect(
      await screen.findByText("Failed to read or parse puzzle.")
    ).toBeInTheDocument();
  });
});
