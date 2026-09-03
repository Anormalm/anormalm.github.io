import { FiArrowUpRight, FiShield } from 'react-icons/fi';

const Privacy = () => (
  <div className="min-h-screen bg-grid">
    <section className="section privacy-page">
      <header className="page-hero-panel tech-panel rounded-3xl p-7 md:p-9" data-page="PRIVACY">
        <div>
          <div className="eyebrow">Plain-language privacy</div>
          <h1 className="font-display mt-3 text-4xl md:text-5xl">No invisible guessing.</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--muted)] md:text-base">
            The optional Geo Signal only runs after you ask it to. Last updated 4 September 2026.
          </p>
        </div>
      </header>

      <div className="privacy-grid">
        <article className="tech-panel privacy-card">
          <span>01</span>
          <h2>This website</h2>
          <p>
            No custom analytics, advertising trackers, or tracking cookies are used. A theme preference is stored only
            in your browser. Like any hosted page, GitHub Pages receives the network request needed to serve the site.
          </p>
          <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noreferrer">
            GitHub privacy statement <FiArrowUpRight />
          </a>
        </article>

        <article className="tech-panel privacy-card">
          <span>02</span>
          <h2>Geo Signal</h2>
          <p>
            If you click “Reveal my geo signal,” your browser sends one request directly to WhatIsMyIP. The service uses
            your public IP to estimate a city, region, country, coordinates, and timezone. The IP is discarded and never
            displayed or stored by this website. The map shows the result as an approximate area rather than an exact pin,
            and it exists only in the current page memory.
          </p>
          <a href="https://whatismyip.codes/privacy/" target="_blank" rel="noreferrer">
            Provider privacy policy <FiArrowUpRight />
          </a>
        </article>

        <article className="tech-panel privacy-card">
          <span>03</span>
          <h2>Your choice</h2>
          <p>
            The lookup is optional and never starts automatically. Ignore the button to opt out, or use “Clear my result”
            to remove the displayed estimate. IP geolocation is approximate and can be wrong, especially with VPNs,
            mobile networks, or shared connections.
          </p>
          <a href="mailto:anormalm@outlook.com">Privacy question <FiArrowUpRight /></a>
        </article>
      </div>

      <div className="privacy-footnote"><FiShield /> Designed for data minimisation. This notice is not legal advice.</div>
    </section>
  </div>
);

export default Privacy;
