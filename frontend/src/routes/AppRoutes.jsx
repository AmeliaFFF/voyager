import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "../layouts/AppLayout.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";
import HomePage from "../pages/HomePage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import TripsPage from "../pages/TripsPage.jsx";
import NewTripPage from "../pages/NewTripPage.jsx";
import TripDetailPage from "../pages/TripDetailPage.jsx";
import EditTripPage from "../pages/EditTripPage.jsx";
import NewTripItemPage from "../pages/NewTripItemPage.jsx";
import EditTripItemPage from "../pages/EditTripItemPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "trips",
            element: <TripsPage />,
          },
          {
            path: "trips/new",
            element: <NewTripPage />,
          },
          {
            path: "trips/:tripId",
            element: <TripDetailPage />,
          },
          {
            path: "trips/:tripId/edit",
            element: <EditTripPage />,
          },
          {
            path: "trips/:tripId/items/new",
            element: <NewTripItemPage />,
          },
          {
            path: "trips/:tripId/items/:tripItemId/edit",
            element: <EditTripItemPage />,
          },
        ],
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

function AppRoutes() {
  return <RouterProvider router={router} />;
}

export default AppRoutes;
