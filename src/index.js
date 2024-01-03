import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import * as React from "react";

import * as ReactDOM from "react-dom/client";

import ErrorPage from "./components/IndexPage";
import HomePage from './components/IndexPage';
import Dashboard from './components/Dashboard';
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    errorElement: <ErrorPage />,
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
