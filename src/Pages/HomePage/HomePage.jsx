import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import { listPuzzles, scrapePuzzleUrl } from "@app/serverless";
import { Version } from "@app/Version";

import { DataFetchProgress } from "./components";

import {
  StyledControls,
  StyledPageWrapper,
  StyledSection,
  StyledSections,
} from "./HomePage.styles";

export const HomePage = () => {
  const [currentPuzzle, setCurrentPuzzleUrl] = useState("");
  const [puzzles, setPuzzles] = useState([]);
  const [selectedPuzzle, setSelectedPuzzle] = useState("");
  const [explicitPuzzle, setExplicitPuzzle] = useState("");
  const navigate = useNavigate();

  const onScrapePuzzleUrlSuccess = (puzzleUrl) => {
    setCurrentPuzzleUrl(puzzleUrl);
  };

  const onListPuzzlesSuccess = (puzzles) => {
    setPuzzles(puzzles);
    if (puzzles.length > 0) {
      setSelectedPuzzle(puzzles[0].url);
    }
  };

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
    <StyledPageWrapper>
      <Container maxWidth="sm">
        <StyledSections>
          <StyledSection data-testid="current-puzzle">
            <Typography>
              Use the following link scraped from the current&nbsp;
              <a href="https://www.private-eye.co.uk/crossword">
                crossword puzzle page
              </a>
              &nbsp;of the Private Eye website.
            </Typography>
            <TextField
              fullWidth
              size="small"
              type="text"
              value={currentPuzzle}
              readOnly
            />
            <StyledControls>
              <Button
                onClick={onViewCurrentPuzzleUrl}
                disabled={!currentPuzzle}
              >
                View Puzzle
              </Button>
              <DataFetchProgress
                fetchData={scrapePuzzleUrl}
                onSuccess={onScrapePuzzleUrlSuccess}
              />
            </StyledControls>
          </StyledSection>

          <StyledSection data-testid="puzzle-list">
            <Typography>
              Select a puzzle from a list scraped from an index of the&nbsp;
              <a href="https://www.private-eye.co.uk/pictures/crossword/download/">
                download page
              </a>
              &nbsp;of the Private Eye website.
            </Typography>
            <Select
              fullWidth
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
            <StyledControls>
              <Button
                onClick={onViewPuzzleListSelection}
                disabled={!selectedPuzzle}
              >
                View Puzzle
              </Button>
              <DataFetchProgress
                fetchData={listPuzzles}
                onSuccess={onListPuzzlesSuccess}
              />
            </StyledControls>
          </StyledSection>

          <StyledSection data-testid="explicit-puzzle-url">
            <Typography>
              Enter an arbitrary link to a .puz binary file.
            </Typography>
            <TextField
              fullWidth
              size="small"
              label="Puzzle Url"
              type="text"
              value={explicitPuzzle}
              onChange={(e) => {
                setExplicitPuzzle(e.target.value);
              }}
            />
            <Button
              onClick={onViewExplicitPuzzleUrl}
              disabled={!explicitPuzzle}
            >
              View Puzzle
            </Button>
          </StyledSection>

          <Version />
        </StyledSections>
      </Container>
    </StyledPageWrapper>
  );
};
