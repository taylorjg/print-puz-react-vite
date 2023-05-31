import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listPuzzles, scrapePuzzleUrl } from "./serverless";
import { Version } from "./Version";
import { StyledSection } from "./App.styles";

export const App = () => {
  const [currentPuzzleUrl, setCurrentPuzzleUrl] = useState("");
  const [puzzles, setPuzzles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const scrapePuzzleUrlAsync = async () => {
      const puzzleUrl = await scrapePuzzleUrl();
      setCurrentPuzzleUrl(puzzleUrl);
    };
    const listPuzzlesAsync = async () => {
      const puzzles = await listPuzzles();
      setPuzzles(puzzles);
    };
    scrapePuzzleUrlAsync();
    listPuzzlesAsync();
  }, []);

  const onViewCurrentPuzzleUrl = () => {
    const state = { puzzleUrl: currentPuzzleUrl };
    navigate("/page2", { state });
  };

  const onViewPuzzleListSelection = () => {
    const state = { puzzleUrl: currentPuzzleUrl };
    navigate("/page2", { state });
  };

  const onViewExplicitPuzzleUrl = () => {
    const state = { puzzleUrl: currentPuzzleUrl };
    navigate("/page2", { state });
  };

  return (
    <div>
      <div data-testid="current-puzzle-url">
        <StyledSection>
          <input type="text" value={currentPuzzleUrl} readOnly />
          <button onClick={onViewCurrentPuzzleUrl}>View Puzzle</button>
        </StyledSection>
      </div>

      <hr />

      <div data-testid="puzzle-list">
        <StyledSection>
          <select>
            {puzzles.map((puzzle) => {
              const { url } = puzzle;
              const pos = url.lastIndexOf("/");
              const name = url.substring(pos + 1);
              return (
                <option key={url} value={url}>
                  {name}
                </option>
              );
            })}
          </select>
          <button onClick={onViewPuzzleListSelection}>View Puzzle</button>
        </StyledSection>
      </div>

      <hr />

      <div data-testid="explicit-puzzle-url">
        <StyledSection>
          <input type="text" />
          <button onClick={onViewExplicitPuzzleUrl}>View Puzzle</button>
        </StyledSection>
      </div>

      <Version />
    </div>
  );
};
