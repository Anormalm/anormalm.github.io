import { useEffect, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiRefreshCw } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import VisitorArchive from '../components/VisitorArchive';

const LOG_BANK = [
  'NODE/01 handshake accepted',
  'NODE/02 latent route discovered',
  'NODE/03 graph memory coherent',
  'NODE/04 noise floor listening',
  'NODE/05 strange loop stabilized',
  'NODE/06 visitor signature unknown',
  'NODE/07 ghost channel available',
  'NODE/08 curiosity threshold exceeded',
];

const LOG_BANK_ZH = [
  '节点/01 握手成功',
  '节点/02 发现潜在路径',
  '节点/03 图记忆状态一致',
  '节点/04 正在监听噪声底',
  '节点/05 奇异循环已稳定',
  '节点/06 访客特征未知',
  '节点/07 幽灵频道可用',
  '节点/08 好奇心阈值已突破',
];

const Node = () => {
  const { isChinese } = useLanguage();
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key.toLowerCase() === 'n') setPulse((previous) => previous + 1);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const logBank = isChinese ? LOG_BANK_ZH : LOG_BANK;
  const logs = Array.from({ length: 4 }, (_, index) => logBank[(index + pulse) % logBank.length]);

  return (
    <div className="node-page">
      <div className="node-grid" aria-hidden="true" />
      <section className="section node-stage">
        <Motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="node-visual"
          aria-hidden="true"
        >
          <span className="node-ring node-ring-one"><i /></span>
          <span className="node-ring node-ring-two"><i /></span>
          <span className="node-ring node-ring-three"><i /></span>
          <strong>{String(pulse + 1).padStart(2, '0')}</strong>
        </Motion.div>

        <div className="node-console">
          <div className="eyebrow">{isChinese ? '隐藏路径 / 访问已授权' : 'Hidden route / access granted'}</div>
          <h1>{isChinese ? <>你找到了<br /><span>隐藏节点。</span></> : <>YOU FOUND<br /><span>THE NODE.</span></>}</h1>
          <p>
            {isChinese
              ? '这是刻意藏在明显链接之间的私有诊断频道。网站的古怪表现完全符合设计。'
              : 'A private diagnostics channel left intentionally between the obvious links. The website is behaving strangely—as designed.'}
          </p>

          <div className="node-logs">
            {logs.map((line, index) => (
              <Motion.div
                key={`${pulse}-${line}`}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>{line}
              </Motion.div>
            ))}
          </div>

          <div className="node-actions">
            <button type="button" onClick={() => setPulse((previous) => previous + 1)} className="button-primary">
              {isChinese ? '脉冲节点' : 'Pulse node'} <FiRefreshCw />
            </button>
            <Link to="/" className="button-secondary"><FiArrowLeft /> {isChinese ? '返回首页' : 'Return home'}</Link>
          </div>
          <div className="node-hint">{isChinese ? '键盘快捷键：按 N 旋转信号。' : 'Keyboard shortcut: press N to rotate the signal.'}</div>
        </div>
      </section>
      <div className="section node-archive-section">
        <VisitorArchive />
      </div>
    </div>
  );
};

export default Node;
