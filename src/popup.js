// NachGerms — popup.js.
// Reads current colors from storage, keeps the popup UI in sync,
// and writes changes back to chrome.storage.local.
// Content scripts react via chrome.storage.onChanged — no messaging needed.

var DEFAULTS = { colorUI: '#00eeff', colorFondo: '#000000', cellBg: 'default' };
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
  var previewFondo = document.getElementById('preview-fondo');
  var hexUI       = document.getElementById('hex-ui');
  var hexFondo    = document.getElementById('hex-fondo');
  var titleColor  = document.getElementById('title-color');
  var cellBgOpts  = document.querySelectorAll('.cellbg-opt');
  var cellBgName  = document.getElementById('cellbg-name');
  var btnReset    = document.getElementById('btn-reset');
  var footerLink  = document.getElementById('footer-link');

  footerLink.href = GITHUB_URL;

  // ── Load from storage ─────────────────────────────────────────────────────
  chrome.storage.local.get(DEFAULTS, function (data) {
    applyToUI(data.colorUI, data.colorFondo, data.cellBg);
  });

  // ── Color pickers ─────────────────────────────────────────────────────────
  pickerUI.addEventListener('input', function () {
    var val = pickerUI.value;
    chrome.storage.local.set({ colorUI: val });
    syncUIColor(val);
  });

  pickerFondo.addEventListener('input', function () {
    var val = pickerFondo.value;
    chrome.storage.local.set({ colorFondo: val });
    syncFondoColor(val);
  });

  // ── Cell BG swatches ──────────────────────────────────────────────────────
  cellBgOpts.forEach(function (opt) {
    opt.addEventListener('click', function () {
      var val = opt.getAttribute('data-val');
      chrome.storage.local.set({ cellBg: val });
      syncCellBg(val);
    });
  });

  // ── Reset ─────────────────────────────────────────────────────────────────
  btnReset.addEventListener('click', function () {
    chrome.storage.local.set(DEFAULTS);
    applyToUI(DEFAULTS.colorUI, DEFAULTS.colorFondo, DEFAULTS.cellBg);
  });

  // ── Helpers ───────────────────────────────────────────────────────────────

  function applyToUI(ui, fondo, bg) {
    syncUIColor(ui);
    syncFondoColor(fondo);
    syncCellBg(bg);
  }

  function syncUIColor(ui) {
    pickerUI.value      = ui;
    previewUI.style.background = ui;
    previewUI.style.borderColor = ui;
    hexUI.textContent   = ui;
    titleColor.style.color = ui;

    // tint active cell bg swatch border
    cellBgOpts.forEach(function (o) {
      if (o.classList.contains('active')) {
        o.style.borderColor = ui;
        o.style.color = ui;
      }
    });
  }

  function syncFondoColor(fondo) {
    pickerFondo.value      = fondo;
    previewFondo.style.background  = fondo;
    previewFondo.style.borderColor = '#555';
    hexFondo.textContent   = fondo;
  }

  function syncCellBg(bg) {
    cellBgOpts.forEach(function (o) {
      var isActive = o.getAttribute('data-val') === bg;
      o.classList.toggle('active', isActive);
      // read current colorUI for border tint
      o.style.borderColor = isActive ? pickerUI.value : '#444';
      o.style.color = isActive ? pickerUI.value : '';
    });
    cellBgName.textContent = CELLBG_LABELS[bg] || bg;
  }
});
