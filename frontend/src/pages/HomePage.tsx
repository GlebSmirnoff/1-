import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="p-10 text-center">
      <h1 className="text-4xl font-bold">Головна сторінка</h1>
      <p className="mt-4">Вітаємо на AutoHub!</p>

      <div className="mt-10 space-y-2">
        <Link className="text-blue-500 underline" to="/info/about">Про нас</Link><br />
        <Link className="text-blue-500 underline" to="/info/contact">Контакти</Link><br />
        <Link className="text-blue-500 underline" to="/info/faq">FAQ</Link>
      </div>
    </div>
  );
}
