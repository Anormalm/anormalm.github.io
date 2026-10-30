import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiDownload, FiRefreshCw, FiShield } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import { fetchVisitorArchive, isVisitorSignalPaused, setVisitorSignalPaused } from '../lib/visitorSignals';
import { buildVisitorReport, visitorReportCsv } from '../lib/visitorReport';
import './Visitors.css';

const Visitors = () => {
  const { locale, t } = useLanguage();
  const [report, setReport] = useState(null);
  const [status, setStatus] = useState('loading');
  const [updated, setUpdated] = useState(null);
  const [range, setRange] = useState(30);
  const [selectedDay, setSelectedDay] = useState(null);
  const [paused, setPaused] = useState(isVisitorSignalPaused);
  const privacyExcluded = navigator.globalPrivacyControl === true || navigator.doNotTrack === '1';
  const excluded = paused || privacyExcluded;

  const refresh = useCallback(async (signal) => {
    setStatus('loading');
    try {
      const archive = await fetchVisitorArchive(signal);
      if (signal?.aborted) return;
      const generatedAt = new Date(archive.generatedAt);
      if (Number.isNaN(generatedAt.getTime())) throw new Error('Invalid count timestamp');
      setReport(buildVisitorReport(archive, generatedAt));
      setUpdated(generatedAt);
      setStatus('ready');
    } catch (error) {
      if (error.name !== 'AbortError') setStatus('error');
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    refresh(controller.signal);
    const timer = setInterval(() => {
      if (!document.hidden) refresh(controller.signal);
    }, 60_000);
    return () => { controller.abort(); clearInterval(timer); };
  }, [refresh]);

  const number = new Intl.NumberFormat(locale);
  const decimal = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 });
  const date = new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric', timeZone: 'UTC' });
  const fullDate = new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'UTC' });
  const days = report?.daily.slice(-range) || [];
  const max = Math.max(1, ...days.map((day) => day.count));
  const active = days.find((day) => day.day === selectedDay) || days.at(-1);
  const rangeTotal = days.reduce((sum, day) => sum + day.count, 0);
  const countryName = (code) => {
    if (code === 'XX') return t('Unknown region');
    try { return new Intl.DisplayNames([locale], { type: 'region' }).of(code) || code; }
    catch { return code; }
  };
  const exportCsv = () => {
    const url = URL.createObjectURL(new Blob([visitorReportCsv(days)], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `anormalm-visits-${range}days.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <section className="section traffic-page">
      <header className="traffic-header">
        <div>
          <div className="eyebrow">Visits over time</div>
          <h1>Visitor counts</h1>
        </div>
        <div className="traffic-actions">
          <button className="icon-button" type="button" onClick={() => refresh()} disabled={status === 'loading'} aria-label="Refresh visitor signals"><FiRefreshCw /></button>
          <Link className="button-secondary" to="/node"><FiArrowLeft />Hidden node</Link>
        </div>
      </header>

      {status === 'error' && <p className="traffic-error" role="alert">Could not load visitor counts.</p>}

      <div className="traffic-metrics" aria-busy={status === 'loading'}>
        {[['Today', report?.today], ['Last 7 days', report?.week], ['Last 30 days', report?.month], ['Daily average', report?.dailyAverage]].map(([label, value], index) => (
          <article className="tech-panel traffic-metric" key={label}>
            <span>{label}</span>
            <strong>{value === undefined ? '—' : (index === 3 ? decimal : number).format(value)}</strong>
            <small>{index === 3 ? 'Last 30 days' : 'Counted visits'}</small>
          </article>
        ))}
      </div>

      <section className="tech-panel traffic-chart-panel" aria-labelledby="traffic-chart-title">
        <header className="traffic-chart-header">
          <div><h2 id="traffic-chart-title">Daily visits (UTC)</h2><p><span>Total in range</span><strong>{report ? number.format(rangeTotal) : '—'}</strong></p></div>
          <div className="traffic-range" role="group" aria-label="Choose a time range">
            {[[7, '7 days'], [30, '30 days'], [90, '90 days']].map(([value, label]) => (
              <button key={value} type="button" aria-pressed={range === value} onClick={() => setRange(value)}>{label}</button>
            ))}
          </div>
        </header>
        <div className="traffic-chart" dir="ltr">
          <div className="traffic-chart-grid" aria-hidden="true"><i /><i /><i /><i /></div>
          <div className="traffic-bars" style={{ gridTemplateColumns: `repeat(${range}, minmax(0, 1fr))` }}>
            {days.map((day) => (
              <button key={day.day} type="button" className={active?.day === day.day ? 'is-selected' : ''}
                onMouseEnter={() => setSelectedDay(day.day)} onFocus={() => setSelectedDay(day.day)} onClick={() => setSelectedDay(day.day)}
                aria-pressed={active?.day === day.day}
                aria-label={`${fullDate.format(new Date(day.day + 'T00:00:00Z'))}: ${number.format(day.count)} ${t('Counted visits')}`}>
                <span style={{ height: day.count ? `${Math.max(2, day.count / max * 100)}%` : '2px' }} />
              </button>
            ))}
          </div>
        </div>
        <div className="traffic-axis" dir="ltr">
          {days.length > 0 && [days[0], days[Math.floor(days.length / 2)], days.at(-1)].map((day) => <span key={day.day}>{date.format(new Date(day.day + 'T00:00:00Z'))}</span>)}
        </div>
        <div className="traffic-chart-footer">
          <div aria-live="polite" aria-label="Visit details">
            {active && <><time dateTime={active.day}>{fullDate.format(new Date(active.day + 'T00:00:00Z'))}</time><strong>{number.format(active.count)}</strong><span>Counted visits</span></>}
            {status === 'loading' && !report && <span>Receiving…</span>}
          </div>
          <button type="button" className="button-secondary" onClick={exportCsv} disabled={!report}><FiDownload />Export CSV</button>
        </div>
        {report?.total === 0 && <p className="traffic-empty">No visits recorded yet.</p>}
      </section>

      <div className="traffic-bottom-grid">
        <section className="tech-panel traffic-countries">
          <header><h2>Country breakdown</h2><span>90 days</span></header>
          {report?.countries.length ? <ol>{report.countries.map((country) => (
            <li key={country.code}>
              <div><span>{countryName(country.code)}</span><strong>{number.format(country.count)}</strong></div>
              <span className="traffic-country-track" aria-hidden="true"><i style={{ width: `${country.count / Math.max(1, report.total) * 100}%` }} /></span>
            </li>
          ))}</ol> : <p className="traffic-empty">{report ? 'No visits recorded yet.' : 'Receiving…'}</p>}
        </section>
        <aside className="tech-panel traffic-method">
          <FiShield aria-hidden="true" />
          <p>One count per browser per UTC day. Returning browsers count again on another day. Privacy opt-outs are excluded.</p>
          <p>These are approximate counts, not unique people. Only the latest 90 days are retained.</p>
          <button type="button" className="button-secondary" aria-pressed={excluded} disabled={privacyExcluded} onClick={() => {
            setVisitorSignalPaused(!paused); setPaused(!paused);
          }}>{excluded ? 'Count this browser' : 'Exclude this browser'}</button>
          {excluded && <span className="traffic-excluded" role="status">This browser is excluded.</span>}
          <Link to="/privacy" className="link-arrow">Privacy details</Link>
        </aside>
      </div>
      <p className="traffic-updated"><span>Last updated</span> {updated ? new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' }).format(updated) : '—'} · UTC</p>
    </section>
  );
};

export default Visitors;
