// NachGerms — content.js
// Main content script. Applies dynamic CSS theming to Germs.io.
// Depends on: storage.js  (NachStorage, NACH_DEFAULTS)
// Depends on: dom.js      (initXPBar, patchVersionTag, injectCellBgSelector)

// ─── EXCLUSION LISTS ─────────────────────────────────────────────────────────

var ZONAS_EXCLUIDAS = [
  '.color-picker', '#cellContainer', '#leaderboardList',
  '#debugText', '#chat', '#worldTab',
  '#germsfoxInfo', '#ge-nach-label',
  'a#version', '#version', '[for="skinsInput"]'
];

var CLASES_EXCLUIDAS = [
  'name', 'nick', 'player', 'cell', 'tag', 'picker',
  'fa-coins', 'fa-play', 'fa-cog', 'fa-search'
];

// ─── RUNTIME STATE ───────────────────────────────────────────────────────────

var colorUI    = NACH_DEFAULTS.colorUI;
var colorFondo = NACH_DEFAULTS.colorFondo;
var cellBg     = NACH_DEFAULTS.cellBg;
var menuZoom   = NACH_DEFAULTS.menuZoom;

// ─── MENU ZOOM ────────────────────────────────────────────────────────────────

function _clamp(val, min, max) { return Math.min(Math.max(val, min), max); }

function _setZoom() {
  var el = document.getElementById('menuContainer');
  if (!el) return;
  var t = 'scale(' + menuZoom + ')';
  if (el.style.transform !== t) {
    el.style.transform = t;
    el.style.transformOrigin = 'center top';
  }
}

function applyZoom(val) {
  menuZoom = _clamp(parseFloat(parseFloat(val).toFixed(2)), 0.85, 1.0);
  NachStorage.set({ menuZoom: menuZoom });
  _setZoom();
  if (!applyZoom._obs) {
    applyZoom._obs = new MutationObserver(function() { _setZoom(); });
    applyZoom._obs.observe(document.body, {
      childList: true, subtree: true,
      attributes: true, attributeFilter: ['style', 'class']
    });
  }
}

// ─── DETECCIÓN DE ESTADO ─────────────────────────────────────────────────────
// Cuando el botón Play no está visible, el jugador está en partida.
// En ese estado el JS no toca estilos de texto — el CSS se encarga.

function estaEnJuego() {
  var playBtn = document.getElementById('play');
  if (!playBtn) return false;
  var s = window.getComputedStyle(playBtn);
  return s.display === 'none' || s.visibility === 'hidden' || playBtn.offsetParent === null;
}

// ─── CSS INJECTION ───────────────────────────────────────────────────────────

function aplicarEstilos(ui, fondo) {
  var existente = document.getElementById('ge-bordes-estilos');
  if (existente) existente.remove();

  var cellBgColor = cellBg === 'black'     ? '#000000'
                  : cellBg === 'white'     ? '#ffffff'
                  : cellBg === 'invisible' ? 'transparent'
                  : 'unset';

  var css = '\
/* CELL BG */\n' +
    (cellBg !== 'default' ? '#cellContainer { background-color: ' + cellBgColor + ' !important; }\n' : '') + '\
\n\
/* BORDES */\n\
div[class*="panel"], div[class*="card"], div[class*="box"],\n\
div[class*="menu"], div[class*="modal"], div[class*="popup"],\n\
div[class*="sidebar"], div[class*="widget"], div[class*="section"],\n\
#profile, #play, #modes, #social, #settings, #shop,\n\
.ui-panel, .game-panel {\n\
  border: 2px solid ' + ui + ' !important;\n\
  box-shadow: 0 0 6px ' + ui + '33 !important;\n\
  outline: none !important;\n\
}\n\
\n\
/* FONDO */\n\
div[class*="panel"]:not(#cellPanel), div[class*="card"],\n\
div[class*="menu"], div[class*="sidebar"], div[class*="section"],\n\
#profile, #play, #modes, #social, #settings, #shop,\n\
.ui-panel, .game-panel {\n\
  background-color: ' + fondo + ' !important;\n\
}\n\
\n\
/* BOTONES */\n\
button:not(.btn-info), input[type="button"]:not(.btn-info),\n\
input[type="submit"]:not(.btn-info), a[class*="btn"]:not(.btn-info),\n\
div[class*="btn"]:not(.btn-info), span[class*="btn"]:not(.btn-info) {\n\
  border: 2px solid ' + ui + ' !important;\n\
  outline: none !important;\n\
}\n\
#cellButtons button {\n\
  border: 0px solid transparent !important;\n\
  outline: none !important;\n\
}\n\
#cellButtons button:hover {\n\
  border: 1px solid rgba(255,255,255,0.7) !important;\n\
}\n\
\n\
/* INPUTS */\n\
input[type="text"]:not(#chat_input), input[type="search"]:not(#chat_input),\n\
input:not([type]):not(#chat_input) {\n\
  border: 2px solid ' + ui + ' !important;\n\
  color: ' + ui + ' !important;\n\
  background-color: ' + fondo + ' !important;\n\
  outline: none !important;\n\
}\n\
\n\
/* CHAT INPUT */\n\
input#chat_input {\n\
  border: 2px solid ' + ui + ' !important;\n\
  color: #ffffff !important;\n\
  background-color: unset !important;\n\
  outline: none !important;\n\
  box-shadow: none !important;\n\
}\n\
\n\
textarea {\n\
  border: 2px solid ' + ui + ' !important;\n\
  color: ' + ui + ' !important;\n\
  outline: none !important;\n\
}\n\
\n\
.form-control:not(#chat_input), .form-control[readonly]:not(#chat_input) {\n\
  background-color: ' + fondo + ' !important;\n\
  color: ' + ui + ' !important;\n\
}\n\
\n\
textarea#nick, #nick {\n\
  background-color: ' + fondo + ' !important;\n\
  color: ' + ui + ' !important;\n\
  border: 2px solid ' + ui + ' !important;\n\
}\n\
\n\
input[type="text"]:focus, input:not([type]):focus {\n\
  box-shadow: 0 0 6px ' + ui + '55 !important;\n\
}\n\
\n\
/* BARRA XP */\n\
#loginProgress > div, #loginProgress .progress-bar {\n\
  background-color: ' + ui + ' !important;\n\
}\n\
\n\
/* BOTONES PARTY */\n\
.partyCard button, #partyMenu button, div[class*="party"] button {\n\
  background-color: ' + fondo + ' !important;\n\
  border: 2px solid ' + ui + ' !important;\n\
  color: ' + ui + ' !important;\n\
}\n\
\n\
#partyText b, div#partyText b { color: ' + ui + ' !important; }\n\
div.partyText { color: ' + ui + ' !important; }\n\
\n\
/* BTN-INFO */\n\
button.btn-info, .btn.btn-info, a.btn-info {\n\
  background-color: ' + fondo + ' !important;\n\
  border: 2px solid ' + ui + ' !important;\n\
  color: ' + ui + ' !important;\n\
}\n\
\n\
/* BTN-PRIMARY */\n\
.btn-primary, button.btn-primary, a.btn-primary,\n\
.btn.btn-primary, .btn-sm.btn-primary {\n\
  background-color: ' + fondo + ' !important;\n\
  border: 2px solid ' + ui + ' !important;\n\
  color: ' + ui + ' !important;\n\
}\n\
.btn-primary:hover, button.btn-primary:hover {\n\
  background-color: ' + ui + '22 !important;\n\
}\n\
\n\
/* BTN-SUCCESS */\n\
.btn-success, button.btn-success, input.btn-success, a.btn-success {\n\
  background-color: ' + ui + ' !important;\n\
  border: 2px solid ' + ui + ' !important;\n\
  color: ' + fondo + ' !important;\n\
}\n\
\n\
/* BADGES */\n\
.badge-primary, span.badge.badge-primary, .badge.badge-pill.badge-primary {\n\
  background-color: ' + fondo + ' !important;\n\
  border: 2px solid ' + ui + ' !important;\n\
  color: ' + ui + ' !important;\n\
}\n\
\n\
/* TOGGLES */\n\
.custom-control-input:checked ~ .custom-control-label::before,\n\
input[type="checkbox"]:checked + label::before,\n\
.toggle-on, .switch input:checked + span,\n\
.custom-switch .custom-control-input:checked ~ .custom-control-label::before {\n\
  background-color: ' + ui + ' !important;\n\
  border-color: ' + ui + ' !important;\n\
}\n\
.custom-control-label::before, input[type="checkbox"] + label::before,\n\
.toggle-off, .switch span {\n\
  background-color: ' + fondo + ' !important;\n\
  border-color: ' + ui + ' !important;\n\
}\n\
\n\
/* TABS */\n\
#settingsTabs, .nav.nav-pills { flex-wrap: nowrap !important; white-space: nowrap !important; }\n\
#settingsTabs .nav-link, .nav.nav-pills .nav-link {\n\
  color: ' + ui + ' !important;\n\
  background-color: ' + fondo + ' !important;\n\
  border: 1px solid ' + ui + '55 !important;\n\
  padding: 4px 10px !important;\n\
  font-size: 13px !important;\n\
  white-space: nowrap !important;\n\
}\n\
#settingsTabs .nav-link.active, .nav.nav-pills .nav-link.active {\n\
  color: ' + fondo + ' !important;\n\
  background-color: ' + ui + ' !important;\n\
  border: 1px solid ' + ui + ' !important;\n\
}\n\
\n\
/* SLIDER */\n\
input[type="range"] {\n\
  -webkit-appearance: none; appearance: none;\n\
  background: transparent !important; height: 20px !important;\n\
  cursor: pointer; accent-color: ' + ui + ';\n\
}\n\
input[type="range"]::-webkit-slider-runnable-track {\n\
  height: 3px !important; background: transparent !important;\n\
  border: none !important; border-bottom: 2px solid ' + ui + ' !important;\n\
  border-radius: 0 !important;\n\
}\n\
input[type="range"]::-webkit-slider-thumb {\n\
  -webkit-appearance: none !important; width: 13px !important;\n\
  height: 13px !important; border-radius: 50% !important;\n\
  background: ' + ui + ' !important; border: 2px solid ' + ui + ' !important;\n\
  margin-top: -5px !important; box-shadow: none !important; cursor: pointer;\n\
}\n\
input[type="range"]::-moz-range-track {\n\
  height: 2px !important; background: transparent !important;\n\
  border-bottom: 2px solid ' + ui + ' !important; border-radius: 0 !important;\n\
}\n\
input[type="range"]::-moz-range-thumb {\n\
  width: 13px !important; height: 13px !important;\n\
  border-radius: 50% !important; background: ' + ui + ' !important;\n\
  border: 2px solid ' + ui + ' !important; box-shadow: none !important; cursor: pointer;\n\
}\n\
\n\
/* SHOP NAV */\n\
#shopNav li a { color: ' + ui + ' !important; background-color: ' + fondo + ' !important; border: 1px solid ' + ui + '55 !important; }\n\
#shopNav li.active a, #shopNav li a.active { color: ' + fondo + ' !important; background-color: ' + ui + ' !important; border: 1px solid ' + ui + ' !important; }\n\
\n\
/* MODOS */\n\
div.gm { background-color: ' + fondo + ' !important; border: 1px solid ' + ui + '55 !important; color: ' + ui + ' !important; }\n\
div.gm.active, div.gm.active * { background-color: inherit; color: ' + fondo + ' !important; }\n\
div.gm.active { background-color: ' + ui + ' !important; border: 2px solid ' + fondo + ' !important; }\n\
\n\
/* CONNECTING */\n\
#connecting { background-color: ' + fondo + ' !important; border: 2px solid ' + ui + ' !important; }\n\
\n\
/* OVERLAYS */\n\
#settings, #shop, #skins, #rankings {\n\
  background-color: transparent !important;\n\
  backdrop-filter: none !important; border: none !important;\n\
  box-shadow: none !important; outline: none !important;\n\
}\n\
#settingsCard, #settingsTabsContent,\n\
#settings-general, #settings-controls, #settings-graphics, #settings-gameplay {\n\
  background-color: ' + fondo + ' !important;\n\
}\n\
#settingsTabs { background-color: transparent !important; }\n\
\n\
/* SHOP */\n\
#shopCard { background-color: ' + fondo + ' !important; }\n\
#shopContent, #shopTabBlocked, #shopTabVeteran, #shopTabPremium,\n\
#shopTabCoins, #shopTabBoosts, #shopTabBucks { background-color: transparent !important; }\n\
\n\
/* SKINS */\n\
#skinsCard { background-color: ' + fondo + ' !important; }\n\
#skinContainer { background-color: transparent !important; }\n\
#loginCustomSkinText, #searchText {\n\
  color: ' + ui + ' !important;\n\
  border-color: ' + ui + ' !important;\n\
  background-color: ' + fondo + ' !important;\n\
}\n\
#loginCustomSkinText::placeholder, #searchText::placeholder {\n\
  color: ' + ui + '88 !important;\n\
}\n\
\n\
/* RANKINGS */\n\
#rankingsCard { background-color: ' + fondo + ' !important; }\n\
#rankingsList table { background-color: transparent !important; border-collapse: collapse !important; width: 100% !important; }\n\
#rankingsList thead, #rankingsList tbody, #rankingsList tr { background-color: transparent !important; }\n\
#rankingsList td, #rankingsList th { background-color: transparent !important; border: none !important; border-bottom: 1px solid ' + ui + ' !important; }\n\
#rankingsList thead th { border-bottom: 2px solid ' + ui + ' !important; }\n\
\n\
/* GERMSFOX PANEL */\n\
#germsfoxSettingsCard { background-color: ' + fondo + ' !important; }\n\
\n\
/* Override germsfox style.css rgba overlay backgrounds (raiz de las cajas grises) */\n\
#germsfoxSettingsTabsContent {\n\
  background: transparent !important;\n\
  background-color: transparent !important;\n\
}\n\
#germsfoxSettingsTabs {\n\
  background: transparent !important;\n\
  background-color: transparent !important;\n\
}\n\
#germsfox-settings-general p,\n\
#germsfox-settings-theme p {\n\
  background: transparent !important;\n\
  background-color: transparent !important;\n\
}\n\
\n\
/* Remove border/shadow applied by nachgerms general rules on Bootstrap layout elements inside the card */\n\
#germsfoxSettingsCard .row,\n\
#germsfoxSettingsCard [class^="col-"],\n\
#germsfoxSettingsCard [class*=" col-"],\n\
#germsfoxSettingsCard .clearfix,\n\
#germsfoxSettingsCard .input-group {\n\
  background-color: transparent !important;\n\
  border: none !important;\n\
  box-shadow: none !important;\n\
}\n\
\n\
/* LOCKED NAME PANELS */\n\
#loginCustomLocked, #loginCustomLockedName {\n\
  background: transparent !important;\n\
  box-shadow: none !important;\n\
}\n\
\n\
/* REDEEM CODE */\n\
#loginCustomLocked h5, #loginCustomLockedName h5 {\n\
  color: ' + ui + ' !important;\n\
}\n\
#loginLockedNameRedeem {\n\
  background: ' + fondo + ' !important;\n\
  color: ' + ui + ' !important;\n\
  border-color: ' + ui + ' !important;\n\
}\n\
#loginLockedNameRedeem::placeholder { color: ' + ui + '88 !important; }\n\
.input-group-append .btn.btn-info {\n\
  background: ' + ui + ' !important;\n\
  color: ' + fondo + ' !important;\n\
  border-color: ' + ui + ' !important;\n\
}\n\
\n\
/* BLOCKLIST / MUTE */\n\
#userMenuPlayerName { color: ' + ui + ' !important; }\n\
#userMenuBlockText  { color: ' + ui + ' !important; }\n\
#blocklistList li, #blockerList li { color: ' + ui + ' !important; }\n\
button.block-button {\n\
  color: ' + ui + ' !important;\n\
  background: transparent !important;\n\
  border-color: ' + ui + ' !important;\n\
}\n\
button.block-button i.fas {\n\
  color: ' + ui + ' !important;\n\
}\n\
button.block-button.blocked {\n\
  color: ' + ui + '88 !important;\n\
  border-color: ' + ui + '88 !important;\n\
}\n\
button.block-button.blocked i.fas {\n\
  color: ' + ui + '88 !important;\n\
}\n\
#germsfox-settings-blocklist {\n\
  background: transparent !important;\n\
}\n\
#germsfox-settings-blocklist .clearfix {\n\
  background: transparent !important;\n\
}\n\
\n\
i.fa-coins, .fa-coins { color: #ffd700 !important; }\n\
\n\
/* PARTY CODE */\n\
#partyCopyCode, input.party-token, .form-control[readonly] { background-color: ' + fondo + ' !important; }\n\
\n\
/* SETTINGS / SPECTATE BUTTONS */\n\
button#settingsButton, button#spectate {\n\
  background-color: ' + fondo + ' !important;\n\
  border: 2px solid ' + ui + ' !important;\n\
  color: ' + ui + ' !important;\n\
}\n\
button#settingsButton i, button#spectate i { color: ' + ui + ' !important; }\n\
\n\
/* GERMSFOX BTN */\n\
button#germsfoxButton { background-color: ' + fondo + ' !important; color: ' + ui + ' !important; }\n\
\n\
/* BTN CERRAR */\n\
#settingsClose, #rankingsClose, #germsfoxSettingsClose, #shopClose, #skinsClose {\n\
  background: ' + fondo + ' !important; color: ' + ui + ' !important; border: 2px solid ' + ui + ' !important;\n\
}\n\
\n\
/* BTN SOCIAL */\n\
.btn-discord, .btn-google, button.btn-discord, button.btn-google {\n\
  color: ' + ui + ' !important; border: 2px solid ' + ui + ' !important;\n\
  background-color: ' + fondo + ' !important;\n\
}\n\
\n\
/* LEVEL */\n\
#loginNextLevel, #loginNextSkin { background-color: ' + fondo + ' !important; }\n\
#loginNextLevel > p:first-child, #loginNextSkin > p:first-child {\n\
  background-color: ' + ui + ' !important; color: ' + fondo + ' !important;\n\
  border-radius: 4px !important; padding: 1px 6px !important; display: inline-block !important;\n\
}\n\
\n\
#loginProgress {\n\
  background-color: transparent !important; background: transparent !important;\n\
  border: 2px solid ' + ui + ' !important; border-radius: 6px !important; box-sizing: border-box !important;\n\
}\n\
\n\
#loginCoins, #loginBucks, #loginShop, #loginGift, #loginLeaderboard {\n\
  background-color: transparent !important; background: transparent !important;\n\
}\n\
\n\
#cellButtons > p { background-color: ' + ui + ' !important; color: ' + fondo + ' !important; }\n\
#lockedButtons > p { background-color: ' + ui + ' !important; color: ' + fondo + ' !important; }\n\
\n\
/* COINS / BUCKS */\n\
span#loginCoins a, span#loginBucks a {\n\
  display: inline-flex !important; align-items: center !important;\n\
  justify-content: center !important; width: 22px !important; height: 22px !important;\n\
  padding: 0 !important; background-color: transparent !important;\n\
  color: ' + ui + ' !important; border: 1.5px solid ' + ui + ' !important;\n\
  border-radius: 4px !important; box-sizing: border-box !important;\n\
  line-height: 1 !important; vertical-align: middle !important;\n\
}\n\
span#loginCoins a i, span#loginBucks a i { color: ' + ui + ' !important; font-size: 11px !important; }\n\
\n\
/* PLAY */\n\
button#play, #partyMenu button.party-copy, #partyMenu .btn-party, button.party-copy {\n\
  background-color: ' + ui + ' !important; color: ' + fondo + ' !important; border: 2px solid ' + ui + ' !important;\n\
}\n\
button#play i, i.fa-play, button.party-copy i { color: ' + fondo + ' !important; }\n\
\n\
h4.partyCreate, h4.partyCreate span { background-color: ' + fondo + ' !important; color: ' + ui + ' !important; }\n\
\n\
hr, div[class*="divider"], div[class*="separator"] { border-color: ' + ui + '55 !important; }\n\
\n\
#debugText b { color: ' + ui + ' !important; }\n\
\n\
#cellButtons { background: transparent !important; border: none !important; box-shadow: none !important; }\n\
\n\
img#loginAvatar {\n\
  border: 2px solid ' + ui + ' !important; border-radius: 6px !important;\n\
  box-shadow: 0 0 8px ' + ui + '55 !important; outline: none !important;\n\
}\n\
\n\
h4#loginName, #loginName, h5#shopName, #shopName {\n\
  outline: none !important; border: none !important;\n\
  box-shadow: none !important; background: transparent !important;\n\
  text-shadow: none !important; -webkit-text-stroke: 0 !important;\n\
}\n\
\n\
/* SHOP TABS */\n\
#shopTabLocked, #shopTabVeteran, #shopTabPremium, #shopTabCoins, #shopTabBoosts, #shopTabBucks,\n\
#shopTabLocked > ul, #shopTabVeteran > ul, #shopTabPremium > ul,\n\
#shopTabCoins > ul, #shopTabBoosts > ul, #shopTabBucks > ul {\n\
  background-color: transparent !important;\n\
}\n\
#shopTabLocked li, #shopTabVeteran li, #shopTabPremium li,\n\
#shopTabCoins li, #shopTabBoosts li, #shopTabBucks li {\n\
  background-color: transparent !important;\n\
}\n\
\n\
span#shopCoins, span#shopBucks { background: transparent !important; }\n\
span#shopCoins a, span#shopCoins button, span#shopBucks a, span#shopBucks button {\n\
  background: transparent !important; border: 1px solid ' + ui + ' !important; color: ' + ui + ' !important;\n\
}\n\
\n\
/* SELECT */\n\
#settingsTabsContent select, #germsfoxSettingsCard select {\n\
  border: 2px solid ' + ui + ' !important; background-color: ' + fondo + ' !important;\n\
  color: ' + ui + ' !important; outline: none !important; border-radius: 4px !important;\n\
}\n\
#settingsTabsContent select option, #germsfoxSettingsCard select option {\n\
  background-color: ' + fondo + ' !important; color: ' + ui + ' !important;\n\
}\n\
\n\
.xSettingsCard span.badge.badge-primary {\n\
  background-color: ' + fondo + ' !important; border: 1px solid ' + ui + ' !important; color: ' + ui + ' !important;\n\
}\n\
\n\
/* VERSION LABELS — nunca coloreados por NachGerms */\n\
#ge-nach-label, #ge-nach-label b, #ge-nach-label a,\n\
span#ge-gf-label, span#ge-gf-label * {\n\
  color: unset !important;\n\
}\n\
#ge-nach-label a:hover { text-decoration: underline !important; cursor: pointer !important; }\n\
\n\
/* SCROLLBAR */\n\
::-webkit-scrollbar { width: 5px; }\n\
::-webkit-scrollbar-track { background: transparent; }\n\
::-webkit-scrollbar-thumb { background: ' + ui + '99; border-radius: 3px; }\n\
\n\
/* CELL BG SELECTOR */\n\
#ge-cell-options {\n\
  display: none; position: absolute; bottom: 100%; left: 0; margin-bottom: 6px;\n\
  background: #111; border: 1px solid ' + ui + '66; border-radius: 8px;\n\
  padding: 6px; gap: 5px; flex-direction: row; z-index: 9999;\n\
  box-shadow: 0 4px 16px rgba(0,0,0,.6);\n\
}\n\
#ge-cell-options.open { display: flex; }\n\
.ge-cell-opt {\n\
  width: 28px; height: 28px; border-radius: 5px; cursor: pointer;\n\
  border: 2px solid #444; transition: border-color .15s, transform .1s; box-sizing: border-box;\n\
}\n\
.ge-cell-opt:hover { border-color: #fff; transform: scale(1.1); }\n\
.ge-cell-opt.active { border-color: ' + ui + ' !important; box-shadow: 0 0 6px ' + ui + '88; }\n\
.ge-cell-opt[data-val="default"]   { background: linear-gradient(135deg,#555 50%,#333 50%); }\n\
.ge-cell-opt[data-val="invisible"] { background: repeating-conic-gradient(#666 0% 25%,#333 0% 50%) 0 0/10px 10px; }\n\
.ge-cell-opt[data-val="white"]     { background: #ffffff; }\n\
.ge-cell-opt[data-val="black"]     { background: #000000; }\n\
/* GERMSFOX PANEL TEXT */\n\
#germsfoxSettingsCard p,\n\
#germsfoxSettingsCard label:not(.btn),\n\
#germsfoxSettingsCard span:not(.badge),\n\
#germsfoxSettingsTabsContent p,\n\
#germsfoxSettingsTabsContent label:not(.btn),\n\
#germsfox-settings-general p,\n\
#germsfox-settings-general label:not(.btn),\n\
#germsfox-settings-controls p,\n\
#germsfox-settings-controls label:not(.btn),\n\
#germsfox-settings-general .col-md-6[style*="text-align: left"],\n\
#germsfox-settings-controls .col-md-6[style*="text-align: left"],\n\
#germsfox-settings-theme .col-md-6[style*="text-align: left"] {\n\
  color: ' + ui + ' !important;\n\
}\n\
/* SETTINGS GAME TEXT */\n\
#settings-controls p, #settings-controls label,\n\
#settings-controls div[style*="font-size"],\n\
#settings-gameplay p, #settings-gameplay label,\n\
#settings-general p, #settings-general label,\n\
#settings-graphics p, #settings-graphics label {\n\
  color: ' + ui + ' !important;\n\
}\n\
';

  var etiqueta = document.createElement('style');
  etiqueta.id  = 'ge-bordes-estilos';
  etiqueta.textContent = css;
  document.head.appendChild(etiqueta);

  var gfBtn = document.getElementById('germsfoxButton');
  if (gfBtn) {
    gfBtn.style.setProperty('background-color', fondo, 'important');
    gfBtn.style.setProperty('color', ui, 'important');
  }
  var shopCard = document.getElementById('shopCard');
  if (shopCard) shopCard.style.setProperty('background-color', fondo, 'important');
  var rankingsCard = document.getElementById('rankingsCard');
  if (rankingsCard) rankingsCard.style.setProperty('background-color', fondo, 'important');
  var skinsCard = document.getElementById('skinsCard');
  if (skinsCard) skinsCard.style.setProperty('background-color', fondo, 'important');
}

// ─── TEXT COLOR ───────────────────────────────────────────────────────────────
// Solo corre cuando el jugador está en el lobby (no en partida).

function aplicarColorTexto(ui) {
  if (estaEnJuego()) return;

  document.querySelectorAll('p,label,h1,h2,h3,h4,h5,h6,td,th,li,span,i,b,strong')
    .forEach(function(el) {
      for (var z = 0; z < ZONAS_EXCLUIDAS.length; z++) {
        if (el.closest(ZONAS_EXCLUIDAS[z])) return;
      }
      var clase = (el.className && typeof el.className === 'string') ? el.className : '';
      for (var c = 0; c < CLASES_EXCLUIDAS.length; c++) {
        if (clase.includes(CLASES_EXCLUIDAS[c])) return;
      }
      if (el.id === 'cellName') return;
      if (el.classList && el.classList.contains('fa-play')) {
        el.style.setProperty('color', colorFondo, 'important'); return;
      }
      if ((el.closest('#cellButtons') || el.closest('#lockedButtons')) && el.tagName === 'P') {
        el.style.setProperty('color', colorFondo, 'important'); return;
      }
      if ((el.closest('span#loginCoins') || el.closest('span#loginBucks')) && el.tagName === 'A') {
        el.style.setProperty('color', colorFondo, 'important'); return;
      }
      if (el.closest('#loginNextLevel') || el.closest('#loginNextSkin')) {
        var parent = el.closest('#loginNextLevel') || el.closest('#loginNextSkin');
        var primerP = parent ? parent.querySelector('p') : null;
        el.style.setProperty('color', el === primerP ? colorFondo : ui, 'important');
        return;
      }
      el.style.setProperty('color', ui, 'important');
    });
}

// ─── PROTECT GERMSFOX COLORS ─────────────────────────────────────────────────

function protegerColoresGermsfox() {
  if (estaEnJuego()) return;

  document.querySelectorAll('[style*="color"]').forEach(function(el) {
    if (el.closest('#partyText')) return;
    if (el.id === 'loginEXP') return;
    if (el.classList && el.classList.contains('fa-play')) {
      el.style.setProperty('color', colorFondo, 'important'); return;
    }
    if (el.classList && el.classList.contains('fa-cog') && el.closest('button#settingsButton')) {
      el.style.setProperty('color', colorUI, 'important'); return;
    }
    if (el.classList && el.classList.contains('fa-search') && el.closest('button#spectate')) {
      el.style.setProperty('color', colorUI, 'important'); return;
    }
    if (el.classList && (el.classList.contains('fa-cog') || el.classList.contains('fa-search'))) {
      el.style.setProperty('color', colorFondo, 'important'); return;
    }
    if (el.closest('div.gm.active')) return;
    if (el.closest('#loginNextLevel') || el.closest('#loginNextSkin')) return;
    if (el.closest('#cellButtons') && el.tagName === 'P') return;
    if (el.closest('#lockedButtons') && el.tagName === 'P') return;
    if (el.closest('span#loginCoins') && (el.tagName === 'A' || el.closest('a'))) return;
    if (el.closest('span#loginBucks') && (el.tagName === 'A' || el.closest('a'))) return;
    var c = el.style.color;
    if (c) el.style.setProperty('color', c, 'important');
  });
}

// ─── GAME MODES COLOR ────────────────────────────────────────────────────────

function aplicarColorModos() {
  document.querySelectorAll('div.gm.active, div.gm.active *').forEach(function(el) {
    if (el.tagName === 'IMG' || el.tagName === 'CANVAS') return;
    el.style.setProperty('color', colorFondo, 'important');
  });
  document.querySelectorAll('#gamemodes .gm:not(.active), #gamemodes .gm:not(.active) *').forEach(function(el) {
    if (el.tagName === 'IMG' || el.tagName === 'CANVAS') return;
    el.style.setProperty('color', colorUI, 'important');
  });
}

// ─── MUTATION OBSERVERS ──────────────────────────────────────────────────────

var _throttleTimer = null;
var _applying = false;

new MutationObserver(function() {
  if (_throttleTimer || _applying) return;
  _throttleTimer = setTimeout(function() {
    _applying = true;
    aplicarColorTexto(colorUI);
    protegerColoresGermsfox();
    var partyTextB = document.querySelector('#partyText b');
    if (partyTextB) partyTextB.style.setProperty('color', colorUI, 'important');
    _applying = false;
    _throttleTimer = null;
  }, 400);
}).observe(document.body, { childList: true, subtree: true });

new MutationObserver(function() {
  aplicarColorModos();
}).observe(document.body, {
  childList: true, subtree: true,
  attributes: true, attributeFilter: ['style', 'class']
});

new MutationObserver(function() {
  patchVersionTag();
}).observe(document.body, { childList: true, subtree: true });

// ─── LISTEN FOR POPUP CHANGES ────────────────────────────────────────────────

chrome.storage.onChanged.addListener(function(changes, area) {
  if (area !== 'local') return;
  if (changes.colorUI)    colorUI    = changes.colorUI.newValue;
  if (changes.colorFondo) colorFondo = changes.colorFondo.newValue;
  if (changes.cellBg)     cellBg     = changes.cellBg.newValue;
  if (changes.menuZoom) {
    menuZoom = changes.menuZoom.newValue;
    _setZoom();
    // Re-position the in-page panel after the menu rescales
    var nachWrap = document.getElementById('ge-nach-wrap');
    if (nachWrap && nachWrap._reposition) nachWrap._reposition();
  }
  aplicarEstilos(colorUI, colorFondo);
  aplicarColorTexto(colorUI);
  protegerColoresGermsfox();

  var trigger = document.getElementById('ge-cellbg-selector');
  if (trigger) trigger.style.borderColor = colorUI;
  var activeOpt = document.querySelector('#ge-cellbg-popup [data-cellval="' + cellBg + '"]');
  if (activeOpt) activeOpt.style.borderColor = colorUI;
});

// Live color preview from popup (bypasses storage round-trip)
chrome.runtime.onMessage.addListener(function(msg) {
  if (!msg || msg.type !== 'NACH_LIVE') return;
  if (msg.data.colorUI !== undefined)    colorUI    = msg.data.colorUI;
  if (msg.data.colorFondo !== undefined) colorFondo = msg.data.colorFondo;
  aplicarEstilos(colorUI, colorFondo);
  aplicarColorTexto(colorUI);
  protegerColoresGermsfox();
  var trigger = document.getElementById('ge-cellbg-selector');
  if (trigger) trigger.style.borderColor = colorUI;
  var activeOpt = document.querySelector('#ge-cellbg-popup [data-cellval="' + cellBg + '"]');
  if (activeOpt) activeOpt.style.borderColor = colorUI;
});

// ─── HIDE PANEL WHILE IN GAME ────────────────────────────────────────────────

function actualizarVisibilidadPanel() {
  var wrap = document.getElementById('ge-nach-wrap');
  if (!wrap) return;
  // Hide while in game
  if (estaEnJuego()) { wrap.style.display = 'none'; return; }
  // Hide while any overlay is open
  var overlays = ['shop', 'settings', 'skins', 'rankings'];
  for (var i = 0; i < overlays.length; i++) {
    var el = document.getElementById(overlays[i]);
    if (el && el.offsetParent !== null && window.getComputedStyle(el).display !== 'none') {
      wrap.style.display = 'none';
      return;
    }
  }
  wrap.style.display = '';
}

new MutationObserver(actualizarVisibilidadPanel)
  .observe(document.body, { attributes: true, attributeFilter: ['style'], subtree: true });

// ─── FORCE-LOAD SHOP SKIN IMAGES ─────────────────────────────────────────────
// Germs.io uses lazy loading (data-src) for shop images; NachGerms CSS can
// prevent the IntersectionObserver from firing, so we copy data-src → src.

function loadShopImages() {
  document.querySelectorAll('#shopContent img[data-src]').forEach(function(img) {
    var lazySrc = img.getAttribute('data-src');
    if (lazySrc && img.getAttribute('src') !== lazySrc) {
      img.setAttribute('src', lazySrc);
    }
  });
}

// Fire when a shop tab is clicked
var shopNav = document.getElementById('shopNav');
if (shopNav) {
  shopNav.addEventListener('click', function() { setTimeout(loadShopImages, 100); });
}

// Fire when the shop itself opens (display changes from none → block)
new MutationObserver(function() {
  var shop = document.getElementById('shop');
  if (shop && shop.style.display !== 'none' && shop.offsetParent !== null) {
    loadShopImages();
  }
}).observe(document.body, { attributes: true, attributeFilter: ['style'], subtree: true });

// ─── INIT ────────────────────────────────────────────────────────────────────

function nachInit(data) {
  colorUI    = data.colorUI;
  colorFondo = data.colorFondo;
  cellBg     = data.cellBg;
  menuZoom   = (typeof data.menuZoom === 'number' && isFinite(data.menuZoom)) ? data.menuZoom : 1.0;

  aplicarEstilos(colorUI, colorFondo);
  aplicarColorTexto(colorUI);
  protegerColoresGermsfox();
  aplicarColorModos();
  initXPBar();
  injectNachPanel();
  setTimeout(injectCellBgSelector, 500);
  [500, 1000, 2000, 4000, 8000].forEach(function(ms) { setTimeout(patchVersionTag, ms); });

  if (menuZoom < 1.0) applyZoom(menuZoom);

  setTimeout(function() {
    aplicarEstilos(colorUI, colorFondo);
    aplicarColorTexto(colorUI);
    protegerColoresGermsfox();
    patchVersionTag();
    injectCellBgSelector();
    loadShopImages();
  }, 2000);
}

NachStorage.get(nachInit);
