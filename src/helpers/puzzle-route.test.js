import { describe, expect, test } from "vitest";

import {
  buildPuzzlePath,
  buildPuzzleSearch,
  puzzleUrlFromSearch,
} from "./puzzle-route";

describe("puzzle-route", () => {
  test("uses private-eye-crossword for Private Eye download URLs", () => {
    const puzzleUrl =
      "https://www.private-eye.co.uk/pictures/crossword/download/833.puz";
    expect(buildPuzzleSearch(puzzleUrl)).toBe("?private-eye-crossword=833.puz");
    expect(buildPuzzlePath(puzzleUrl)).toBe(
      "/puzzle2?private-eye-crossword=833.puz"
    );
    expect(puzzleUrlFromSearch("?private-eye-crossword=833.puz")).toBe(
      puzzleUrl
    );
  });

  test("uses crossword-url for other puzzle URLs", () => {
    const puzzleUrl = "http://website.com/mock-current-puzzle.puz";
    const search = buildPuzzleSearch(puzzleUrl);
    expect(search).toBe(
      "?crossword-url=http%3A%2F%2Fwebsite.com%2Fmock-current-puzzle.puz"
    );
    expect(puzzleUrlFromSearch(search)).toBe(puzzleUrl);
  });
});
