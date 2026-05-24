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
// Initialised from chrome.storage.local on load; updated on popup changes.

var colorUI    = NACH_DEFAULTS.colorUI;
var colorFondo = NACH_DEFAULTS.colorFondo;
var cellBg     = NACH_DEFAULTS.cellBg;

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
\n\
/* PARTY DESCRIPTION TEXT */\n\
div.partyText {\n\
  color: ' + ui + ' !important;\n\
}\n\
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
#germsfoxSettingsTabsContent, #germsfox-settings-general,\n\
#germsfox-settings-controls, #germsfox-settings-theme,\n\
#germsfox-settings-blocklist { background-color: transparent !important; }\n\
#germsfoxSettingsTabs { background-color: transparent !important; }\n\
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
#shopTabCoins > ul, #shopTabBoosts > ul, #shopTabBucks > ul,\n\
#shopTabLocked li, #shopTabVeteran li, #shopTabPremium li,\n\
#shopTabCoins li, #shopTabBoosts li, #shopTabBucks li {\n\
  background: transparent !important; background-color: transparent !important;\n\
}\n\
\n\
span#shopCoins, span#shopBucks { background: transparent !important; }\n\
span#shopCoins a, span#shopCoins button, span#shopBucks a, span#shopBucks button {\n\
  background: transparent !important; border: 1px solid ' + ui + ' !important; color: ' + ui + ' !important;\n\
}\n\
\n\
label[for="skinsInput"] { outline: 2px solid ' + ui + ' !important; outline-offset: 1px !important; }\n\
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
#germsfoxSettingsCard label,\n\
#germsfoxSettingsCard span:not(.badge),\n\
#germsfoxSettingsTabsContent p,\n\
#germsfoxSettingsTabsContent label,\n\
#germsfox-settings-general p,\n\
#germsfox-settings-general label,\n\
#germsfox-settings-controls p,\n\
#germsfox-settings-controls label,\n\
#germsfox-settings-controls div[style*="font-size"],\n\
#germsfox-settings-general div[style*="font-size"] {\n\
  color: ' + ui + ' !important;\n\
}\n\
\n\
/* SETTINGS GAME TEXT */\n\
#settings-controls p,\n\
#settings-controls label,\n\
#settings-controls div[style*="font-size"],\n\
#settings-gameplay p,\n\
#settings-gameplay label,\n\
#settings-general p,\n\
#settings-general label,\n\
#settings-graphics p,\n\
#settings-graphics label {\n\
  color: ' + ui + ' !important;\n\
}\n\
';

  var etiqueta = document.createElement('style');
  etiqueta.id  = 'ge-bordes-estilos';
  etiqueta.textContent = css;
  document.head.appendChild(etiqueta);

  // Patch inline styles on key elements
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

function aplicarColorTexto(ui) {
  document.querySelectorAll('p,label,h1,h2,h3,h4,h5,h6,td,th,li,span,i,b,strong')
    .forEach(function (el) {
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
  document.querySelectorAll('[style*="color"]').forEach(function (el) {
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
  document.querySelectorAll('div.gm.active, div.gm.active *').forEach(function (el) {
    if (el.tagName === 'IMG' || el.tagName === 'CANVAS') return;
    el.style.setProperty('color', colorFondo, 'important');
  });
  document.querySelectorAll('#gamemodes .gm:not(.active), #gamemodes .gm:not(.active) *').forEach(function (el) {
    if (el.tagName === 'IMG' || el.tagName === 'CANVAS') return;
    el.style.setProperty('color', colorUI, 'important');
  });
}

// ─── MUTATION OBSERVERS ──────────────────────────────────────────────────────

var _throttleTimer = null;
new MutationObserver(function () {
  if (_throttleTimer) return;
  _throttleTimer = setTimeout(function () {
    aplicarColorTexto(colorUI);
    protegerColoresGermsfox();
    var partyTextB = document.querySelector('#partyText b');
    if (partyTextB) partyTextB.style.setProperty('color', colorUI, 'important');
    _throttleTimer = null;
  }, 300);
}).observe(document.body, { childList: true, subtree: true });

new MutationObserver(function () {
  aplicarColorModos();
}).observe(document.body, {
  childList: true, subtree: true,
  attributes: true, attributeFilter: ['style', 'class']
});

new MutationObserver(function () {
  patchVersionTag();
  var gfLabel  = document.getElementById('ge-gf-label');
  var nachLabel = document.getElementById('ge-nach-label');
  if (gfLabel) gfLabel.style.setProperty('color', colorUI, 'important');
  var nachB = nachLabel ? nachLabel.querySelector('b') : null;
  if (nachB) nachB.style.setProperty('color', colorUI, 'important');
}).observe(document.body, { childList: true, subtree: true });

// ─── LISTEN FOR POPUP CHANGES ────────────────────────────────────────────────
// The popup writes to chrome.storage.local; we react immediately here.

chrome.storage.onChanged.addListener(function (changes, area) {
  if (area !== 'local') return;
  if (changes.colorUI)    colorUI    = changes.colorUI.newValue;
  if (changes.colorFondo) colorFondo = changes.colorFondo.newValue;
  if (changes.cellBg)     cellBg     = changes.cellBg.newValue;
  aplicarEstilos(colorUI, colorFondo);
  aplicarColorTexto(colorUI);
  protegerColoresGermsfox();

  // Sync cell bg selector border color
  var trigger = document.getElementById('ge-cellbg-selector');
  if (trigger) trigger.style.borderColor = colorUI;
  var activeOpt = document.querySelector('#ge-cellbg-popup [data-cellval="' + cellBg + '"]');
  if (activeOpt) activeOpt.style.borderColor = colorUI;
  var gfLabel  = document.getElementById('ge-gf-label');
  var nachLabel = document.getElementById('ge-nach-label');
  if (gfLabel) gfLabel.style.setProperty('color', colorUI, 'important');
  var nachB = nachLabel ? nachLabel.querySelector('b') : null;
  if (nachB) nachB.style.setProperty('color', colorUI, 'important');
});

// ─── INIT ────────────────────────────────────────────────────────────────────

function nachInit(data) {
  colorUI    = data.colorUI;
  colorFondo = data.colorFondo;
  cellBg     = data.cellBg;

  aplicarEstilos(colorUI, colorFondo);
  aplicarColorTexto(colorUI);
  protegerColoresGermsfox();
  aplicarColorModos();
  initXPBar();
  setTimeout(injectCellBgSelector, 500);
  [500, 1000, 2000, 4000, 8000].forEach(function (ms) { setTimeout(patchVersionTag, ms); });

  // Re-apply after React/game hydration
  setTimeout(function () {
    aplicarEstilos(colorUI, colorFondo);
    aplicarColorTexto(colorUI);
    protegerColoresGermsfox();
    patchVersionTag();
    injectCellBgSelector();
  }, 2000);
}

NachStorage.get(nachInit);
