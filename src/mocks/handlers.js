import { rest } from "msw";

import puzzle753 from "./puzzle753.json";

const mockScrapePuzzleUrlHandler = (_req, res, ctx) => {
  return res(
    ctx.status(200),
    ctx.json({ puzzleUrl: "http://website.com/mock-current-puzzle.puz" })
  );
};

const mockListPuzzlesHandler = (_req, res, ctx) => {
  return res(
    ctx.status(200),
    ctx.json({
      puzzles: [
        {
          url: "http://website.com/mock-puzzle-1.puz",
          timestamp: "2023-01-01",
        },
        {
          url: "http://website.com/mock-puzzle-2.puz",
          timestamp: "2023-02-02",
        },
        {
          url: "http://website.com/mock-puzzle-3.puz",
          timestamp: "2023-03-03",
        },
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
