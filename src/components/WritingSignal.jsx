const hashTitle = (title) => [...title].reduce((hash, character) => (
  ((hash << 5) - hash + character.charCodeAt(0)) | 0
), 17);

const WritingSignal = ({ title }) => {
  const seed = Math.abs(hashTitle(title));
  const points = Array.from({ length: 9 }, (_, index) => {
    const x = 12 + index * 37;
    const wave = Math.sin((seed % 19 + index * 3) * 0.72) * 26;
    const jitter = ((seed >> (index % 8)) % 15) - 7;
    return `${x},${60 + wave + jitter}`;
  }).join(' ');
  const signalId = (seed % 65535).toString(16).toUpperCase().padStart(4, '0');

  return (
    <div className="writing-signal" aria-hidden="true">
      <svg viewBox="0 0 320 120" preserveAspectRatio="none">
        <line x1="0" y1="60" x2="320" y2="60" className="writing-signal-axis" />
        <polyline points={points} className="writing-signal-line writing-signal-line-back" />
        <polyline points={points} className="writing-signal-line writing-signal-line-front" />
        {points.split(' ').filter((_, index) => index % 2 === 0).map((point) => {
          const [cx, cy] = point.split(',');
          return <circle key={point} cx={cx} cy={cy} r="2.5" />;
        })}
      </svg>
      <span>SIGNAL / {signalId}</span>
      <i />
    </div>
  );
};

export default WritingSignal;
