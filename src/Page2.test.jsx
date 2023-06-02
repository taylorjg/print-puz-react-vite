import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { Page2 } from "./Page2";

const myRender = (initialState) => {
  const routes = [{ path: "/page2", element: <Page2 /> }];
  const initialEntries = [
    {
      pathname: "/page2",
      state: initialState,
    },
  ];
  const opts = { initialEntries };
  const router = createMemoryRouter(routes, opts);
  return render(<RouterProvider router={router} />);
};

describe("happy path scenarios", () => {
  test("Puzzle page displays title and author in header", async () => {
    myRender({
      puzzleUrl:
        "https://www.private-eye.co.uk/pictures/crossword/download/753.puz",
    });
    expect(await screen.findByText("Eye 753/1598")).toBeInTheDocument();
    expect(await screen.findByText("Cyclops")).toBeInTheDocument();
  });
});
