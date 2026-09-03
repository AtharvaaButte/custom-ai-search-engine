import axios from 'axios';

const getSearchUrl = () => {
  const envUrl = import.meta.env.VITE_API_SEARCH_URL || import.meta.env.VITE_API_BASE_URL;
  if (!envUrl) {
    return 'http://localhost:5000/api/search';
  }

  let cleanUrl = envUrl.trim().replace(/\/+$/, '');

  // Deduplicate nested /api/search/api/search if present
  cleanUrl = cleanUrl.replace(/(\/api\/search)+$/i, '/api/search');

  if (cleanUrl.toLowerCase().endsWith('/api/search')) {
    return cleanUrl;
  }

  if (cleanUrl.toLowerCase().endsWith('/api')) {
    return `${cleanUrl}/search`;
  }

  return `${cleanUrl}/api/search`;
};

const API_SEARCH_URL = getSearchUrl();

export const executeSearch = async (query, signal) => {
  const response = await axios.post(
    API_SEARCH_URL,
    {
      query,
      top_k: 5,
      enable_rag: true,
    },
    {
      headers: { 'Content-Type': 'application/json' },
      signal,
    }
  );

  return response.data;
};