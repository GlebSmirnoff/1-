// src/pages/NotFoundPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold mb-4">Сторінка не знайдена</h1>
      <p className="mb-6 text-gray-600">На жаль, такої сторінки не існує.</p>
      <Link
        to="/"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Повернутися додому
      </Link>
    </div>
  );
}
