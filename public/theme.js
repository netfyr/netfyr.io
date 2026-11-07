import { mountTheme } from './ui/theme.js';

const root = document.documentElement;

function updateThemeColor() {
  const color = root.dataset.uiMode === 'dark' ? '#211c19' : '#faf8f4';
  document.querySelectorAll('meta[name="theme-color"]').forEach(meta => {
    meta.content = color;
  });
}

root.addEventListener('ui:themechange', event => {
  if (event.target === root) updateThemeColor();
});

mountTheme(root, { storageKey: 'netfyr-theme' });
updateThemeColor();
