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
            {isChinese ? '匿名访问信号保持宽泛、短期且可关闭。最后更新：2026 年 10 月 30 日。' : 'Anonymous visit signals stay broad, short-lived, and optional. Last updated 30 October 2026.'}
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
              ? '点击“显示所在城市”后，浏览器会向 WhatIsMyIP 发送一次请求，使用公网 IP 估算城市、地区、国家、坐标和时区。地图只在点击后显示大致范围，结果只保留在当前页面的内存中。本站不会显示或保存 IP。另有一项自动语言查询在访问时运行，详见下方说明。'
              : 'Clicking “Reveal your city” sends a request to WhatIsMyIP, which uses the public IP to estimate a city, region, country, coordinates, and timezone. The map only reveals an approximate area after that click, held in page memory. This website never displays or stores the IP. A separate automatic language lookup runs on arrival, as described below.'}
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
              ? '你可以在这个浏览器中暂停匿名访问信号。已经汇总的计数无法与你关联，也无法单独删除。地图上的城市显示仍需主动点击。使用语言菜单手动选择语言后，将优先使用你的选择，不再为了选择语言而查询 IP。'
              : 'You can pause anonymous visit signals in this browser. Past aggregate counts cannot be linked back to you or individually removed. Revealing your city on the map still requires a click. Choosing a language in the menu overrides automatic selection and skips future IP lookups for language selection.'}
          </p>
          <button type="button" className="privacy-toggle" onClick={toggleSignals} aria-pressed={signalsPaused}>
            <span aria-hidden="true"><i /></span>
            {signalsPaused ? (isChinese ? '匿名信号已暂停' : 'Anonymous signals paused') : (isChinese ? '暂停匿名信号' : 'Pause anonymous signals')}
          </button>
          <a href="mailto:anormalm@outlook.com">{isChinese ? '隐私问题' : 'Privacy question'} <FiArrowUpRight /></a>
        </article>
      </div>

      <section className="tech-panel rounded-3xl p-6 mt-6">
        <h2 className="font-display text-xl">{isChinese ? '语言翻译' : 'Language translation'}</h2>
        <p className="mt-3 text-base leading-7 text-[var(--muted)]">{isChinese ? '如果没有已选语言，访问页面时浏览器会自动向 api.country.is 发送请求，用 IP 对应的国家选择初始语言，无需先点击城市显示按钮，也不依据浏览器的语言列表。该请求不查询城市或坐标。本站只在当前浏览器会话中缓存所选语言代码，不保存返回的 IP；手动选择的语言会保存在本地。国家识别可能受 VPN 或网络出口影响，无法确定个人偏好。查询失败时使用英文。' : 'When no language has been chosen, your browser automatically contacts api.country.is on arrival and uses the IP-derived country to select an initial language. This happens before the city-reveal button and does not use your browser’s language list. No city or coordinates are requested. Only the selected language code is cached for the browser session; this website does not retain the returned IP. Manual language choices are saved locally. VPNs and network routing can affect the country estimate, which cannot establish personal preference. A failed lookup falls back to English.'}</p>
        <p className="mt-3 text-base leading-7 text-[var(--muted)]">{isChinese ? '英文和简体中文直接在本站切换。其他语言会自动在当前标签页打开 Google 翻译版本，并向 Google 提供当前公开页面的网址；语言菜单中的翻译链接则在新标签页打开。本站不嵌入翻译跟踪脚本。自动翻译可能有误，且并非所有地区都支持。PDF 保留原文。返回按钮可回到本站，不会立即重复跳转。' : 'English and Simplified Chinese switch directly on this website. Other languages automatically open Google’s translated version in the current tab, sharing the current public page URL with Google; translation links in the language menu open in a new tab. No translation tracking script is embedded here. Automatic translations may contain errors and are not available in all regions. PDFs remain in their original language. Back returns to this site without immediately redirecting again.'}</p>
        <a className="link-arrow mt-4" href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">{isChinese ? 'Google 隐私政策' : 'Google privacy policy'} <FiArrowUpRight /></a>
        <a className="link-arrow mt-4 ml-6" href="https://country.is/" target="_blank" rel="noopener noreferrer">{isChinese ? '国家查询服务与数据说明' : 'Country lookup service & data handling'} <FiArrowUpRight /></a>
      </section>

      <div className="privacy-footnote"><FiShield /> {isChinese ? '遵循数据最小化原则。本说明不构成法律意见。' : 'Designed for data minimisation. This notice is not legal advice.'}</div>
    </section>
  </div>
  );
};

export default Privacy;
