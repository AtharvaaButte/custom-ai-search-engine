import axios from 'axios';

const API_SEARCH_URL = import.meta.env.VITE_API_SEARCH_URL || 'http://localhost:5000/api/search';

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