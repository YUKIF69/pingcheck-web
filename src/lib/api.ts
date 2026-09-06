import axios from 'axios';

// Базовий axios інстанс з URL нашого NestJS API
// Всі запити автоматично йдуть на http://localhost:4000
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
});

// Interceptor — перехоплює кожен запит перед відправкою
// Автоматично додає Authorization header з токеном якщо він є в localStorage
// Це означає що не треба вручну додавати токен в кожен fetch
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
