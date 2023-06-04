import React from "react";
import ReactDOM from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { HomePage, PuzzlePage } from "./Pages";

const router = createHashRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/puzzle",
    element: <PuzzlePage />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
