import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, MenuItem, Select, TextField } from "@mui/material";
import { listPuzzles, scrapePuzzleUrl } from "../../serverless";
import { Version } from "../../Version";
import { StyledSection, StyledSections } from "./Home.styles";

export const Home = () => {
  const mountedRef = useRef(false);
  const [currentPuzzle, setCurrentPuzzleUrl] = useState("");
  const [puzzles, setPuzzles] = useState([]);
  const [selectedPuzzle, setSelectedPuzzle] = useState("");
  const [explicitPuzzle, setExplicitPuzzle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
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
    const state = { puzzleUrl: currentPuzzle };
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
    <StyledSections>
      <StyledSection data-testid="current-puzzle">
        <TextField size="small" type="text" value={currentPuzzle} readOnly />
        <Button onClick={onViewCurrentPuzzleUrl} disabled={!currentPuzzle}>
          View Puzzle
        </Button>
      </StyledSection>

      <StyledSection data-testid="puzzle-list">
        <Select
          sx={{ width: "100%" }}
          size="small"
          aria-label="Puzzles"
          value={selectedPuzzle}
          onChange={(e) => {
            setSelectedPuzzle(e.target.value);
          }}
        >
          {puzzles.map((puzzle) => {
            const { url } = puzzle;
            const pos = url.lastIndexOf("/");
            const name = url.substring(pos + 1);
            return (
              <MenuItem key={url} value={url}>
                {name}
              </MenuItem>
            );
          })}
        </Select>
        <Button onClick={onViewPuzzleListSelection} disabled={!selectedPuzzle}>
          View Puzzle
        </Button>
      </StyledSection>

      <StyledSection data-testid="explicit-puzzle-url">
        <TextField
          size="small"
          label="Puzzle Url"
          type="text"
          value={explicitPuzzle}
          onChange={(e) => {
            setExplicitPuzzle(e.target.value);
          }}
        />
        <Button onClick={onViewExplicitPuzzleUrl} disabled={!explicitPuzzle}>
          View Puzzle
        </Button>
      </StyledSection>

      <Version />
    </StyledSections>
  );
};
