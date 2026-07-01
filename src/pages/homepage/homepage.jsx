import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  CssBaseline,
  Link,
  MenuItem,
  Select,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";

import { listPuzzles, scrapePuzzleUrl } from "@app/serverless";
import { Version } from "@app/components";
import { buildPuzzlePath } from "@app/helpers";

import { DataFetchProgress } from "./components";
import { homePageTheme } from "./homepage.theme";

import {
  StyledControls,
  StyledPageWrapper,
  StyledSection,
  StyledSections,
} from "./homepage.styles";

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
    puzzles = puzzles
      .filter(({ timestamp }) => timestamp !== "2017-04-24")
      .filter(
        ({ url, timestamp }) =>
          !(url.endsWith("783.puz") && timestamp === "2022-10-07")
      )
      .reverse();
    setPuzzles(puzzles);
    if (puzzles.length > 0) {
      setSelectedPuzzle(puzzles[0].url);
    }
  };

  const onViewCurrentPuzzleUrl = () => {
    navigate(buildPuzzlePath(currentPuzzle));
  };

  const onViewPuzzleListSelection = () => {
    navigate(buildPuzzlePath(selectedPuzzle));
  };

  const onViewExplicitPuzzleUrl = () => {
    navigate(buildPuzzlePath(explicitPuzzle));
  };

  return (
    <ThemeProvider theme={homePageTheme}>
      <CssBaseline />
      <StyledPageWrapper>
        <Container maxWidth="sm">
          <StyledSections>
            <StyledSection data-testid="current-puzzle">
              <Typography>
                Use the following link scraped from the current&nbsp;
                <Link
                  href="https://www.private-eye.co.uk/crossword"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  crossword puzzle page
                </Link>
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
                  onClick={() => onViewCurrentPuzzleUrl()}
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
                Select a puzzle from a list scraped from the&nbsp;
                <Link
                  href="https://www.private-eye.co.uk/pictures/crossword/download/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  download page
                </Link>
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
                  const { url, timestamp } = puzzle;
                  const pos = url.lastIndexOf("/");
                  const name = url.substring(pos + 1);
                  return (
                    <MenuItem key={url} value={url}>
                      {name} ({new Date(timestamp).toDateString()})
                    </MenuItem>
                  );
                })}
              </Select>
              <StyledControls>
                <Button
                  onClick={() => onViewPuzzleListSelection()}
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
              <StyledControls>
                <Button
                  onClick={() => onViewExplicitPuzzleUrl()}
                  disabled={!explicitPuzzle}
                >
                  View Puzzle
                </Button>
              </StyledControls>
            </StyledSection>

            <Version />
          </StyledSections>
        </Container>
      </StyledPageWrapper>
    </ThemeProvider>
  );
};
