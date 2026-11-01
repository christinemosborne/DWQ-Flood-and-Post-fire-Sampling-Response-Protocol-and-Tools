/**
 * Shared Sampling Data Hub backend: a Google Apps Script web app that stores
 * events, planned sampling and uploaded results in this Google Sheet.
 *
 * Setup (once):
 *  1. Create a Google Sheet (e.g., "DWQ Shared Sampling Data Hub").
 *  2. Extensions > Apps Script. Replace the default code with this file. Save.
 *  3. Project Settings > Script Properties > Add property:
 *       PASSCODE = a passcode you will share with partner agencies.
 *  4. Run the setup() function once (approve the permissions it asks for).
 *  5. Deploy > New deployment > type "Web app":
 *       Execute as: Me    Who has access: Anyone
 *     Copy the web app URL into config.js (hubBackendUrl).
 *  When you change this code later, use Deploy > Manage deployments > Edit >
 *  New version, so the URL stays the same.
 */

var SHEETS = {
  Events:  ['id', 'name', 'type', 'water', 'start', 'createdBy', 'createdAt'],
  Plans:   ['id', 'eventId', 'agency', 'siteId', 'siteName', 'date', 'params', 'contact', 'status', 'createdBy', 'createdAt'],
  Uploads: ['id', 'eventId', 'agency', 'filename', 'rowCount', 'createdBy', 'createdAt'],
  Results: ['uploadId', 'eventId', 'site_id', 'site_name', 'sample_date', 'sample_time', 'parameter', 'result',
            'qualifier', 'unit', 'fraction', 'sample_type', 'lab', 'status']
};
var MAX_ROWS = 1000;

/** Run once from the Apps Script editor to create the tabs and headers. */
function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  Object.keys(SHEETS).forEach(function (name) {
    var sh = ss.getSheetByName(name) || ss.insertSheet(name);
    var cols = SHEETS[name];
    sh.getRange(1, 1, 1, cols.length).setValues([cols]).setFontWeight('bold');
    sh.setFrozenRows(1);
    // Keep everything as plain text so dates and IDs aren't reformatted.
    sh.getRange(1, 1, sh.getMaxRows(), cols.length).setNumberFormat('@');
  });
}

function doGet(e) {
  return respond_(function () {
    checkKey_(e.parameter.key);
    var action = e.parameter.action;
    if (action === 'events') return { events: rows_('Events') };
    if (action === 'event') {
      var ev = String(e.parameter.eventId || '');
      var plans = rows_('Plans').filter(function (p) { return p.eventId === ev; });
      var results = rows_('Results').filter(function (r) { return r.eventId === ev; });
      var uploads = rows_('Uploads').filter(function (u) { return u.eventId === ev; }).map(function (u) {
        u.rows = results.filter(function (r) { return r.uploadId === u.id; });
        return u;
      });
      return { plans: plans, uploads: uploads };
    }
    throw fail_('bad_action', 'Unknown action');
  });
}

function doPost(e) {
  return respond_(function () {
    var body = JSON.parse(e.postData.contents || '{}');
    checkKey_(body.key);
    var lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      var r = body.record || {};
      switch (body.action) {
        case 'addEvent':
          append_('Events', [r]);
          return {};
        case 'addPlan':
          append_('Plans', [r]);
          return {};
        case 'updatePlan':
          update_('Plans', body.id, { status: String((body.fields || {}).status || '') });
          return {};
        case 'deletePlan':
          deleteWhere_('Plans', 'id', body.id);
          return {};
        case 'addUpload':
          var rows = r.rows || [];
          if (rows.length > MAX_ROWS) throw fail_('too_many', 'Split uploads into ' + MAX_ROWS + ' rows or fewer');
          append_('Uploads', [{ id: r.id, eventId: r.eventId, agency: r.agency, filename: r.filename,
                                rowCount: rows.length, createdBy: r.createdBy, createdAt: r.createdAt }]);
          append_('Results', rows.map(function (x) { x.uploadId = r.id; x.eventId = r.eventId; return x; }));
          return {};
        case 'deleteUpload':
          deleteWhere_('Results', 'uploadId', body.id);
          deleteWhere_('Uploads', 'id', body.id);
          return {};
      }
      throw fail_('bad_action', 'Unknown action');
    } finally {
      lock.releaseLock();
    }
  });
}

/* ---------- helpers ---------- */
function respond_(fn) {
  var out;
  try { out = fn(); out.ok = true; }
  catch (err) { out = { ok: false, code: err.code || 'error', error: err.message || String(err) }; }
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}
function fail_(code, msg) { var e = new Error(msg); e.code = code; return e; }
function checkKey_(key) {
  var pass = PropertiesService.getScriptProperties().getProperty('PASSCODE');
  if (!pass || String(key || '') !== pass) throw fail_('bad_key', 'Wrong or missing passcode');
}
function sheet_(name) {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  if (!sh) throw fail_('setup', 'Run setup() first');
  return sh;
}
function rows_(name) {
  var sh = sheet_(name), cols = SHEETS[name], n = sh.getLastRow() - 1;
  if (n < 1) return [];
  return sh.getRange(2, 1, n, cols.length).getDisplayValues().map(function (v) {
    var o = {};
    cols.forEach(function (c, i) { o[c] = v[i]; });
    return o;
  });
}
function clean_(v) {
  // Plain text only; a leading = + - @ would otherwise be read as a formula.
  v = v === undefined || v === null ? '' : String(v).slice(0, 2000);
  return /^[=+\-@]/.test(v) && isNaN(Number(v)) ? "'" + v : v;
}
function append_(name, recs) {
  if (!recs.length) return;
  var sh = sheet_(name), cols = SHEETS[name];
  var values = recs.map(function (r) { return cols.map(function (c) { return clean_(r[c]); }); });
  var start = sh.getLastRow() + 1;
  sh.getRange(start, 1, values.length, cols.length).setNumberFormat('@').setValues(values);
}
function update_(name, id, fields) {
  var sh = sheet_(name), cols = SHEETS[name], data = sh.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(id)) {
      Object.keys(fields).forEach(function (k) {
        var c = cols.indexOf(k);
        if (c >= 0) sh.getRange(i + 1, c + 1).setValue(clean_(fields[k]));
      });
      return;
    }
  }
}
function deleteWhere_(name, field, value) {
  // Rewrites the remaining rows in one pass (much faster than deleting rows one by one).
  var sh = sheet_(name), cols = SHEETS[name], c = cols.indexOf(field), n = sh.getLastRow() - 1;
  if (n < 1) return;
  var data = sh.getRange(2, 1, n, cols.length).getDisplayValues();
  var keep = data.filter(function (row) { return String(row[c]) !== String(value); });
  if (keep.length === data.length) return;
  sh.getRange(2, 1, n, cols.length).clearContent();
  if (keep.length) sh.getRange(2, 1, keep.length, cols.length).setNumberFormat('@').setValues(keep);
}
