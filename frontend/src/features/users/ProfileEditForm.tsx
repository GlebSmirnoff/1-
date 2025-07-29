// src/features/users/ProfileEditForm.tsx
import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import type { User } from './types';

interface ProfileEditFormProps {
  onCancel: () => void;
}

export default function ProfileEditForm({ onCancel }: ProfileEditFormProps) {
  const { user, updateProfile, loading, error } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [accountType, setAccountType] = useState<string>(user?.account_type || '');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (!fullName) return setLocalError('Full Name is required');
    if (!phone) return setLocalError('Phone is required');
    if (!accountType) return setLocalError('Account Type is required');

    try {
      await updateProfile({ full_name: fullName, phone, account_type: accountType } as Partial<User>);
      onCancel(); // повертаємо з режиму редагування
    } catch (e: any) {
      // помилка вже у контексті
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {(localError || error) && (
        <p className="text-red-500">{localError || error}</p>
      )}
      <div>
        <label className="block mb-1">Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block mb-1">Phone</label>
        <input
          type="tel"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block mb-1">Account Type</label>
        <select
          value={accountType}
          onChange={e => setAccountType(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Select type</option>
          <option value="buyer">Покупець/Продавець</option>
          <option value="service">СТО</option>
          <option value="parts">Запчастини</option>
          <option value="rental">Прокат</option>
          <option value="insurance">Страхування</option>
          <option value="dealer">Автосалон</option>
          <option value="admin">Адміністратор</option>
        </select>
      </div>
      <div className="flex space-x-2">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
