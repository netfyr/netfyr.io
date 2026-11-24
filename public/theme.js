import { mountTheme } from './ui/theme.js';

const root = document.documentElement;
const storageKey = 'netfyr-theme';

function updateThemeColor() {
  const color = getComputedStyle(root).getPropertyValue('--background').trim();
  document.querySelectorAll('meta[name="theme-color"]').forEach(meta => {
    meta.content = color;
  });
}

root.addEventListener('ui:themechange', event => {
  if (event.target === root) updateThemeColor();
});

let unmountTheme = mountTheme(root, { storageKey });
updateThemeColor();

window.addEventListener('storage', event => {
  if (event.key !== storageKey && event.key !== null) return;
  if (event.storageArea !== window.localStorage) return;
  unmountTheme();
  unmountTheme = mountTheme(root, { storageKey });
});
