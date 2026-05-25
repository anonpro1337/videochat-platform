'use client';

import axios from 'axios';

const PRODUCTION_API_URL = 'https://api-tau-dusky-58.vercel.app/api/v1';
const API_URL = process.env.NEXT_PUBLIC_API_URL || PRODUCTION_API_URL;

if (typeof window !== 'undefined' && !process.env.NEXT_PUBLIC_API_URL) {
  console.warn(
    `NEXT_PUBLIC_API_URL not set. Using default: ${PRODUCTION_API_URL}`
  );
}

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      if (!error.config._retry) {
        error.config._retry = true;
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error);
  },
);

export { realtime } from './realtime';
