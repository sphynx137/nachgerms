// NachGerms — icons.js
// Reemplaza imágenes del juego con SVGs dinámicos coloreados con colorUI / colorBg.
// Se carga después de content.js, por lo que colorUI y colorBg ya están definidos.

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

function injectGiftIcon(ui) {
  var svg = _replaceImg('loginGift', 'gift.png', 'ge-gift-svg', '0 0 24 24',
    '<path d="M20 6h-2.18c.07-.26.18-.51.18-.8C18 3.88 16.12 2 13.8 2c-1.15 0-2.15.67-2.88' +
    ' 1.39L10 4.41 9.08 3.4C8.35 2.67 7.35 2 6.2 2 3.88 2 2 3.88 2 6.2c0 .29.11.54.18.8H2' +
    'C.9 7 0 7.9 0 9v2c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2z"/>' +
    '<path d="M11 14H2v7c0 .55.45 1 1 1h8v-8z"/>' +
    '<path d="M13 14v8h8c.55 0 1-.45 1-1v-7h-9z"/>'
  );
  if (svg) svg.style.fill = ui;
}

// ─── LEADERBOARD ICON ────────────────────────────────────────────────────────

function injectLeaderboardIcon(ui) {
  var svg = _replaceImg('loginLeaderboard', 'leaderboard.png', 'ge-leaderboard-svg', '0 0 24 24',
    '<path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/>'
  );
  if (svg) svg.style.fill = ui;
}

// ─── SOCIAL ICONS ─────────────────────────────────────────────────────────────
//
//  Cada ícono expone una función markupFn(fill, bg):
//    fill → color del símbolo   (pathFill)
//    bg   → color del fondo / huecos (rectFill)
//
//  ui  = colorUI → fondo del cuadrado  (rectFill si invert=false)
//  bg  = colorBg → símbolo interior    (pathFill si invert=false)

// ── Discord — path Simple Icons (Clyde, sin forma exterior) ──────────────────
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

function _discordMarkup(fill, bg) {
  return '<path fill="' + fill + '" d="' + _SI_DISCORD + '"/>';
}

// ── YouTube — path Simple Icons, escala x√2 integrada en el markup ────────────
// La escala está dentro del markup (no en symScale) para que el play-button
// llene el cuadrado completo. El triángulo CCW crea un hueco que muestra bg.
var _SI_YOUTUBE = [
  'M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507 0',
  '-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247',
  ' 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0',
  ' 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247',
  ' 0 0 0-.5-5.805z',
  'M9.609 15.601V8.408l6.264 3.602z'
].join('');

function _youtubeMarkup(fill, bg) {
  // Escala x√2 desde el centro → el play-button llena el cuadrado.
  // bg coincide con rectFill (invert=true), así los huecos top/bottom son invisibles.
  return (
    '<g transform="translate(12,12) scale(1.4143) translate(-12,-12)">' +
    '<path fill="' + fill + '" d="' + _SI_YOUTUBE + '"/>' +
    '</g>'
  );
}

// ── Reddit — Snoo dibujado como formas positivas (sin círculo exterior) ───────
//  Diseñado en viewBox 0 0 24 24 para llenar bien el espacio antes de symScale.
//  fill = cuerpo del Snoo  |  bg = color de los huecos (ojos, sonrisa)
function _redditMarkup(fill, bg) {
  return (
    // Orejas (detrás de la cabeza para que no sobresalgan demasiado)
    '<circle cx="3.5"  cy="12" r="2.8" fill="' + fill + '"/>' +
    '<circle cx="20.5" cy="12" r="2.8" fill="' + fill + '"/>' +
    // Cabeza (elipse grande)
    '<ellipse cx="12" cy="15" rx="9" ry="8" fill="' + fill + '"/>' +
    // Antena: bola + tallo
    '<rect x="11.2" y="4.5" width="1.6" height="3.2" rx="0.8" fill="' + fill + '"/>' +
    '<circle cx="12" cy="3"  r="2.5"  fill="' + fill + '"/>' +
    // Ojos — huecos que muestran bg
    '<circle cx="9"  cy="14" r="2"   fill="' + bg + '"/>' +
    '<circle cx="15" cy="14" r="2"   fill="' + bg + '"/>' +
    // Sonrisa — hueco con stroke
    '<path d="M9 18.5q3 3.5 6 0" stroke="' + bg + '" stroke-width="1.8"' +
    ' fill="none" stroke-linecap="round"/>'
  );
}

// ── Facebook — solo la "f" (sin círculo exterior), path Font Awesome ──────────
//  viewBox 0 0 24 24; fill = color de la "f"
function _facebookMarkup(fill, bg) {
  return (
    '<path fill="' + fill + '" d="' +
    'M17 2h-3a5 5 0 0 0-5 5v3H6v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' +
    '"/>'
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// _socialContent — construye el innerHTML del SVG.
//
//  markup   → SVG elements ya coloreados (generados por la markupFn)
//  rectFill → color del cuadrado de fondo
//  symScale → escala del dibujo dentro del marco (null = sin escala)
// ─────────────────────────────────────────────────────────────────────────────
function _socialContent(svgId, markup, rectFill, symScale) {
  var clipId = 'nc-clip-' + svgId;
  var inner = (symScale && symScale !== 1)
    ? '<g transform="translate(12,12) scale(' + symScale + ') translate(-12,-12)">' + markup + '</g>'
    : markup;
  return (
    '<defs><clipPath id="' + clipId + '">' +
      '<rect width="24" height="24" rx="5.5"/>' +
    '</clipPath></defs>' +
    '<rect width="24" height="24" rx="5.5" fill="' + rectFill + '"/>' +
    '<g clip-path="url(#' + clipId + ')">' + inner + '</g>'
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// _injectSocialIcon — inyecta o actualiza un ícono social en #socialIcons.
//
//  markupFn(fill, bg) → genera el SVG interior ya con colores aplicados
//  invert             → true: rectFill=bg, pathFill=ui
//  symScale           → escala del dibujo (null = nativo / ya incluida en markup)
// ─────────────────────────────────────────────────────────────────────────────
function _injectSocialIcon(srcFragment, svgId, markupFn, ui, bg, invert, symScale) {
  var rectFill = invert ? bg : ui;
  var pathFill = invert ? ui : bg;
  var markup   = markupFn(pathFill, rectFill);
  var content  = _socialContent(svgId, markup, rectFill, symScale);

  var existing = document.getElementById(svgId);
  if (existing) {
    // Reconstruir el innerHTML para actualizar todos los colores de una vez
    existing.innerHTML = content;
    return existing;
  }

  var container = document.getElementById('socialIcons');
  if (!container) return null;

  var imgs = container.querySelectorAll('img.social-icon');
  var img = null;
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
  //                    src         id                  markupFn         ui  bg  invert  symScale
  _injectSocialIcon('discord',  'ge-discord-svg',  _discordMarkup,  ui, bg, false,  0.72);  // Clyde reducido
  _injectSocialIcon('youtube',  'ge-youtube-svg',  _youtubeMarkup,  ui, bg, true,   null);  // invertido, escala en markup
  _injectSocialIcon('reddit',   'ge-reddit-svg',   _redditMarkup,   ui, bg, false,  0.72);  // Snoo positivo, no invertido
  _injectSocialIcon('facebook', 'ge-facebook-svg', _facebookMarkup, ui, bg, false,  0.75);  // "f" positiva, no invertida
}


// ─── GBUX COIN (res/gbux.png) ─────────────────────────────────────────────────
//  Moneda circular con:
//    • Anillo exterior más oscuro (border)
//    • Cuerpo principal en colorUI
//    • Letra "G" en negro semitransparente (adapta a cualquier colorUI)
//  La imagen original mide 20×20 px renderizados.

function _gbuxContent(ui) {
  return (
    // Capa base completa — será el anillo exterior (más oscuro)
    '<circle cx="12" cy="12" r="12" fill="' + ui + '"/>' +
    '<circle cx="12" cy="12" r="12" fill="#000" fill-opacity="0.28"/>' +
    // Cuerpo interior de la moneda — colorUI sin oscurecer
    '<circle cx="12" cy="12" r="9.8" fill="' + ui + '"/>' +
    // Brillo sutil en la parte superior (efecto moneda 3-D)
    '<ellipse cx="10.5" cy="8.5" rx="4.5" ry="2.8" fill="#fff" fill-opacity="0.13"/>' +
    // Letra "G" centrada — negro semitransparente para que funcione con cualquier color
    '<text x="12" y="16.8" text-anchor="middle"' +
    ' font-family="\'Arial Black\',Impact,sans-serif"' +
    ' font-weight="900" font-size="13.5"' +
    ' fill="#000" fill-opacity="0.30">G</text>'
  );
}

function injectGbuxIcon(ui) {
  // Actualizar SVGs ya inyectados
  var existing = document.querySelectorAll('[id^="ge-gbux-svg"]');
  for (var e = 0; e < existing.length; e++) {
    existing[e].innerHTML = _gbuxContent(ui);
  }
  if (existing.length) return;

  // Reemplazar TODOS los img[src*="gbux"] de la página
  var imgs = document.querySelectorAll('img[src*="gbux"]');
  for (var i = 0; i < imgs.length; i++) {
    var img = imgs[i];
    var r = img.getBoundingClientRect();
    var w = (r.width  > 0 ? r.width  : img.offsetWidth)  || 20;
    var h = (r.height > 0 ? r.height : img.offsetHeight) || 20;
    var svgId = 'ge-gbux-svg-' + i;
    var svg = _makeSvg(svgId, '0 0 24 24', w, h, _gbuxContent(ui));
    var cls = img.getAttribute('class');
    if (cls) svg.setAttribute('class', cls);
    svg.style.verticalAlign = 'middle';
    img.parentNode.replaceChild(svg, img);
  }
}

// ─── UPDATE ALL ──────────────────────────────────────────────────────────────

function nachIconsUpdate(ui, bg) {
  var bgColor = bg || (typeof colorFondo !== 'undefined' ? colorFondo : '#111111');
  _updateColor('ge-shop-svg', ui);
  _updateColor('ge-gift-svg', ui);
  _updateColor('ge-leaderboard-svg', ui);
  injectSocialIcons(ui, bgColor);
  injectGbuxIcon(ui);
}

function _injectAll(ui, bg) {
  var bgColor = bg || (typeof colorFondo !== 'undefined' ? colorFondo : '#111111');
  injectShopIcon(ui);
  injectGiftIcon(ui);
  injectLeaderboardIcon(ui);
  injectSocialIcons(ui, bgColor);
  injectGbuxIcon(ui);
}

// ─── INIT ────────────────────────────────────────────────────────────────────

// Leer ambos colores desde storage para garantizar que colorBg sea correcto
function _initFromStorage() {
  chrome.storage.local.get(['colorUI', 'colorFondo'], function(stored) {
    var ui = stored.colorUI || (typeof colorUI !== 'undefined' ? colorUI : '#00ccff');
    var bg = stored.colorFondo || (typeof colorFondo !== 'undefined' ? colorFondo : '#111111');
    _injectAll(ui, bg);
  });
}

[300, 800, 1500, 3000].forEach(function(ms) {
  setTimeout(_initFromStorage, ms);
});

chrome.storage.onChanged.addListener(function(changes, area) {
  if (area !== 'local') return;
  if (!changes.colorUI && !changes.colorFondo) return;
  var ui = changes.colorUI ? changes.colorUI.newValue
         : (typeof colorUI !== 'undefined' ? colorUI : '#ffffff');
  var bg = changes.colorFondo ? changes.colorFondo.newValue
         : (typeof colorFondo !== 'undefined' ? colorFondo : '#111111');
  nachIconsUpdate(ui, bg);
  _injectAll(ui, bg);
});

chrome.runtime.onMessage.addListener(function(msg) {
  if (!msg || msg.type !== 'NACH_LIVE') return;
  var ui = msg.data.colorUI || (typeof colorUI !== 'undefined' ? colorUI : '#ffffff');
  var bg = msg.data.colorFondo || (typeof colorFondo !== 'undefined' ? colorFondo : '#111111');
  nachIconsUpdate(ui, bg);
});
