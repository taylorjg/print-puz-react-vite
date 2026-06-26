import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router-dom";

import { RouterTestComponent } from "@app/mocks/RouterTestComponent";

import { PuzzlePage } from "./PuzzlePage";

const routerFuture = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
};

let user;

beforeEach(() => {
  user = userEvent.setup();
});

const myRender = (initialState) => {
  const routes = [
    { path: "/", element: <RouterTestComponent /> },
    { path: "/puzzle", element: <PuzzlePage /> },
  ];
  const initialEntries = [
    {
      pathname: "/puzzle",
      state: initialState,
    },
  ];
  const opts = { initialEntries, future: routerFuture };
  const router = createMemoryRouter(routes, opts);
  return render(<RouterProvider router={router} future={routerFuture} />);
};

const renderPuzzlePage = async (initialState) => {
  myRender(initialState);

  if (!initialState?.puzzleUrl) {
    await screen.findByRole("alert");
  }
};

describe("PuzzlePage happy path scenarios", () => {
  test("displays title and author in header", async () => {
    await renderPuzzlePage({
      puzzleUrl:
        "https://www.private-eye.co.uk/pictures/crossword/download/753.puz",
    });
    expect(await screen.findByText("Eye 753/1598")).toBeInTheDocument();
    expect(await screen.findByText("Cyclops")).toBeInTheDocument();
  });
});

describe("PuzzlePage error scenarios", () => {
  it("no puzzle specified", async () => {
    await renderPuzzlePage();
    const alert = screen.getByRole("alert");
    expect(within(alert).getByText("No puzzle specified.")).toBeInTheDocument();
    await user.click(within(alert).getByText("Return Home"));
    expect(await screen.findByText("RouterTestComponent")).toBeInTheDocument();
    expect(screen.getByText(`pathname: /`)).toBeInTheDocument();
  });

  it("read or parse failure", async () => {
    await renderPuzzlePage({
      puzzleUrl:
        "https://www.private-eye.co.uk/pictures/crossword/download/bogus.puz",
    });
    expect(
      await screen.findByText("Failed to read or parse puzzle.")
    ).toBeInTheDocument();
    const alert = screen.getByRole("alert");
    await user.click(within(alert).getByText("Return Home"));
    expect(await screen.findByText("RouterTestComponent")).toBeInTheDocument();
    expect(screen.getByText(`pathname: /`)).toBeInTheDocument();
  });
});
