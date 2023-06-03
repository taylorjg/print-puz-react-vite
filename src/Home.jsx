import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listPuzzles, scrapePuzzleUrl } from "./serverless";
import { Version } from "./Version";
import { StyledSection } from "./Home.styles";

export const Home = () => {
  const [currentPuzzleUrl, setCurrentPuzzleUrl] = useState("");
  const [puzzles, setPuzzles] = useState([]);
  const [selectedPuzzle, setSelectedPuzzle] = useState("");
  const [explicitPuzzle, setExplicitPuzzle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const scrapePuzzleUrlAsync = async () => {
      const puzzleUrl = await scrapePuzzleUrl();
      setCurrentPuzzleUrl(puzzleUrl);
    };
    const listPuzzlesAsync = async () => {
      const puzzles = await listPuzzles();
      setPuzzles(puzzles);
      if (puzzles.length > 0) {
        setSelectedPuzzle(puzzles[0].url);
      }
    };
    scrapePuzzleUrlAsync();
    listPuzzlesAsync();
  }, []);

  const onViewCurrentPuzzleUrl = () => {
    const state = { puzzleUrl: currentPuzzleUrl };
    navigate("/puzzle", { state });
  };

  const onViewPuzzleListSelection = () => {
    const state = { puzzleUrl: selectedPuzzle };
    navigate("/puzzle", { state });
  };

  const onViewExplicitPuzzleUrl = () => {
    const state = { puzzleUrl: explicitPuzzle };
    navigate("/puzzle", { state });
  };

  return (
    <div>
      <div data-testid="current-puzzle-url">
        <StyledSection>
          <input type="text" value={currentPuzzleUrl} readOnly />
          <button onClick={onViewCurrentPuzzleUrl} disabled={!currentPuzzleUrl}>
            View Puzzle
          </button>
        </StyledSection>
      </div>

      <hr />

      <div data-testid="puzzle-list">
        <StyledSection>
          <select
            aria-label="Puzzles"
            onChange={(e) => {
              setSelectedPuzzle(e.target.value);
            }}
          >
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
          <button
            onClick={onViewPuzzleListSelection}
            disabled={!selectedPuzzle}
          >
            View Puzzle
          </button>
        </StyledSection>
      </div>

      <hr />

      <div data-testid="explicit-puzzle-url">
        <StyledSection>
          <input
            aria-label="Puzzle Url"
            type="text"
            value={explicitPuzzle}
            onChange={(e) => {
              setExplicitPuzzle(e.target.value);
            }}
          />
          <button onClick={onViewExplicitPuzzleUrl} disabled={!explicitPuzzle}>
            View Puzzle
          </button>
        </StyledSection>
      </div>

      <Version />
    </div>
  );
};
