import { FaGithub, FaLinkedin, FaMedium } from 'react-icons/fa';
import { FiArrowUpRight, FiMail, FiMapPin } from 'react-icons/fi';

const CHANNELS = [
  {
    label: 'Email',
    value: 'lifan.hu@u.nus.edu',
    href: 'mailto:lifan.hu@u.nus.edu',
    icon: <FiMail />,
  },
  {
    label: 'GitHub',
    value: '@Anormalm',
    href: 'https://github.com/Anormalm',
    icon: <FaGithub />,
  },
  {
    label: 'LinkedIn',
    value: '/in/anormalm',
    href: 'https://www.linkedin.com/in/anormalm/',
    icon: <FaLinkedin />,
  },
  {
    label: 'Medium',
    value: '@hulifan55555',
    href: 'https://medium.com/@hulifan55555',
    icon: <FaMedium />,
  },
];

const Contact = () => {
  return (
    <div className="min-h-screen bg-grid">
      <section className="section">
        <div className="page-hero-panel tech-panel rounded-3xl p-7 md:p-9" data-page="CONTACT">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="eyebrow">Contact</div>
              <h1 className="font-display mt-3 text-4xl md:text-5xl">Let’s compare notes.</h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--muted)] md:text-base">
                If you’re working on model evaluation, intelligent systems, applied ML, or a genuinely interesting
                adjacent problem, I’d be glad to hear from you.
              </p>
            </div>
            <div className="font-mono inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
              <FiMapPin className="text-[var(--accent)]" /> Singapore
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="tech-panel rounded-3xl p-7 md:p-9">
            <div className="eyebrow">Start here</div>
            <h2 className="font-display mt-4 text-3xl">A short email works best.</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Tell me what you’re building or investigating, where you think our interests overlap, and what kind of
              conversation would be useful.
            </p>
            <a href="mailto:lifan.hu@u.nus.edu" className="button-primary mt-7">
              Email Lifan <FiMail />
            </a>

            <div className="mt-8 rounded-2xl border border-[var(--line)] bg-[var(--paper)]/70 p-5">
              <div className="font-display text-lg">Good topics to send</div>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                Research collaboration, experimental design, engineering a credible prototype, or a thoughtful
                conversation about where AI systems still fail.
              </p>
            </div>
          </section>

          <aside className="tech-panel rounded-3xl p-7 md:p-9">
            <div className="eyebrow">Elsewhere</div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {CHANNELS.map(({ label, value, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="contact-channel"
                >
                  <span className="flex items-center gap-3">
                    <span className="social-link" aria-hidden="true">{icon}</span>
                    <span>
                      <span className="font-mono block text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
                        {label}
                      </span>
                      <span className="mt-1 block text-sm">{value}</span>
                    </span>
                  </span>
                  <FiArrowUpRight className="text-[var(--accent)]" />
                </a>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default Contact;
