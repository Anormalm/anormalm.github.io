import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { FiRefreshCw, FiShield } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { fetchVisitorArchive } from '../lib/visitorSignals';

const SINGAPORE_POINT = { x: 78.8, y: 49.2 };

const toMapPoint = (latitude, longitude) => ({
  x: Math.max(1.5, Math.min(98.5, ((Number(longitude) + 180) / 360) * 100)),
  y: Math.max(2, Math.min(98, ((90 - Number(latitude)) / 180) * 100)),
});

const countryName = (code, isChinese) => {
  if (code === 'XX') return isChinese ? '未知区域' : 'Unknown region';
  try {
    return new Intl.DisplayNames([isChinese ? 'zh' : 'en'], { type: 'region' }).of(code) || code;
  } catch {
    return code;
  }
};

const VisitorArchive = () => {
  const { isChinese } = useLanguage();
  const [archive, setArchive] = useState(null);
  const [status, setStatus] = useState('loading');

  const loadArchive = useCallback(async (signal) => {
    setStatus('loading');
    try {
      setArchive(await fetchVisitorArchive(signal));
      setStatus('ready');
    } catch (error) {
      if (error.name !== 'AbortError') setStatus('error');
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadArchive(controller.signal);
    return () => controller.abort();
  }, [loadArchive]);

  const regions = useMemo(() => {
    const grouped = new Map();
    for (const point of archive?.points || []) {
      const existing = grouped.get(point.countryCode) || { ...point, count: 0 };
      existing.count += point.count;
      if (!existing.lastSeen || point.lastSeen > existing.lastSeen) existing.lastSeen = point.lastSeen;
      grouped.set(point.countryCode, existing);
    }
    return [...grouped.values()].sort((a, b) => b.count - a.count).slice(0, 5);
  }, [archive]);

  const hasSignals = Boolean(archive?.points?.length);

  return (
    <section className="visitor-archive" aria-labelledby="visitor-archive-title">
      <header className="visitor-archive-header">
        <div>
          <div className="eyebrow">{isChinese ? '匿名信号 / 近 90 天' : 'Anonymous signals / 90 days'}</div>
          <h2 id="visitor-archive-title">{isChinese ? '访客信号档案' : 'Visitor signal archive'}</h2>
        </div>
        <button type="button" onClick={() => loadArchive()} aria-label={isChinese ? '刷新访客信号' : 'Refresh visitor signals'} disabled={status === 'loading'}>
          <FiRefreshCw />
        </button>
      </header>

      <div className="visitor-archive-grid">
        <figure className={`visitor-map ${status === 'loading' ? 'is-loading' : ''}`}>
          <img src="/world-map-equirectangular.png" alt="" />
          <div className="visitor-map-grid" aria-hidden="true" />

          {hasSignals && (
            <svg className="visitor-map-links" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              {archive.points.map((point, index) => {
                const position = toMapPoint(point.latitude, point.longitude);
                const bend = Math.min(SINGAPORE_POINT.y, position.y) - 11 - (index % 3) * 3;
                return (
                  <Motion.path
                    key={`${point.countryCode}-${point.latitude}-${point.longitude}`}
                    d={`M ${SINGAPORE_POINT.x} ${SINGAPORE_POINT.y} Q ${(SINGAPORE_POINT.x + position.x) / 2} ${bend} ${position.x} ${position.y}`}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.28 }}
                    transition={{ duration: 0.9, delay: index * 0.05 }}
                  />
                );
              })}
            </svg>
          )}

          {archive?.points?.map((point, index) => {
            const position = toMapPoint(point.latitude, point.longitude);
            const size = Math.min(22, 7 + Math.log2(point.count + 1) * 3);
            const label = `${countryName(point.countryCode, isChinese)}: ${point.count} ${isChinese ? '个信号' : point.count === 1 ? 'signal' : 'signals'}`;
            return (
              <Motion.span
                key={`${point.countryCode}-${point.latitude}-${point.longitude}`}
                className="visitor-map-point"
                style={{ left: `${position.x}%`, top: `${position.y}%`, width: size, height: size }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 + index * 0.05, type: 'spring' }}
                title={label}
                aria-label={label}
              ><i /></Motion.span>
            );
          })}

          {!hasSignals && status === 'ready' && (
            <div className="visitor-map-empty">{isChinese ? '等待第一个信号。' : 'Waiting for the first signal.'}</div>
          )}
          {status === 'error' && (
            <div className="visitor-map-empty">{isChinese ? '档案暂时休眠。' : 'The archive is sleeping.'}</div>
          )}
          <figcaption>{isChinese ? '圆点代表约 30° 的宽泛世界区域，而不是精确位置。' : 'Dots represent broad 30° world regions—not precise locations.'}</figcaption>
        </figure>

        <aside className="visitor-archive-stats">
          <div className="visitor-stat-pair">
            <div><strong>{archive?.totalSignals ?? '—'}</strong><span>{isChinese ? '信号' : 'signals'}</span></div>
            <div><strong>{archive?.countryCount ?? '—'}</strong><span>{isChinese ? '国家与地区' : 'countries'}</span></div>
          </div>

          <div className="visitor-region-list">
            {regions.length > 0 ? regions.map((region, index) => (
              <div key={region.countryCode}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{countryName(region.countryCode, isChinese)}</strong>
                <small>{region.count}</small>
              </div>
            )) : (
              <p>{status === 'loading' ? (isChinese ? '正在接收……' : 'Receiving…') : (isChinese ? '目前没有可显示的区域。' : 'No regions to show yet.')}</p>
            )}
          </div>

          <div className="visitor-archive-privacy">
            <FiShield />
            <p>
              {isChinese ? '只保存日期、国家、宽泛区域和计数。不会保存原始 IP 或个人档案。' : 'Only the day, country, broad region, and count survive. No raw IP or personal profile.'}
              {' '}<Link to="/privacy">{isChinese ? '隐私详情' : 'Privacy details'}</Link>
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default VisitorArchive;
