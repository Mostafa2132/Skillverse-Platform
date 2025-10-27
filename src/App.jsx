// App.jsx
// This file sets up the app routing (React Router),
// wraps everything inside global Providers (Cart & Wishlist),
// and configures the central toast system (react-hot-toast).

import React from "react"
import Layout from "./Components/Layout/Layout"           // Main layout that holds Navbar, Footer, and <Outlet />
import Home from "./Pages/Home/Home"                     // Home page component
import { createBrowserRouter, RouterProvider } from "react-router-dom" // React Router v6 APIs
import "./i18n"                                          // Initializes i18n translations
import Courses from "./Pages/Courses/Courses"            // Courses listing page
import CourseDetails from "./Pages/Course/CourseDetails" // Single course details page
import Dashboard from "./Pages/Dashboard/Dashboard"      // Dashboard page
import Auth from "./Pages/Auth/Auth"                     // Authentication (login/register) page
import Wishlist from "./Pages/Wishlist/Wishlist"         // Wishlist page
import { CartProvider, WishlistProvider } from "./Context/CartContext" // Global context providers
import { Toaster } from "react-hot-toast"                // Toast notification system
import NotFound from "./Pages/NotFound/NotFound"         // 404 page

/* ----------------------------------------------
   ROUTER CONFIGURATION
   - Defines all routes in the application.
   - The Layout component contains <Outlet /> where
     child routes will be rendered dynamically.
---------------------------------------------- */
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // Layout holds Navbar, Footer, and <Outlet />
    children: [
      {
        index: true,      // The default route for "/"
        element: <Home />,
      },
      { path: "courses", element: <Courses /> },          // /courses
      { path: "courses/:slug", element: <CourseDetails /> }, // Dynamic route, e.g., /courses/react-basics
      { path: "dashboard", element: <Dashboard /> },      // /dashboard
      { path: "wishlist", element: <Wishlist /> },        // /wishlist
    ],
  },
  {
    path: "/auth",          // Auth page (outside the main layout)
    element: <Auth />,
  },
  {
    path: "*",              // Catch-all route → 404 page
    element: <NotFound />,
  },
])

/* ----------------------------------------------
   App Component
   - Wraps the app with Providers for global state
     (cart & wishlist).
   - Injects the RouterProvider to enable navigation.
   - Includes the Toaster for global notifications.
---------------------------------------------- */
function App() {
  return (
    <>
      {/* 
        CartProvider → gives access to cart items, total, etc.
        WishlistProvider → gives access to wishlist items.
        The order doesn’t matter here since they’re independent.
      */}
      <CartProvider>
        <WishlistProvider>
          {/* RouterProvider renders the router defined above */}
          <RouterProvider router={router} />

          {/* 
            Toaster: global toast notification system
            - position: defines where to show the toast
            - toastOptions: default styles for all toasts
          */}
          <Toaster
            position="right-bottom"
            toastOptions={{
              duration: 4000,
              style: {
                background: "rgba(17, 24, 39, 0.9)", // Dark semi-transparent background
                color: "#fff",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                backdropFilter: "blur(12px)",        // Subtle blur effect
              },
              success: {
                iconTheme: {
                  primary: "#10b981", // Green icon for success
                  secondary: "#fff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444", // Red icon for errors
                  secondary: "#fff",
                },
              },
            }}
          />
        </WishlistProvider>
      </CartProvider>
    </>
  )
}

export default App
