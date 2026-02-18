import { useMemo } from 'react';
import WritingCard from '../components/WritingCard';

const WRITINGS = [
  {
    title: 'The Disenchantment of Modern Life (GEC1052 @NUS)',
    excerpt: 'Content removed. Card retained for future update.',
    date: 'March 2025',
    link: '/writings/Disenchantment',
  },
  {
    title: 'Fragments of a Digital Mind',
    excerpt: 'Content removed. Card retained for future update.',
    date: 'February 2025',
    link: '/writings/Fragments',
  },
  {
    title: 'Graphs, Agents, and Adversaries',
    excerpt: 'Content removed. Card retained for future update.',
    date: 'April 2025',
    link: '/writings/GNNMARLFraud',
  },
];

const Writings = () => {
  const writings = useMemo(() => WRITINGS, []);

  return (
    <div className="min-h-screen">
      <section className="section">
        <div className="tech-panel rounded-3xl p-6 md:p-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--muted)]">Writings</div>
              <h1 className="font-display text-4xl">Technical notes and essays.</h1>
              <p className="mt-3 max-w-2xl text-sm text-[var(--muted)]">
              Documentation, research commentary, and engineering reflections.
              </p>
            </div>
            <div className="font-mono rounded-full border border-[var(--line)] px-4 py-2 text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
              Ongoing
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {writings.map((writing) => (
            <WritingCard
              key={writing.title}
              title={writing.title}
              excerpt={writing.excerpt}
              date={writing.date}
              link={writing.link}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Writings;
