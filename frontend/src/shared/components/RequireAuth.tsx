// src/RequireAuth.tsx
import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '@/features/users/AuthContext';

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const auth = useContext(AuthContext);
  const location = useLocation();

  // Якщо контекст не знайдено — редірект на логін
  if (!auth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const { user, loading } = auth;

  // Поки профіль завантажується — можна показати лоадер
  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  // Якщо не залогований — на логін
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Інакше рендеримо дітей
  return <>{children}</>;
}
