import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const publicApi = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getHomeData = async () => {
  const res = await publicApi.get('/public/home');
  return res.data.data;
};

export const getPageBySlug = async (slug: string) => {
  const res = await publicApi.get(`/public/pages/${slug}`);
  return res.data.data;
};

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

export const getSettings = async () => {
  const res = await publicApi.get('/public/settings');
  return res.data.data;
};

export const getNavigation = async (location: string) => {
  const res = await publicApi.get(`/public/navigation/${location}`);
  return res.data.data;
};

export const getSeoBySlug = async (slug: string) => {
  try {
    const normalized =
      !slug || slug === '/' ? 'home' : slug.replace(/^\//, '');
    const res = await publicApi.get(`/public/seo/${normalized}`);
    return res.data.data;
  } catch (error) {
    return null;
  }
};

export const getNewsBySlug = async (slug: string) => {
  const res = await publicApi.get(`/public/news/${slug}`);
  return res.data.data;
};

export const submitContactForm = async (data: any) => {
  const res = await publicApi.post('/public/contact', data);
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
