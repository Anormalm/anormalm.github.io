(function applyInitialTheme() {
  try {
    const useDarkMode = window.localStorage.getItem('theme') !== 'light';
    document.documentElement.classList.toggle('dark', useDarkMode);
    document.documentElement.style.colorScheme = useDarkMode ? 'dark' : 'light';
  } catch {
    document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = 'dark';
  }
}());
