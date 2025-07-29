// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './features/users/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';

declare global {
  interface Window {
    FB: any;
    AppleID: any;
  }
}

// ——————— Apple Sign‑In Initialization ———————
if (window.AppleID) {
  window.AppleID.auth.init({
    clientId: import.meta.env.VITE_APPLE_CLIENT_ID,
    scope: 'name email',
    redirectURI: `${window.location.origin}/auth/apple/callback`,
    usePopup: true,
  });
}

// ——————— Facebook SDK Initialization ———————
window.fbAsyncInit = () => {
  window.FB.init({
    appId: import.meta.env.VITE_FACEBOOK_APP_ID,
    cookie: true,
    xfbml: true,
    version: 'v16.0',
  });
};

// Створюємо клієнта React Query
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    {/* Google OAuth Context */}
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID!}>
      {/* React Router */}
      <BrowserRouter>
        {/* React Query Provider */}
        <QueryClientProvider client={queryClient}>
          {/* Our Auth Context */}
          <AuthProvider>
            {/* Main App */}
            <App />
          </AuthProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
