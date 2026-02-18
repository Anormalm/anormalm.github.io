import { useMemo } from 'react';
import WritingCard from '../components/WritingCard';
import { useGlobalSearch } from '../context/SearchContext';

const WRITINGS = [
  {
    title: 'The Disenchantment of Modern Life (GEC1052 @NUS)',
    excerpt: 'An essay exploring how rationalization shapes culture and identity.',
    date: 'March 2025',
    link: '/writings/Disenchantment',
  },
  {
    title: 'Fragments of a Digital Mind',
    excerpt: 'Reflections on attention, algorithms, and the self in the age of screens.',
    date: 'February 2025',
    link: '/writings/Fragments',
  },
  {
    title: 'Graphs, Agents, and Adversaries',
    excerpt: 'Lessons from building a fraud detection system using GNNs and multi-agent reinforcement learning.',
    date: 'April 2025',
    link: '/writings/GNNMARLFraud',
  },
];

const Writings = () => {
  const { query } = useGlobalSearch();

  const filteredWritings = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return WRITINGS.filter((writing) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        writing.title.toLowerCase().includes(normalizedQuery) ||
        writing.excerpt.toLowerCase().includes(normalizedQuery);
      return matchesQuery;
    });
  }, [query]);

  return (
    <div className="min-h-screen">
      <section className="section">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">Writings</div>
            <h1 className="font-display text-4xl">Essays, notes, and fragments.</h1>
            <p className="mt-3 max-w-2xl text-sm text-[var(--muted)]">
              Writing is how I think about systems, culture, and the way technology reshapes intimacy.
            </p>
          </div>
          <div className="rounded-full border border-[var(--line)] px-4 py-2 text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
            Ongoing
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {filteredWritings.map((writing) => (
            <WritingCard
              key={writing.title}
              title={writing.title}
              excerpt={writing.excerpt}
              date={writing.date}
              link={writing.link}
            />
          ))}
          {filteredWritings.length === 0 && (
            <div className="glass-card p-6 text-sm text-[var(--muted)]">
              No writings match the current search.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Writings;
