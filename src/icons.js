// NachGerms — icons.js

// ─── HELPERS GENERALES ───────────────────────────────────────────────────────

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
  var w = img.offsetWidth || 30;
  var h = img.offsetHeight || 26;
  var svg = _makeSvg(svgId, viewBox, w, h, paths);
  img.parentNode.replaceChild(svg, img);
  return svg;
}

function _updateColor(id, color) {
  var el = document.getElementById(id);
  if (el) el.style.fill = color;
}

// ─── SHOP ICON ───────────────────────────────────────────────────────────────

function injectShopIcon(ui) {
  var svg = _replaceImg('loginShop', 'shop.png', 'ge-shop-svg', '0 0 24 24',
    '<path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2z"/>' +
    '<path d="M1 2v2h2l3.6 7.59L5.25 14c-.16.28-.25.61-.25.96C5 16.1 5.9 17 7 17h13v-2H7.42' +
    'c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63H18c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0' +
    ' 22.46 4H5.21l-.94-2H1z"/>' +
    '<path d="M17 18c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2z"/>'
  );
  if (svg) svg.style.fill = ui;
}

// ─── GIFT ICON ───────────────────────────────────────────────────────────────

// Detecta si el timer está activo (muestra HH:MM:SS en lugar de "Free Gift!")
function _isGiftTimerActive() {
  var timerEl = document.getElementById('giftTimer');
  if (!timerEl) return false;
  return /\d{1,2}:\d{2}:\d{2}/.test((timerEl.textContent || timerEl.innerText || '').trim());
}

// ── Estado CERRADO — "Free Gift!" ──────────────────────────────────────────
function _giftClosedContent(ui) {
  var g   = 0.65;
  var lx  = 12 - g, rx = 12 + g;
  var gy1 = 12 - g, gy2 = 12 + g;
  var f   = ' fill="' + ui + '" stroke="none"';
  var bs  = ' stroke="' + ui + '" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"';
  return (
    '<rect'  + f  + ' x="3" y="9" width="18" height="' + (gy1 - 9) + '" rx="1"/>' +
    '<rect'  + f  + ' x="3" y="' + gy2 + '" width="18" height="' + (12 - gy2) + '"/>' +
    '<path'  + f  + ' d="M4 '  + gy2 + ' L' + lx + ' ' + gy2 + ' L' + lx + ' 21 L5 21 Q4 21 4 20 Z"/>' +
    '<path'  + f  + ' d="M'  + rx + ' ' + gy2 + ' L20 ' + gy2 + ' L20 20 Q20 21 19 21 L' + rx + ' 21 Z"/>' +
    '<path'  + bs + ' d="M12 9 C12 9 8.5 4 7 5.5 C5.5 7 8.5 9 12 9"/>' +
    '<path'  + bs + ' d="M12 9 C12 9 15.5 4 17 5.5 C18.5 7 15.5 9 12 9"/>'
  );
}

// ── Estado ABIERTO — timer/countdown activo ────────────────────────────────
function _giftOpenContent(ui) {
  var f  = ' fill="' + ui + '" stroke="none"';
  var sw = ' stroke="' + ui + '" fill="none" stroke-linecap="round"';
  return (
    // tira horizontal (reemplaza la tapa), sobresale 0.8px a cada lado
    '<rect' + f + ' x="3.2" y="11" width="17.6" height="1.5" rx="0.5"/>' +

    // cuerpo izq
    '<path' + f + ' d="M4 12.65 L11.35 12.65 L11.35 21 L5 21 Q4 21 4 20 Z"/>' +
    // cuerpo der
    '<path' + f + ' d="M12.65 12.65 L20 12.65 L20 20 Q20 21 19 21 L12.65 21 Z"/>' +

    // decorativos — figuras
    '<path' + f + ' d="M11 7.5 L12 6 L13 7.5 L12 9 Z"/>' +                      // diamante
    '<circle' + f + ' cx="6"    cy="8"   r="1"/>' +                              // círculo izq grande
    '<circle' + f + ' cx="17.5" cy="7"   r="0.75"/>' +                           // círculo der mediano
    '<circle' + f + ' cx="12"   cy="3.5" r="0.6"/>' +                            // círculo centro-arr
    '<circle' + f + ' cx="8.5"  cy="4"   r="0.5"/>' +                            // círculo izq-arr
    '<circle' + f + ' cx="15.5" cy="4.5" r="0.4"/>' +                            // punto der-arr
    '<path'  + f + ' d="M3.5 5.5 L4.5 4.5 L5.5 5.5 L4.5 6.5 Z"/>' +            // cuadrito rotado

    // decorativos — onduladas (distintos tamaños, posiciones y grosores)
    '<path' + sw + ' stroke-width="0.5"  d="M7 10.5 C5.5 9.5 7.5 8.2 6 7 C4.8 6 6.5 5 6 4"/>' +
    '<path' + sw + ' stroke-width="0.4"  d="M10.5 5 C11.2 4.3 10.5 3.5 11.5 3"/>' +
    '<path' + sw + ' stroke-width="0.55" d="M16 10 C18 9 15.5 7.8 17.5 7 C19 6.4 17 5.5 18 4.5"/>'
  );
}

// Inyecta o actualiza el SVG del regalo según el estado actual del timer
function injectGiftIcon(ui) {
  var content = _isGiftTimerActive() ? _giftOpenContent(ui) : _giftClosedContent(ui);
  var existing = document.getElementById('ge-gift-svg');
  if (existing) { existing.innerHTML = content; return existing; }
  var container = document.getElementById('loginGift');
  if (!container) return null;
  var img = container.querySelector('img.nodrag');
  if (!img) return null;
  var w = img.offsetWidth  || 26;
  var h = img.offsetHeight || 26;
  var svg = _makeSvg('ge-gift-svg', '0 0 24 24', w, h, content);
  img.parentNode.replaceChild(svg, img);
  return svg;
}

// Observer: detecta cuando #giftTimer cambia entre "Free Gift!" y HH:MM:SS
function _setupGiftTimerObserver() {
  var _lastActive = null;

  function _checkState() {
    var active = _isGiftTimerActive();
    if (active === _lastActive) return;
    _lastActive = active;
    var ui = typeof colorUI !== 'undefined' ? colorUI : '#00eeff';
    injectGiftIcon(ui);
  }

  function _attachObserver() {
    var timerEl = document.getElementById('giftTimer');
    if (!timerEl) return false;
    new MutationObserver(_checkState)
      .observe(timerEl, { childList: true, characterData: true, subtree: true });
    _checkState();
    return true;
  }

  if (!_attachObserver()) {
    var waitObs = new MutationObserver(function () {
      if (_attachObserver()) waitObs.disconnect();
    });
    if (document.body) {
      waitObs.observe(document.body, { childList: true, subtree: true });
    } else {
      document.addEventListener('DOMContentLoaded', function () {
        waitObs.observe(document.body, { childList: true, subtree: true });
      });
    }
  }
}

// ─── PLUS ICON ───────────────────────────────────────────────────────────────

function _plusContent(ui, maskId) {
  var SX = 3, SY = 3, SW = 18, SH = 18;
  var CX = 12, CY = 12;
  var rx = 2.5, ps = 4, g = 1;
  return (
    '<defs>' +
      '<mask id="' + maskId + '">' +
        '<rect x="0" y="0" width="24" height="24" fill="white"/>' +
        '<rect x="' + (CX-g) + '" y="' + (CY-ps) + '" width="' + (g*2) + '" height="' + (ps*2) + '" fill="black"/>' +
        '<rect x="' + (CX-ps) + '" y="' + (CY-g) + '" width="' + (ps*2) + '" height="' + (g*2) + '" fill="black"/>' +
      '</mask>' +
    '</defs>' +
    '<rect fill="' + ui + '" stroke="none"' +
      ' x="' + SX + '" y="' + SY + '" width="' + SW + '" height="' + SH + '"' +
      ' rx="' + rx + '" mask="url(#' + maskId + ')"/>'
  );
}

function injectPlusIcons(ui) {
  var idx = 0;

  var existingSvgs = document.querySelectorAll('svg.ge-plus-svg');
  for (var e = 0; e < existingSvgs.length; e++) {
    existingSvgs[e].innerHTML = _plusContent(ui, 'plus-mask-' + e);
    idx = e + 1;
  }

  var targets = document.querySelectorAll('i.fa-plus');
  for (var i = 0; i < targets.length; i++) {
    var iEl = targets[i];
    var aEl = iEl.parentNode;
    if (!aEl) continue;

    var maskId = 'plus-mask-' + (idx++);
    var sz = 20;

    aEl.setAttribute('style',
      'display:inline-flex !important;align-items:center !important;justify-content:center !important;' +
      'background:none !important;border:none !important;border-radius:0 !important;' +
      'box-shadow:none !important;outline:none !important;padding:0 !important;margin:0 !important;' +
      'width:20px !important;height:20px !important;min-width:0 !important;min-height:0 !important;' +
      'vertical-align:middle !important;cursor:pointer !important;line-height:1 !important;margin-top:7px !important;'
    );

    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'ge-plus-svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', sz);
    svg.setAttribute('height', sz);
    svg.style.display       = 'inline-block';
    svg.style.verticalAlign = 'middle';
    svg.innerHTML = _plusContent(ui, maskId);
    aEl.replaceChild(svg, iEl);
  }
}

// ─── CROWN / LEADERBOARD ICON ────────────────────────────────────────────────

function _crownContent(ui) {
  return (
    '<path d="M1.5 17.5 C1.8 14,3.6 10,3.8 9.5 C4.0 10,5.8 15,8.5 15' +
    ' C10.5 15,11.8 4.5,12 3.5 C12.2 4.5,13.5 15,15.5 15' +
    ' C18.2 15,20.0 10,20.2 9.5 C20.4 10,22.2 14,22.5 17.5' +
    ' L22 19 Q12 17.5 2 19 Z" fill="' + ui + '" stroke="none"/>' +
    '<path d="M3 21.5 Q12 20 21 21.5" fill="none" stroke="' + ui + '" stroke-width="1.2" stroke-linecap="round"/>' +
    '<circle cx="3.8"  cy="9.5" r="1.25" fill="' + ui + '"/>' +
    '<circle cx="12"   cy="3.5" r="1.25" fill="' + ui + '"/>' +
    '<circle cx="20.2" cy="9.5" r="1.25" fill="' + ui + '"/>'
  );
}

function injectLeaderboardIcon(ui) {
  var existing = document.getElementById('ge-leaderboard-svg');
  if (existing) { existing.innerHTML = _crownContent(ui); return existing; }
  var container = document.getElementById('loginLeaderboard');
  if (!container) return null;
  var img = container.querySelector('img.nodrag');
  if (!img) return null;
  var w = img.offsetWidth  || 26;
  var h = img.offsetHeight || 26;
  var svg = _makeSvg('ge-leaderboard-svg', '0 0 24 24', w, h, _crownContent(ui));
  img.parentNode.replaceChild(svg, img);
  return svg;
}

// ─── SOCIAL ICONS ─────────────────────────────────────────────────────────────

var _SI_DISCORD = [
  'M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864',
  '-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079',
  '-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099',
  ' 18.057.1 18.082.114 18.105.133 18.12a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084',
  '-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1',
  '-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077',
  '-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292',
  'a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36',
  '.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03',
  '.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z',
  'M8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0',
  ' 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418z',
  'M15.995 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21',
  ' 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z'
].join('');

function _discordMarkup(fill, bg) { return '<path fill="' + fill + '" d="' + _SI_DISCORD + '"/>'; }

var _SI_YOUTUBE = [
  'M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507 0',
  '-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247',
  ' 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0',
  ' 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247',
  ' 0 0 0-.5-5.805z',
  'M9.609 15.601V8.408l6.264 3.602z'
].join('');

function _youtubeMarkup(fill, bg) {
  return '<g transform="translate(12,12) scale(1.4143) translate(-12,-12)"><path fill="' + fill + '" d="' + _SI_YOUTUBE + '"/></g>';
}

function _redditMarkup(fill, bg) {
  return (
    '<circle cx="3.5"  cy="12" r="2.8" fill="' + fill + '"/>' +
    '<circle cx="20.5" cy="12" r="2.8" fill="' + fill + '"/>' +
    '<ellipse cx="12" cy="15" rx="9" ry="8" fill="' + fill + '"/>' +
    '<rect x="11.2" y="4.5" width="1.6" height="3.2" rx="0.8" fill="' + fill + '"/>' +
    '<circle cx="12" cy="3"  r="2.5" fill="' + fill + '"/>' +
    '<circle cx="9"  cy="14" r="2"   fill="' + bg + '"/>' +
    '<circle cx="15" cy="14" r="2"   fill="' + bg + '"/>' +
    '<path d="M9 18.5q3 3.5 6 0" stroke="' + bg + '" stroke-width="1.8" fill="none" stroke-linecap="round"/>'
  );
}

function _facebookMarkup(fill, bg) {
  return '<path fill="' + fill + '" d="M17 2h-3a5 5 0 0 0-5 5v3H6v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>';
}

function _socialContent(svgId, markup, rectFill, symScale) {
  var clipId = 'nc-clip-' + svgId;
  var inner  = (symScale && symScale !== 1)
    ? '<g transform="translate(12,12) scale(' + symScale + ') translate(-12,-12)">' + markup + '</g>'
    : markup;
  return (
    '<defs><clipPath id="' + clipId + '"><rect width="24" height="24" rx="5.5"/></clipPath></defs>' +
    '<rect width="24" height="24" rx="5.5" fill="' + rectFill + '"/>' +
    '<g clip-path="url(#' + clipId + ')">' + inner + '</g>'
  );
}

function _injectSocialIcon(srcFragment, svgId, markupFn, ui, bg, invert, symScale) {
  var rectFill = invert ? bg : ui;
  var pathFill = invert ? ui : bg;
  var content  = _socialContent(svgId, markupFn(pathFill, rectFill), rectFill, symScale);
  var existing = document.getElementById(svgId);
  if (existing) { existing.innerHTML = content; return existing; }
  var container = document.getElementById('socialIcons');
  if (!container) return null;
  var imgs = container.querySelectorAll('img.social-icon');
  var img  = null;
  for (var i = 0; i < imgs.length; i++) {
    if ((imgs[i].src || '').indexOf(srcFragment) !== -1) { img = imgs[i]; break; }
  }
  if (!img) return null;
  var r = img.getBoundingClientRect();
  var w = (r.width  > 0 ? r.width  : img.offsetWidth)  || 32;
  var h = (r.height > 0 ? r.height : img.offsetHeight) || 32;
  var svg = _makeSvg(svgId, '0 0 24 24', w, h, content);
  var cls = img.getAttribute('class');
  if (cls) svg.setAttribute('class', cls);
  svg.style.verticalAlign = 'middle';
  img.parentNode.replaceChild(svg, img);
  return svg;
}

function injectSocialIcons(ui, bg) {
  _injectSocialIcon('discord',  'ge-discord-svg',  _discordMarkup,  ui, bg, false, 0.72);
  _injectSocialIcon('youtube',  'ge-youtube-svg',  _youtubeMarkup,  ui, bg, true,  null);
  _injectSocialIcon('reddit',   'ge-reddit-svg',   _redditMarkup,   ui, bg, false, 0.72);
  _injectSocialIcon('facebook', 'ge-facebook-svg', _facebookMarkup, ui, bg, false, 0.75);
}

// ─── UPDATE ALL ──────────────────────────────────────────────────────────────

function nachIconsUpdate(ui, bg) {
  var bgColor = bg || (typeof colorFondo !== 'undefined' ? colorFondo : '#111111');
  _updateColor('ge-shop-svg', ui);
  injectGiftIcon(ui);
  injectPlusIcons(ui);
  injectLeaderboardIcon(ui);
  injectSocialIcons(ui, bgColor);
}

function _injectAll(ui, bg) {
  var bgColor = bg || (typeof colorFondo !== 'undefined' ? colorFondo : '#111111');
  injectShopIcon(ui);
  injectGiftIcon(ui);
  injectPlusIcons(ui);
  injectLeaderboardIcon(ui);
  injectSocialIcons(ui, bgColor);
}

// ─── INIT ────────────────────────────────────────────────────────────────────

function _initFromStorage() {
  chrome.storage.local.get(['colorUI', 'colorFondo'], function(stored) {
    var ui = stored.colorUI    || (typeof colorUI    !== 'undefined' ? colorUI    : '#00ccff');
    var bg = stored.colorFondo || (typeof colorFondo !== 'undefined' ? colorFondo : '#111111');
    _injectAll(ui, bg);
  });
}

// ─── MUTATION OBSERVER ───────────────────────────────────────────────────────

function _setupReinjectObserver() {
  var _lastFired = 0;
  var _COOLDOWN  = 600;
  var observer   = new MutationObserver(function() {
    var now = Date.now();
    if (now - _lastFired < _COOLDOWN) return;
    var hasContainers =
      document.getElementById('loginGift')        ||
      document.getElementById('loginShop')        ||
      document.getElementById('loginLeaderboard') ||
      document.getElementById('loginCoins')       ||
      document.getElementById('socialIcons');
    var hasSvgs =
      document.getElementById('ge-gift-svg') &&
      document.getElementById('ge-shop-svg') &&
      document.querySelector('svg.ge-plus-svg');
    var unreplacedPlus = document.querySelector('i.fa-plus');
    if (hasContainers && (!hasSvgs || unreplacedPlus)) {
      _lastFired = now;
      _initFromStorage();
      setTimeout(_initFromStorage, 250);
      setTimeout(_initFromStorage, 600);
    }
  });
  function _startObserver() { observer.observe(document.body, { childList: true, subtree: true }); }
  if (document.body) { _startObserver(); }
  else { document.addEventListener('DOMContentLoaded', _startObserver); }
}

[300, 600, 1000, 1500, 2500, 4000].forEach(function(ms) { setTimeout(_initFromStorage, ms); });
_setupReinjectObserver();
_setupGiftTimerObserver();

chrome.storage.onChanged.addListener(function(changes, area) {
  if (area !== 'local') return;
  if (!changes.colorUI && !changes.colorFondo) return;
  var ui = changes.colorUI    ? changes.colorUI.newValue    : (typeof colorUI    !== 'undefined' ? colorUI    : '#ffffff');
  var bg = changes.colorFondo ? changes.colorFondo.newValue : (typeof colorFondo !== 'undefined' ? colorFondo : '#111111');
  nachIconsUpdate(ui, bg);
  _injectAll(ui, bg);
});

chrome.runtime.onMessage.addListener(function(msg) {
  if (!msg || msg.type !== 'NACH_LIVE') return;
  var ui = msg.data.colorUI    || (typeof colorUI    !== 'undefined' ? colorUI    : '#ffffff');
  var bg = msg.data.colorFondo || (typeof colorFondo !== 'undefined' ? colorFondo : '#111111');
  nachIconsUpdate(ui, bg);
});
