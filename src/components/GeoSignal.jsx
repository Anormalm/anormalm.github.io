import { useState } from 'react';
import { AnimatePresence, motion as Motion, useReducedMotion } from 'framer-motion';
import { FiCompass, FiMapPin, FiRefreshCw, FiShield, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const GEO_ENDPOINT = 'https://whatismyip.technology/api/me';

const MAP_ROUNDS = [
  {
    name: 'Singapore',
    clue: 'Island city-state at the southern tip of the Malay Peninsula.',
    latitude: 1.3521,
    longitude: 103.8198,
  },
  {
    name: 'Reykjavík',
    clue: 'Northern capital on a volcanic island in the North Atlantic.',
    latitude: 64.1466,
    longitude: -21.9426,
  },
  {
    name: 'Quito',
    clue: 'Andean capital sitting almost directly on the equator.',
    latitude: -0.1807,
    longitude: -78.4678,
  },
  {
    name: 'Cape Town',
    clue: 'Atlantic port beneath a famously flat-topped mountain.',
    latitude: -33.9249,
    longitude: 18.4241,
  },
  {
    name: 'Tokyo',
    clue: 'Pacific megacity on the eastern side of Honshu.',
    latitude: 35.6762,
    longitude: 139.6503,
  },
];

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const formatCoordinate = (value, positive, negative) => {
  const direction = value >= 0 ? positive : negative;
  return `${Math.abs(value).toFixed(1)}° ${direction}`;
};

const toMapPoint = (latitude, longitude) => ({
  x: clamp(((longitude + 180) / 360) * 100, 1.5, 98.5),
  y: clamp(((90 - latitude) / 180) * 100, 2.5, 97.5),
});

const toRadians = (degrees) => degrees * (Math.PI / 180);

const distanceBetween = (origin, target) => {
  const earthRadiusKm = 6371;
  const latitudeDelta = toRadians(target.latitude - origin.latitude);
  const longitudeDelta = toRadians(target.longitude - origin.longitude);
  const startLatitude = toRadians(origin.latitude);
  const endLatitude = toRadians(target.latitude);
  const haversine =
    Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(startLatitude) * Math.cos(endLatitude) * Math.sin(longitudeDelta / 2) ** 2;

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
};

const scoreDistance = (distanceKm) => (
  distanceKm < 50 ? 5000 : Math.max(0, Math.round(5000 * Math.exp(-distanceKm / 2000)))
);

const pointStyle = (point) => ({ '--geo-x': `${point.x}%`, '--geo-y': `${point.y}%` });

const GeoSignal = () => {
  const [phase, setPhase] = useState('idle');
  const [signal, setSignal] = useState(null);
  const [roundIndex, setRoundIndex] = useState(0);
  const [guess, setGuess] = useState(null);
  const [totalScore, setTotalScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const reduceMotion = useReducedMotion();

  const currentRound = MAP_ROUNDS[roundIndex];
  const targetPoint = toMapPoint(currentRound.latitude, currentRound.longitude);
  const signalPoint = signal ? toMapPoint(signal.latitude, signal.longitude) : null;
  const activeCoordinates = guess || signal;

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

  const placeGuess = (event) => {
    if (guess || gameComplete) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const keyboardGuess = event.detail === 0;
    const x = keyboardGuess ? 50 : clamp(((event.clientX - bounds.left) / bounds.width) * 100, 0, 100);
    const y = keyboardGuess ? 50 : clamp(((event.clientY - bounds.top) / bounds.height) * 100, 0, 100);
    const latitude = 90 - (y / 100) * 180;
    const longitude = (x / 100) * 360 - 180;
    const distanceKm = Math.round(distanceBetween({ latitude, longitude }, currentRound));

    setGuess({
      x,
      y,
      latitude,
      longitude,
      distanceKm,
      score: scoreDistance(distanceKm),
    });
  };

  const resetGame = () => {
    setRoundIndex(0);
    setGuess(null);
    setTotalScore(0);
    setGameComplete(false);
  };

  const advanceRound = () => {
    if (gameComplete) {
      resetGame();
      return;
    }
    if (!guess) return;

    const nextTotal = totalScore + guess.score;
    setTotalScore(nextTotal);

    if (roundIndex === MAP_ROUNDS.length - 1) {
      setGameComplete(true);
      return;
    }

    setRoundIndex((index) => index + 1);
    setGuess(null);
  };

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

          <div className="geo-rank-stamp" aria-label="GeoGuessr Master II for multiple seasons">
            <span>GeoGuessr</span>
            <strong>Master II</strong>
            <small>Multiple seasons</small>
          </div>
        </Motion.header>

        <Motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{ duration: reduceMotion ? 0.01 : 0.75, delay: 0.08 }}
          className="geo-console"
        >
          <div className="geo-radar">
            <div className="geo-radar-topline">
              <span><i /> MAP SPRINT</span>
              <span>ROUND {String(roundIndex + 1).padStart(2, '0')} / 05</span>
              <FiCompass aria-hidden="true" />
            </div>

            <button
              type="button"
              className="geo-grid"
              onClick={placeGuess}
              disabled={Boolean(guess) || gameComplete}
              aria-label={gameComplete ? 'Map sprint complete' : `Place your guess for ${currentRound.name} on the world map`}
            >
              <img
                className="geo-world-map"
                src="/world-map-equirectangular.png"
                alt=""
                width="1280"
                height="640"
                loading="lazy"
                decoding="async"
              />
              <span className="geo-crosshair geo-crosshair-x" aria-hidden="true" />
              <span className="geo-crosshair geo-crosshair-y" aria-hidden="true" />
              <span className="geo-north" aria-hidden="true">N</span>
              <span className="geo-sweep" aria-hidden="true" />

              {guess && (
                <svg className="geo-guess-line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                  <line x1={guess.x} y1={guess.y} x2={targetPoint.x} y2={targetPoint.y} />
                </svg>
              )}

              <AnimatePresence>
                {signalPoint && (
                  <Motion.span
                    className="geo-map-marker geo-visitor-marker"
                    style={pointStyle(signalPoint)}
                    initial={{ opacity: 0, scale: 1.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: reduceMotion ? 0.01 : 0.4 }}
                    aria-hidden="true"
                  >
                    <i />
                  </Motion.span>
                )}

                {guess && (
                  <Motion.span
                    className="geo-map-marker geo-guess-marker"
                    style={pointStyle(guess)}
                    initial={{ opacity: 0, scale: 2 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: reduceMotion ? 0.01 : 0.35 }}
                    aria-hidden="true"
                  >
                    <i />
                  </Motion.span>
                )}

                {guess && (
                  <Motion.span
                    className="geo-map-marker geo-target-marker"
                    style={pointStyle(targetPoint)}
                    initial={{ opacity: 0, scale: 2.4 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: reduceMotion ? 0.01 : 0.5, delay: reduceMotion ? 0 : 0.16 }}
                    aria-hidden="true"
                  >
                    <FiMapPin />
                  </Motion.span>
                )}
              </AnimatePresence>

              {!guess && !gameComplete && <span className="geo-map-hint">Click anywhere to drop a pin</span>}
            </button>

            <div className="geo-radar-readout">
              <span>{activeCoordinates ? formatCoordinate(activeCoordinates.latitude, 'N', 'S') : 'LAT —'}</span>
              <span>{activeCoordinates ? formatCoordinate(activeCoordinates.longitude, 'E', 'W') : 'LON —'}</span>
              <strong>{guess ? `${guess.distanceKm.toLocaleString()} KM` : signal ? signal.countryCode : 'READY'}</strong>
            </div>
          </div>

          <div className="geo-brief">
            <div className="geo-round-label">
              <span>{gameComplete ? 'Sprint complete' : 'Find this place'}</span>
              <strong>{gameComplete ? '05 / 05' : `${String(roundIndex + 1).padStart(2, '0')} / 05`}</strong>
            </div>

            <AnimatePresence mode="wait">
              {gameComplete ? (
                <Motion.div
                  key="complete"
                  initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="geo-result"
                >
                  <span>Final score</span>
                  <h3>{totalScore.toLocaleString()}</h3>
                  <p>out of 25,000 points. One more run?</p>
                </Motion.div>
              ) : guess ? (
                <Motion.div
                  key={`result-${roundIndex}`}
                  initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
                  className="geo-result"
                >
                  <span>{currentRound.name} found</span>
                  <h3>{guess.score.toLocaleString()}</h3>
                  <p>{guess.distanceKm.toLocaleString()} km away · max 5,000</p>
                </Motion.div>
              ) : (
                <Motion.div
                  key={`prompt-${roundIndex}`}
                  initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
                  className="geo-prompt"
                >
                  <span>Target</span>
                  <h3>{currentRound.name}</h3>
                  <p>{currentRound.clue}</p>
                </Motion.div>
              )}
            </AnimatePresence>

            <div className="geo-round-progress" aria-label={`Round ${roundIndex + 1} of ${MAP_ROUNDS.length}`}>
              {MAP_ROUNDS.map((round, index) => (
                <i
                  key={round.name}
                  className={gameComplete || index < roundIndex ? 'is-done' : index === roundIndex ? 'is-current' : ''}
                />
              ))}
            </div>

            <button
              type="button"
              className="geo-game-button"
              onClick={advanceRound}
              disabled={!guess && !gameComplete}
            >
              {gameComplete ? <><FiRefreshCw aria-hidden="true" /> Run it again</> : guess ? (
                roundIndex === MAP_ROUNDS.length - 1 ? 'Finish sprint' : 'Next round'
              ) : 'Drop a pin on the map'}
            </button>

            <div className="geo-visitor-signal">
              <div>
                <span>Optional spawn check</span>
                <strong>
                  {phase === 'revealed' && signal
                    ? signal.city
                    : phase === 'error'
                      ? 'Signal unavailable'
                      : 'Reveal your city'}
                </strong>
                {phase === 'revealed' && signal && (
                  <small>{[signal.region, signal.country].filter(Boolean).join(', ')}</small>
                )}
              </div>

              {phase === 'revealed' ? (
                <button type="button" onClick={clearSignal} aria-label="Clear approximate location">
                  <FiX aria-hidden="true" />
                </button>
              ) : (
                <button type="button" onClick={revealSignal} disabled={phase === 'loading'} aria-label="Reveal approximate city">
                  {phase === 'loading' ? '…' : <FiMapPin aria-hidden="true" />}
                </button>
              )}
            </div>

            <div className="geo-privacy-note">
              <FiShield aria-hidden="true" />
              <Link to="/privacy">Privacy details</Link>
            </div>
          </div>
        </Motion.div>
      </div>
    </section>
  );
};

export default GeoSignal;
