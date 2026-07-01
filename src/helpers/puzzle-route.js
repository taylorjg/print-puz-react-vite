export const PRIVATE_EYE_CROSSWORD_DOWNLOAD_PREFIX =
  "https://www.private-eye.co.uk/pictures/crossword/download/";

export const isPrivateEyeCrosswordUrl = (puzzleUrl) =>
  puzzleUrl.startsWith(PRIVATE_EYE_CROSSWORD_DOWNLOAD_PREFIX);

export const toPrivateEyeCrosswordUrl = (filename) =>
  `${PRIVATE_EYE_CROSSWORD_DOWNLOAD_PREFIX}${filename}`;

export const buildPuzzleSearch = (puzzleUrl) => {
  if (isPrivateEyeCrosswordUrl(puzzleUrl)) {
    const filename = puzzleUrl.slice(
      PRIVATE_EYE_CROSSWORD_DOWNLOAD_PREFIX.length
    );
    return `?private-eye-crossword=${encodeURIComponent(filename)}`;
  }
  return `?crossword-url=${encodeURIComponent(puzzleUrl)}`;
};

export const buildPuzzlePath = (puzzleUrl, pathname = "/puzzle2") =>
  `${pathname}${buildPuzzleSearch(puzzleUrl)}`;

export const puzzleUrlFromSearch = (search) => {
  const params = new URLSearchParams(search);
  const filename = params.get("private-eye-crossword");
  if (filename) {
    return toPrivateEyeCrosswordUrl(filename);
  }
  return params.get("crossword-url");
};
