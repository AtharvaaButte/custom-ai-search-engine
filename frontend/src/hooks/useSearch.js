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

      // Express API returns: { source: '...', data: { query, count, summary, results } }
      const resData = response?.data;

      // Extract results array cleanly from response.data.results or response.results
      const itemsList = Array.isArray(resData?.results)
        ? resData.results
        : Array.isArray(response?.results)
        ? response.results
        : Array.isArray(resData)
        ? resData
        : Array.isArray(response)
        ? response
        : [];

      // Extract summary string explicitly from response.data.summary or response.summary
      const summaryText =
        (typeof resData?.summary === 'string' && resData.summary) ||
        (typeof response?.summary === 'string' && response.summary) ||
        (typeof resData === 'string' ? resData : '') ||
        '';

      setLatency(resData?.latency ?? response?.latency ?? Math.round(endTime - startTime));
      setDataSource(response?.source || resData?.source || 'python_engine');

      setResultsData({
        results: itemsList,
        count: resData?.count ?? response?.count ?? itemsList.length,
      });

      setAiSummary(summaryText);
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