import { useState } from 'react';
import { FiArrowUpRight, FiShield } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import { isVisitorSignalPaused, setVisitorSignalPaused } from '../lib/visitorSignals';

const Privacy = () => {
  const { isChinese } = useLanguage();
  const [signalsPaused, setSignalsPaused] = useState(isVisitorSignalPaused);

  const toggleSignals = () => {
    const nextValue = !signalsPaused;
    setVisitorSignalPaused(nextValue);
    setSignalsPaused(nextValue);
  };
  return (
  <div className="min-h-screen bg-grid">
    <section className="section privacy-page">
      <header className="page-hero-panel tech-panel rounded-3xl p-7 md:p-9" data-page="PRIVACY">
        <div>
          <div className="eyebrow">{isChinese ? '简明隐私说明' : 'Plain-language privacy'}</div>
          <h1 className="font-display mt-3 text-4xl md:text-5xl">{isChinese ? '小信号，不是人物档案。' : 'Small signal. No dossier.'}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--muted)] md:text-base">
            {isChinese ? '匿名访问信号保持宽泛、短期且可关闭。最后更新：2026 年 9 月 7 日。' : 'Anonymous visit signals stay broad, short-lived, and optional. Last updated 7 September 2026.'}
          </p>
        </div>
      </header>

      <div className="privacy-grid">
        <article className="tech-panel privacy-card">
          <span>01</span>
          <h2>{isChinese ? '匿名档案' : 'Anonymous archive'}</h2>
          <p>
            {isChinese
              ? '除非你启用了全局隐私控制、请勿追踪或下方的暂停选项，否则每个浏览器每天最多发送一个匿名信号。只保存 UTC 日期、两位国家代码、约 30° 的宽泛地图区域和计数，保存 90 天。不会保存原始 IP、姓名、精确位置、页面历史、广告 Cookie 或设备指纹。'
              : 'Unless Global Privacy Control, Do Not Track, or the pause option below is enabled, each browser sends at most one anonymous signal per day. Only the UTC day, two-letter country code, broad 30° map region, and count are kept for 90 days. No raw IP, name, precise location, page history, advertising cookie, or device fingerprint is stored.'}
          </p>
          <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noreferrer">
            {isChinese ? 'GitHub 隐私声明' : 'GitHub privacy statement'} <FiArrowUpRight />
          </a>
        </article>

        <article className="tech-panel privacy-card">
          <span>02</span>
          <h2>Geo Signal</h2>
          <p>
            {isChinese
              ? '如果你点击“显示我的地理信号”，浏览器会直接向 WhatIsMyIP 发送一次请求。该服务使用你的公网 IP 估算城市、地区、国家、坐标和时区。本站不会显示或保存 IP；地图只展示大致范围，结果也只存在于当前页面的内存中。'
              : 'If you click “Reveal my geo signal,” your browser sends one request directly to WhatIsMyIP. The service uses your public IP to estimate a city, region, country, coordinates, and timezone. The IP is discarded and never displayed or stored by this website. The map shows the result as an approximate area rather than an exact pin, and it exists only in the current page memory.'}
          </p>
          <a href="https://whatismyip.codes/privacy/" target="_blank" rel="noreferrer">
            {isChinese ? '服务商隐私政策' : 'Provider privacy policy'} <FiArrowUpRight />
          </a>
        </article>

        <article className="tech-panel privacy-card">
          <span>03</span>
          <h2>{isChinese ? '由你选择' : 'Your choice'}</h2>
          <p>
            {isChinese
              ? '你可以在这个浏览器中暂停匿名访问信号。已经汇总的计数无法与你关联，也无法单独删除。实验室里的地理查询依然需要你主动点击，结果只保留在当前页面内存中。'
              : 'You can pause anonymous visit signals in this browser. Past aggregate counts cannot be linked back to you or individually removed. The Lab’s Geo Signal still requires a click and remains only in the current page memory.'}
          </p>
          <button type="button" className="privacy-toggle" onClick={toggleSignals} aria-pressed={signalsPaused}>
            <span aria-hidden="true"><i /></span>
            {signalsPaused ? (isChinese ? '匿名信号已暂停' : 'Anonymous signals paused') : (isChinese ? '暂停匿名信号' : 'Pause anonymous signals')}
          </button>
          <a href="mailto:anormalm@outlook.com">{isChinese ? '隐私问题' : 'Privacy question'} <FiArrowUpRight /></a>
        </article>
      </div>

      <div className="privacy-footnote"><FiShield /> {isChinese ? '遵循数据最小化原则。本说明不构成法律意见。' : 'Designed for data minimisation. This notice is not legal advice.'}</div>
    </section>
  </div>
  );
};

export default Privacy;
