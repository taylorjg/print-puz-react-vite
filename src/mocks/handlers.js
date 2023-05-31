import { rest } from "msw";
import puzzle753 from "./puzzle753.json";

const mockScrapePuzzleUrlHandler = (_req, res, ctx) => {
  return res(
    ctx.status(200),
    ctx.json({ puzzleUrl: "mock-current-puzzle-url" })
  );
};

const mockListPuzzlesHandler = (_req, res, ctx) => {
  return res(
    ctx.status(200),
    ctx.json({
      puzzles: [
        { url: "mock-puzzle-url-1", timestamp: "2023-01-01" },
        { url: "mock-puzzle-url-2", timestamp: "2023-02-02" },
      ],
    })
  );
};

const mockParsePuzzleHandler = (req, res, ctx) => {
  const puzzleUrl = req.url.searchParams.get("puzzleUrl");
  if (puzzleUrl === puzzle753.puzzleUrl) {
    return res(ctx.status(200), ctx.json(puzzle753));
  }
  return res(ctx.status(200), ctx.json(undefined));
};

export const handlers = [
  rest.get(/\/scrape-puzzle-url$/, mockScrapePuzzleUrlHandler),
  rest.get(/\/list-puzzles$/, mockListPuzzlesHandler),
  rest.get(/\/parse-puzzle$/, mockParsePuzzleHandler),
];
