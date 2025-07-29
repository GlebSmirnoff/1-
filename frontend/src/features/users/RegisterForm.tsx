// src/features/users/RegisterForm.tsx
import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import PhoneAuthForm from './PhoneAuthForm';

export default function RegisterForm() {
  const { register, error, loading } = useAuth();
  const [mode, setMode] = useState<'email'|'phone'>('email');

  // email‑form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [accountType, setAccountType] = useState<string>('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (password !== password2) {
      setLocalError('Паролі не співпадають');
      return;
    }
    if (!phone) {
      setLocalError('Телефон обов’язковий');
      return;
    }
    if (!accountType) {
      setLocalError('Оберіть тип акаунту');
      return;
    }
    await register({
      email,
      full_name: fullName,
      phone,
      password,
      account_type: accountType as any,
    });
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded shadow">
      {/* Mode switch */}
      <div className="flex justify-center mb-6 space-x-4">
        <button
          onClick={() => setMode('email')}
          className={`px-4 py-2 ${mode==='email'? 'bg-blue-600 text-white':'bg-gray-200'}`}
        >
          Email
        </button>
        <button
          onClick={() => setMode('phone')}
          className={`px-4 py-2 ${mode==='phone'? 'bg-blue-600 text-white':'bg-gray-200'}`}
        >
          Phone
        </button>
      </div>

      {mode === 'email' ? (
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          {(localError || error) && (
            <p className="text-red-500">{localError || error}</p>
          )}
          <div>
            <label>Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label>Phone Number</label>
            <input
              type="tel"
              placeholder="+380XXXXXXXXX"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label>Confirm Password</label>
            <input
              type="password"
              value={password2}
              onChange={e => setPassword2(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label>Account Type</label>
            <select
              value={accountType}
              onChange={e => setAccountType(e.target.value)}
              required
              className="w-full p-2 border rounded"
            >
              <option value="" disabled>Оберіть тип акаунту</option>
              <option value="buyer">Покупець/Продавець</option>
              <option value="service">СТО</option>
              <option value="parts">Запчастини</option>
              <option value="rental">Прокат</option>
              <option value="insurance">Страхування</option>
              <option value="dealer">Автосалон</option>
              <option value="admin">Адміністратор</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            {loading ? 'Реєструємось...' : 'Зареєструватись'}
          </button>
        </form>
      ) : (
        <PhoneAuthForm />
      )}
    </div>
  );
}

