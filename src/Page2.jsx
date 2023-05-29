import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { parsePuzzle } from "./serverless";

const findClueNumber = (parsedPuzzle, row, col) => {
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

const makeSquares = (parsedPuzzle) => {
  const squares = [];
  const lastRow = parsedPuzzle.puzzle.height - 1;
  const lastCol = parsedPuzzle.puzzle.width - 1;
  for (let row = 0; row < parsedPuzzle.puzzle.height; row++) {
    const rowSquares = [];
    for (let col = 0; col < parsedPuzzle.puzzle.width; col++) {
      const makeSuffix = () => {
        if (row === lastRow && col === lastCol) return 4;
        if (col === lastCol) return 3;
        if (row === lastRow) return 2;
        return "";
      };
      const suffix = makeSuffix();
      const isBlackSquare = parsedPuzzle.grid[row][col] === "X";
      if (isBlackSquare) {
        rowSquares.push("black_cell.gif");
      } else {
        const clueNumber = findClueNumber(parsedPuzzle, row, col);
        if (clueNumber) {
          rowSquares.push(`${clueNumber}_number${suffix}.gif`);
        } else {
          rowSquares.push(`white_cell${suffix}.gif`);
        }
      }
    }
    squares.push(rowSquares);
  }
  return squares;
};

export const Page2 = () => {
  const { state } = useLocation();

  const [parsedPuzzle, setParsedPuzzle] = useState();

  useEffect(() => {
    const parsePuzzleAsync = async () => {
      const result = await parsePuzzle(state?.puzzleUrl);
      setParsedPuzzle(result);
    };
    parsePuzzleAsync();
  }, [state?.puzzleUrl]);

  const squares = parsedPuzzle ? makeSquares(parsedPuzzle) : [];
  console.log(squares);

  return (
    <div>
      <div>Page 2</div>

      <table
        border="0"
        width="650"
        style={{ backgroundColor: "#000000" }}
        cellPadding="0"
        cellSpacing="0"
      >
        <tbody>
          <tr>
            <td
              width="450"
              className="telegraph"
              style={{ backgroundColor: "#ffffff" }}
            >
              {parsedPuzzle?.puzzle.title}
              <br />
              <img src="clear.gif" width="250" height="1" />
            </td>
            <td
              align="right"
              style={{ backgroundColor: "#ffffff" }}
              valign="bottom"
              className="sectionhead"
            >
              {parsedPuzzle?.puzzle.author}
            </td>
          </tr>
          <tr>
            <td colSpan="2">
              <img src="clear.gif" width="1" height="2" />
            </td>
          </tr>
        </tbody>
      </table>

      <br />

      <table
        border="0"
        width="650"
        style={{ backgroundColor: "#ffffff" }}
        cellPadding="0"
        cellSpacing="0"
      >
        <tbody>
          <tr>
            <td>
              <img src="clear.gif" width="1" height="3" />
            </td>
          </tr>
          <tr>
            <td>
              <center>
                <table
                  cellSpacing="0"
                  cellPadding="0"
                  border="0"
                  style={{ backgroundColor: "#ccc" }}
                  align="center"
                >
                  <tbody>
                    {squares.map((rowSquares, row) => {
                      return (
                        <tr key={row}>
                          {rowSquares.map((imageSrc, col) => (
                            <td key={`${row}-${col}`}>
                              <div style={{ width: "24px", height: "24px" }}>
                                <img src={imageSrc} />
                              </div>
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </center>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
