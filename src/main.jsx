import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import {
  HomePage,
  PuzzlePageOldHtmlLayout,
  PuzzlePageNewPdfLayout,
} from "@app/Pages";

const router = createHashRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/puzzle",
    element: <PuzzlePageOldHtmlLayout />,
  },
  {
    path: "/puzzle2",
    element: <PuzzlePageNewPdfLayout />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
