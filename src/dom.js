// NachGerms — dom.js
// DOM utility functions: XP bar layout fix, in-game version tag,
// and the cell-background mini selector embedded in #cellContainer.
// Depends on: storage.js  (NachStorage, NACH_DEFAULTS)
// Depends on: content.js  (colorUI, colorFondo, cellBg — available at call time)

var SCRIPT_VERSION = '2.0.9'; // keep in sync with manifest.json "version"

// ─── XP BAR ──────────────────────────────────────────────────────────────────
// Moves the EXP label outside the progress bar and cleans its styling.

function initXPBar() {
  var s = document.createElement('style');
  s.id = 'ge-xp-bar-style';
  s.textContent = [
    '#loginProgress.progress{',
      'height:16px !important;',
      'overflow:visible !important;',
      'margin-bottom:0 !important;',
    '}',
    '#loginProgress .progress-bar{',
      'height:100% !important;',
    '}',
    '#loginEXP{',
      'display:block !important;',
      'text-align:center !important;',
      'margin-top:13px !important;',
      'margin-bottom:0 !important;',
      'font-size:0.95rem !important;',
      'font-weight:600 !important;',
      'line-height:1.2 !important;',
      'text-shadow:none !important;',
      '-webkit-text-stroke:0 !important;',
    '}'
  ].join('');
  document.head.appendChild(s);

  function moveLabel() {
    var bar   = document.getElementById('loginProgress');
    var label = document.getElementById('loginEXP');
    if (!bar || !label || !bar.parentElement) return false;
    if (bar.contains(label)) bar.insertAdjacentElement('afterend', label);
    return true;
  }
  if (!moveLabel()) {
    var obs = new MutationObserver(function () { if (moveLabel()) obs.disconnect(); });
    obs.observe(document.body, { childList: true, subtree: true });
  }
  [300, 800, 1500, 3000, 5000].forEach(function (ms) { setTimeout(moveLabel, ms); });
}

// ─── VERSION TAG ─────────────────────────────────────────────────────────────
// Appends "Nch☆: 2.0.9" next to the existing Germsfox version info.

function patchVersionTag() {
  var ver = document.getElementById('version');
  if (!ver) return;

  // Color the Germsfox label if present
  var gfInfo = document.getElementById('germsfoxInfo');
  if (gfInfo && !document.getElementById('ge-gf-label')) {
    var gfText   = (gfInfo.textContent || gfInfo.innerText || '').trim();
    if (gfText) {
      var colonIdx = gfText.indexOf(':');
      var wordGF   = colonIdx > -1 ? gfText.slice(0, colonIdx) : gfText;
      var restGF   = colonIdx > -1 ? gfText.slice(colonIdx) : '';
      gfInfo.innerHTML = '';
      var gfSpan = document.createElement('span');
      gfSpan.id  = 'ge-gf-label';
      gfSpan.style.cssText = 'color:' + colorUI + ' !important;font-weight:700 !important';
      gfSpan.textContent = wordGF;
      gfInfo.appendChild(gfSpan);
      if (restGF) gfInfo.appendChild(document.createTextNode(restGF));
    }
  }

  // Remove stale NachGerms label (version mismatch)
  var existingNach = document.getElementById('ge-nach-label');
  if (existingNach && existingNach.textContent.indexOf(SCRIPT_VERSION) === -1) {
    var prevSep = existingNach.previousSibling;
    if (prevSep && prevSep.nodeType === 3) prevSep.parentNode.removeChild(prevSep);
    existingNach.parentNode.removeChild(existingNach);
    existingNach = null;
  }

  // Inject NachGerms label
  if (!existingNach) {
    var spans = ver.querySelectorAll('span');
    var targetSpan = null;
    for (var i = 0; i < spans.length; i++) {
      if (spans[i].textContent.indexOf('|') !== -1) { targetSpan = spans[i]; break; }
    }
    if (!targetSpan && spans.length > 0) targetSpan = spans[0];
    if (!targetSpan) return;

    var sep      = document.createTextNode(' | ');
    var nach     = document.createElement('span');
    nach.id      = 'ge-nach-label';
    var nachLink = document.createElement('a');
    nachLink.href   = 'https://github.com/sphynx137/nachgerms.git';
    nachLink.target = '_blank';
    nachLink.rel    = 'noopener noreferrer';
    nachLink.style.cssText = 'text-decoration:none;cursor:pointer';

    var nachB = document.createElement('b');
    nachB.style.cssText = 'color:' + colorUI + ' !important;font-weight:900 !important';
    nachB.textContent   = 'Nch\u2606';
    nachLink.appendChild(nachB);
    nach.appendChild(nachLink);
    nach.appendChild(document.createTextNode(': ' + SCRIPT_VERSION));
    targetSpan.appendChild(sep);
    targetSpan.appendChild(nach);
  }
}

// ─── CELL BG SELECTOR ────────────────────────────────────────────────────────
// Injects a small color-swatch button into #cellContainer that lets the player
// pick the cell background without opening the popup.

function injectCellBgSelector() {
  if (document.getElementById('ge-cellbg-selector')) return;
  var cellContainer = document.getElementById('cellContainer');
  if (!cellContainer) return;

  cellContainer.style.position = 'relative';

  var trigger = document.createElement('div');
  trigger.id  = 'ge-cellbg-selector';
  trigger.style.cssText = [
    'position:absolute', 'bottom:6px', 'left:6px',
    'width:22px', 'height:22px', 'border-radius:5px',
    'border:2px solid ' + colorUI,
    'background:transparent', 'cursor:pointer', 'z-index:100',
    'box-sizing:border-box', 'box-shadow:0 2px 8px rgba(0,0,0,.5)',
    'transition:transform .1s'
  ].join(';');
  trigger.title = 'Cell BG';

  var flyout = document.createElement('div');
  flyout.id   = 'ge-cellbg-popup';
  flyout.style.cssText = [
    'display:none', 'position:absolute', 'bottom:0', 'left:28px',
    'background:transparent', 'border:none', 'padding:0 0 0 5px',
    'gap:5px', 'flex-direction:row', 'align-items:center', 'z-index:200'
  ].join(';');

  var CELL_OPTS = [
    { val: 'default',   title: 'Default',     bg: 'linear-gradient(135deg,#555 50%,#333 50%)' },
    { val: 'invisible', title: 'Transparent',  bg: 'repeating-conic-gradient(#666 0% 25%,#333 0% 50%) 0 0/8px 8px' },
    { val: 'white',     title: 'White',        bg: '#ffffff' },
    { val: 'black',     title: 'Black',        bg: '#000000' }
  ];

  CELL_OPTS.forEach(function (o) {
    var btn = document.createElement('div');
    btn.title = o.title;
    btn.setAttribute('data-cellval', o.val);
    btn.style.cssText = [
      'width:22px', 'height:22px', 'border-radius:4px', 'cursor:pointer',
      'box-sizing:border-box',
      'border:2px solid ' + (cellBg === o.val ? colorUI : '#444'),
      'background:' + o.bg,
      'transition:border-color .15s,transform .1s', 'flex-shrink:0'
    ].join(';');
    btn.addEventListener('mouseenter', function () { btn.style.transform = 'scale(1.1)'; });
    btn.addEventListener('mouseleave', function () { btn.style.transform = 'scale(1)'; });
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      cellBg = o.val;
      NachStorage.set({ cellBg: cellBg });
      flyout.querySelectorAll('[data-cellval]').forEach(function (b) {
        b.style.borderColor = b.getAttribute('data-cellval') === cellBg ? colorUI : '#444';
      });
      flyout.style.display = 'none';
      aplicarEstilos(colorUI, colorFondo);
    });
    flyout.appendChild(btn);
  });

  trigger.addEventListener('click', function (e) {
    e.stopPropagation();
    flyout.style.display = flyout.style.display === 'flex' ? 'none' : 'flex';
  });
  trigger.addEventListener('mouseenter', function () { trigger.style.transform = 'scale(1.1)'; });
  trigger.addEventListener('mouseleave', function () { trigger.style.transform = 'scale(1)'; });
  document.addEventListener('click', function () { flyout.style.display = 'none'; });
  flyout.addEventListener('click', function (e) { e.stopPropagation(); });

  trigger.appendChild(flyout);
  cellContainer.appendChild(trigger);
}
