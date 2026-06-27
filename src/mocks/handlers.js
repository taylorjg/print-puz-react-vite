import { http, HttpResponse } from "msw";

import puzzle753 from "./puzzle753.json";

const mockScrapePuzzleUrlHandler = () => {
  return HttpResponse.json({
    puzzleUrl: "http://website.com/mock-current-puzzle.puz",
  });
};

const mockListPuzzlesHandler = () => {
  return HttpResponse.json({
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
  });
};

const mockParsePuzzleHandler = ({ request }) => {
  const puzzleUrl = new URL(request.url).searchParams.get("puzzleUrl");
  if (puzzleUrl === puzzle753.puzzleUrl) {
    return HttpResponse.json(puzzle753);
  }
  return HttpResponse.json(undefined);
};

export const handlers = [
  http.get("*/scrape-puzzle-url", mockScrapePuzzleUrlHandler),
  http.get("*/list-puzzles", mockListPuzzlesHandler),
  http.get("*/parse-puzzle", mockParsePuzzleHandler),
];
