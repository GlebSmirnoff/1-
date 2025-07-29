import React from 'react';
import MainLayout from '@/layouts/MainLayout';

export default function InfoPageLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">{title}</h1>
        {children}
      </div>
    </MainLayout>
  );
}

