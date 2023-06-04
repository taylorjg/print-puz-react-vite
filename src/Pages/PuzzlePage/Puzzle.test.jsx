import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { RouterTestComponent } from "../../mocks/RouterTestComponent";
import { Puzzle } from "./Puzzle";

const myRender = (initialState) => {
  const routes = [
    { path: "/", element: <RouterTestComponent /> },
    { path: "/puzzle", element: <Puzzle /> },
  ];
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

describe("error scenarios", () => {
  it("no puzzle specified", async () => {
    myRender();
    const alert = await screen.findByRole("alert");
    expect(within(alert).getByText("No puzzle specified.")).toBeInTheDocument();
    userEvent.click(within(alert).getByText("Return Home"));
    expect(await screen.findByText("RouterTestComponent")).toBeInTheDocument();
    expect(screen.getByText(`pathname: /`)).toBeInTheDocument();
  });

  it("read or parse failure", async () => {
    myRender({
      puzzleUrl:
        "https://www.private-eye.co.uk/pictures/crossword/download/bogus.puz",
    });
    expect(
      await screen.findByText("Failed to read or parse puzzle.")
    ).toBeInTheDocument();
    const alert = await screen.findByRole("alert");
    userEvent.click(within(alert).getByText("Return Home"));
    expect(await screen.findByText("RouterTestComponent")).toBeInTheDocument();
    expect(screen.getByText(`pathname: /`)).toBeInTheDocument();
  });
});
