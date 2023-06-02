import React from "react";
import ReactDOM from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { Home } from "./Home.jsx";
import { Page2 } from "./Page2";

const router = createHashRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/page2",
    element: <Page2 />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
