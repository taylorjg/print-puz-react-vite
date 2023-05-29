import { rest } from "msw";

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
        { filename: "mock-puzzle-url-1", timestamp: "2023-01-01" },
        { filename: "mock-puzzle-url-2", timestamp: "2023-02-02" },
      ],
    })
  );
};

const mockParsePuzzleHandler = (_req, res, ctx) => {
  return res(ctx.status(200), ctx.json({}));
};

export const handlers = [
  rest.get(/\/scrape-puzzle-url$/, mockScrapePuzzleUrlHandler),
  rest.get(/\/list-puzzles$/, mockListPuzzlesHandler),
  rest.get(/\/parse-puzzle$/, mockParsePuzzleHandler),
];
