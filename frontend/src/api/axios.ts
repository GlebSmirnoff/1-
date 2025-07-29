import axios, { AxiosRequestConfig } from 'axios';

// Базовый URL к API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Функция для получения CSRF токена из cookie
function getCsrfToken(name: string): string | null {
  const match = document.cookie.match(new RegExp(
    `(?:^|; )${name}=([^;]*)`
  ));
  return match ? decodeURIComponent(match[1]) : null;
}

// Создаём axios-инстанс
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // отправлять куки при запросах к API
});

// Интерсептор для установки CSRF токена в заголовки
api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    if (config.withCredentials && config.headers) {
      const token = getCsrfToken('csrftoken');
      if (token) {
        config.headers['X-CSRFToken'] = token;
      }
    }
    return config;
  },
  error => Promise.reject(error)
);

export default api;
