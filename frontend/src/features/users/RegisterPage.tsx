import React from 'react';
import RegisterForm from './RegisterForm';
import { GoogleLogin } from '@react-oauth/google';
// якщо ти вже встановив бібліотеку для Facebook:
// import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
declare global { interface Window { AppleID: any; } }

export default function RegisterPage() {
  // (можеш витягнути useAuth(), якщо потрібно відразу логінити)
  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Реєстрація</h1>

      {/* Вбудована форма реєстрації */}
      <RegisterForm />

      <div className="my-6 text-center text-gray-500">або через</div>

      {/* Google */}
      <div className="flex justify-center space-x-4 mb-4">
        <GoogleLogin
          onSuccess={({ credential }) => {
            // твоє fetch на бекенд /auth/google/
          }}
          onError={() => alert('Не вдалося увійти через Google')}
        />
      </div>

      {/* Facebook */}
      <div className="flex justify-center space-x-4 mb-4">
        <button
          onClick={() => {
            // тут виклик Facebook SDK, напр. window.FB.login(...)
            alert('Facebook ще не налаштовано');
          }}
          className="px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-900"
        >
          Вхід через Facebook
        </button>
      </div>

      {/* Apple */}
      <div className="flex justify-center">
        <button
          onClick={() => {
            // якщо AppleJS підключено, можна викликати:
            // window.AppleID.auth.signIn();
            alert('Apple Sign‑In ще не налаштовано');
          }}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-900"
        >
          Вхід через Apple
        </button>
      </div>
    </div>
  );
}
