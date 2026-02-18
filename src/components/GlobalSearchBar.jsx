import { useGlobalSearch } from '../context/SearchContext';

const GlobalSearchBar = () => {
  const { query, setQuery, clearAll } = useGlobalSearch();

  return (
    <div className="border-b border-[var(--line)] bg-[var(--paper)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between md:px-10">
        <div className="flex flex-1 flex-col gap-3">
          <div className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
            Global Search
          </div>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search projects, writings, labs"
            className="surface-strong w-full rounded-2xl border border-[var(--line)] px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)]"
          />
        </div>

        <div className="flex items-center md:justify-end">
          <button
            onClick={clearAll}
            className="rounded-full border border-[var(--line)] px-3 py-2 text-[11px] uppercase tracking-[0.25em] text-[var(--muted)] transition hover:border-[var(--accent)]"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearchBar;
