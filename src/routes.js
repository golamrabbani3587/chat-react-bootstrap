// routes.js

import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from './components/IndexPage'
export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
  </Routes>
);
