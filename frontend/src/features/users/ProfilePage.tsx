// src/features/users/ProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import ProfileEditForm from './ProfileEditForm';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string>('/default-avatar.png');
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (user?.avatarUrl) setAvatarUrl(user.avatarUrl);
  }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
      // TODO: відправити FormData з file на бекенд
    }
  };

  if (!user) return <div className="max-w-md mx-auto mt-16">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-16 p-8 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <img
            src={avatarUrl}
            alt="Avatar"
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <label
              htmlFor="avatar-upload"
              className="text-sm text-blue-600 hover:underline cursor-pointer"
            >
              Змінити аватар
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
        </div>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {editing ? (
        <>
          <h2 className="text-2xl font-semibold mb-4">Редагування профілю</h2>
          <ProfileEditForm onCancel={() => setEditing(false)} />
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Ліва колонка: дані користувача */}
            <section>
              <h2 className="text-xl font-semibold mb-2">Ваші дані</h2>
              <ul className="space-y-2">
                <li><strong>Full Name:</strong> {user.full_name}</li>
                <li><strong>Email:</strong> {user.email}</li>
                <li><strong>Phone:</strong> {user.phone || '—'}</li>
                <li><strong>Account Type:</strong> {user.account_type}</li>
                <li><strong>Joined:</strong> {new Date(user.created_at).toLocaleDateString()}</li>
              </ul>
            </section>

            {/* Права колонка: навігація */}
            <section>
              <h2 className="text-xl font-semibold mb-2">Кабінет користувача</h2>
              <ul className="space-y-2">
                <li><a href="/dashboard" className="text-blue-600 hover:underline">Dashboard</a></li>
                <li><a href="/dashboard/listings" className="text-blue-600 hover:underline">Мої оголошення</a></li>
                <li><a href="/dashboard/listings/new" className="text-blue-600 hover:underline">Нове оголошення</a></li>
                <li><a href="/dashboard/favorites" className="text-blue-600 hover:underline">Обране</a></li>
              </ul>
            </section>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Налаштування акаунту</h2>
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Редагувати профіль
            </button>
          </div>
        </>
      )}
    </div>
  );
}
