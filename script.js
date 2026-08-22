const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const searchInput = document.querySelector('#route-search');
const clearButton = document.querySelector('#clear-search');
const status = document.querySelector('#result-status');
const emptyState = document.querySelector('#empty-state');
const cards = [...document.querySelectorAll('.airline-card')];

menuButton.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? '关闭导航菜单' : '打开导航菜单');
});
nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

function filterRoutes() {
  const query = searchInput.value.trim().toLowerCase();
  let visibleRoutes = 0;
  cards.forEach((card) => {
    let routesInCard = 0;
    card.querySelectorAll('.route-list button').forEach((route) => {
      const matches = !query || route.textContent.toLowerCase().includes(query) || card.dataset.airline.toLowerCase().includes(query);
      route.hidden = !matches;
      if (matches) routesInCard += 1;
    });
    card.hidden = routesInCard === 0;
    visibleRoutes += routesInCard;
  });
  clearButton.hidden = !query;
  emptyState.hidden = visibleRoutes !== 0;
  status.textContent = query ? `找到 ${visibleRoutes} 条相关航线` : '正在展示全部航线';
}
searchInput.addEventListener('input', filterRoutes);
clearButton.addEventListener('click', () => { searchInput.value = ''; filterRoutes(); searchInput.focus(); });
document.querySelectorAll('.route-list button').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('.route-list button.selected').forEach((item) => item.classList.remove('selected'));
  button.classList.add('selected');
  status.textContent = `已选择：${button.closest('.airline-card').dataset.airline} · ${button.textContent.trim()}`;
}));
const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...nav.querySelectorAll('a')];
const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (entry.isIntersecting) navLinks.forEach((link) => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
}), { rootMargin: '-35% 0px -55% 0px' });
sections.forEach((section) => observer.observe(section));
document.querySelector('#current-year').textContent = new Date().getFullYear();
