import { useState, useRef } from 'react';
import { executeSearch as fetchSearchResults } from '../api/searchService';

export function useSearch() {
  const [query, setQuery] = useState('');
  const [resultsData, setResultsData] = useState(null);
  const [aiSummary, setAiSummary] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const [latency, setLatency] = useState(null);
  const [dataSource, setDataSource] = useState(null);

  const searchInputRef = useRef(null);
  const abortControllerRef = useRef(null);

  const executeSearch = async (searchQuery) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsSearching(true);
    setError(null);
    setResultsData(null);
    setAiSummary('');

    const startTime = performance.now();

    try {
      const response = await fetchSearchResults(trimmed, abortControllerRef.current.signal);
      const endTime = performance.now();

      const payload = response.data || response;

      const itemsList = Array.isArray(payload.results)
        ? payload.results
        : Array.isArray(payload)
        ? payload
        : [];

      setLatency(payload.latency ?? Math.round(endTime - startTime));
      setDataSource(response.source || payload.source || 'python_engine');

      setResultsData({
        results: itemsList,
        count: payload.count ?? itemsList.length,
      });

      setAiSummary(payload.summary || '');
    } catch (err) {
      if (err.name !== 'AbortError' && err.code !== 'ERR_CANCELED') {
        setError(
          err.message?.includes('Failed to fetch') || err.message?.includes('Network Error')
            ? 'Failed to connect to backend server.'
            : err.message
        );
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectQuery = (selectedQuery) => {
    setQuery(selectedQuery);
    executeSearch(selectedQuery);
  };

  return {
    query,
    setQuery,
    resultsData,
    aiSummary,
    isSearching,
    error,
    latency,
    dataSource,
    searchInputRef,
    executeSearch,
    handleSelectQuery,
  };
}