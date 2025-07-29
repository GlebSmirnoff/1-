// src/features/users/ConfirmEmailPage.tsx
import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import type { FormEvent } from 'react';

export default function ConfirmEmailPage() {
  const { confirmEmail, error, loading } = useAuth();
  const [code, setCode] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (!code.trim()) {
      setLocalError('Вкажіть код підтвердження');
      return;
    }
    try {
      await confirmEmail(code.trim());
      // navigate handled in context
    } catch {
      // error shown below
    }
  };

  const inputClass = () => {
    if (loading) return 'border-gray-300';
    if (localError || error) return 'border-red-500';
    if (code.trim().length === 6) return 'border-green-500';
    return 'border-gray-300';
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Підтвердіть Email</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1" htmlFor="code">Код підтвердження</label>
          <input
            id="code"
            type="text"
            value={code}
            onChange={e => setCode(e.target.value)}
            disabled={loading}
            className={`w-full p-2 border ${inputClass()} rounded focus:outline-none transition-colors`}
            placeholder="Введіть 6-значний код"
          />
          {(localError || error) && (
            <p className="text-red-500 mt-1 text-sm">{localError || error}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? (
            'Перевірка коду...'
          ) : (
            'Підтвердити'
          )}
        </button>
      </form>
    </div>
  );
}
