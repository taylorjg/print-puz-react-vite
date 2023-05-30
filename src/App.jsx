import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listPuzzles, scrapePuzzleUrl } from "./serverless";
import { Version } from "./Version";

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

  const onSubmit = (e) => {
    e.preventDefault();
    const state = { puzzleUrl: currentPuzzleUrl };
    navigate("/page2", { state });
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            alignItems: "flex-start",
          }}
        >
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
          <button type="submit">View Puzzle</button>
        </div>
      </form>

      <Version />
    </div>
  );
};
