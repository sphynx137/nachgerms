// ==UserScript==
// @name         Germs.io - Nach☆ Color
// @namespace    germs-tema
// @version      1.2.9
// @updateURL    https://nachgerms.pages.dev/NachGerms-UIPanel.user.js
// @downloadURL  https://nachgerms.pages.dev/NachGerms-UIPanel.user.js
// @description  UI Color (bordes+texto) y fondo personalizables. Compatible con Germsfox.
// @match        https://germs.io/*
// @match        https://*.germs.io/*
// @run-at       document-end
// @grant        none
// ==/UserScript==

(function () {

  const UI_DEFAULT = '#00eeff';
  const BG_DEFAULT = '#000000';

  let colorUI    = localStorage.getItem('germs-color-ui')    || UI_DEFAULT;
  let colorFondo = localStorage.getItem('germs-color-fondo') || BG_DEFAULT;
  let cellBg     = localStorage.getItem('germs-cell-bg')     || 'default';

  // CSS
  function aplicarEstilos(ui, fondo) {
    const existente = document.getElementById('ge-bordes-estilos');
    if (existente) existente.remove();

    var cellBgColor = cellBg === 'black'     ? '#000000'
                    : cellBg === 'white'     ? '#ffffff'
                    : cellBg === 'invisible' ? 'transparent'
                    : 'unset';

    const css = `
      /* CELL BG */
      ${cellBg !== 'default' ? `#cellContainer { background-color: ${cellBgColor} !important; }` : ''}

      /* BORDES */
      div[class*="panel"],
      div[class*="card"],
      div[class*="box"],
      div[class*="menu"],
      div[class*="modal"],
      div[class*="popup"],
      div[class*="sidebar"],
      div[class*="widget"],
      div[class*="section"],
      #profile, #play, #modes,
      #social, #settings, #shop,
      .ui-panel, .game-panel {
        border: 2px solid ${ui} !important;
        box-shadow: 0 0 6px ${ui}33 !important;
        outline: none !important;
      }

      /* FONDO */
      div[class*="panel"]:not(#cellPanel),
      div[class*="card"],
      div[class*="menu"],
      div[class*="sidebar"],
      div[class*="section"],
      #profile, #play, #modes,
      #social, #settings, #shop,
      .ui-panel, .game-panel {
        background-color: ${fondo} !important;
      }

      /* BOTONES */
      button:not(.btn-info),
      input[type="button"]:not(.btn-info),
      input[type="submit"]:not(.btn-info),
      a[class*="btn"]:not(.btn-info),
      div[class*="btn"]:not(.btn-info),
      span[class*="btn"]:not(.btn-info) {
        border: 2px solid ${ui} !important;
        outline: none !important;
      }

      /* INPUTS */
      input[type="text"]:not(#chat_input),
      input[type="search"]:not(#chat_input),
      input:not([type]):not(#chat_input) {
        border: 2px solid ${ui} !important;
        color: ${ui} !important;
        background-color: ${fondo} !important;
        outline: none !important;
      }

      /* CHAT INPUT */
      input#chat_input {
        border: 2px solid ${ui} !important;
        color: #ffffff !important;
        background-color: unset !important;
        outline: none !important;
        box-shadow: none !important;
      }

      textarea {
        border: 2px solid ${ui} !important;
        color: ${ui} !important;
        outline: none !important;
      }

      .form-control:not(#chat_input),
      .form-control[readonly]:not(#chat_input) {
        background-color: ${fondo} !important;
        color: ${ui} !important;
      }

      textarea#nick,
      #nick {
        background-color: ${fondo} !important;
        color: ${ui} !important;
        border: 2px solid ${ui} !important;
      }

      input[type="text"]:focus,
      input:not([type]):focus {
        box-shadow: 0 0 6px ${ui}55 !important;
      }

      /* BARRA XP */
      #loginProgress > div,
      #loginProgress .progress-bar {
        background-color: ${ui} !important;
      }

      /* BOTONES PARTY */
      .partyCard button,
      #partyMenu button,
      div[class*="party"] button {
        background-color: ${fondo} !important;
        border: 2px solid ${ui} !important;
        color: ${ui} !important;
      }

      /* PARTY TEXT B */
      #partyText b,
      div#partyText b {
        color: ${ui} !important;
      }

      /* BTN-INFO */
      button.btn-info,
      .btn.btn-info,
      a.btn-info {
        background-color: ${fondo} !important;
        border: 2px solid ${ui} !important;
        color: ${ui} !important;
      }

      /* BADGES */
      .badge-primary,
      span.badge.badge-primary,
      .badge.badge-pill.badge-primary {
        background-color: ${fondo} !important;
        border: 2px solid ${ui} !important;
        color: ${ui} !important;
      }

      /* TOGGLES */
      .custom-control-input:checked ~ .custom-control-label::before,
      input[type="checkbox"]:checked + label::before,
      .toggle-on, .switch input:checked + span,
      .custom-switch .custom-control-input:checked ~ .custom-control-label::before {
        background-color: ${ui} !important;
        border-color: ${ui} !important;
      }
      .custom-control-label::before,
      input[type="checkbox"] + label::before,
      .toggle-off, .switch span {
        background-color: ${fondo} !important;
        border-color: ${ui} !important;
      }

      /* TABS */
      #settingsTabs,
      .nav.nav-pills {
        flex-wrap: nowrap !important;
        white-space: nowrap !important;
      }
      #settingsTabs .nav-link,
      .nav.nav-pills .nav-link {
        color: ${ui} !important;
        background-color: ${fondo} !important;
        border: 1px solid ${ui}55 !important;
        padding: 4px 10px !important;
        font-size: 13px !important;
        white-space: nowrap !important;
      }
      #settingsTabs .nav-link.active,
      .nav.nav-pills .nav-link.active {
        color: ${fondo} !important;
        background-color: ${ui} !important;
        border: 1px solid ${ui} !important;
      }

      /* SLIDER */
      input[type="range"] {
        -webkit-appearance: none;
        appearance: none;
        background: transparent !important;
        height: 20px !important;
        cursor: pointer;
        accent-color: ${ui};
      }
      input[type="range"]::-webkit-slider-runnable-track {
        height: 3px !important;
        background: transparent !important;
        border: none !important;
        border-bottom: 2px solid ${ui} !important;
        border-radius: 0 !important;
      }
      input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none !important;
        width: 13px !important;
        height: 13px !important;
        border-radius: 50% !important;
        background: ${ui} !important;
        border: 2px solid ${ui} !important;
        margin-top: -5px !important;
        box-shadow: none !important;
        cursor: pointer;
      }
      input[type="range"]::-moz-range-track {
        height: 2px !important;
        background: transparent !important;
        border-bottom: 2px solid ${ui} !important;
        border-radius: 0 !important;
      }
      input[type="range"]::-moz-range-thumb {
        width: 13px !important;
        height: 13px !important;
        border-radius: 50% !important;
        background: ${ui} !important;
        border: 2px solid ${ui} !important;
        box-shadow: none !important;
        cursor: pointer;
      }

      /* BTN-PRIMARY */
      .btn-primary, button.btn-primary, a.btn-primary,
      .btn.btn-primary, .btn-sm.btn-primary {
        background-color: ${fondo} !important;
        border: 2px solid ${ui} !important;
        color: ${ui} !important;
      }
      .btn-primary:hover, button.btn-primary:hover {
        background-color: ${ui}22 !important;
      }

      /* BTN-SUCCESS */
      .btn-success, button.btn-success,
      input.btn-success, a.btn-success {
        background-color: ${ui} !important;
        border: 2px solid ${ui} !important;
        color: ${fondo} !important;
      }

      /* SHOP NAV */
      #shopNav li a {
        color: ${ui} !important;
        background-color: ${fondo} !important;
        border: 1px solid ${ui}55 !important;
      }
      #shopNav li.active a,
      #shopNav li a.active {
        color: ${fondo} !important;
        background-color: ${ui} !important;
        border: 1px solid ${ui} !important;
      }

      /* PARTY TEXT */
      .partyText { color: ${ui} !important; }

      /* MODOS */
      div.gm {
        background-color: ${fondo} !important;
        border: 1px solid ${ui}55 !important;
        color: ${ui} !important;
      }
      div.gm.active, div.gm.active * {
        background-color: inherit;
        color: ${fondo} !important;
      }
      div.gm.active {
        background-color: ${ui} !important;
        border: 2px solid ${fondo} !important;
      }

      /* CONNECTING */
      #connecting {
        background-color: ${fondo} !important;
        border: 2px solid ${ui} !important;
      }

      /* OVERLAYS */
      #settings, #shop, #skins, #rankings {
        background-color: transparent !important;
        backdrop-filter: none !important;
        border: none !important;
        box-shadow: none !important;
        outline: none !important;
      }

      #settingsCard,
      #settingsTabsContent,
      #settings-general,
      #settings-controls,
      #settings-graphics,
      #settings-gameplay {
        background-color: ${fondo} !important;
      }
      #settingsTabs {
        background-color: transparent !important;
      }

      /* SHOP */
      #shopCard {
        background-color: ${fondo} !important;
      }
      #shopContent,
      #shopTabBlocked,
      #shopTabVeteran,
      #shopTabPremium,
      #shopTabCoins,
      #shopTabBoosts,
      #shopTabBucks {
        background-color: transparent !important;
      }

      /* SKINS */
      #skinsCard {
        background-color: ${fondo} !important;
      }
      #skinContainer {
        background-color: transparent !important;
      }

      /* RANKINGS */
      #rankingsCard {
        background-color: ${fondo} !important;
      }
      /* TABLA RANKINGS */
      #rankingsList table {
        background-color: transparent !important;
        border-collapse: collapse !important;
        width: 100% !important;
      }
      #rankingsList thead,
      #rankingsList tbody,
      #rankingsList tr {
        background-color: transparent !important;
      }
      #rankingsList td,
      #rankingsList th {
        background-color: transparent !important;
        border: none !important;
        border-bottom: 1px solid ${ui} !important;
      }
      #rankingsList thead th {
        border-bottom: 2px solid ${ui} !important;
      }

      /* GERMSFOX PANEL */
      #germsfoxSettingsCard {
        background-color: ${fondo} !important;
      }
      #germsfoxSettingsTabsContent,
      #germsfox-settings-general,
      #germsfox-settings-controls,
      #germsfox-settings-theme,
      #germsfox-settings-blocklist {
        background-color: transparent !important;
      }
      #germsfoxSettingsTabs {
        background-color: transparent !important;
      }

      /* MONEDAS */
      i.fa-coins, .fa-coins { color: #ffd700 !important; }

      /* PARTY CODE */
      #partyCopyCode, input.party-token,
      .form-control[readonly] {
        background-color: ${fondo} !important;
      }

      /* SETTINGS / SPECTATE */
      button#settingsButton,
      button#spectate {
        background-color: ${fondo} !important;
        border: 2px solid ${ui} !important;
        color: ${ui} !important;
      }
      button#settingsButton i,
      button#settingsButton .fa-cog,
      button#spectate i,
      button#spectate .fa-search {
        color: ${ui} !important;
      }

      /* GERMSFOX BTN */
      button#germsfoxButton {
        background-color: ${fondo} !important;
        color: ${ui} !important;
      }

      /* BTN CERRAR */
      #settingsClose, #rankingsClose,
      #germsfoxSettingsClose, #shopClose, #skinsClose {
        background: ${fondo} !important;
        color: ${ui} !important;
        border: 2px solid ${ui} !important;
      }

      /* BTN SOCIAL */
      .btn-discord, .btn-google,
      button.btn-discord, button.btn-google {
        color: ${ui} !important;
        border: 2px solid ${ui} !important;
        background-color: ${fondo} !important;
      }

      /* LEVEL */
      #loginNextLevel, #loginNextSkin {
        background-color: ${fondo} !important;
      }
      #loginNextLevel > p:first-child,
      #loginNextSkin > p:first-child {
        background-color: ${ui} !important;
        color: ${fondo} !important;
        border-radius: 4px !important;
        padding: 1px 6px !important;
        display: inline-block !important;
      }

      #loginProgress {
        background-color: transparent !important;
        background: transparent !important;
        border: 2px solid ${ui} !important;
        border-radius: 6px !important;
        box-sizing: border-box !important;
      }

      #loginCoins, #loginBucks, #loginShop,
      #loginGift, #loginLeaderboard {
        background-color: transparent !important;
        background: transparent !important;
      }

      /* CELL COLOR */
      #cellButtons > p {
        background-color: ${ui} !important;
        color: ${fondo} !important;
      }

      /* LOCKED */
      #lockedButtons > p {
        background-color: ${ui} !important;
        color: ${fondo} !important;
      }

      /* COINS/BUCKS */
      span#loginCoins a, span#loginBucks a {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 22px !important;
        height: 22px !important;
        padding: 0 !important;
        background-color: transparent !important;
        color: ${ui} !important;
        border: 1.5px solid ${ui} !important;
        border-radius: 4px !important;
        box-sizing: border-box !important;
        line-height: 1 !important;
        vertical-align: middle !important;
      }
      span#loginCoins a i, span#loginBucks a i {
        color: ${ui} !important;
        font-size: 11px !important;
        line-height: 1 !important;
      }

      /* PLAY */
      button#play,
      #partyMenu button.party-copy,
      #partyMenu .btn-party,
      button.party-copy {
        background-color: ${ui} !important;
        color: ${fondo} !important;
        border: 2px solid ${ui} !important;
      }
      button#play i,
      button#play .fa-play,
      button#play i.fas,
      i.fa-play,
      button.party-copy i {
        color: ${fondo} !important;
      }

      /* PARTY JOIN */
      h4.partyCreate, h4.partyCreate span {
        background-color: ${fondo} !important;
        color: ${ui} !important;
      }

      /* DIVISORES */
      hr, div[class*="divider"], div[class*="separator"] {
        border-color: ${ui}55 !important;
      }

      /* DEBUG TEXT */
      #debugText b {
        color: ${ui} !important;
      }
      #debugText font {
      }

      /* CELL BUTTONS */
      #cellButtons {
        background: transparent !important;
        background-color: transparent !important;
        border: none !important;
        box-shadow: none !important;
      }

      /* AVATAR */
      img#loginAvatar {
        border: 2px solid ${ui} !important;
        border-radius: 6px !important;
        box-shadow: 0 0 8px ${ui}55 !important;
        outline: none !important;
      }

      /* LOGIN NAME */
      h4#loginName,
      #loginName,
      h5#shopName,
      #shopName {
        outline: none !important;
        border: none !important;
        box-shadow: none !important;
        background: transparent !important;
        text-shadow: none !important;
        -webkit-text-stroke: 0 !important;
      }

      /* SHOP TABS */
      #shopTabLocked,
      #shopTabVeteran,
      #shopTabPremium,
      #shopTabCoins,
      #shopTabBoosts,
      #shopTabBucks,
      #shopTabLocked > ul,
      #shopTabVeteran > ul,
      #shopTabPremium > ul,
      #shopTabCoins > ul,
      #shopTabBoosts > ul,
      #shopTabBucks > ul,
      #shopTabLocked li,
      #shopTabVeteran li,
      #shopTabPremium li,
      #shopTabCoins li,
      #shopTabBoosts li,
      #shopTabBucks li {
        background: transparent !important;
        background-color: transparent !important;
      }

      /* SHOP COINS */
      span#shopCoins,
      span#shopBucks {
        background: transparent !important;
        background-color: transparent !important;
      }

      /* SHOP + BTN */
      span#shopCoins a,
      span#shopCoins button,
      span#shopBucks a,
      span#shopBucks button {
        background: transparent !important;
        background-color: transparent !important;
        border: 1px solid ${ui} !important;
        color: ${ui} !important;
      }

      /* IMPORT */
      label[for="skinsInput"] {
        outline: 2px solid ${ui} !important;
        outline-offset: 1px !important;
      }

      /* SETTINGS TEXTO */
      #settings-controls .row > div[style*="font-size"],
      #germsfox-settings-general .row > div[style*="font-size"],
      #germsfox-settings-controls .row > div[style*="font-size"] {
        color: ${ui} !important;
      }

      /* SELECT */
      #settingsTabsContent select,
      #germsfoxSettingsCard select {
        border: 2px solid ${ui} !important;
        background-color: ${fondo} !important;
        color: ${ui} !important;
        outline: none !important;
        border-radius: 4px !important;
      }
      #settingsTabsContent select option,
      #germsfoxSettingsCard select option {
        background-color: ${fondo} !important;
        color: ${ui} !important;
      }

      /* DANGER ZONE */
      .xSettingsCard span.badge.badge-primary {
        background-color: ${fondo} !important;
        border: 1px solid ${ui} !important;
        color: ${ui} !important;
      }

      /* SCROLLBAR */
      ::-webkit-scrollbar { width: 5px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb {
        background: \${ui}99;
        border-radius: 3px;
      }

      /* CELL BG SELECTOR */
      #ge-cell-options {
        display: none; position: absolute;
        bottom: 100%; left: 0; margin-bottom: 6px;
        background: #111; border: 1px solid \${ui}66;
        border-radius: 8px; padding: 6px; gap: 5px;
        flex-direction: row; z-index: 9999;
        box-shadow: 0 4px 16px rgba(0,0,0,.6);
      }
      #ge-cell-options.open { display: flex; }
      .ge-cell-opt {
        width: 28px; height: 28px; border-radius: 5px;
        cursor: pointer; border: 2px solid #444;
        transition: border-color .15s, transform .1s;
        box-sizing: border-box;
      }
      .ge-cell-opt:hover { border-color: #fff; transform: scale(1.1); }
      .ge-cell-opt.active { border-color: \${ui} !important; box-shadow: 0 0 6px \${ui}88; }
      .ge-cell-opt[data-val="default"]   { background: linear-gradient(135deg,#555 50%,#333 50%); }
      .ge-cell-opt[data-val="invisible"] { background: repeating-conic-gradient(#666 0% 25%,#333 0% 50%) 0 0/10px 10px; }
      .ge-cell-opt[data-val="white"]     { background: #ffffff; }
      .ge-cell-opt[data-val="black"]     { background: #000000; }
    `;

    const etiqueta = document.createElement('style');
    etiqueta.id = 'ge-bordes-estilos';
    etiqueta.textContent = css;
    document.head.appendChild(etiqueta);

    // Germsfox btn
    var gfBtn = document.getElementById('germsfoxButton');
    if (gfBtn) {
      gfBtn.style.setProperty('background-color', fondo, 'important');
      gfBtn.style.setProperty('color', ui, 'important');
    }

    // Shop
    var shopCard = document.getElementById('shopCard');
    if (shopCard) shopCard.style.setProperty('background-color', fondo, 'important');
    var shopContent = document.getElementById('shopContent');
    if (shopContent) shopContent.style.setProperty('background-color', 'transparent', 'important');

    // Rankings
    var rankingsCard = document.getElementById('rankingsCard');
    if (rankingsCard) rankingsCard.style.setProperty('background-color', fondo, 'important');

    // Skins
    var skinsCard = document.getElementById('skinsCard');
    if (skinsCard) skinsCard.style.setProperty('background-color', fondo, 'important');
  }

  const ZONAS_EXCLUIDAS = [
    '.color-picker',
    '#cellContainer',
    '#leaderboardList',
    '#debugText',
    '#chat',
    '#worldTab',
    '#ge-panel-control',
    '#partyText',
    '#germsfoxInfo',  
    '#ge-nach-label',
    'a#version',
    '#version',
    '[for="skinsInput"]'
  ];
  const CLASES_EXCLUIDAS = ['name','nick','player','cell','tag','picker','fa-coins','fa-play','fa-cog','fa-search'];

  function aplicarColorTexto(ui) {
    document.querySelectorAll('p,label,h1,h2,h3,h4,h5,h6,td,th,li,span,i,b,strong')
      .forEach(function (el) {
        for (const zona of ZONAS_EXCLUIDAS) {
          if (el.closest(zona)) return;
        }
        const clase = (el.className && typeof el.className === 'string') ? el.className : '';
        for (const c of CLASES_EXCLUIDAS) {
          if (clase.includes(c)) return;
        }
        if (el.id === 'cellName') return;

        if (el.classList && el.classList.contains('fa-play')) {
          el.style.setProperty('color', colorFondo, 'important');
          return;
        }

        if ((el.closest('#cellButtons') || el.closest('#lockedButtons')) && el.tagName === 'P') {
          el.style.setProperty('color', colorFondo, 'important');
          return;
        }
        if ((el.closest('span#loginCoins') || el.closest('span#loginBucks')) && el.tagName === 'A') {
          el.style.setProperty('color', colorFondo, 'important');
          return;
        }
        if (el.closest('#loginNextLevel') || el.closest('#loginNextSkin')) {
          const parent = el.closest('#loginNextLevel') || el.closest('#loginNextSkin');
          const primerP = parent ? parent.querySelector('p') : null;
          if (el === primerP) {
            el.style.setProperty('color', colorFondo, 'important');
          } else {
            el.style.setProperty('color', ui, 'important');
          }
          return;
        }
        el.style.setProperty('color', ui, 'important');
      });
  }

  function protegerColoresGermsfox() {
    document.querySelectorAll('[style*="color"]').forEach(function (el) {
      if (el.closest('#ge-panel-control')) return;
      if (el.closest('#partyText')) return;
      if (el.id === 'loginEXP') return;
      if (el.classList && el.classList.contains('fa-play')) {
        el.style.setProperty('color', colorFondo, 'important');
        return;
      }
      if (el.classList && el.classList.contains('fa-cog') && el.closest('button#settingsButton')) {
        el.style.setProperty('color', colorUI, 'important');
        return;
      }
      if (el.classList && el.classList.contains('fa-search') && el.closest('button#spectate')) {
        el.style.setProperty('color', colorUI, 'important');
        return;
      }
      if (el.classList && (el.classList.contains('fa-cog') || el.classList.contains('fa-search'))) {
        el.style.setProperty('color', colorFondo, 'important');
        return;
      }
      if (el.closest('div.gm.active')) return;
      if (el.closest('#loginNextLevel') || el.closest('#loginNextSkin')) return;
      if (el.closest('#cellButtons') && el.tagName === 'P') return;
      if (el.closest('#lockedButtons') && el.tagName === 'P') return;
      if (el.closest('span#loginCoins') && (el.tagName === 'A' || el.closest('a'))) return;
      if (el.closest('span#loginBucks') && (el.tagName === 'A' || el.closest('a'))) return;

      const c = el.style.color;
      if (c) el.style.setProperty('color', c, 'important');
    });
  }

  let throttleTimer = null;
  new MutationObserver(function () {
    if (throttleTimer) return;
    throttleTimer = setTimeout(function () {
      aplicarColorTexto(colorUI);
      protegerColoresGermsfox();

      const partyTextB = document.querySelector('#partyText b');
      if (partyTextB) partyTextB.style.setProperty('color', colorUI, 'important');
      throttleTimer = null;
    }, 300);
  }).observe(document.body, { childList: true, subtree: true });

  // OBSERVER MODOS
  function aplicarColorModos() {
    document.querySelectorAll('div.gm.active, div.gm.active *')
      .forEach(function (el) {
        if (el.tagName === 'IMG' || el.tagName === 'CANVAS') return;
        el.style.setProperty('color', colorFondo, 'important');
      });
    document.querySelectorAll('#gamemodes .gm:not(.active), #gamemodes .gm:not(.active) *')
      .forEach(function (el) {
        if (el.tagName === 'IMG' || el.tagName === 'CANVAS') return;
        el.style.setProperty('color', colorUI, 'important');
      });
  }

  new MutationObserver(function () {
    aplicarColorModos();
  }).observe(document.body, {
    childList: true, subtree: true,
    attributes: true, attributeFilter: ['style', 'class']
  });

  // PANEL
  function crearPanelControl() {
    if (document.getElementById('ge-panel-control')) return;

    const panel = document.createElement('div');
    panel.id = 'ge-panel-control';
    panel.style.cssText = `
      position: fixed; bottom: 16px; right: 16px;
      z-index: 2147483647; background: #111111;
      border: 2px solid ${colorUI}; border-radius: 8px;
      padding: 10px 14px; display: flex; flex-direction: column;
      gap: 7px; font-family: Arial, sans-serif; font-size: 11px;
      color: #aaaaaa; user-select: none;
    `;

    panel.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="min-width:80px;letter-spacing:1px;color:#aaa;">UI COLOR</span>
        <input type="color" id="ge-picker-ui" value="${colorUI}"
          style="width:28px;height:22px;border:none;background:none;cursor:pointer;padding:0;">
        <span id="ge-picker-ui-label" style="color:#555;min-width:52px;">${colorUI}</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="min-width:80px;letter-spacing:1px;color:#aaa;">BACKGROUND</span>
        <input type="color" id="ge-picker-fondo" value="${colorFondo}"
          style="width:28px;height:22px;border:none;background:none;cursor:pointer;padding:0;">
        <span id="ge-picker-fondo-label" style="color:#555;min-width:52px;">${colorFondo}</span>
      </div>
    `;

    document.body.appendChild(panel);

    document.getElementById('ge-picker-ui').addEventListener('input', function (e) {
      colorUI = e.target.value;
      document.getElementById('ge-picker-ui-label').textContent = colorUI;
      panel.style.borderColor = colorUI;
      localStorage.setItem('germs-color-ui', colorUI);
      aplicarEstilos(colorUI, colorFondo);
      aplicarColorTexto(colorUI);
      protegerColoresGermsfox();
      var gfLabel = document.getElementById('ge-gf-label');
      var nachLabel = document.getElementById('ge-nach-label');
      if (gfLabel) gfLabel.style.setProperty('color', colorUI, 'important');
var nachB = nachLabel ? nachLabel.querySelector('b') : null;
if (nachB) nachB.style.setProperty('color', colorUI, 'important');
      var cellTrigger = document.getElementById('ge-cellbg-selector');
      if (cellTrigger) cellTrigger.style.borderColor = colorUI;
      var activeOpt = document.querySelector('#ge-cellbg-popup [data-cellval="' + cellBg + '"]');
      if (activeOpt) activeOpt.style.borderColor = colorUI;
    });

    document.getElementById('ge-picker-fondo').addEventListener('input', function (e) {
      colorFondo = e.target.value;
      document.getElementById('ge-picker-fondo-label').textContent = colorFondo;
      localStorage.setItem('germs-color-fondo', colorFondo);
      aplicarEstilos(colorUI, colorFondo);
      aplicarColorTexto(colorUI);
      protegerColoresGermsfox();
    });

  }

  // VERSION TAG
  // ⚠️ cambiar también en @version del header
  var SCRIPT_VERSION = '2.0.9';

  function patchVersionTag() {
    var ver = document.getElementById('version');
    if (!ver) return;

    var gfInfo = document.getElementById('germsfoxInfo');
    if (gfInfo && !document.getElementById('ge-gf-label')) {
      var gfText = (gfInfo.textContent || gfInfo.innerText || '').trim();
      if (gfText) {
        var colonIdx = gfText.indexOf(':');
        var wordGF  = colonIdx > -1 ? gfText.slice(0, colonIdx) : gfText;
        var restGF  = colonIdx > -1 ? gfText.slice(colonIdx) : '';
        gfInfo.innerHTML = '';
        var gfSpan = document.createElement('span');
        gfSpan.id = 'ge-gf-label';
        gfSpan.style.cssText = 'color:' + colorUI + ' !important; font-weight:700 !important';
        gfSpan.textContent = wordGF;
        gfInfo.appendChild(gfSpan);
        if (restGF) gfInfo.appendChild(document.createTextNode(restGF));
      }
    }

    var existingNach = document.getElementById('ge-nach-label');
    if (existingNach && existingNach.textContent.indexOf(SCRIPT_VERSION) === -1) {
      var prevSep = existingNach.previousSibling;
      if (prevSep && prevSep.nodeType === 3) prevSep.parentNode.removeChild(prevSep);
      existingNach.parentNode.removeChild(existingNach);
      existingNach = null;
    }
    if (!existingNach) {
      var spans = ver.querySelectorAll('span');
      var targetSpan = null;
      for (var i = 0; i < spans.length; i++) {
        if (spans[i].textContent.indexOf('|') !== -1) { targetSpan = spans[i]; break; }
      }
      if (!targetSpan && spans.length > 0) targetSpan = spans[0];
      if (targetSpan) {
        var sep = document.createTextNode(' | ');
        var nach = document.createElement('span');
        nach.id = 'ge-nach-label';
        var nachLink = document.createElement('a');
        nachLink.href = 'https://nachgerms.pages.dev/NachGerms-UIPanel.user.js';
        nachLink.target = '_blank';
        nachLink.rel = 'noopener noreferrer';
        nachLink.style.cssText = 'text-decoration:none;cursor:pointer';
        nachLink.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          window.open('https://nachgerms.pages.dev/NachGerms-UIPanel.user.js', '_blank');
        }, true);
        var nachB = document.createElement('b');
        nachB.style.cssText = 'color:' + colorUI + ' !important;font-weight:900 !important';
        nachB.textContent = 'Nch\u2606';
        nachLink.appendChild(nachB);
        nach.appendChild(nachLink);
        nach.appendChild(document.createTextNode(': ' + SCRIPT_VERSION));
        targetSpan.appendChild(sep);
        targetSpan.appendChild(nach);
      }
    }
  }

  new MutationObserver(function() {
    patchVersionTag();
    var gfLabel = document.getElementById('ge-gf-label');
    var nachLabel = document.getElementById('ge-nach-label');
    if (gfLabel) gfLabel.style.setProperty('color', colorUI, 'important');
var nachB = nachLabel ? nachLabel.querySelector('b') : null;
if (nachB) nachB.style.setProperty('color', colorUI, 'important');
  }).observe(document.body, { childList: true, subtree: true });

  [500, 1000, 2000, 4000, 8000].forEach(function(ms) {
    setTimeout(patchVersionTag, ms);
  });

  // CELL BG SELECTOR
  function injectCellBgSelector() {
    if (document.getElementById('ge-cellbg-selector')) return;
    var cellContainer = document.getElementById('cellContainer');
    if (!cellContainer) return;

    cellContainer.style.position = 'relative';

    function currentBg() {
      if (cellBg === 'white')     return '#ffffff';
      if (cellBg === 'black')     return '#000000';
      if (cellBg === 'invisible') return 'repeating-conic-gradient(#666 0% 25%,#333 0% 50%) 0 0/8px 8px';
      return 'linear-gradient(135deg,#555 50%,#333 50%)';
    }

    var trigger = document.createElement('div');
    trigger.id = 'ge-cellbg-selector';
    trigger.style.cssText = [
      'position:absolute',
      'bottom:6px',
      'left:6px',
      'width:22px',
      'height:22px',
      'border-radius:5px',
      'border:2px solid ' + colorUI,
      'background:transparent',
      'cursor:pointer',
      'z-index:100',
      'box-sizing:border-box',
      'box-shadow:0 2px 8px rgba(0,0,0,.5)',
      'transition:transform .1s'
    ].join(';');
    trigger.title = 'Cell BG';

    var popup = document.createElement('div');
    popup.id = 'ge-cellbg-popup';
    popup.style.cssText = [
      'display:none',
      'position:absolute',
      'bottom:0',
      'left:28px',
      'background:transparent',
      'border:none',
      'border-radius:0',
      'padding:0 0 0 5px',
      'gap:5px',
      'flex-direction:row',
      'align-items:center',
      'z-index:200'
    ].join(';');

    var opts = [
      { val:'default',   title:'Default',   bg:'linear-gradient(135deg,#555 50%,#333 50%)' },
      { val:'invisible', title:'Transparent',  bg:'repeating-conic-gradient(#666 0% 25%,#333 0% 50%) 0 0/8px 8px' },
      { val:'white',     title:'White',      bg:'#ffffff' },
      { val:'black',     title:'Black',      bg:'#000000' }
    ];

    opts.forEach(function(o) {
      var btn = document.createElement('div');
      btn.title = o.title;
      btn.setAttribute('data-cellval', o.val);
      btn.style.cssText = [
        'width:22px','height:22px','border-radius:4px',
        'cursor:pointer','box-sizing:border-box',
        'border:2px solid ' + (cellBg === o.val ? colorUI : '#444'),
        'background:' + o.bg,
        'transition:border-color .15s,transform .1s',
        'flex-shrink:0'
      ].join(';');
      btn.addEventListener('mouseenter', function() { btn.style.transform = 'scale(1.1)'; });
      btn.addEventListener('mouseleave', function() { btn.style.transform = 'scale(1)'; });
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        cellBg = o.val;
        localStorage.setItem('germs-cell-bg', cellBg);
        popup.querySelectorAll('[data-cellval]').forEach(function(b) {
          b.style.borderColor = b.getAttribute('data-cellval') === cellBg ? colorUI : '#444';
        });
        trigger.style.background = 'transparent';
        trigger.style.backdropFilter = 'none';
        popup.style.display = 'none';
        aplicarEstilos(colorUI, colorFondo, cellBg);
      });
      popup.appendChild(btn);
    });

    trigger.addEventListener('click', function(e) {
      e.stopPropagation();
      var isOpen = popup.style.display === 'flex';
      popup.style.display = isOpen ? 'none' : 'flex';
    });
    trigger.addEventListener('mouseenter', function() { trigger.style.transform = 'scale(1.1)'; });
    trigger.addEventListener('mouseleave', function() { trigger.style.transform = 'scale(1)'; });
    document.addEventListener('click', function() { popup.style.display = 'none'; });
    popup.addEventListener('click', function(e) { e.stopPropagation(); });

    trigger.appendChild(popup);
    cellContainer.appendChild(trigger);
  }

  function setupPanelVisibility() {
    document.addEventListener('click', function(e) {
      const playBtn = e.target.closest('button#play, button.btn-play, [id="play"]');
      if (playBtn) {
        const panel = document.getElementById('ge-panel-control');
        if (panel) panel.style.display = 'none';
      }
    }, true);

    const menuEl = document.getElementById('menu');
    if (menuEl) {
      new MutationObserver(function() {
        const panel = document.getElementById('ge-panel-control');
        if (!panel) return;
        const menuVisible = menuEl.style.display !== 'none' && menuEl.offsetParent !== null;
        panel.style.display = menuVisible ? 'flex' : 'none';
      }).observe(menuEl, { attributes: true, attributeFilter: ['style'] });
    } else {
      new MutationObserver(function() {
        const menu = document.getElementById('menu');
        const panel = document.getElementById('ge-panel-control');
        if (!menu || !panel) return;
        const menuVisible = menu.style.display !== 'none';
        panel.style.display = menuVisible ? 'flex' : 'none';
      }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] });
    }
  }

  // XP BAR
  (function applyXPBar() {
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
      var obs = new MutationObserver(function() { if (moveLabel()) obs.disconnect(); });
      obs.observe(document.body, { childList:true, subtree:true });
    }
    [300,800,1500,3000,5000].forEach(function(ms){ setTimeout(moveLabel, ms); });
  })();

  // INICIO
  aplicarEstilos(colorUI, colorFondo);
  aplicarColorTexto(colorUI);
  protegerColoresGermsfox();
  crearPanelControl();
  setupPanelVisibility();
  setTimeout(injectCellBgSelector, 500);

  setTimeout(function () {
    aplicarEstilos(colorUI, colorFondo);
    aplicarColorTexto(colorUI);
    protegerColoresGermsfox();
    setupPanelVisibility();
    patchVersionTag();
    injectCellBgSelector();
  }, 2000);

})();
