import { useState } from 'react';
import { AnimatePresence, motion as Motion, useReducedMotion } from 'framer-motion';
import { FiCompass, FiGlobe, FiMapPin, FiMessageCircle, FiRefreshCw, FiShield, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { CITY_ROUNDS, LANGUAGE_ROUNDS } from '../data/worldGames';
import { useLanguage } from '../context/LanguageContext';

const GEO_ENDPOINT = 'https://whatismyip.technology/api/me';
const ROUNDS_PER_GAME = 5;

const LANGUAGE_NAMES_ZH = {
  English: '英语', Spanish: '西班牙语', French: '法语', German: '德语', Italian: '意大利语', Portuguese: '葡萄牙语',
  Dutch: '荷兰语', Swedish: '瑞典语', Danish: '丹麦语', Norwegian: '挪威语', Finnish: '芬兰语', Polish: '波兰语',
  Czech: '捷克语', Hungarian: '匈牙利语', Romanian: '罗马尼亚语', Turkish: '土耳其语', Greek: '希腊语', Russian: '俄语',
  Ukrainian: '乌克兰语', Arabic: '阿拉伯语', Hebrew: '希伯来语', Hindi: '印地语', 'Mandarin Chinese': '汉语普通话',
  Japanese: '日语', Korean: '韩语', Thai: '泰语', Vietnamese: '越南语', Indonesian: '印度尼西亚语', Malay: '马来语',
  Swahili: '斯瓦希里语',
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const shuffle = (items) => {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
};

const createCityDeck = () => shuffle(CITY_ROUNDS).slice(0, ROUNDS_PER_GAME);

const createLanguageDeck = () => shuffle(LANGUAGE_ROUNDS).slice(0, ROUNDS_PER_GAME).map((round) => ({
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
  const { isChinese } = useLanguage();
  const [gameMode, setGameMode] = useState('cities');
  const [phase, setPhase] = useState('idle');
  const [signal, setSignal] = useState(null);
  const [cityRounds, setCityRounds] = useState(createCityDeck);
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
  const currentCityName = isChinese ? currentRound.nameZh : currentRound.name;
  const currentCityClue = isChinese ? currentRound.clueZh : currentRound.clue;
  const languageName = (name) => (isChinese ? LANGUAGE_NAMES_ZH[name] || name : name);
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
    setCityRounds(createCityDeck());
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
            <div className="eyebrow">{isChinese ? '支线任务 / 世界游戏' : 'Side quest / world games'}</div>
            <h2 id="geo-title">{isChinese ? <>读懂这个<br /><em>世界。</em></> : <>I read the<br /><em>world.</em></>}</h2>
          </div>

          <div className="geo-rank-stamp" aria-label={isChinese ? '连续多个赛季达到 GeoGuessr Master II' : 'GeoGuessr Master II for multiple seasons'}>
            <span>GeoGuessr</span>
            <strong>Master II</strong>
            <small>{isChinese ? '连续多个赛季' : 'Multiple seasons'}</small>
          </div>
        </Motion.header>

        <div className="geo-mode-switch" role="tablist" aria-label={isChinese ? '选择世界游戏' : 'Choose a world game'}>
          <button
            type="button"
            role="tab"
            aria-selected={gameMode === 'cities'}
            className={gameMode === 'cities' ? 'is-active' : ''}
            onClick={() => setGameMode('cities')}
          >
            <FiGlobe aria-hidden="true" />
            <span><strong>{isChinese ? '城市雷达' : 'City radar'}</strong><small>{CITY_ROUNDS.length} {isChinese ? '个地点库 · 每局 5 题' : 'locations · 5 per run'}</small></span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={gameMode === 'languages'}
            className={gameMode === 'languages' ? 'is-active' : ''}
            onClick={() => setGameMode('languages')}
          >
            <FiMessageCircle aria-hidden="true" />
            <span><strong>{isChinese ? '识别语言' : 'Language ID'}</strong><small>{LANGUAGE_ROUNDS.length} {isChinese ? '种语言库 · 每局 5 题' : 'languages · 5 per run'}</small></span>
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
                  <span><i /> {isChinese ? '城市雷达' : 'CITY RADAR'}</span>
                  <span>{isChinese ? '第' : 'ROUND'} {String(roundIndex + 1).padStart(2, '0')} / {cityRounds.length}</span>
                  <FiCompass aria-hidden="true" />
                </div>

                <button
                  type="button"
                  className="geo-grid"
                  data-cursor="pin"
                  onClick={placeGuess}
                  disabled={Boolean(guess) || gameComplete}
                  aria-label={gameComplete
                    ? (isChinese ? '城市游戏已完成' : 'City game complete')
                    : (isChinese ? `在世界地图上标出你猜测的${currentCityName}位置` : `Place your guess for ${currentRound.name} on the world map`)}
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
                        <span>{isChinese ? '约' : 'Approx.'}</span>
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

                  {!guess && !gameComplete && <span className="geo-map-hint">{isChinese ? '点击地图任意位置落针' : 'Click anywhere to drop a pin'}</span>}
                </button>

                <div className="geo-radar-readout">
                  <span>{guess ? formatCoordinate(guess.latitude, 'N', 'S') : signal ? (isChinese ? '城市范围' : 'CITY AREA') : (isChinese ? '纬度 —' : 'LAT —')}</span>
                  <span>{guess ? formatCoordinate(guess.longitude, 'E', 'W') : signal ? (isChinese ? '估算' : 'ESTIMATE') : (isChinese ? '经度 —' : 'LON —')}</span>
                  <strong>{guess ? `${guess.distanceKm.toLocaleString()} KM` : signal ? signal.countryCode : (isChinese ? '准备' : 'READY')}</strong>
                </div>
              </div>

              <div className="geo-brief">
                <div className="geo-round-label">
                  <span>{gameComplete ? (isChinese ? '本局完成' : 'Run complete') : (isChinese ? '找到这座城市' : 'Find this city')}</span>
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
                      <span>{isChinese ? '最终得分' : 'Final score'}</span>
                      <h3>{totalScore.toLocaleString()}</h3>
                      <p>{isChinese
                        ? `共 ${cityRounds.length} 座城市，满分 ${(cityRounds.length * 5000).toLocaleString()} 分。`
                        : `out of ${(cityRounds.length * 5000).toLocaleString()} points across ${cityRounds.length} cities.`}</p>
                    </Motion.div>
                  ) : guess ? (
                    <Motion.div
                      key={`result-${roundIndex}`}
                      initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
                      className="geo-result"
                    >
                      <span>{isChinese ? `找到${currentCityName}` : `${currentRound.name} found`}</span>
                      <h3>{guess.score.toLocaleString()}</h3>
                      <p>{isChinese ? `相距 ${guess.distanceKm.toLocaleString()} 公里 · 满分 5,000` : `${guess.distanceKm.toLocaleString()} km away · max 5,000`}</p>
                    </Motion.div>
                  ) : (
                    <Motion.div
                      key={`prompt-${roundIndex}`}
                      initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
                      className="geo-prompt"
                    >
                      <span>{isChinese ? '目标' : 'Target'}</span>
                      <h3>{currentCityName}</h3>
                      <p>{currentCityClue}</p>
                    </Motion.div>
                  )}
                </AnimatePresence>

                <div className="geo-round-progress" aria-label={isChinese ? `第 ${roundIndex + 1} 题，共 ${cityRounds.length} 题` : `Round ${roundIndex + 1} of ${cityRounds.length}`}>
                  <i style={{ width: `${gameComplete ? 100 : ((roundIndex + (guess ? 1 : 0)) / cityRounds.length) * 100}%` }} />
                </div>

                <button
                  type="button"
                  className="geo-game-button"
                  onClick={advanceRound}
                  disabled={!guess && !gameComplete}
                >
                  {gameComplete ? <><FiRefreshCw aria-hidden="true" /> {isChinese ? '再来 5 题' : 'Shuffle 5 more'}</> : guess ? (
                    roundIndex === cityRounds.length - 1 ? (isChinese ? '完成本局' : 'Finish run') : (isChinese ? '下一座城市' : 'Next city')
                  ) : (isChinese ? '在地图上落针' : 'Drop a pin on the map')}
                </button>

                <div className="geo-visitor-signal">
                  <div>
                    <span>{isChinese ? '可选：查看出生点' : 'Optional spawn check'}</span>
                    <strong>
                      {phase === 'revealed' && signal
                        ? signal.city
                        : phase === 'error'
                          ? (isChinese ? '信号不可用' : 'Signal unavailable')
                          : (isChinese ? '显示所在城市' : 'Reveal your city')}
                    </strong>
                    {phase === 'revealed' && signal && (
                      <small>{[signal.region, signal.country].filter(Boolean).join(', ')} · {isChinese ? '大致范围' : 'approximate range'}</small>
                    )}
                  </div>

                  {phase === 'revealed' ? (
                    <button type="button" onClick={clearSignal} aria-label={isChinese ? '清除大致位置' : 'Clear approximate location'}>
                      <FiX aria-hidden="true" />
                    </button>
                  ) : (
                    <button type="button" onClick={revealSignal} disabled={phase === 'loading'} aria-label={isChinese ? '显示大致城市' : 'Reveal approximate city'}>
                      {phase === 'loading' ? '…' : <FiMapPin aria-hidden="true" />}
                    </button>
                  )}
                </div>

                <div className="geo-privacy-note">
                  <FiShield aria-hidden="true" />
                  <Link to="/privacy">{isChinese ? '隐私详情' : 'Privacy details'}</Link>
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
                  <span><i /> {isChinese ? '语言信号' : 'LANGUAGE SIGNAL'}</span>
                  <span>{isChinese ? '第' : 'ROUND'} {String(languageIndex + 1).padStart(2, '0')} / {languageRounds.length}</span>
                  <FiMessageCircle aria-hidden="true" />
                </div>

                <div className="language-sample-stage">
                  <div className="language-wave" aria-hidden="true">
                    {Array.from({ length: 18 }, (_, index) => <i key={index} />)}
                  </div>
                  <span>{isChinese ? '收到短句 / 火车站' : 'Incoming phrase / train station'}</span>
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
                  <small>{isChinese ? '同一个意思，不同的信号。' : 'Same meaning. Different signal.'}</small>
                </div>

                <div className="language-readout">
                  <span>{isChinese ? 'Unicode 传输' : 'Unicode feed'}</span>
                  <span>{languageChoice ? (isChinese ? '信号已识别' : 'Signal resolved') : (isChinese ? '等待匹配' : 'Awaiting match')}</span>
                  <strong>{languageChoice ? languageName(currentLanguage.answer) : (isChinese ? '准备' : 'READY')}</strong>
                </div>
              </div>

              <div className="geo-brief language-brief">
                <div className="geo-round-label">
                  <span>{languageComplete ? (isChinese ? '本局完成' : 'Run complete') : (isChinese ? '说出语言名称' : 'Name the language')}</span>
                  <strong>{languageComplete ? `${languageRounds.length} / ${languageRounds.length}` : `${String(languageIndex + 1).padStart(2, '0')} / ${languageRounds.length}`}</strong>
                </div>

                <AnimatePresence mode="wait">
                  {languageComplete ? (
                    <Motion.div key="language-complete" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="language-result">
                      <span>{isChinese ? '最终得分' : 'Final score'}</span>
                      <h3>{languageScore} / {languageRounds.length}</h3>
                      <p>{isChinese ? '五个语言信号已解码。再来一局？' : 'Five language signals decoded. Want another shuffled run?'}</p>
                    </Motion.div>
                  ) : languageChoice ? (
                    <Motion.div key={`language-result-${languageIndex}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="language-result">
                      <span>{languageChoice === currentLanguage.answer
                        ? (isChinese ? '信号匹配' : 'Signal matched')
                        : (isChinese ? '已校正信号' : 'Signal corrected')}</span>
                      <h3>{languageName(currentLanguage.answer)}</h3>
                      <p>{languageChoice === currentLanguage.answer
                        ? (isChinese ? '识别正确。' : 'Clean read.')
                        : (isChinese ? `你选择了${languageName(languageChoice)}。` : `You chose ${languageChoice}.`)}</p>
                    </Motion.div>
                  ) : (
                    <Motion.div key={`language-prompt-${languageIndex}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="language-prompt">
                      <span>{isChinese ? '用眼睛听' : 'Listen with your eyes'}</span>
                      <h3>{isChinese ? '这是哪种语言？' : 'Name it.'}</h3>
                      <p>{isChinese ? '选择收到的短句所使用的语言。' : 'Choose the language used in the incoming phrase.'}</p>
                    </Motion.div>
                  )}
                </AnimatePresence>

                {!languageComplete && (
                  <div className="language-options" role="group" aria-label={isChinese ? '语言选项' : 'Language choices'}>
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
                          {languageName(choice)}
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="geo-round-progress" aria-label={isChinese ? `第 ${languageIndex + 1} 题，共 ${languageRounds.length} 题` : `Round ${languageIndex + 1} of ${languageRounds.length}`}>
                  <i style={{ width: `${languageComplete ? 100 : ((languageIndex + (languageChoice ? 1 : 0)) / languageRounds.length) * 100}%` }} />
                </div>

                <button
                  type="button"
                  className="geo-game-button"
                  onClick={advanceLanguage}
                  disabled={!languageChoice && !languageComplete}
                >
                  {languageComplete ? <><FiRefreshCw aria-hidden="true" /> {isChinese ? '再来 5 题' : 'Shuffle 5 more'}</> : languageChoice ? (
                    languageIndex === languageRounds.length - 1 ? (isChinese ? '完成本局' : 'Finish run') : (isChinese ? '下一种语言' : 'Next language')
                  ) : (isChinese ? '选择答案' : 'Choose an answer')}
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
