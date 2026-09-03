const DEFAULT_ITEMS = ['Graph ML', 'Language Models', 'Edge AI', 'Adaptive Systems', 'Creative Code'];

const Marquee = ({ items = DEFAULT_ITEMS }) => {
  const loop = [...items, ...items];

  return (
    <div className="marquee-shell" aria-label={items.join(', ')}>
      <div className="marquee-track" aria-hidden="true">
        {loop.map((item, index) => (
          <span key={`${item}-${index}`} className="marquee-item">
            {item}<span className="marquee-star">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
