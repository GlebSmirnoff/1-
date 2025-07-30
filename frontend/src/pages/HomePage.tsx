// src/pages/HomePage.tsx
import React from 'react'
import { Link } from 'react-router-dom'
import logoSrc from '../assets/logo.jpg'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          {/* Лого в обрезающем контейнере */}
          <Link to="/" className="flex items-center">
            {/* Ограничиваем по размеру и скрываем overflow */}
            <div className="h-10 w-32 overflow-hidden rounded">
              <img
                src={logoSrc}
                alt="AutoBuy Logo"
                className="object-cover object-top object-left h-full w-full"
              />
            </div>
            <span className="ml-2 text-2xl font-bold text-red-600">AutoBuy</span>
          </Link>

          {/* Навигация */}
          <nav className="space-x-6 text-gray-700 text-sm">
            <Link to="/" className="hover:text-blue-500">Головна</Link>
            <Link to="/listings" className="hover:text-blue-500">Автомобілі</Link>
            <Link to="/info/about" className="hover:text-blue-500">Про нас</Link>
            <Link to="/login" className="hover:text-blue-500">Вхід</Link>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="flex-grow container mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold mb-4">Ласкаво просимо до AutoBuy</h1>
        <p className="text-lg mb-8">Пошук та продаж автомобілів — легко та швидко</p>
        <Link
          to="/listings"
          className="inline-block bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition"
        >
          Перейти до оголошень
        </Link>
      </main>
    </div>
  )
}
