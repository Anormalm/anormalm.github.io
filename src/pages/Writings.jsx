import { useMemo } from 'react';
import WritingCard from '../components/WritingCard';
import { useGlobalSearch } from '../context/SearchContext';

const Writings = () => {
  const { query, tags } = useGlobalSearch();
  const writings = [
    {
      title: 'The Disenchantment of Modern Life (GEC1052 @NUS)',
      excerpt: 'An essay exploring how rationalization shapes culture and identity.',
      date: 'March 2025',
      link: '/writings/Disenchantment',
      tags: ['writing', 'research'],
    },
    {
      title: 'Fragments of a Digital Mind',
      excerpt: 'Reflections on attention, algorithms, and the self in the age of screens.',
      date: 'February 2025',
      link: '/writings/Fragments',
      tags: ['writing', 'interfaces'],
    },
    {
      title: 'Graphs, Agents, and Adversaries',
      excerpt: 'Lessons from building a fraud detection system using GNNs and multi-agent reinforcement learning.',
      date: 'April 2025',
      link: '/writings/GNNMARLFraud',
      tags: ['research', 'ml', 'systems'],
    },
  ];

  const filteredWritings = useMemo(() => {
    return writings.filter((writing) => {
      const matchesQuery =
        query.trim().length === 0 ||
        writing.title.toLowerCase().includes(query.toLowerCase()) ||
        writing.excerpt.toLowerCase().includes(query.toLowerCase());
      const matchesTags = tags.length === 0 || tags.every((tag) => writing.tags?.includes(tag));
      return matchesQuery && matchesTags;
    });
  }, [writings, query, tags]);

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
              No writings match the current search. Try clearing tags.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Writings;
