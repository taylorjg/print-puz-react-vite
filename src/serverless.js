import axios from "axios";

const SERVERLESS_URL = "https://fr0r2wv048.execute-api.us-east-1.amazonaws.com";

export const scrapePuzzleUrl = async () => {
  const response = await axios.get(`${SERVERLESS_URL}/scrape-puzzle-url`);
  return response.data.puzzleUrl;
};

export const listPuzzles = async () => {
  const response = await axios.get(`${SERVERLESS_URL}/list-puzzles`);
  return response.data.puzzles;
};

export const parsePuzzle = async (puzzleUrl) => {
  const config = {
    params: {
      puzzleUrl,
    },
  };
  const response = await axios.get(`${SERVERLESS_URL}/parse-puzzle`, config);
  return response.data;
};
