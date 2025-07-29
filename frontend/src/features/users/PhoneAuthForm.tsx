// src/features/users/PhoneAuthForm.tsx
import React, { useState } from 'react';
import { useAuth } from './AuthContext';

export default function PhoneAuthForm() {
  const { sendPhoneCode, loginByPhone, loading, error } = useAuth();
  const [step, setStep] = useState<'send' | 'verify'>('send');

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [accountType, setAccountType] = useState<string>('');
  const [code, setCode] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (!fullName) return setLocalError('Вкажіть своє ім’я');
    if (!phone) return setLocalError('Вкажіть номер телефону');
    if (!accountType) return setLocalError('Оберіть тип акаунту');
    const ok = await sendPhoneCode(phone);
    if (ok) setStep('verify');
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (!code) return setLocalError('Вкажіть код підтвердження');
    try {
      await loginByPhone({ phone, code, full_name: fullName, account_type: accountType });
    } catch {
      setLocalError(error);
    }
  };

  if (step === 'send') {
    return (
      <form onSubmit={handleSend}>
        {localError && <p className="text-red-500 mb-2">{localError}</p>}
        <div className="mb-4">
          <label className="block mb-1">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            className="w-full p-2 border rounded mb-4"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Phone Number</label>
          <input
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="+38 (067) 123 45 67"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="w-full p-2 border rounded mb-4"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Account Type</label>
          <select
            value={accountType}
            onChange={e => setAccountType(e.target.value)}
            className="w-full p-2 border rounded"
            required
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
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Надсилаємо код...' : 'Надіслати код'}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleVerify}>
      {localError && <p className="text-red-500 mb-2">{localError}</p>}
      <div className="mb-4">
        <label className="block mb-1">Verification Code</label>
        <input
          type="text"
          value={code}
          onChange={e => setCode(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          placeholder="Введіть код"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {loading ? 'Перевіряємо...' : 'Verify & Register'}
      </button>
    </form>
  );
}
