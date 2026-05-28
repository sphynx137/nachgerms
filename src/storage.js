// NachGerms — storage.js.
// Abstraction layer for chrome.storage.local.
// Loaded first so all other scripts can use NachStorage and NACH_DEFAULTS.

var NACH_DEFAULTS = {
  colorUI:    '#00eeff',
  colorFondo: '#000000',
  cellBg:     'default'
};

var NachStorage = {
  /**
   * Reads all stored values, falling back to NACH_DEFAULTS.
   * @param {function(data)} cb
   */
  get: function (cb) {
    chrome.storage.local.get(NACH_DEFAULTS, cb);
  },

  /**
   * Persists one or more keys.
   * @param {object} data  e.g. { colorUI: '#ff0000' }
   */
  set: function (data) {
    chrome.storage.local.set(data);
  }
};
