import axios from 'axios';
import { getApiBaseUrl } from '@/lib/api-base';

const publicApi = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

/** Fresh CMS data for server components — bypasses Next.js static cache */
async function cmsFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${getApiBaseUrl()}${path}`, {
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    throw new Error(`CMS fetch failed: ${path} (${res.status})`);
  }
  const json = await res.json();
  return json.data as T;
}

export const getHomeData = async () => cmsFetch<any[]>('/public/home');

export const getPageBySlug = async (slug: string) => cmsFetch<any>(`/public/pages/${slug}`);

export const getProjects = async (params = {}) => {
  const res = await publicApi.get('/public/projects', { params });
  return res.data.data;
};

export const getProjectBySlug = async (slug: string) => {
  const res = await publicApi.get(`/public/projects/${slug}`);
  return res.data.data;
};

export const getCategories = async () => {
  const res = await publicApi.get('/public/project-categories');
  return res.data.data;
};

export const getSettings = async () => cmsFetch<Record<string, unknown>>('/public/settings');

export const getNavigation = async (location: string) => {
  const res = await publicApi.get(`/public/navigation/${location}`);
  return res.data.data;
};

export const getSeoBySlug = async (slug: string) => {
  try {
    const normalized =
      !slug || slug === '/' ? 'home' : slug.replace(/^\//, '');
    return await cmsFetch<any>(`/public/seo/${normalized}`);
  } catch {
    return null;
  }
};

export const getNewsBySlug = async (slug: string) => {
  const res = await publicApi.get(`/public/news/${slug}`);
  return res.data.data;
};

export const submitContactForm = async (data: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}) => {
  const res = await publicApi.post('/public/contact', data);
  return res.data;
};

export const submitCareersForm = async (formData: FormData) => {
  const res = await publicApi.post('/public/careers', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const trackPageVisit = async (data: {
  path: string;
  locale?: string;
  referrer?: string;
}) => {
  const res = await publicApi.post('/public/analytics/visit', data);
  return res.data;
};

export const getGallery = async (params?: { type?: string; category?: string }) => {
  const res = await publicApi.get('/public/gallery', { params });
  return res.data.data;
};

export const getNewsCategories = async () => {
  const res = await publicApi.get('/public/news-categories');
  return res.data.data;
};

export const getGalleryCategories = async () => {
  const res = await publicApi.get('/public/gallery-categories');
  return res.data.data;
};

export const getNews = async (params?: { limit?: number; category?: string }) => {
  const res = await publicApi.get('/public/news', { params });
  return res.data.data;
};

export default publicApi;
