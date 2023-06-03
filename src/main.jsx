import React from "react";
import ReactDOM from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { Home } from "./Pages/HomePage";
import { Puzzle } from "./Pages/PuzzlePage";

const router = createHashRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/puzzle",
    element: <Puzzle />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
