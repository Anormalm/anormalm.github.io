import { FiArrowUpRight, FiShield } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';

const Privacy = () => {
  const { isChinese } = useLanguage();
  return (
  <div className="min-h-screen bg-grid">
    <section className="section privacy-page">
      <header className="page-hero-panel tech-panel rounded-3xl p-7 md:p-9" data-page="PRIVACY">
        <div>
          <div className="eyebrow">{isChinese ? '简明隐私说明' : 'Plain-language privacy'}</div>
          <h1 className="font-display mt-3 text-4xl md:text-5xl">{isChinese ? '不在背后猜测你。' : 'No invisible guessing.'}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--muted)] md:text-base">
            {isChinese ? '可选的地理信号只会在你主动点击后运行。最后更新：2026 年 9 月 4 日。' : 'The optional Geo Signal only runs after you ask it to. Last updated 4 September 2026.'}
          </p>
        </div>
      </header>

      <div className="privacy-grid">
        <article className="tech-panel privacy-card">
          <span>01</span>
          <h2>{isChinese ? '本网站' : 'This website'}</h2>
          <p>
            {isChinese
              ? '本站不使用自定义分析、广告追踪器或追踪 Cookie。主题和语言偏好仅保存在你的浏览器中。与其他托管页面一样，GitHub Pages 会接收提供页面所需的网络请求。'
              : 'No custom analytics, advertising trackers, or tracking cookies are used. Theme and language preferences are stored only in your browser. Like any hosted page, GitHub Pages receives the network request needed to serve the site.'}
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
              ? '查询完全可选，并且绝不会自动开始。忽略按钮即可退出，也可以清除已显示的结果。IP 定位只是估算，在使用 VPN、移动网络或共享连接时尤其可能出错。'
              : 'The lookup is optional and never starts automatically. Ignore the button to opt out, or clear the displayed result. IP geolocation is approximate and can be wrong, especially with VPNs, mobile networks, or shared connections.'}
          </p>
          <a href="mailto:anormalm@outlook.com">{isChinese ? '隐私问题' : 'Privacy question'} <FiArrowUpRight /></a>
        </article>
      </div>

      <div className="privacy-footnote"><FiShield /> {isChinese ? '遵循数据最小化原则。本说明不构成法律意见。' : 'Designed for data minimisation. This notice is not legal advice.'}</div>
    </section>
  </div>
  );
};

export default Privacy;
