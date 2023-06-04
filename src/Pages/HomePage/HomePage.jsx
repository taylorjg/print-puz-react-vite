import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, MenuItem, Select, TextField } from "@mui/material";

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
  const mountedRef = useRef(false);
  const [currentPuzzle, setCurrentPuzzleUrl] = useState("");
  const [puzzles, setPuzzles] = useState([]);
  const [selectedPuzzle, setSelectedPuzzle] = useState("");
  const [explicitPuzzle, setExplicitPuzzle] = useState("");
  const [scrapePuzzleUrlLoading, setScrapePuzzleUrlLoading] = useState(false);
  const [scrapePuzzleUrlErrorMessage, setScrapePuzzleUrlErrorMessage] =
    useState();
  const [listPuzzlesLoading, setListPuzzlesLoading] = useState(false);
  const [listPuzzlesErrorMessage, setListPuzzlesErrorMessage] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    const scrapePuzzleUrlAsync = async () => {
      try {
        setScrapePuzzleUrlLoading(true);
        const puzzleUrl = await scrapePuzzleUrl();
        setCurrentPuzzleUrl(puzzleUrl);
      } catch (error) {
        setScrapePuzzleUrlErrorMessage(error.message);
      } finally {
        setScrapePuzzleUrlLoading(false);
      }
    };
    const listPuzzlesAsync = async () => {
      try {
        setListPuzzlesLoading(true);
        const puzzles = await listPuzzles();
        setPuzzles(puzzles);
        if (puzzles.length > 0) {
          setSelectedPuzzle(puzzles[0].url);
        }
      } catch (error) {
        setListPuzzlesErrorMessage(error.message);
      } finally {
        setListPuzzlesLoading(false);
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
    <StyledPageWrapper>
      <Container maxWidth="sm">
        <StyledSections>
          <StyledSection data-testid="current-puzzle">
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
                loading={scrapePuzzleUrlLoading}
                errorMessage={scrapePuzzleUrlErrorMessage}
              />
            </StyledControls>
          </StyledSection>

          <StyledSection data-testid="puzzle-list">
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
                loading={listPuzzlesLoading}
                errorMessage={listPuzzlesErrorMessage}
              />
            </StyledControls>
          </StyledSection>

          <StyledSection data-testid="explicit-puzzle-url">
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
