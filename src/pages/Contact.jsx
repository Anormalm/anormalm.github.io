const Contact = () => {
  return (
    <div className="min-h-screen">
      <section className="section">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">Contact</div>
            <h1 className="font-display text-4xl">Let's work together.</h1>
            <p className="mt-3 max-w-2xl text-sm text-[var(--muted)]">
              Send a note about your idea, research, or collaboration. I usually reply within a few days.
            </p>
          </div>
          <div className="rounded-full border border-[var(--line)] px-4 py-2 text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
            Based in SG/CN
          </div>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <form
            action="https://formspree.io/f/mkgjnbdd"
            method="POST"
            className="glass-card grid gap-4 p-6"
          >
            <input
              type="text"
              name="name"
              placeholder="Your name"
              required
              className="surface-strong rounded-2xl border border-[var(--line)] px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)]"
            />
            <input
              type="email"
              name="email"
              placeholder="Your email"
              required
              className="surface-strong rounded-2xl border border-[var(--line)] px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)]"
            />
            <textarea
              name="message"
              placeholder="Tell me about the project"
              required
              rows="6"
              className="surface-strong rounded-2xl border border-[var(--line)] px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)]"
            />
            <button
              type="submit"
              className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:opacity-90"
            >
              Send message
            </button>
          </form>

          <div className="glass-card p-6">
            <div className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">Studio Notes</div>
            <h2 className="font-display mt-3 text-2xl">Availability</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              I am currently open to a small number of collaborations in product design, research tooling,
              or software systems.
            </p>
            <div className="mt-6 grid gap-3 text-sm text-[var(--muted)]">
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-2">
                <span>Response time</span>
                <span>3-5 days</span>
              </div>
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-2">
                <span>Focus areas</span>
                <span>Research, Interfaces</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Preferred contact</span>
                <span>Email</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
