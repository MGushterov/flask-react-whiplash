import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import ErrorPage from './components/pages/ErrorPage.jsx';
import Explore from './components/pages/Explore.jsx';
import Library from './components/pages/Library.jsx';
import Popular from './components/pages/Popular.jsx';
import Login from './components/forms/Login.jsx';
import Register from './components/forms/Register.jsx';
import ArtistPage from './components/pages/ArtistPage.jsx';
import AlbumPage from './components/pages/AlbumPage.jsx';
import AdminPanel from './components/pages/AdminPanel.jsx';
import AddSongForm from './components/forms/AddSongForm.jsx';
import DeleteSongForm from './components/forms/DeleteSongForm.jsx';

const router = createBrowserRouter([{
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />
  }, {
    path: '/login',
    element: <Login />
  }, {
    path: '/register',
    element: <Register />
  }, {
    path: '/explore',
    element: <Explore />
  }, {
    path: '/library',
    element: <Library />
  }, {
    path: '/popular',
    element: <Popular />
  }, {
    path: '/artist/:artistId',
    element: <ArtistPage />
  }, {
    path: '/album/:albumId',
    element: <AlbumPage />
  }, {
    path: '/admin',
    element: <AdminPanel />
  }, {
    path: '/admin/add',
    element: <AddSongForm />
  }, {
    path: 'admin/delete',
    element: <DeleteSongForm />
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)