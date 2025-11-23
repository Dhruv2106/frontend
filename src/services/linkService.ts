import api from './api';
import type { AuthResponse, Link, LinkAnalytics } from '../types';

export const authService = {
  register: async (email: string, password: string, name?: string): Promise<AuthResponse> => {
    const response = await api.post('/rest/auth/register', { email, password, name });
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/rest/auth/login', { email, password });
    return response.data;
  },
};

export const linkService = {
  getAll: async (): Promise<{ count: number; links: Link[] }> => {
    const response = await api.get('/rest/links');
    return response.data;
  },

  getById: async (id: number): Promise<{ link: Link }> => {
    const response = await api.get(`/rest/links/${id}`);
    return response.data;
  },

  create: async (targetUrl: string): Promise<{ message: string; link: Link }> => {
    const response = await api.post('/rest/links', { targetUrl });
    return response.data;
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete(`/rest/links/${id}`);
    return response.data;
  },

  getAnalytics: async (id: number): Promise<LinkAnalytics> => {
    const response = await api.get(`/rest/analytics/${id}`);
    return response.data;
  },
};
