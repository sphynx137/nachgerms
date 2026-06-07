// NachGerms — imgur_photos.js
// Selector de imagen personalizada en div#money-square.
// NO interfiere con img#cellSkin ni con el sistema de skins de Germsfox.
// Solo muestra la imagen en el panel vacío como decoración/referencia visual.

function updateImgurLabelColor(ui) {
  var lbl = document.getElementById('ge-imgur-lbl');
  if (lbl) lbl.style.color = ui;
}

function injectImgurPhotos() {
  if (document.getElementById('ge-imgur-wrap')) return;
  var target = document.getElementById('money-square');
  if (!target) return;
  target.style.overflow = 'hidden';

  // Si hay publicidad real ocupando el panel, no inyectar
  var hasRealAd = target.querySelector('iframe, ins, [id*="google"], [class*="ad"], [id*="ad"]');
  if (hasRealAd) return;

  chrome.storage.local.get(['imgurPhotoUrl'], function(stored) {
    var savedUrl = stored.imgurPhotoUrl || '';

    // ── WRAPPER PRINCIPAL ──
    var wrap = document.createElement('div');
    wrap.id = 'ge-imgur-wrap';
    wrap.style.cssText =
      'width:100%;display:flex;flex-direction:column;' +
      'align-items:center;gap:4px;' +
      'padding:6px;box-sizing:border-box;';

    // ── PREVIEW CUADRADO GRANDE ──
    var preview = document.createElement('div');
    preview.id = 'ge-imgur-preview';
    preview.style.cssText =
      'width:95%;height:220px;border-radius:6px;position:relative;overflow:hidden;' +
      'background-size:cover;background-position:center;background-repeat:no-repeat;' +
      'background-color:#111;cursor:pointer;box-sizing:border-box;' +
      'transition:opacity .15s;min-height:0;';
    preview.title = 'Click para cambiar imagen';

    if (savedUrl) {
      preview.style.backgroundImage = 'url(' + savedUrl + ')';
    } else {
      preview.style.border = '1px dashed rgba(255,255,255,0.15)';
    }

    preview.addEventListener('mouseenter', function() { preview.style.opacity = '0.85'; });
    preview.addEventListener('mouseleave', function() { preview.style.opacity = '1'; });

    // ── PANEL INPUT (oculto por defecto) ──
    var panel = document.createElement('div');
    panel.id = 'ge-imgur-panel';
    panel.style.cssText =
      'display:none;position:absolute;bottom:0;left:0;right:0;' +
      'flex-direction:column;align-items:center;gap:4px;' +
      'padding:6px;box-sizing:border-box;' +
      'background:rgba(0,0,0,0.75);border-radius:0 0 6px 6px;z-index:10;';

    var input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'https://i.imgur.com/...';
    input.value = savedUrl;
    input.style.cssText =
      'width:100%;font-size:10px;padding:3px 6px;border-radius:4px;' +
      'box-sizing:border-box;text-align:center;outline:none;';

    var btnRow = document.createElement('div');
    btnRow.style.cssText = 'display:flex;gap:4px;';

    var btnApply = document.createElement('button');
    btnApply.textContent = 'Apply';
    btnApply.style.cssText = 'font-size:10px;padding:2px 8px;border-radius:4px;cursor:pointer;';

    var btnClear = document.createElement('button');
    btnClear.textContent = 'Clear';
    btnClear.style.cssText = 'font-size:10px;padding:2px 8px;border-radius:4px;cursor:pointer;';

    btnRow.appendChild(btnApply);
    btnRow.appendChild(btnClear);
    panel.appendChild(input);
    panel.appendChild(btnRow);

    // ── LABEL ──
    var lbl = document.createElement('div');
    lbl.id = 'ge-imgur-lbl';
    lbl.textContent = 'Photo';
    lbl.style.cssText =
      'font-size:11px;opacity:0.8;letter-spacing:2px;text-transform:uppercase;flex-shrink:0;font-weight:700;';
    lbl.style.color = (typeof colorUI !== 'undefined' ? colorUI : '#ffffff');

    // ── TOGGLE PANEL ──
    preview.addEventListener('click', function(e) {
      if (e.target === input || e.target === btnApply || e.target === btnClear) return;
      var isOpen = panel.style.display !== 'none';
      panel.style.display = isOpen ? 'none' : 'flex';
      if (!isOpen) setTimeout(function() { input.focus(); }, 50);
    });
    // Cerrar al hacer click fuera del panel
    document.addEventListener('click', function(e) {
      if (panel.style.display === 'none') return;
      if (!wrap.contains(e.target)) {
        panel.style.display = 'none';
      }
    });


    // ── APPLY ──
    function applyUrl(url) {
      url = url.trim();
      if (url) {
        preview.style.backgroundImage = 'url(' + url + ')';
        preview.style.border = 'none';
      } else {
        preview.style.backgroundImage = '';
        preview.style.border = '1px dashed rgba(255,255,255,0.15)';
      }
      chrome.storage.local.set({ imgurPhotoUrl: url });
      panel.style.display = 'none';
    }

    btnApply.addEventListener('click', function() { applyUrl(input.value); });
    btnClear.addEventListener('click', function() { input.value = ''; applyUrl(''); });
    input.addEventListener('keydown', function(e) { if (e.key === 'Enter') applyUrl(input.value); });

    preview.appendChild(panel);
    wrap.appendChild(preview);
    wrap.appendChild(lbl);

    target.innerHTML = '';
    target.appendChild(wrap);
  });
}

// ── RE-INYECTAR TRAS LOGOUT/LOGIN ────────────────────────────────────────────

(function() {
  var _last = 0;
  var obs = new MutationObserver(function() {
    var now = Date.now();
    if (now - _last < 1000) return;
    var sq = document.getElementById('money-square');
    if (sq && !document.getElementById('ge-imgur-wrap')) {
      _last = now;
      injectImgurPhotos();
    }
  });
  function start() { obs.observe(document.body, { childList: true, subtree: true }); }
  if (document.body) start();
  else document.addEventListener('DOMContentLoaded', start);
})();

// ── INIT ─────────────────────────────────────────────────────────────────────

[500, 1000, 2000, 3500].forEach(function(ms) {
  setTimeout(injectImgurPhotos, ms);
});