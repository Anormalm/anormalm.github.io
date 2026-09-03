import { useState } from 'react';
import { AnimatePresence, motion as Motion, useReducedMotion } from 'framer-motion';
import { FiArrowUpRight, FiCompass, FiGithub, FiMapPin, FiShield, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const GEO_ENDPOINT = 'https://whatismyip.technology/api/me';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const formatCoordinate = (value, positive, negative) => {
  const direction = value >= 0 ? positive : negative;
  return `${Math.abs(value).toFixed(1)}° ${direction}`;
};

const GeoSignal = () => {
  const [phase, setPhase] = useState('idle');
  const [signal, setSignal] = useState(null);
  const reduceMotion = useReducedMotion();

  const revealSignal = async () => {
    setPhase('loading');

    try {
      const response = await fetch(GEO_ENDPOINT, {
        cache: 'no-store',
        referrerPolicy: 'no-referrer',
      });
      if (!response.ok) throw new Error('Location service unavailable');

      const payload = await response.json();
      const latitude = Number(payload.lat);
      const longitude = Number(payload.lon);
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) throw new Error('Invalid location response');

      setSignal({
        city: payload.city || 'Unknown city',
        region: payload.region || '',
        country: payload.country || 'Unknown country',
        countryCode: payload.countryCode || '??',
        timezone: payload.timezone || 'Unknown timezone',
        latitude,
        longitude,
      });
      setPhase('revealed');
    } catch {
      setSignal(null);
      setPhase('error');
    }
  };

  const clearSignal = () => {
    setSignal(null);
    setPhase('idle');
  };

  const markerStyle = signal
    ? {
        '--geo-x': `${clamp(((signal.longitude + 180) / 360) * 100, 3, 97)}%`,
        '--geo-y': `${clamp(((90 - signal.latitude) / 180) * 100, 4, 96)}%`,
      }
    : undefined;

  return (
    <section className="geo-section" aria-labelledby="geo-title">
      <div className="section geo-inner">
        <Motion.header
          initial={{ opacity: 0, y: reduceMotion ? 0 : 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: reduceMotion ? 0.01 : 0.65 }}
          className="geo-heading"
        >
          <div>
            <div className="eyebrow">Side quest / geography</div>
            <h2 id="geo-title">I read the<br /><em>world.</em></h2>
          </div>

          <div className="geo-heading-side">
            <div className="geo-rank-stamp" aria-label="GeoGuessr Master II for multiple seasons">
              <span>GeoGuessr</span>
              <strong>Master II</strong>
              <small>Multiple seasons</small>
            </div>

            <a
              className="geo-source-chip"
              href="https://github.com/GeoGuess/GeoGuess"
              target="_blank"
              rel="noreferrer"
              aria-label="Explore GeoGuess, an open-source geography game, on GitHub"
            >
              <FiGithub aria-hidden="true" />
              <span>Open-source detour</span>
              <strong>GeoGuess</strong>
              <FiArrowUpRight aria-hidden="true" />
            </a>
          </div>
        </Motion.header>

        <Motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{ duration: reduceMotion ? 0.01 : 0.75, delay: 0.08 }}
          className="geo-console"
        >
          <div className="geo-radar" aria-hidden="true">
            <div className="geo-radar-topline">
              <span><i /> GEO SIGNAL</span>
              <FiCompass />
            </div>

            <div className="geo-grid">
              <span className="geo-orbit geo-orbit-one" />
              <span className="geo-orbit geo-orbit-two" />
              <span className="geo-crosshair geo-crosshair-x" />
              <span className="geo-crosshair geo-crosshair-y" />
              <span className="geo-north">N</span>
              <span className="geo-sweep" />
              <AnimatePresence>
                {signal && (
                  <Motion.span
                    className="geo-marker"
                    style={markerStyle}
                    initial={{ opacity: 0, scale: 2.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: reduceMotion ? 0.01 : 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <FiMapPin />
                  </Motion.span>
                )}
              </AnimatePresence>
            </div>

            <div className="geo-radar-readout">
              <span>{signal ? formatCoordinate(signal.latitude, 'N', 'S') : '00.0° N'}</span>
              <span>{signal ? formatCoordinate(signal.longitude, 'E', 'W') : '000.0° E'}</span>
              <strong>{signal ? signal.countryCode : 'HIDDEN'}</strong>
            </div>
          </div>

          <div className="geo-brief">
            <div className="geo-round-label">Your round</div>

            <AnimatePresence mode="wait">
              {phase === 'revealed' && signal ? (
                <Motion.div
                  key="result"
                  initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
                  className="geo-result"
                >
                  <span>Approximate signal</span>
                  <h3>{signal.city}</h3>
                  <p>{[signal.region, signal.country].filter(Boolean).join(', ')}</p>
                  <div className="geo-result-meta">
                    <span>{signal.timezone}</span>
                    <span>City-level estimate</span>
                  </div>
                </Motion.div>
              ) : (
                <Motion.div
                  key="prompt"
                  initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
                  className="geo-prompt"
                >
                  <h3>{phase === 'error' ? 'Signal lost.' : 'Where did you spawn?'}</h3>
                  <p>{phase === 'error' ? 'The lookup failed. Nothing was saved.' : 'One click reveals an approximate city—not your exact location.'}</p>
                </Motion.div>
              )}
            </AnimatePresence>

            <div className="geo-privacy-note">
              <FiShield aria-hidden="true" />
              <Link to="/privacy">Privacy details</Link>
            </div>

            {phase === 'revealed' ? (
              <button type="button" className="geo-clear-button" onClick={clearSignal}>
                <FiX aria-hidden="true" /> Clear my result
              </button>
            ) : (
              <button type="button" className="geo-reveal-button" onClick={revealSignal} disabled={phase === 'loading'}>
                <FiMapPin aria-hidden="true" /> {phase === 'loading' ? 'Triangulating…' : 'Reveal my geo signal'}
              </button>
            )}
          </div>
        </Motion.div>
      </div>
    </section>
  );
};

export default GeoSignal;
