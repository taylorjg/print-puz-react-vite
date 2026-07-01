import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router-dom";

import { RouterTestComponent } from "@app/mocks/router-test-component";
import { buildPuzzleSearch } from "@app/helpers";

import { PuzzlePageNewPdfLayout } from "./puzzle-page-new-pdf-layout";

let user;

beforeEach(() => {
  user = userEvent.setup();
});

const myRender = (puzzleUrl) => {
  const routes = [
    { path: "/", element: <RouterTestComponent /> },
    { path: "/puzzle2", element: <PuzzlePageNewPdfLayout /> },
  ];
  const initialEntries = [
    {
      pathname: "/puzzle2",
      search: puzzleUrl ? buildPuzzleSearch(puzzleUrl) : "",
    },
  ];
  const router = createMemoryRouter(routes, { initialEntries });
  return render(<RouterProvider router={router} />);
};

const renderPuzzlePageNewPdfLayout = async (puzzleUrl) => {
  myRender(puzzleUrl);

  if (!puzzleUrl) {
    await screen.findByRole("alert");
  }
};

describe("PuzzlePageNewPdfLayout happy path scenarios", () => {
  test("displays generated PDF", async () => {
    await renderPuzzlePageNewPdfLayout(
      "https://www.private-eye.co.uk/pictures/crossword/download/753.puz"
    );
    expect(await screen.findByTitle("Crossword puzzle")).toBeInTheDocument();
  });
});

describe("PuzzlePageNewPdfLayout error scenarios", () => {
  it("no puzzle specified", async () => {
    await renderPuzzlePageNewPdfLayout();
    const alert = screen.getByRole("alert");
    expect(within(alert).getByText("No puzzle specified.")).toBeInTheDocument();
    await user.click(within(alert).getByText("Return Home"));
    expect(await screen.findByText("RouterTestComponent")).toBeInTheDocument();
  });

  it("read or parse failure", async () => {
    await renderPuzzlePageNewPdfLayout(
      "https://www.private-eye.co.uk/pictures/crossword/download/bogus.puz"
    );
    expect(
      await screen.findByText("Failed to read or parse puzzle.")
    ).toBeInTheDocument();
  });
});
