import { useState } from 'react';
import { AnimatePresence, motion as Motion, useReducedMotion } from 'framer-motion';
import { FiCompass, FiGlobe, FiMapPin, FiMessageCircle, FiRefreshCw, FiShield, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { CITY_ROUNDS, LANGUAGE_ROUNDS } from '../data/worldGames';

const GEO_ENDPOINT = 'https://whatismyip.technology/api/me';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const shuffle = (items) => {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
};

const createLanguageDeck = () => shuffle(LANGUAGE_ROUNDS).map((round) => ({
  ...round,
  choices: shuffle([round.answer, ...round.distractors]),
}));

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
  const [gameMode, setGameMode] = useState('cities');
  const [phase, setPhase] = useState('idle');
  const [signal, setSignal] = useState(null);
  const [cityRounds, setCityRounds] = useState(() => shuffle(CITY_ROUNDS));
  const [roundIndex, setRoundIndex] = useState(0);
  const [guess, setGuess] = useState(null);
  const [totalScore, setTotalScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [languageRounds, setLanguageRounds] = useState(createLanguageDeck);
  const [languageIndex, setLanguageIndex] = useState(0);
  const [languageChoice, setLanguageChoice] = useState(null);
  const [languageScore, setLanguageScore] = useState(0);
  const [languageComplete, setLanguageComplete] = useState(false);
  const reduceMotion = useReducedMotion();

  const currentRound = cityRounds[roundIndex];
  const currentLanguage = languageRounds[languageIndex];
  const targetPoint = toMapPoint(currentRound.latitude, currentRound.longitude);
  const signalPoint = signal ? toMapPoint(signal.latitude, signal.longitude) : null;

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
    setCityRounds(shuffle(CITY_ROUNDS));
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

    if (roundIndex === cityRounds.length - 1) {
      setGameComplete(true);
      return;
    }

    setRoundIndex((index) => index + 1);
    setGuess(null);
  };

  const chooseLanguage = (choice) => {
    if (languageChoice || languageComplete) return;
    setLanguageChoice(choice);
    if (choice === currentLanguage.answer) setLanguageScore((score) => score + 1);
  };

  const resetLanguageGame = () => {
    setLanguageRounds(createLanguageDeck());
    setLanguageIndex(0);
    setLanguageChoice(null);
    setLanguageScore(0);
    setLanguageComplete(false);
  };

  const advanceLanguage = () => {
    if (languageComplete) {
      resetLanguageGame();
      return;
    }
    if (!languageChoice) return;
    if (languageIndex === languageRounds.length - 1) {
      setLanguageComplete(true);
      return;
    }
    setLanguageIndex((index) => index + 1);
    setLanguageChoice(null);
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
            <div className="eyebrow">Side quest / world games</div>
            <h2 id="geo-title">I read the<br /><em>world.</em></h2>
          </div>

          <div className="geo-rank-stamp" aria-label="GeoGuessr Master II for multiple seasons">
            <span>GeoGuessr</span>
            <strong>Master II</strong>
            <small>Multiple seasons</small>
          </div>
        </Motion.header>

        <div className="geo-mode-switch" role="tablist" aria-label="Choose a world game">
          <button
            type="button"
            role="tab"
            aria-selected={gameMode === 'cities'}
            className={gameMode === 'cities' ? 'is-active' : ''}
            onClick={() => setGameMode('cities')}
          >
            <FiGlobe aria-hidden="true" />
            <span><strong>City radar</strong><small>{CITY_ROUNDS.length} locations</small></span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={gameMode === 'languages'}
            className={gameMode === 'languages' ? 'is-active' : ''}
            onClick={() => setGameMode('languages')}
          >
            <FiMessageCircle aria-hidden="true" />
            <span><strong>Language ID</strong><small>{LANGUAGE_ROUNDS.length} languages</small></span>
          </button>
        </div>

        <AnimatePresence mode="wait">
          {gameMode === 'cities' ? (
            <Motion.div
              key="cities"
              initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduceMotion ? 0 : -12 }}
              transition={{ duration: reduceMotion ? 0.01 : 0.42 }}
              className="geo-console"
            >
              <div className="geo-radar">
                <div className="geo-radar-topline">
                  <span><i /> CITY RADAR</span>
                  <span>ROUND {String(roundIndex + 1).padStart(2, '0')} / {cityRounds.length}</span>
                  <FiCompass aria-hidden="true" />
                </div>

                <button
                  type="button"
                  className="geo-grid"
                  onClick={placeGuess}
                  disabled={Boolean(guess) || gameComplete}
                  aria-label={gameComplete ? 'City game complete' : `Place your guess for ${currentRound.name} on the world map`}
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
                        className="geo-visitor-range"
                        style={pointStyle(signalPoint)}
                        initial={{ opacity: 0, scale: 0.45 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ duration: reduceMotion ? 0.01 : 0.4 }}
                        aria-hidden="true"
                      >
                        <i />
                        <span>Approx.</span>
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
                  <span>{guess ? formatCoordinate(guess.latitude, 'N', 'S') : signal ? 'CITY AREA' : 'LAT —'}</span>
                  <span>{guess ? formatCoordinate(guess.longitude, 'E', 'W') : signal ? 'ESTIMATE' : 'LON —'}</span>
                  <strong>{guess ? `${guess.distanceKm.toLocaleString()} KM` : signal ? signal.countryCode : 'READY'}</strong>
                </div>
              </div>

              <div className="geo-brief">
                <div className="geo-round-label">
                  <span>{gameComplete ? 'Run complete' : 'Find this city'}</span>
                  <strong>{gameComplete ? `${cityRounds.length} / ${cityRounds.length}` : `${String(roundIndex + 1).padStart(2, '0')} / ${cityRounds.length}`}</strong>
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
                      <p>out of {(cityRounds.length * 5000).toLocaleString()} points across {cityRounds.length} cities.</p>
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

                <div className="geo-round-progress" aria-label={`Round ${roundIndex + 1} of ${cityRounds.length}`}>
                  <i style={{ width: `${gameComplete ? 100 : ((roundIndex + (guess ? 1 : 0)) / cityRounds.length) * 100}%` }} />
                </div>

                <button
                  type="button"
                  className="geo-game-button"
                  onClick={advanceRound}
                  disabled={!guess && !gameComplete}
                >
                  {gameComplete ? <><FiRefreshCw aria-hidden="true" /> Shuffle 50 cities</> : guess ? (
                    roundIndex === cityRounds.length - 1 ? 'Finish run' : 'Next city'
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
                      <small>{[signal.region, signal.country].filter(Boolean).join(', ')} · approximate range</small>
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
          ) : (
            <Motion.div
              key="languages"
              initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduceMotion ? 0 : -12 }}
              transition={{ duration: reduceMotion ? 0.01 : 0.42 }}
              className="geo-console language-console"
            >
              <div className="language-stage">
                <div className="geo-radar-topline">
                  <span><i /> LANGUAGE SIGNAL</span>
                  <span>ROUND {String(languageIndex + 1).padStart(2, '0')} / {languageRounds.length}</span>
                  <FiMessageCircle aria-hidden="true" />
                </div>

                <div className="language-sample-stage">
                  <div className="language-wave" aria-hidden="true">
                    {Array.from({ length: 18 }, (_, index) => <i key={index} />)}
                  </div>
                  <span>Incoming phrase / train station</span>
                  <AnimatePresence mode="wait">
                    <Motion.blockquote
                      key={currentLanguage.sample}
                      initial={{ opacity: 0, filter: reduceMotion ? 'none' : 'blur(8px)', y: reduceMotion ? 0 : 10 }}
                      animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                      exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
                    >
                      {currentLanguage.sample}
                    </Motion.blockquote>
                  </AnimatePresence>
                  <small>Same meaning. Different signal.</small>
                </div>

                <div className="language-readout">
                  <span>Unicode feed</span>
                  <span>{languageChoice ? 'Signal resolved' : 'Awaiting match'}</span>
                  <strong>{languageChoice ? currentLanguage.answer : 'READY'}</strong>
                </div>
              </div>

              <div className="geo-brief language-brief">
                <div className="geo-round-label">
                  <span>{languageComplete ? 'Run complete' : 'Name the language'}</span>
                  <strong>{languageComplete ? `${languageRounds.length} / ${languageRounds.length}` : `${String(languageIndex + 1).padStart(2, '0')} / ${languageRounds.length}`}</strong>
                </div>

                <AnimatePresence mode="wait">
                  {languageComplete ? (
                    <Motion.div key="language-complete" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="language-result">
                      <span>Final score</span>
                      <h3>{languageScore} / {languageRounds.length}</h3>
                      <p>Thirty language signals decoded. Want another shuffled run?</p>
                    </Motion.div>
                  ) : languageChoice ? (
                    <Motion.div key={`language-result-${languageIndex}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="language-result">
                      <span>{languageChoice === currentLanguage.answer ? 'Signal matched' : 'Signal corrected'}</span>
                      <h3>{currentLanguage.answer}</h3>
                      <p>{languageChoice === currentLanguage.answer ? 'Clean read.' : `You chose ${languageChoice}.`}</p>
                    </Motion.div>
                  ) : (
                    <Motion.div key={`language-prompt-${languageIndex}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="language-prompt">
                      <span>Listen with your eyes</span>
                      <h3>Name it.</h3>
                      <p>Choose the language used in the incoming phrase.</p>
                    </Motion.div>
                  )}
                </AnimatePresence>

                {!languageComplete && (
                  <div className="language-options" role="group" aria-label="Language choices">
                    {currentLanguage.choices.map((choice) => {
                      const isAnswer = choice === currentLanguage.answer;
                      const isChosen = choice === languageChoice;
                      const state = languageChoice
                        ? isAnswer ? 'is-correct' : isChosen ? 'is-wrong' : 'is-muted'
                        : '';
                      return (
                        <button
                          key={choice}
                          type="button"
                          className={state}
                          onClick={() => chooseLanguage(choice)}
                          disabled={Boolean(languageChoice)}
                        >
                          {choice}
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="geo-round-progress" aria-label={`Round ${languageIndex + 1} of ${languageRounds.length}`}>
                  <i style={{ width: `${languageComplete ? 100 : ((languageIndex + (languageChoice ? 1 : 0)) / languageRounds.length) * 100}%` }} />
                </div>

                <button
                  type="button"
                  className="geo-game-button"
                  onClick={advanceLanguage}
                  disabled={!languageChoice && !languageComplete}
                >
                  {languageComplete ? <><FiRefreshCw aria-hidden="true" /> Shuffle languages</> : languageChoice ? (
                    languageIndex === languageRounds.length - 1 ? 'Finish run' : 'Next language'
                  ) : 'Choose an answer'}
                </button>
              </div>
            </Motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default GeoSignal;
