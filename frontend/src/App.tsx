import React from 'react';
import MainLayout from '@/layouts/MainLayout';
import AppRoutes  from '@/router/AppRoutes';

export default function App() {
  return (
    <MainLayout>
      <AppRoutes />
    </MainLayout>
  );
}