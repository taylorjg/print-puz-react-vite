import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { parsePuzzle } from "./serverless";

export const Page2 = () => {
  const { state } = useLocation();

  const [parsedPuzzle, setParsedPuzzle] = useState([]);

  useEffect(() => {
    const parsePuzzleAsync = async () => {
      const result = await parsePuzzle(state?.puzzleUrl);
      setParsedPuzzle(result);
    };
    parsePuzzleAsync();
  }, []);

  return (
    <div>
      <div>Page 2</div>
      <pre>{JSON.stringify(state?.puzzleUrl, null, 2)}</pre>
      <pre>{JSON.stringify(parsedPuzzle, null, 2)}</pre>
    </div>
  );
};
