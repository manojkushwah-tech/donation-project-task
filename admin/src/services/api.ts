import axios from 'axios';
import { Event, CommitteeMember, FAQ, ApiResponse, EventData, CommitteeData, FAQData } from '../types';

const BASE_URL = 'https://lkvp3hlz-3000.inc1.devtunnels.ms/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
});

// Add a request interceptor to include the Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear the token and redirect to login or refresh the page
      localStorage.removeItem('auth_token');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export const eventService = {
  getAll: (page = 1, limit = 10) => api.get<ApiResponse<EventData>>(`/event/admin?page=${page}&limit=${limit}`),
  getOne: (id: string) => api.get<ApiResponse<Event>>(`/event/admin/${id}`),
  create: (data: any) => api.post<ApiResponse<Event>>('/event/admin', data),
  update: (id: string, data: any) => api.put<ApiResponse<Event>>(`/event/admin/${id}`, data),
  delete: (id: string) => api.delete<ApiResponse<any>>(`/event/admin/${id}`),
};

export const committeeService = {
  getAll: (page = 1, limit = 10) => api.get<ApiResponse<CommitteeData>>(`/committee/admin?page=${page}&limit=${limit}`),
  getOne: (id: string) => api.get<ApiResponse<CommitteeMember>>(`/committee/admin/${id}`),
  create: (data: any) => api.post<ApiResponse<CommitteeMember>>('/committee/admin', data),
  update: (id: string, data: any) => api.put<ApiResponse<CommitteeMember>>(`/committee/admin/${id}`, data),
  delete: (id: string) => api.delete<ApiResponse<any>>(`/committee/admin/${id}`),
};

export const faqService = {
  getAll: (page = 1, limit = 10) => api.get<ApiResponse<FAQData>>(`/faq/admin?page=${page}&limit=${limit}`),
  getOne: (id: string) => api.get<ApiResponse<FAQ>>(`/faq/admin/${id}`),
  create: (data: Omit<FAQ, '_id'>) => api.post<ApiResponse<FAQ>>('/faq/admin', data),
  update: (id: string, data: Partial<FAQ>) => api.put<ApiResponse<FAQ>>(`/faq/admin/${id}`, data),
  delete: (id: string) => api.delete<ApiResponse<any>>(`/faq/admin/${id}`),
};

