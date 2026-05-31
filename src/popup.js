// NachGerms — popup.js
// Reads current values from storage, keeps the popup UI in sync,
// and writes changes back to chrome.storage.local.
// Content scripts react via chrome.storage.onChanged — no messaging needed.

var DEFAULTS = { colorUI: '#00eeff', colorFondo: '#000000', cellBg: 'default', menuZoom: 1.0 };
var GITHUB_URL = 'https://github.com/sphynx137/nachgerms';

var CELLBG_LABELS = {
  default:   'Default',
  invisible: 'Transparent',
  white:     'White',
  black:     'Black'
};

document.addEventListener('DOMContentLoaded', function () {

  // ── Element refs ──────────────────────────────────────────────────────────
  var pickerUI    = document.getElementById('picker-ui');
  var pickerFondo = document.getElementById('picker-fondo');
  var previewUI   = document.getElementById('preview-ui');
  var previewFondo= document.getElementById('preview-fondo');
  var hexUI       = document.getElementById('hex-ui');
  var hexFondo    = document.getElementById('hex-fondo');
  var titleColor  = document.getElementById('title-color');
  var lblColors   = document.getElementById('lbl-colors');
  var lblUI       = document.getElementById('lbl-ui');
  var lblCellBg   = document.getElementById('lbl-cellbg');
  var lblZoom     = document.getElementById('lbl-zoom');
  var cellBgOpts  = document.querySelectorAll('.ge-copt');
  var cellBgName  = document.getElementById('cellbg-name');
  var btnReset    = document.getElementById('btn-reset');
  var footerCompat= document.getElementById('footer-compat');
  var footerLink  = document.getElementById('footer-link');
  var zoomSlider  = document.getElementById('zoom-slider');
  var zoomPct     = document.getElementById('zoom-pct');

  footerLink.href = GITHUB_URL;

  // ── Load from storage ─────────────────────────────────────────────────────
  chrome.storage.local.get(DEFAULTS, function (data) {
    applyAll(data.colorUI, data.colorFondo, data.cellBg, data.menuZoom);
  });

  // ── Color pickers ─────────────────────────────────────────────────────────
  pickerUI.addEventListener('input', function () {
    chrome.storage.local.set({ colorUI: this.value });
    syncUIColor(this.value);
  });

  pickerFondo.addEventListener('input', function () {
    chrome.storage.local.set({ colorFondo: this.value });
    syncFondoColor(this.value);
  });

  // ── Cell BG swatches ──────────────────────────────────────────────────────
  cellBgOpts.forEach(function (opt) {
    opt.addEventListener('click', function () {
      var val = opt.getAttribute('data-val');
      chrome.storage.local.set({ cellBg: val });
      syncCellBg(val);
    });
  });

  // ── Menu Size slider ──────────────────────────────────────────────────────
  if (zoomSlider) {
    zoomSlider.addEventListener('input', function () {
      var pct = parseInt(this.value);
      if (zoomPct) zoomPct.textContent = pct + '%';
    });
    zoomSlider.addEventListener('change', function () {
      var pct = parseInt(this.value);
      if (zoomPct) zoomPct.textContent = pct + '%';
      chrome.storage.local.set({ menuZoom: pct / 100 });
    });
  }

  // ── Reset ─────────────────────────────────────────────────────────────────
  btnReset.addEventListener('click', function () {
    chrome.storage.local.set(DEFAULTS);
    applyAll(DEFAULTS.colorUI, DEFAULTS.colorFondo, DEFAULTS.cellBg, DEFAULTS.menuZoom);
  });

  // ── Helpers ───────────────────────────────────────────────────────────────

  function applyAll(ui, fondo, bg, zoom) {
    syncUIColor(ui);
    syncFondoColor(fondo);
    syncCellBg(bg);
    syncZoom(typeof zoom === 'number' && isFinite(zoom) ? zoom : 1.0);
  }

  function syncUIColor(ui) {
    pickerUI.value = ui;
    if (previewUI)  { previewUI.style.background = ui; previewUI.style.borderColor = ui; }
    if (hexUI)      { hexUI.textContent = ui; hexUI.style.color = ui; }
    if (titleColor) titleColor.style.color = ui;
    if (lblColors)  lblColors.style.color  = ui;
    if (lblUI)      lblUI.style.color      = ui;
    if (lblCellBg)  lblCellBg.style.color  = ui;
    if (lblZoom)    lblZoom.style.color    = ui;
    if (btnReset)   { btnReset.style.color = ui; btnReset.style.borderColor = ui + '66'; }
    if (footerCompat) footerCompat.style.color = ui + 'aa';
    if (footerLink)   {
      footerLink.style.color = ui + 'aa';
      footerLink.onmouseover = function () { footerLink.style.color = ui; };
      footerLink.onmouseout  = function () { footerLink.style.color = ui + 'aa'; };
    }
    if (zoomSlider) zoomSlider.style.accentColor = ui;
    if (zoomPct)    zoomPct.style.color = ui;

    // update active swatch border
    cellBgOpts.forEach(function (o) {
      if (o.classList.contains('active')) {
        o.style.borderColor = ui;
        o.style.boxShadow   = '0 0 5px ' + ui;
      }
    });
  }

  function syncFondoColor(fondo) {
    pickerFondo.value = fondo;
    if (previewFondo) { previewFondo.style.background = fondo; previewFondo.style.borderColor = '#555'; }
    if (hexFondo)     hexFondo.textContent = fondo;
  }

  function syncCellBg(bg) {
    var ui = pickerUI.value;
    cellBgOpts.forEach(function (o) {
      var active = o.getAttribute('data-val') === bg;
      o.classList.toggle('active', active);
      o.style.borderColor = active ? ui : '#444';
      o.style.boxShadow   = active ? '0 0 5px ' + ui : 'none';
    });
    if (cellBgName) {
      cellBgName.textContent = CELLBG_LABELS[bg] || bg;
      cellBgName.style.color = ui;
    }
  }

  function syncZoom(zoom) {
    var pct = Math.round(zoom * 100);
    if (zoomSlider) {
      zoomSlider.value = pct;
      zoomSlider.style.accentColor = pickerUI.value;
    }
    if (zoomPct) {
      zoomPct.textContent = pct + '%';
      zoomPct.style.color = pickerUI.value;
    }
  }
});
