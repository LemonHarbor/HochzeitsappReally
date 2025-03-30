import React from "react";
import { RouteObject } from "react-router-dom";

// Dummy routes for Tempo integration
const routes: RouteObject[] = [
  {
    path: "/tempobook",
    element: React.createElement("div", null, "Tempo Storyboard"),
    children: [
      {
        path: "home",
        element: React.createElement("div", null, "Home Storyboard"),
      },
      {
        path: "guests",
        element: React.createElement("div", null, "Guest Management Storyboard"),
      },
      {
        path: "tables",
        element: React.createElement("div", null, "Table Planner Storyboard"),
      },
      {
        path: "budget",
        element: React.createElement("div", null, "Budget Tracker Storyboard"),
      },
      {
        path: "timeline",
        element: React.createElement("div", null, "Timeline Storyboard"),
      },
      {
        path: "vendors",
        element: React.createElement("div", null, "Vendor Management Storyboard"),
      },
    ],
  },
];

export default routes;
