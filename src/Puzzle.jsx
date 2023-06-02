import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import { Alert, Button } from "@mui/material";
import { parsePuzzle, extractErrorMessage } from "./serverless";
import {
  StyledClue,
  StyledClueNumber,
  StyledClueType,
  StyledMessageWrapper,
  StyledTable,
} from "./Puzzle.styles";
import { Version } from "./Version";
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

const Loading = () => {
  return (
    <StyledMessageWrapper>
      <Alert severity="info" variant="filled">
        Loading puzzle...
      </Alert>
    </StyledMessageWrapper>
  );
};

const OnError = ({ message, onReturnHome }) => {
  return (
    <StyledMessageWrapper>
      <Alert
        sx={{ width: "33%" }}
        severity="error"
        variant="filled"
        action={
          <Button color="inherit" onClick={onReturnHome}>
            Return Home
          </Button>
        }
      >
        {message}
      </Alert>
    </StyledMessageWrapper>
  );
};

OnError.propTypes = {
  message: PropTypes.string.isRequired,
  onReturnHome: PropTypes.func.isRequired,
};

export const Puzzle = () => {
  const { state } = useLocation();

  const [errorMessage, setErrorMessage] = useState();
  const [parsedPuzzle, setParsedPuzzle] = useState();
  const [loading, setLoading] = useState(true);
  const startedRef = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    const parsePuzzleAsync = async () => {
      if (state?.puzzleUrl && !startedRef.current) {
        try {
          startedRef.current = true;
          const result = await parsePuzzle(state.puzzleUrl);
          setParsedPuzzle(result);
        } catch (error) {
          setErrorMessage(extractErrorMessage(error));
        } finally {
          setLoading(false);
        }
      }
    };
    parsePuzzleAsync();
  }, [state]);

  const onReturnHome = () => {
    navigate("/");
  };

  if (!state?.puzzleUrl) {
    return (
      <OnError message="No puzzle specified." onReturnHome={onReturnHome} />
    );
  }

  if (loading) {
    return <Loading />;
  }

  if (errorMessage || !parsedPuzzle) {
    return (
      <OnError
        message="Failed to read or parse puzzle."
        onReturnHome={onReturnHome}
      />
    );
  }

  const gridSquares = makeGridSquares(parsedPuzzle);

  return (
    <div>
      <StyledTable width="650" style={{ backgroundColor: "#000000" }}>
        <tbody>
          <tr>
            <td width="450" style={{ backgroundColor: "#ffffff" }}>
              {parsedPuzzle.puzzle.title}
              <br />
              <div style={{ width: "250px", height: "1px" }}>
                <img src="clear.gif" />
              </div>
            </td>
            <td align="right" style={{ backgroundColor: "#ffffff" }}>
              {parsedPuzzle.puzzle.author}
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
      </StyledTable>

      <br />

      <StyledTable width="650">
        <tbody>
          <tr>
            <td>
              <img src="clear.gif" width="1" height="3" />
            </td>
          </tr>
          <tr>
            <td>
              <center>
                <StyledTable>
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
                </StyledTable>
              </center>
            </td>
          </tr>
        </tbody>
      </StyledTable>

      <br />

      <StyledTable width="650">
        <tbody>
          <tr valign="top">
            <td width="20">&nbsp;</td>
            <td width="290">
              <StyledClueType>Across</StyledClueType>
              <br />
              <StyledTable>
                <tbody>
                  {(parsedPuzzle.acrossClues ?? []).map((clue) => (
                    <tr key={`across-${clue.clueNumber}`}>
                      <td valign="top">
                        <StyledClueNumber>{clue.clueNumber}</StyledClueNumber>
                      </td>
                      <td width="85%">
                        <StyledClue>{clue.clue}</StyledClue>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </StyledTable>
            </td>
            <td width="30">&nbsp;</td>
            <td width="290">
              <StyledClueType>Down</StyledClueType>
              <br />
              <StyledTable>
                <tbody>
                  {(parsedPuzzle.downClues ?? []).map((clue) => (
                    <tr key={`across-${clue.clueNumber}`}>
                      <td valign="top">
                        <StyledClueNumber>{clue.clueNumber}</StyledClueNumber>
                      </td>
                      <td width="85%">
                        <StyledClue>{clue.clue}</StyledClue>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </StyledTable>
            </td>
            <td width="20">&nbsp;</td>
          </tr>
        </tbody>
      </StyledTable>

      <Version />
    </div>
  );
};
