// main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Pages
import { EventsPage } from "./pages/EventsPage";
import { EventPage } from "./pages/EventPage";
import { AddEvent } from "./pages/AddEvent";

// Components
import { Root } from "./components/Root";
import { DataProvider } from "./components/DataContext";

// Define router
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "/", element: <EventsPage /> },
      { path: "/event/:eventId", element: <EventPage /> },
      { path: "/add", element: <AddEvent /> },
    ],
  },
]);

// Render the app
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider>
      <DataProvider>
        <RouterProvider router={router} />
      </DataProvider>
    </ChakraProvider>
  </React.StrictMode>
);
