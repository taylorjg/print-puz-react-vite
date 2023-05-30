import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { parsePuzzle } from "./serverless";
import * as U from "./utils";

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

const makeGridSquares = (parsedPuzzle) => {
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
          return "black_cell.gif";
        } else {
          const clueNumber = findClueNumber(parsedPuzzle, row, col);
          const suffix = makeSuffix();
          if (clueNumber) {
            return `${clueNumber}_number${suffix}.gif`;
          } else {
            return `white_cell${suffix}.gif`;
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

  const gridSquares = parsedPuzzle ? makeGridSquares(parsedPuzzle) : [];

  return (
    <div>
      <table
        border="0"
        width="650"
        style={{ backgroundColor: "#000000" }}
        cellPadding="0"
        cellSpacing="0"
      >
        <tbody>
          <tr>
            <td width="450" style={{ backgroundColor: "#ffffff" }}>
              {parsedPuzzle?.puzzle.title}
              <br />
              <div style={{ width: "250px", height: "1px" }}>
                <img src="clear.gif" />
              </div>
            </td>
            <td align="right" style={{ backgroundColor: "#ffffff" }}>
              {parsedPuzzle?.puzzle.author}
            </td>
          </tr>
          <tr>
            <td colSpan="2">
              <div style={{ width: "1px", height: "2px" }}>
                <img src="clear.gif" />
              </div>
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
                    {gridSquares.map((rowSquares, row) => {
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

      <br />

      <table
        border="0"
        width="650"
        style={{ backgroundColor: "#ffffff" }}
        cellPadding="0"
        cellSpacing="0"
      >
        <tbody>
          <tr valign="top">
            <td width="20">&nbsp;</td>
            <td width="290">
              <font face="arial,helvetica" size="2">
                <b>Across</b>
              </font>
              <br />
              <table>
                <tbody>
                  {(parsedPuzzle?.acrossClues ?? []).map((clue) => (
                    <tr key={`across-${clue.clueNumber}`}>
                      <td valign="top">
                        <b>
                          <font face="arial,helvetica" size="2">
                            {clue.clueNumber}
                          </font>
                        </b>
                      </td>
                      <td width="85%">
                        <font face="arial,helvetica" size="2">
                          <span>{clue.clue}</span>
                        </font>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </td>
            <td width="30">&nbsp;</td>
            <td width="290">
              <font face="arial,helvetica" size="2">
                <b>Down</b>
              </font>
              <br />
              <table>
                <tbody>
                  {(parsedPuzzle?.downClues ?? []).map((clue) => (
                    <tr key={`across-${clue.clueNumber}`}>
                      <td valign="top">
                        <b>
                          <font face="arial,helvetica" size="2">
                            {clue.clueNumber}
                          </font>
                        </b>
                      </td>
                      <td width="85%">
                        <font face="arial,helvetica" size="2">
                          <span>{clue.clue}</span>
                        </font>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </td>
            <td width="20">&nbsp;</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
