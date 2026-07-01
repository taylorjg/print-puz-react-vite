import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { parsePuzzle, extractErrorMessage } from "@app/serverless";
import { puzzleUrlFromSearch } from "@app/helpers";
import { LoadingAlert, ErrorAlert, Version } from "@app/components";
import * as U from "@app/utils";

import {
  StyledClue,
  StyledClueNumber,
  StyledClueType,
  StyledTable,
} from "./puzzle-page-old-html-layout.styles";
import { makeGridSquares } from "./puzzle-page-old-html-layout.utils";

export const PuzzlePageOldHtmlLayout = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const puzzleUrl = puzzleUrlFromSearch(search);

  const [errorMessage, setErrorMessage] = useState();
  const [parsedPuzzle, setParsedPuzzle] = useState();
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    const parsePuzzleAsync = async () => {
      if (puzzleUrl) {
        try {
          const result = await parsePuzzle(puzzleUrl);
          setParsedPuzzle(result);
        } catch (error) {
          setErrorMessage(extractErrorMessage(error));
        } finally {
          setLoading(false);
        }
      }
    };
    parsePuzzleAsync();
  }, [puzzleUrl]);

  const onReturnHome = () => {
    navigate("/");
  };

  if (!puzzleUrl) {
    return (
      <ErrorAlert message="No puzzle specified." onReturnHome={onReturnHome} />
    );
  }

  if (loading) {
    return <LoadingAlert />;
  }

  if (errorMessage || !parsedPuzzle) {
    return (
      <ErrorAlert
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
                <img src={U.publicAssetUrl("clear.gif")} />
              </div>
            </td>
            <td align="right" style={{ backgroundColor: "#ffffff" }}>
              {parsedPuzzle.puzzle.author}
            </td>
          </tr>
          <tr>
            <td colSpan="2">
              <div style={{ width: "1px", height: "2px" }}>
                <img src={U.publicAssetUrl("clear.gif")} />
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
              <img src={U.publicAssetUrl("clear.gif")} width="1" height="3" />
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
