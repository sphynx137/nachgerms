// NachGerms — icons.js
// Replaces game images with dynamic SVG icons colored with colorUI.
// Loaded after content.js so colorUI is already defined.

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function _makeSvg(id, viewBox, width, height, paths) {
  var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.id = id;
  svg.setAttribute('viewBox', viewBox);
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);
  svg.style.display = 'inline-block';
  svg.style.verticalAlign = 'middle';
  svg.style.transition = 'fill .15s';
  svg.innerHTML = paths;
  return svg;
}

function _replaceImg(containerId, imgSrc, svgId, viewBox, paths) {
  var existing = document.getElementById(svgId);
  if (existing) return existing;

  var container = document.getElementById(containerId);
  if (!container) return null;
  var img = container.querySelector('img.nodrag');
  if (!img) return null;

  var w = img.offsetWidth  || 30;
  var h = img.offsetHeight || 26;
  var svg = _makeSvg(svgId, viewBox, w, h, paths);
  img.parentNode.replaceChild(svg, img);
  return svg;
}

function _updateColor(id, color) {
  var el = document.getElementById(id);
  if (el) el.style.fill = color;
}

// ─── SHOP ICON (carrito) ─────────────────────────────────────────────────────

function injectShopIcon(ui) {
  var svg = _replaceImg('loginShop', 'shop.png', 'ge-shop-svg', '0 0 24 24',
    '<path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2z"/>' +
    '<path d="M1 2v2h2l3.6 7.59L5.25 14c-.16.28-.25.61-.25.96C5 16.1 5.9 17 7 17h13v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63H18c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 22.46 4H5.21l-.94-2H1z"/>' +
    '<path d="M17 18c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2z"/>'
  );
  if (svg) svg.style.fill = ui;
}

// ─── GIFT ICON ───────────────────────────────────────────────────────────────

function injectGiftIcon(ui) {
  var svg = _replaceImg('loginGift', 'gift.png', 'ge-gift-svg', '0 0 24 24',
    '<path d="M20 6h-2.18c.07-.26.18-.51.18-.8C18 3.88 16.12 2 13.8 2c-1.15 0-2.15.67-2.88 1.39L10 4.41 9.08 3.4C8.35 2.67 7.35 2 6.2 2 3.88 2 2 3.88 2 6.2c0 .29.11.54.18.8H2C.9 7 0 7.9 0 9v2c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2z"/>' +
    '<path d="M11 14H2v7c0 .55.45 1 1 1h8v-8z"/>' +
    '<path d="M13 14v8h8c.55 0 1-.45 1-1v-7h-9z"/>' +
    '<path d="M6.5 7c-.83 0-1.5-.67-1.5-1.5S5.67 4 6.5 4s1.5.67 1.5 1.5S7.33 7 6.5 7zm5-1.41l.88-.88C12.87 4.2 13.45 4 13.8 4c.94 0 1.7.76 1.7 1.7 0 .35-.2.93-.71 1.44L14.5 7.5l-3-1.91z"/>' +
    '<path d="M10.5 7.5L9.21 6.14C8.7 5.63 8.5 5.05 8.5 4.7c0-.94.76-1.7 1.7-1.7.35 0 .93.2 1.44.71l.86.86-2 1.93z"/>'
  );
  if (svg) svg.style.fill = ui;
}

// ─── LEADERBOARD / RANKINGS ICON (corona) ────────────────────────────────────

function injectLeaderboardIcon(ui) {
  var svg = _replaceImg('loginLeaderboard', 'leaderboard.png', 'ge-leaderboard-svg', '0 0 24 24',
    '<path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/>'
  );
  if (svg) svg.style.fill = ui;
}

// ─── UPDATE ALL ──────────────────────────────────────────────────────────────

function nachIconsUpdate(ui) {
  _updateColor('ge-shop-svg', ui);
  _updateColor('ge-gift-svg', ui);
  _updateColor('ge-leaderboard-svg', ui);
}

// ─── INIT ────────────────────────────────────────────────────────────────────

function _injectAll(ui) {
  injectShopIcon(ui);
  injectGiftIcon(ui);
  injectLeaderboardIcon(ui);
}

[300, 800, 1500, 3000].forEach(function(ms) {
  setTimeout(function() { _injectAll(colorUI); }, ms);
});

// React to color changes — update fill instantly without re-injecting
chrome.storage.onChanged.addListener(function(changes, area) {
  if (area !== 'local' || !changes.colorUI) return;
  var ui = changes.colorUI.newValue;
  nachIconsUpdate(ui);
  // Re-inject in case the DOM was rebuilt
  _injectAll(ui);
});

chrome.runtime.onMessage.addListener(function(msg) {
  if (!msg || msg.type !== 'NACH_LIVE' || !msg.data.colorUI) return;
  nachIconsUpdate(msg.data.colorUI);
});