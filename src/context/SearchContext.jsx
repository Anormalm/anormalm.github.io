import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const SearchContext = createContext(null);

const TAGS = [
  'product',
  'research',
  'writing',
  'systems',
  'interfaces',
  'ml',
  'robotics',
  'generative',
  'canvas',
  'webgl',
  'tooling',
];

const parseParams = (searchParams) => {
  const q = searchParams.get('q') ?? '';
  const tagsRaw = searchParams.get('tags') ?? '';
  const tags = tagsRaw
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
  return { q, tags };
};

export const SearchProvider = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState(() => {
    const { q } = parseParams(searchParams);
    if (q) return q;
    const saved = JSON.parse(localStorage.getItem('globalSearch') || '{}');
    return saved.q ?? '';
  });

  const [tags, setTags] = useState(() => {
    const { tags: urlTags } = parseParams(searchParams);
    if (urlTags.length) return urlTags;
    const saved = JSON.parse(localStorage.getItem('globalSearch') || '{}');
    return saved.tags ?? [];
  });

  useEffect(() => {
    const { q: urlQuery, tags: urlTags } = parseParams(searchParams);
    const urlHasParams = urlQuery.length > 0 || urlTags.length > 0;
    if (!urlHasParams && query === '' && tags.length === 0) return;
    if (urlQuery === query && urlTags.join(',') === tags.join(',')) return;
    if (urlHasParams) {
      setQuery(urlQuery);
      setTags(urlTags);
    }
  }, [searchParams, query, tags]);

  useEffect(() => {
    const params = {};
    if (query.trim()) params.q = query.trim();
    if (tags.length) params.tags = tags.join(',');
    setSearchParams(params, { replace: true });
    localStorage.setItem('globalSearch', JSON.stringify({ q: query.trim(), tags }));
  }, [query, tags, setSearchParams]);

  const toggleTag = (tag) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
    );
  };

  const clearAll = () => {
    setQuery('');
    setTags([]);
  };

  const value = useMemo(
    () => ({
      query,
      setQuery,
      tags,
      toggleTag,
      clearAll,
      allTags: TAGS,
    }),
    [query, tags]
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
