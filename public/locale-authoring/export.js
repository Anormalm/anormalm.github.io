document.getElementById('export-locale').addEventListener('click', () => {
  const locale = new URL(location.href).searchParams.get('_x_tr_tl') || 'en';
  const messages = Object.fromEntries([...document.querySelectorAll('[data-source]')].map((node) => [decodeURIComponent(node.dataset.source), node.textContent.replace(/\s+/g, ' ').trim()]));
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([JSON.stringify(messages, null, 2)], { type: 'application/json' }));
  link.download = `anormalm-locale-${locale}.json`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 2000);
});
