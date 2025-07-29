// src/router/AppRoutes.tsx
import React from 'react';
import { useRoutes } from 'react-router-dom';

import HomePage from '@/pages/HomePage';
import InfoPage from '@/blocks/main/InfoPage';

// Listing module
import ListingListPage from '@/blocks/listing/ListingListPage';
import ListingFormPage from '@/blocks/listing/ListingFormPage';
import ListingDetailPage from '@/blocks/listing/ListingDetailPage';

// User features
import RegisterPage from '@/features/users/RegisterPage';
import ConfirmEmailPage from '@/features/users/ConfirmEmailPage';
import LoginPage from '@/features/users/LoginPage';
import Logout from '@/features/users/Logout';
import ProfilePage from '@/features/users/ProfilePage';
import RequireAuth from '@/shared/components/RequireAuth';

import NotFoundPage from '@/pages/NotFoundPage';

const routes = [
  { path: '/', element: <HomePage /> },
  { path: '/info/:slug', element: <InfoPage /> },

  // Listings routes
  { path: '/listings', element: <ListingListPage /> },
  { path: '/listings/new', element: <ListingFormPage /> },
  { path: '/listings/:id/edit', element: <ListingFormPage /> },
  { path: '/listings/:id', element: <ListingDetailPage /> },

  // Authentication & profile
  { path: '/register', element: <RegisterPage /> },
  { path: '/register/confirm', element: <ConfirmEmailPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/logout', element: <Logout /> },
  {
    path: '/profile',
    element: (
      <RequireAuth>
        <ProfilePage />
      </RequireAuth>
    ),
  },

  // catch-all 404
  { path: '*', element: <NotFoundPage /> },
];

export default function AppRoutes() {
  return useRoutes(routes);
}
