import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const SearchContext = createContext(null);

const parseParams = (searchParams) => {
  const q = searchParams.get('q') ?? '';
  return { q };
};

export const SearchProvider = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState(() => {
    const { q } = parseParams(searchParams);
    if (q) return q;
    const saved = JSON.parse(localStorage.getItem('globalSearch') || '{}');
    if (typeof saved === 'string') return saved;
    return saved.q ?? '';
  });

  useEffect(() => {
    const { q: urlQuery } = parseParams(searchParams);
    const urlHasParams = urlQuery.length > 0;
    if (!urlHasParams && query === '') return;
    if (urlQuery === query) return;
    if (urlHasParams) {
      setQuery(urlQuery);
    }
  }, [searchParams, query]);

  useEffect(() => {
    const params = {};
    if (query.trim()) params.q = query.trim();
    setSearchParams(params, { replace: true });
    localStorage.setItem('globalSearch', JSON.stringify({ q: query.trim() }));
  }, [query, setSearchParams]);

  const clearAll = () => {
    setQuery('');
  };

  const value = useMemo(
    () => ({
      query,
      setQuery,
      clearAll,
    }),
    [query]
  );

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};

export const useGlobalSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useGlobalSearch must be used within SearchProvider');
  }
  return context;
};
