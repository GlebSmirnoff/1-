// src/features/users/LoginPage.tsx
import React from 'react';
import { useAuth } from './AuthContext';
import LoginForm from './LoginForm';
import { GoogleLogin } from '@react-oauth/google';

declare global {
  interface Window { FB: any; AppleID: any; }
}

export default function LoginPage() {
  const { login } = useAuth();

  const onFacebookLogin = () => {
    window.FB.login((response: any) => {
      if (response.authResponse) {
        fetch('/api/auth/facebook/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ access_token: response.authResponse.accessToken }),
        })
          .then(async res => { if (!res.ok) throw await res.json(); return res.json(); })
          .then(data => {
            localStorage.setItem('accessToken', data.access);
            localStorage.setItem('refreshToken', data.refresh);
            window.location.href = '/profile';
          })
          .catch(err => { console.error('Facebook login failed:', err); alert(err.error || 'Facebook login error'); });
      } else {
        alert('Facebook login cancelled or failed');
      }
    }, { scope: 'email' });
  };

  const onAppleLogin = () => {
    window.AppleID.auth.signIn()
      .then((res: any) => {
        const id_token = res.authorization.id_token;
        return fetch('/api/auth/apple/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ id_token }),
        });
      })
      .then(async r => { if (!r.ok) throw await r.json(); return r.json(); })
      .then(data => {
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        window.location.href = '/profile';
      })
      .catch(err => { console.error('Apple sign in failed:', err); alert(err.error || 'Apple sign in error'); });
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Login to AutoHub</h1>

      {/* Email/Password Login */}
      <LoginForm />

      {/* Google Login */}
      <div className="my-6 text-center text-gray-500">або через Google</div>
      <GoogleLogin
        onSuccess={res => {
          const token = res.credential;
          if (token) {
            fetch('/api/auth/google/', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ id_token: token }),
            })
              .then(async r => { if (!r.ok) throw await r.json(); return r.json(); })
              .then(data => {
                localStorage.setItem('accessToken', data.access);
                localStorage.setItem('refreshToken', data.refresh);
                window.location.href = '/profile';
              })
              .catch(err => { console.error('Google login failed:', err); alert(err.error || 'Google login error'); });
          }
        }}
        onError={() => { console.error('Google Login Failed'); alert('Не вдалося виконати вхід через Google'); }}
      />

      {/* Facebook Login */}
      <div className="my-6 text-center text-gray-500">або через Facebook</div>
      <button
        onClick={onFacebookLogin}
        className="w-full bg-blue-800 text-white py-2 rounded hover:bg-blue-900"
      >
        Continue with Facebook
      </button>

      {/* Apple Sign In */}
      <div className="my-6 text-center text-gray-500">або через Apple</div>
      <button
        onClick={onAppleLogin}
        className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
      >
        Continue with Apple
      </button>
    </div>
  );
}
