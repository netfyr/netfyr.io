const status = document.querySelector('#copy-status');
let statusTimer;

function notifyCopy(copied) {
  clearTimeout(statusTimer);
  status.textContent = copied ? 'Code copied' : 'Copy unavailable. Select and copy the code manually.';
  status.hidden = false;
  if (copied) {
    statusTimer = setTimeout(() => { status.hidden = true; }, 3000);
  }
}

function copyWithSelection(text) {
  const activeElement = document.activeElement;
  const field = document.createElement('textarea');
  field.value = text;
  field.readOnly = true;
  field.tabIndex = -1;
  field.style.cssText = 'position:fixed;left:-9999px';
  document.body.append(field);
  try {
    field.select();
    return document.execCommand('copy');
  } catch {
    return false;
  } finally {
    field.remove();
    activeElement?.focus({ preventScroll: true });
  }
}

for (const button of document.querySelectorAll('.copy-code')) {
  button.addEventListener('click', async () => {
    const text = button.closest('.code-block').querySelector('code').textContent;
    let copied;
    try {
      await navigator.clipboard.writeText(text);
      copied = true;
    } catch {
      copied = copyWithSelection(text);
    }
    notifyCopy(copied);
  });
  button.hidden = false;
}

const sidebar = document.querySelector('#guide-sidebar');
const backdrop = document.querySelector('#guide-backdrop');
const openMenu = document.querySelector('#guide-open-menu');
const closeMenu = document.querySelector('#guide-close-menu');
const workspace = document.querySelector('#guide-workspace');
const skipLink = document.querySelector('.skip-link');
const mobile = matchMedia('(max-width: 760px)');
let menuOpen = false;
let previousOverflow;
let lastFocused = document.activeElement;

document.addEventListener('focusin', event => {
  if (event.target !== document.body) lastFocused = event.target;
});

function setMenu(open, restoreFocus = false) {
  const visible = open && mobile.matches;
  if (visible && !menuOpen) previousOverflow = document.body.style.overflow;
  if (visible) document.body.style.overflow = 'hidden';
  else if (menuOpen) document.body.style.overflow = previousOverflow;
  menuOpen = visible;
  sidebar.classList.toggle('is-open', visible);
  backdrop.hidden = !visible;
  openMenu.setAttribute('aria-expanded', String(visible));
  sidebar.inert = mobile.matches && !visible;
  workspace.inert = visible;
  skipLink.inert = visible;
  if (visible) {
    sidebar.setAttribute('role', 'dialog');
    sidebar.setAttribute('aria-modal', 'true');
    closeMenu.focus({ preventScroll: true });
    requestAnimationFrame(() => {
      if (menuOpen && !sidebar.contains(document.activeElement)) closeMenu.focus({ preventScroll: true });
    });
  } else {
    sidebar.removeAttribute('role');
    sidebar.removeAttribute('aria-modal');
    if (restoreFocus && mobile.matches) openMenu.focus({ preventScroll: true });
  }
}

openMenu.addEventListener('click', () => setMenu(true));
closeMenu.addEventListener('click', () => setMenu(false, true));
backdrop.addEventListener('click', () => setMenu(false, true));

sidebar.addEventListener('click', event => {
  const link = event.target.closest?.('a[href]');
  if (!menuOpen || !link || !sidebar.contains(link) || event.defaultPrevented
    || event.button !== 0 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  const local = link.origin === location.origin && link.pathname === location.pathname && link.search === location.search;
  const target = local && link.hash ? document.getElementById(decodeURIComponent(link.hash.slice(1))) : null;
  setMenu(false, !target);
  if (target) {
    if (!target.hasAttribute('tabindex')) target.tabIndex = -1;
    requestAnimationFrame(() => target.focus({ preventScroll: true }));
  }
});

mobile.addEventListener('change', () => {
  const active = document.activeElement === document.body ? lastFocused : document.activeElement;
  const wasInSidebar = sidebar.contains(active);
  setMenu(false);
  if (mobile.matches && wasInSidebar) openMenu.focus({ preventScroll: true });
  else if (!mobile.matches && (active === closeMenu || active === openMenu)) {
    (sidebar.querySelector('nav a[aria-current]') || sidebar.querySelector('a[href]')).focus({ preventScroll: true });
  }
  updateNavigation();
});

document.addEventListener('keydown', event => {
  if (!menuOpen || event.defaultPrevented) return;
  if (event.key === 'Escape') {
    event.preventDefault();
    setMenu(false, true);
    return;
  }
  if (event.key !== 'Tab') return;
  const controls = [...sidebar.querySelectorAll('a[href], button:not(:disabled), [tabindex]:not([tabindex="-1"])')]
    .filter(element => element.tabIndex >= 0 && element.getClientRects().length);
  const first = controls[0];
  const last = controls.at(-1);
  if (!first) return;
  if (event.shiftKey && (document.activeElement === first || !sidebar.contains(document.activeElement))) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && (document.activeElement === last || !sidebar.contains(document.activeElement))) {
    event.preventDefault();
    first.focus();
  }
});

addEventListener('beforeprint', () => setMenu(false, true));

const links = [...sidebar.querySelectorAll('.section-navigation a[href^="#"]')];
const headings = links.map(link => document.getElementById(link.hash.slice(1)));
const breadcrumb = document.querySelector('#guide-current-section');

function updateNavigation() {
  const atBottom = scrollY + innerHeight >= document.documentElement.scrollHeight - 2;
  const current = atBottom ? headings.at(-1)
    : headings.findLast(heading => heading.getBoundingClientRect().top <= 120) || headings[0];
  for (const link of links) {
    if (link.hash === `#${current.id}`) {
      link.setAttribute('aria-current', 'location');
      breadcrumb.textContent = link.textContent.trim();
    } else link.removeAttribute('aria-current');
  }
}

let navigationQueued = false;
function scheduleNavigationUpdate() {
  if (navigationQueued) return;
  navigationQueued = true;
  requestAnimationFrame(() => {
    navigationQueued = false;
    updateNavigation();
  });
}

addEventListener('scroll', scheduleNavigationUpdate, { passive: true });
addEventListener('resize', scheduleNavigationUpdate);

document.body.classList.add('has-guide-navigation');
openMenu.hidden = false;
closeMenu.hidden = false;
setMenu(false);
updateNavigation();
