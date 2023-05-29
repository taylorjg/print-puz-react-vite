import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listPuzzles, scrapePuzzleUrl } from "./serverless";

export const App = () => {
  const [currentPuzzleUrl, setCurrentPuzzleUrl] = useState("");
  const [puzzles, setPuzzles] = useState([]);

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

  const onSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <div>Hello from App</div>
      <form onSubmit={onSubmit}>
        <input type="text" value={currentPuzzleUrl} readOnly />
        <select>
          {puzzles.map((puzzle) => {
            const { filename } = puzzle;
            const pos = filename.lastIndexOf("/");
            const name = filename.substring(pos + 1);
            return (
              <option key={filename} value={filename}>
                {name}
              </option>
            );
          })}
        </select>
      </form>
      <Link to={"/page2"} state={{ puzzleUrl: currentPuzzleUrl }}>
        Page 2
      </Link>
    </div>
  );
};
