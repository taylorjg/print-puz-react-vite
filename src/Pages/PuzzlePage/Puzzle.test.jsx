import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { Puzzle } from "./Puzzle";

const myRender = (initialState) => {
  const routes = [{ path: "/puzzle", element: <Puzzle /> }];
  const initialEntries = [
    {
      pathname: "/puzzle",
      state: initialState,
    },
  ];
  const opts = { initialEntries };
  const router = createMemoryRouter(routes, opts);
  return render(<RouterProvider router={router} />);
};

describe("happy path scenarios", () => {
  test("PuzzlePage: displays title and author in header", async () => {
    myRender({
      puzzleUrl:
        "https://www.private-eye.co.uk/pictures/crossword/download/753.puz",
    });
    expect(await screen.findByText("Eye 753/1598")).toBeInTheDocument();
    expect(await screen.findByText("Cyclops")).toBeInTheDocument();
  });
});
