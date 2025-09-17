/*******************************************************
 * usage_tracking.js
 * Tiny helpers for native-friendly usage pings in EE Apps
 * This way each time the app is loaded in a new browser (within a 20 (default) min period)
 * a seperate 'visit' ping is logged
 *
 * Exports:
 *   initVisit(appTag, minutes)
 *       - Sets default workload_tag to appTag.
 *       - Sends a single "visit" ping.
 *       - If `minutes` is undefined → defaults to 20 min dedupe window.
 *       - If `minutes = 0` → no dedupe, ping on every load.
 *       - If `minutes > 0` → dedupe per browser using localStorage
 *         (new ping only after `minutes` have passed).
 *
 *
 *   setAppTag(appTag)
 *       - Set default workload_tag for all computations.
 *
 *   ping(suffix)
 *       - Send a tiny compute with tag `${appTag}-${suffix}`.
 *
 *   pingThrottled(suffix, ms)
 *       - Same as ping(), but client-throttled to ≥ms between calls.
 *
 * Notes:
 *   - Tags must be ≤64 chars, start/end with alphanumeric, only `-` and `_` allowed.
 *   - Pings appear in Cloud Monitoring under:
 *       Resource: Earth Engine Cloud Project
 *       Metric: Completed EECU-seconds
 *       Group by: workload_tag
 *******************************************************/


var _APP_TAG = null;
var _lastPing = {};

function _validateTag(tag) {
  // ≤64 chars; start/end alnum; allow -, _
  var regex = /^[A-Za-z0-9]([A-Za-z0-9\-_]{0,62}[A-Za-z0-9]){0,1}$/;
  var ok = regex.test(tag);
  if (!ok) throw new Error('Invalid appTag: ' + tag + ' (must be ≤64 chars; start/end alnum; only -, _ allowed)');
}

function setAppTag(appTag) {
  _validateTag(appTag);
  _APP_TAG = appTag;
  ee.data.setDefaultWorkloadTag(_APP_TAG);
}

function ping(suffix) {
  if (!_APP_TAG) throw new Error('Call setAppTag(appTag) or initVisit(appTag, ...) first.');
  var tag = _APP_TAG + (suffix ? ('-' + suffix) : '');
  ee.data.setWorkloadTag(tag);
  // Trivial compute to create a timestamped event in Cloud Monitoring
  ee.Number(1).evaluate(function(_) {
    ee.data.resetWorkloadTag(); // restore default tag for real work
  });
}

function pingThrottled(suffix, minMs) {
  var now = Date.now();
  if (!_lastPing[suffix] || (now - _lastPing[suffix] >= (minMs || 0))) {
    _lastPing[suffix] = now;
    ping(suffix);
  }
}

// --- Storage shim: localStorage in Apps, in-memory in Code Editor ----------
// (window is a variable that will exist when an app is running in the browser...but not
// when running the code in the code editor)
var __memStore = {};
function _makeStore() {
  try {
    // real browser context (EE App)
    if (typeof window !== 'undefined' && window && window.localStorage) {
      return {
        available: true,
        getItem: function(k) { return window.localStorage.getItem(k); },
        setItem: function(k, v) { window.localStorage.setItem(k, v); }
      };
    }
  } catch (e) {
    // fall through to memory store
  }
  // Code Editor (or any sandbox without window/localStorage)
  return {
    available: false,
    getItem: function(k) { return __memStore.hasOwnProperty(k) ? __memStore[k] : null; },
    setItem: function(k, v) { __memStore[k] = String(v); }
  };
}
var _store = _makeStore();


/**
 * Initialize usage tracking for an app.
 * - Sets default workload_tag to appTag.
 * - Sends a single "visit" ping, optionally deduped per browser for `minutes`.
 *   If minutes is 0/undefined or localStorage unavailable, pings once per load.
 */
function initVisit(appTag, suffix, minutes) {
  setAppTag(appTag);

  // Default to 20 minutes if minutes is undefined. minutes = 0 means "no dedupe".
  var windowMinutes = (minutes === undefined ? 20 : minutes);
  var suffix2 = (suffix === undefined ? 'visit' : suffix);
  
  if (!windowMinutes) {
    // minutes = 0: ping every load/run
    ping(suffix);
    return;
  }

  var key = 'ee-' + appTag + '-' + suffix2;
  var now = Date.now();
  var maxAge = windowMinutes * 60 * 1000;

  // Use storage shim (localStorage in Apps; in-memory in Code Editor)
  var prev = Number(_store.getItem(key) || 0);
  if (!prev || (now - prev) > maxAge) {
    sendVisitPing();
    _store.setItem(key, String(now));
  }
}


// Exports
exports.initVisit      = initVisit;
// only need to export these if want to tag other actions in the app
exports.setAppTag      = setAppTag;
exports.ping           = ping;
exports.pingThrottled  = pingThrottled;

// testing
// initVisit('test-no-app', 'visit', 0);
