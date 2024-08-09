import HomePage from './Routes/HomePage/HomePage'
import ListPage from './Routes/ListPage/ListPage'
import SinglePage from './Routes/SinglePage/SinglePage'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {Layout, RequireAuth } from './Routes/Layout/Layout';
import ProfilePage from './Routes/ProfilePage/ProfilePage'
import Login from './Routes/Login/Login'
import Register from './Routes/Register/Register'
import ProfileUpdatePage from './Routes/ProfileUpdatePage/ProfileUpdatePage';
import NewPostPage from './Routes/NewPostPage/NewPostPage';
import { listPageLoader, profilePageLoader, singlePageLoader } from './lib/loaders.js';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children:[
        {
          path: "",
          element: <HomePage />
        },
        {
          path: "list",
          element: <ListPage />,
          loader: listPageLoader
        },
        {
          path: ":id",
          element: <SinglePage />,
          loader: singlePageLoader
        },
        {
          path: "login",
          element: <Login />
        },
        {
          path: "register",
          element: <Register />
        },
      ]
    },
    {
      path: "/",
      element: <RequireAuth />,
      children:[
        {
          path: "profile",
          element: <ProfilePage />,
          loader: profilePageLoader
        },
        {
          path: "profile/update",
          element: <ProfileUpdatePage />
        },
        {
          path: "add",
          element: <NewPostPage />
        },
      ]
    },
  ]);

  return (
    <RouterProvider router={router}/>
  )
}

export default App
