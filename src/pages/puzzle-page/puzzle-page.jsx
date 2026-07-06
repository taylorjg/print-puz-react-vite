import { useEffect, useRef, useState } from "react";
import { Global } from "@emotion/react";
import { useLocation, useNavigate } from "react-router-dom";

import { parsePuzzle } from "@app/serverless";
import { puzzleUrlFromSearch } from "@app/helpers";

import { LoadingAlert, ErrorAlert } from "@app/components";
import { generateCrosswordPdf } from "./generate-crossword-pdf";
import { StyledPdfFrame, StyledPdfViewer } from "./puzzle-page.styles";

const SUPPORTED_PUZZLE_SIZE = 15;

const unsupportedPuzzleSizeMessage = (width, height) =>
  `Unsupported puzzle size (${width}×${height}). Only 15×15 puzzles are supported.`;

export const PuzzlePage = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const puzzleUrl = puzzleUrlFromSearch(search);

  const [errorMessage, setErrorMessage] = useState();
  const [pdfUrl, setPdfUrl] = useState();
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(false);
  const pdfUrlRef = useRef();

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    const loadPdf = async () => {
      if (!puzzleUrl) return;
      try {
        const parsedPuzzle = await parsePuzzle(puzzleUrl);
        if (!parsedPuzzle?.puzzle) {
          setErrorMessage("Failed to read or parse puzzle.");
          return;
        }
        const { width, height } = parsedPuzzle.puzzle;
        if (width !== SUPPORTED_PUZZLE_SIZE || height !== SUPPORTED_PUZZLE_SIZE) {
          setErrorMessage(unsupportedPuzzleSizeMessage(width, height));
          return;
        }
        const pdfBytes = await generateCrosswordPdf(parsedPuzzle);
        const file = new File([pdfBytes], "Crossword.pdf", {
          type: "application/pdf",
        });
        const url = URL.createObjectURL(file);
        pdfUrlRef.current = url;
        setPdfUrl(url);
      } catch {
        setErrorMessage("Failed to read or parse puzzle.");
      } finally {
        setLoading(false);
      }
    };

    loadPdf();

    return () => {
      if (pdfUrlRef.current) {
        URL.revokeObjectURL(pdfUrlRef.current);
      }
    };
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

  if (errorMessage || !pdfUrl) {
    return (
      <ErrorAlert
        message={errorMessage ?? "Failed to read or parse puzzle."}
        onReturnHome={onReturnHome}
      />
    );
  }

  return (
    <>
      <Global
        styles={{
          "html, body, #root": {
            margin: 0,
            padding: 0,
            width: "100%",
            height: "100%",
            overflow: "hidden",
          },
        }}
      />
      <StyledPdfViewer>
        <StyledPdfFrame src={`${pdfUrl}#view=Fit`} title="Crossword" />
      </StyledPdfViewer>
    </>
  );
};
