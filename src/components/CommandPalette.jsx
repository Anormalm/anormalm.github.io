import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiCommand, FiCornerDownLeft, FiSearch, FiX } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';

const NAV_COMMANDS = [
  ['Home', '首页', '/', 'home start'],
  ['Projects', '项目', '/projects', 'work projects research'],
  ['Writing', '文章', '/writings', 'essays medium writing'],
  ['Lab', '实验室', '/lab', 'lab physics canvas'],
  ['CV', '履历', '/cv', 'resume cv experience'],
  ['Contact', '联系', '/contact', 'email contact'],
  ['Hidden node', '隐藏节点', '/node', 'secret node ghost'],
];

const CommandPalette = ({ onToggleGlitch }) => {
  const navigate = useNavigate();
  const { isChinese, toggleLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);

  const commands = useMemo(() => [
    ...NAV_COMMANDS.map(([label, labelZh, path, keywords]) => ({
      id: path,
      label: isChinese ? labelZh : label,
      meta: isChinese ? '前往页面' : 'Go to page',
      keywords,
      run: () => navigate(path),
    })),
    {
      id: 'ghost',
      label: isChinese ? '唤醒幽灵信号' : 'Wake the ghost signal',
      meta: isChinese ? '首页彩蛋' : 'Home easter egg',
      keywords: 'ghost home signal',
      run: () => {
        sessionStorage.setItem('anormalm-ghost-on-arrival', '1');
        navigate('/');
        window.dispatchEvent(new Event('anormalm:ghost'));
      },
    },
    {
      id: 'chaos',
      label: isChinese ? '随机化实验室' : 'Randomize the Lab',
      meta: isChinese ? '混沌种子' : 'Chaos seed',
      keywords: 'chaos random lab experiment',
      run: () => {
        sessionStorage.setItem('anormalm-chaos-on-arrival', '1');
        navigate('/lab');
        window.dispatchEvent(new Event('anormalm:chaos'));
      },
    },
    {
      id: 'ravel',
      label: isChinese ? '定位当前配乐' : 'Find the current soundtrack',
      meta: 'Ravel / Gaspard de la Nuit',
      keywords: 'ravel music soundtrack gaspard',
      run: () => {
        navigate('/');
        window.setTimeout(() => document.getElementById('now-playing')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 700);
      },
    },
    {
      id: 'glitch',
      label: isChinese ? '切换故障模式' : 'Toggle glitch mode',
      meta: 'CTRL + SHIFT + G',
      keywords: 'glitch visual easter egg',
      run: onToggleGlitch,
    },
    {
      id: 'language',
      label: isChinese ? 'Switch to English' : '切换至中文',
      meta: isChinese ? '语言' : 'Language',
      keywords: 'language english chinese 中文',
      run: toggleLanguage,
    },
  ], [isChinese, navigate, onToggleGlitch, toggleLanguage]);

  const visibleCommands = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return commands;
    return commands.filter((command) => `${command.label} ${command.meta} ${command.keywords}`.toLowerCase().includes(normalized));
  }, [commands, query]);

  useEffect(() => {
    const onKeyDown = (event) => {
      const target = event.target;
      const isTyping = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target?.isContentEditable;
      const isShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
      const isSlash = event.key === '/' && !isTyping && !event.metaKey && !event.ctrlKey && !event.altKey;

      if (isShortcut || isSlash) {
        event.preventDefault();
        setOpen((current) => !current);
      } else if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    const onOpen = () => setOpen(true);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('anormalm:palette', onOpen);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('anormalm:palette', onOpen);
    };
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    setQuery('');
    setActiveIndex(0);
    const frame = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => setActiveIndex(0), [query]);

  const execute = (command) => {
    if (!command) return;
    command.run();
    setOpen(false);
  };

  const onInputKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % Math.max(visibleCommands.length, 1));
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + Math.max(visibleCommands.length, 1)) % Math.max(visibleCommands.length, 1));
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      execute(visibleCommands[activeIndex]);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <Motion.div
          className="command-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <Motion.section
            role="dialog"
            aria-modal="true"
            aria-label={isChinese ? '命令面板' : 'Command palette'}
            className="command-palette"
            initial={{ opacity: 0, y: -18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="command-header">
              <FiCommand aria-hidden="true" />
              <span>ANORMALM / COMMAND</span>
              <button type="button" onClick={() => setOpen(false)} aria-label={isChinese ? '关闭命令面板' : 'Close command palette'}><FiX /></button>
            </div>
            <label className="command-search">
              <FiSearch aria-hidden="true" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder={isChinese ? '输入命令…' : 'Type a command…'}
                aria-label={isChinese ? '搜索命令' : 'Search commands'}
              />
              <kbd>ESC</kbd>
            </label>
            <div className="command-list" role="listbox">
              {visibleCommands.map((command, index) => (
                <button
                  key={command.id}
                  type="button"
                  role="option"
                  aria-selected={index === activeIndex}
                  className={index === activeIndex ? 'is-active' : ''}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => execute(command)}
                >
                  <span><strong>{command.label}</strong><small>{command.meta}</small></span>
                  {index === activeIndex ? <FiCornerDownLeft /> : <FiArrowRight />}
                </button>
              ))}
              {!visibleCommands.length && <p>{isChinese ? '没有匹配的信号。' : 'No matching signal.'}</p>}
            </div>
            <div className="command-footer"><span>↑↓ {isChinese ? '选择' : 'select'}</span><span>↵ {isChinese ? '打开' : 'open'}</span><span>/ {isChinese ? '再次唤醒' : 'to wake'}</span></div>
          </Motion.section>
        </Motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
