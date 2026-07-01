import * as U from "@app/utils";

export const findClueNumber = (parsedPuzzle, row, col) => {
  const matchingAcrossClue = parsedPuzzle.acrossClues.find(
    ({ rowIndex, colIndex }) => rowIndex === row && colIndex === col
  );
  if (matchingAcrossClue) return matchingAcrossClue.clueNumber;
  const matchingDownClue = parsedPuzzle.downClues.find(
    ({ rowIndex, colIndex }) => rowIndex === row && colIndex === col
  );
  if (matchingDownClue) return matchingDownClue.clueNumber;
  return undefined;
};

export const makeGridSquares = (parsedPuzzle) => {
  const gridSquares = [];
  const lastRow = parsedPuzzle.puzzle.height - 1;
  const lastCol = parsedPuzzle.puzzle.width - 1;
  for (const row of U.range(parsedPuzzle.puzzle.height)) {
    const rowSquares = [];
    for (const col of U.range(parsedPuzzle.puzzle.width)) {
      const makeSuffix = () => {
        if (row === lastRow && col === lastCol) return 4;
        if (col === lastCol) return 3;
        if (row === lastRow) return 2;
        return "";
      };
      const makeImageSrc = () => {
        const isBlackSquare = parsedPuzzle.grid[row][col] === "X";
        if (isBlackSquare) {
          return U.publicAssetUrl("black_cell.gif");
        } else {
          const clueNumber = findClueNumber(parsedPuzzle, row, col);
          const suffix = makeSuffix();
          if (clueNumber) {
            return U.publicAssetUrl(`${clueNumber}_number${suffix}.gif`);
          } else {
            return U.publicAssetUrl(`white_cell${suffix}.gif`);
          }
        }
      };
      const imageSrc = makeImageSrc();
      rowSquares.push(imageSrc);
    }
    gridSquares.push(rowSquares);
  }
  return gridSquares;
};
