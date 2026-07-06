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

const WRONG_SIZE_PUZZLE_URL =
  "https://www.private-eye.co.uk/pictures/crossword/download/wrong-size.puz";

const mockParsePuzzleHandler = ({ request }) => {
  const puzzleUrl = new URL(request.url).searchParams.get("puzzleUrl");
  if (puzzleUrl === puzzle753.puzzleUrl) {
    return HttpResponse.json(puzzle753);
  }
  if (puzzleUrl === WRONG_SIZE_PUZZLE_URL) {
    return HttpResponse.json({
      ...puzzle753,
      puzzleUrl: WRONG_SIZE_PUZZLE_URL,
      puzzle: { ...puzzle753.puzzle, width: 13, height: 13 },
    });
  }
  return HttpResponse.json(undefined);
};

export const handlers = [
  http.get("*/scrape-puzzle-url", mockScrapePuzzleUrlHandler),
  http.get("*/list-puzzles", mockListPuzzlesHandler),
  http.get("*/parse-puzzle", mockParsePuzzleHandler),
];
