// NachGerms — dom.js
// DOM utility functions: XP bar layout fix, in-game version tag,
// and the cell-background mini selector embedded in #cellContainer.
// Depends on: storage.js  (NachStorage, NACH_DEFAULTS)
// Depends on: content.js  (colorUI, colorFondo, cellBg — available at call time)

var SCRIPT_VERSION = '1.2.9'; // keep in sync with manifest.json "version"

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
// Germsfox y Nch☆ heredan el color original del juego (sin UI color).

function patchVersionTag() {
  var ver = document.getElementById('version');
  if (!ver) return;

  // Germsfox label — solo negrita, sin color personalizado
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
      gfSpan.style.cssText = 'font-weight:700';
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

  // Inject NachGerms label — solo negrita, sin color personalizado
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
    nachLink.href   = 'https://github.com/sphynx137/nachgerms';
    nachLink.style.cssText = 'text-decoration:none;cursor:pointer';
    nachLink.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      window.open('https://github.com/sphynx137/nachgerms', '_blank', 'noopener');
    });

    var nachB = document.createElement('b');
    nachB.style.cssText = 'font-weight:900';
    nachB.textContent   = 'Nch\u2606';
    nachLink.appendChild(nachB);
    nachLink.appendChild(document.createTextNode(': ' + SCRIPT_VERSION));
    nach.appendChild(nachLink);
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

// ─── IN-PAGE NACH PANEL ──────────────────────────────────────────────────────

var CELLBG_LABELS_PANEL = {
  'default':   'Default',
  'invisible': 'Transparent',
  'white':     'White',
  'black':     'Black'
};

var CELLBG_BGS = {
  'default':   'linear-gradient(135deg,#555 50%,#333 50%)',
  'invisible': 'repeating-conic-gradient(#666 0% 25%,#333 0% 50%) 0 0/8px 8px',
  'white':     '#ffffff',
  'black':     '#000000'
};

function injectNachPanel() {
  if (document.getElementById('ge-nach-toggle')) return;

  var anchor = document.getElementById('cellContainer');
  if (!anchor) {
    var waitObs = new MutationObserver(function () {
      if (document.getElementById('cellContainer')) { waitObs.disconnect(); injectNachPanel(); }
    });
    waitObs.observe(document.body, { childList: true, subtree: true });
    return;
  }

  // Wrapper
  var wrap = document.createElement('div');
  wrap.id = 'ge-nach-wrap';
  wrap.style.cssText = 'position:fixed;top:0;left:0;width:0;height:0;z-index:99999;pointer-events:none';

  // Toggle button — extension icon
  var toggle = document.createElement('div');
  toggle.id = 'ge-nach-toggle';
  var iconImg = document.createElement('img');
  iconImg.src = chrome.runtime.getURL('images/icons/icon-48.png');
  iconImg.style.cssText = 'width:26px;height:26px;display:block;border-radius:3px';
  toggle.appendChild(iconImg);
  toggle.style.cssText = [
    'position:fixed',
    'width:38px', 'height:38px',
    'background:#0d0d0d',
    'border:2px solid ' + colorUI,
    'border-radius:6px',
    'cursor:pointer',
    'display:flex', 'align-items:center', 'justify-content:center',
    'pointer-events:all',
    'user-select:none',
    'transition:box-shadow .15s,transform .1s',
    'box-shadow:0 2px 10px rgba(0,0,0,.6)'
  ].join(';');
  toggle.addEventListener('mouseenter', function () { toggle.style.transform = 'scale(1.06)'; });
  toggle.addEventListener('mouseleave', function () { toggle.style.transform = 'scale(1)'; });

  // Panel
  var panel = document.createElement('div');
  panel.id = 'ge-nach-panel';
  panel.style.cssText = [
    'position:fixed',
    'width:210px',
    'background:#0d0d0d',
    'border:1px solid #222',
    'border-radius:8px',
    'color:#aaa',
    'font-family:Arial,sans-serif', 'font-size:12px',
    'display:none',
    'box-shadow:0 4px 24px rgba(0,0,0,.85)',
    'user-select:none',
    'overflow:hidden',
    'pointer-events:all'
  ].join(';');

  var PANEL_SIZE_WIDTHS = { S: '170px', M: '210px', L: '250px' };
  var PANEL_SIZE_PADS   = { S: '7px 10px', M: '8px 12px', L: '10px 14px' };

  function applyPanelSize(sz) {
    panel.style.width = PANEL_SIZE_WIDTHS[sz];
    panel.querySelectorAll('.ge-np-sec').forEach(function (sec) {
      sec.style.padding = PANEL_SIZE_PADS[sz];
    });
    ['S','M','L'].forEach(function (s) {
      var btn = document.getElementById('ge-np-sz-' + s);
      if (btn) btn.style.opacity = s === sz ? '1' : '0.35';
    });
    reposition();
    try { chrome.storage.local.set({ panelSize: sz }); } catch(e) {}
  }

  panel.innerHTML =
    // Header
    '<div class="ge-np-sec" style="display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #222">' +
      '<span style="font-size:12px;font-weight:700;letter-spacing:0.5px"><b id="ge-np-title" style="font-weight:900">Nch\u2606</b> Panel</span>' +
      '<div style="display:flex;align-items:center;gap:5px">' +
        ['S','M','L'].map(function(s) {
          return '<span id="ge-np-sz-' + s + '" data-sz="' + s + '" style="font-size:10px;font-weight:700;cursor:pointer;' +
            'opacity:' + (s === 'M' ? '1' : '0.35') + ';transition:opacity .15s;user-select:none;padding:1px 3px">' + s + '</span>';
        }).join('<span style="color:#333;font-size:9px">·</span>') +
      '</div>' +
    '</div>' +

    // Colors
    '<div class="ge-np-sec" style="border-bottom:1px solid #1a1a1a">' +
      '<div id="ge-np-lbl-colores" style="font-size:9px;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:7px">Colors</div>' +
      '<div style="display:flex;align-items:center;gap:6px;margin-bottom:5px">' +
        '<span id="ge-np-lbl-ui" style="flex:1;font-size:10px;letter-spacing:0.3px">UI / Borders</span>' +
        '<span id="ge-np-hex-ui" style="font-size:9px;font-family:monospace;min-width:44px;text-align:right"></span>' +
        '<input type="color" id="ge-np-pick-ui" style="width:24px;height:20px;border:none;background:none;cursor:pointer;padding:0;flex-shrink:0">' +
      '</div>' +
      '<div style="display:flex;align-items:center;gap:6px">' +
        '<span id="ge-np-lbl-fondo" style="flex:1;font-size:10px;color:#888;letter-spacing:0.3px">Background</span>' +
        '<span id="ge-np-hex-fondo" style="font-size:9px;font-family:monospace;color:#555;min-width:44px;text-align:right"></span>' +
        '<input type="color" id="ge-np-pick-fondo" style="width:24px;height:20px;border:none;background:none;cursor:pointer;padding:0;flex-shrink:0">' +
      '</div>' +
    '</div>' +

    // Cell BG
    '<div class="ge-np-sec" style="border-bottom:1px solid #1a1a1a">' +
      '<div id="ge-np-lbl-cellbg" style="font-size:9px;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:7px">Cell background</div>' +
      '<div style="display:flex;align-items:center;gap:5px">' +
        ['default','invisible','white','black'].map(function(v) {
          return '<div class="ge-np-copt" data-val="' + v + '" title="' + CELLBG_LABELS_PANEL[v] + '"' +
            ' style="width:22px;height:22px;border-radius:4px;border:2px solid #444;cursor:pointer;' +
            'box-sizing:border-box;flex-shrink:0;transition:border-color .15s,transform .1s;' +
            'background:' + CELLBG_BGS[v] + '"></div>';
        }).join('') +
        '<span id="ge-np-cellbg-name" style="font-size:9px;margin-left:2px"></span>' +
      '</div>' +
    '</div>' +

    // Reset
    '<div class="ge-np-sec" style="border-bottom:1px solid #1a1a1a">' +
      '<button id="ge-np-reset" style="width:100%;padding:5px;background:transparent;border:1px solid #333;' +
        'border-radius:4px;font-size:10px;cursor:pointer;font-family:Arial,sans-serif;transition:opacity .15s">' +
        'Restore defaults' +
      '</button>' +
    '</div>' +

    // Footer
    '<div class="ge-np-sec" style="display:flex;align-items:center;justify-content:space-between">' +
      '<span id="ge-np-compat" style="font-size:9px">\u2713 Germsfox</span>' +
      '<a id="ge-np-ghlink" href="https://github.com/sphynx137/nachgerms" target="_blank" rel="noopener"' +
        ' style="font-size:9px;text-decoration:none">GitHub \u2197</a>' +
    '</div>';

  wrap.appendChild(toggle);
  wrap.appendChild(panel);
  document.body.appendChild(wrap);

  // Positioning — always to the right of the right panel
  function reposition() {
    var a = document.getElementById('cellContainer');
    if (!a) return;
    var par = a.parentElement;
    var r = par ? par.getBoundingClientRect() : a.getBoundingClientRect();
    toggle.style.left = (r.right + 6) + 'px';
    toggle.style.top  = r.top + 'px';
    panel.style.left  = (r.right + 6) + 'px';
    panel.style.top   = (r.top + 44) + 'px';
  }
  reposition();
  window.addEventListener('resize', reposition);

  // Wire size buttons
  ['S','M','L'].forEach(function (s) {
    var btn = document.getElementById('ge-np-sz-' + s);
    if (btn) btn.addEventListener('click', function (e) { e.stopPropagation(); applyPanelSize(s); });
  });
  try {
    chrome.storage.local.get({ panelSize: 'M' }, function (d) { applyPanelSize(d.panelSize); });
  } catch(e) { applyPanelSize('M'); }

  // Toggle open/close
  toggle.addEventListener('click', function (e) {
    e.stopPropagation();
    var open = panel.style.display === 'block';
    panel.style.display = open ? 'none' : 'block';
    if (!open) syncPanel();
  });
  document.addEventListener('click', function () { panel.style.display = 'none'; });
  panel.addEventListener('click', function (e) { e.stopPropagation(); });

  // Sync panel from storage
  function syncPanel() {
    NachStorage.get(function (data) {
      var ui    = data.colorUI;
      var fondo = data.colorFondo;
      var bg    = data.cellBg;

      toggle.style.borderColor = ui;

      var els = {
        title:    document.getElementById('ge-np-title'),
        lblCol:   document.getElementById('ge-np-lbl-colores'),
        lblUI:    document.getElementById('ge-np-lbl-ui'),
        lblCellBg:document.getElementById('ge-np-lbl-cellbg'),
        hexUI:    document.getElementById('ge-np-hex-ui'),
        hexFondo: document.getElementById('ge-np-hex-fondo'),
        pickUI:   document.getElementById('ge-np-pick-ui'),
        pickF:    document.getElementById('ge-np-pick-fondo'),
        cellName: document.getElementById('ge-np-cellbg-name'),
        reset:    document.getElementById('ge-np-reset'),
        compat:   document.getElementById('ge-np-compat'),
        ghlink:   document.getElementById('ge-np-ghlink')
      };

      if (els.title)     els.title.style.color     = ui;
      if (els.lblCol)    els.lblCol.style.color     = ui;
      if (els.lblUI)     els.lblUI.style.color      = ui;
      if (els.lblCellBg) els.lblCellBg.style.color  = ui;
      if (els.hexUI)     { els.hexUI.textContent = ui;    els.hexUI.style.color = ui; }
      if (els.hexFondo)  els.hexFondo.textContent = fondo;
      if (els.pickUI)    els.pickUI.value  = ui;
      if (els.pickF)     els.pickF.value   = fondo;
      if (els.cellName)  { els.cellName.textContent = CELLBG_LABELS_PANEL[bg] || bg; els.cellName.style.color = ui; }
      if (els.reset)     { els.reset.style.color = ui; els.reset.style.borderColor = ui + '66'; }
      if (els.compat)    els.compat.style.color  = ui + 'aa';
      if (els.ghlink)    {
        els.ghlink.style.color = ui + 'aa';
        els.ghlink.onmouseover = function () { els.ghlink.style.color = ui; };
        els.ghlink.onmouseout  = function () { els.ghlink.style.color = ui + 'aa'; };
      }
      ['S','M','L'].forEach(function (s) {
        var b = document.getElementById('ge-np-sz-' + s);
        if (b) b.style.color = ui;
      });

      panel.querySelectorAll('.ge-np-copt').forEach(function (opt) {
        var active = opt.getAttribute('data-val') === bg;
        opt.style.borderColor = active ? ui : '#444';
        opt.style.boxShadow   = active ? '0 0 5px ' + ui : 'none';
      });
    });
  }
  syncPanel();

  // Wire pickers
  document.getElementById('ge-np-pick-ui').addEventListener('input', function () {
    NachStorage.set({ colorUI: this.value });
    var h = document.getElementById('ge-np-hex-ui');
    if (h) { h.textContent = this.value; h.style.color = this.value; }
  });
  document.getElementById('ge-np-pick-fondo').addEventListener('input', function () {
    NachStorage.set({ colorFondo: this.value });
    var h = document.getElementById('ge-np-hex-fondo');
    if (h) h.textContent = this.value;
  });

  // Wire cell BG swatches
  panel.querySelectorAll('.ge-np-copt').forEach(function (opt) {
    opt.addEventListener('mouseenter', function () { opt.style.transform = 'scale(1.1)'; });
    opt.addEventListener('mouseleave', function () { opt.style.transform = 'scale(1)'; });
    opt.addEventListener('click', function () {
      NachStorage.set({ cellBg: opt.getAttribute('data-val') });
      syncPanel();
    });
  });

  // Reset button
  var resetBtn = document.getElementById('ge-np-reset');
  if (resetBtn) {
    resetBtn.addEventListener('mouseenter', function () { resetBtn.style.opacity = '0.7'; });
    resetBtn.addEventListener('mouseleave', function () { resetBtn.style.opacity = '1'; });
    resetBtn.addEventListener('click', function () { NachStorage.set(NACH_DEFAULTS); syncPanel(); });
  }

  // React to storage changes from popup or other tabs
  chrome.storage.onChanged.addListener(function (changes, area) {
    if (area === 'local') syncPanel();
  });
}
