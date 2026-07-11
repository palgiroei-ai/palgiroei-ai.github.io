/**
 * Campus Climber leaderboard backend.
 * Web app: GET returns top-10 JSON; POST appends a validated score.
 * Moderation: delete rows in the Scores sheet — that's it.
 */
const SHEET_ID = '1llQY_JyzpyeRG2cVkqL0FtYZWuzitzkds_DCQGk8-44';
const TOP_N = 5;
const MAX_SCORE = 60;
const MAX_NAME = 12;
const MAX_ROWS = 5000;

function doGet() {
  const rows = _sheet().getDataRange().getValues().slice(1)
    .filter(function (r) { return r[0] && r[1]; })
    .sort(function (a, b) { return b[1] - a[1]; })
    .slice(0, TOP_N)
    .map(function (r) { return { n: String(r[0]).slice(0, MAX_NAME), s: Number(r[1]) }; });
  return _json(rows);
}

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    var name = String(d.name || '').trim().replace(/[<>&"'\\]/g, '').slice(0, MAX_NAME);
    var score = Math.round(Number(d.score));
    if (!name || !(score >= 1) || score > MAX_SCORE) return _json({ ok: 0 });
    const lock = LockService.getScriptLock();
    lock.waitLock(5000);
    try {
      const sh = _sheet();
      if (sh.getLastRow() >= MAX_ROWS) return _json({ ok: 0 });
      sh.appendRow([name, score, new Date()]);
    } finally {
      lock.releaseLock();
    }
    return _json({ ok: 1 });
  } catch (err) {
    return _json({ ok: 0 });
  }
}

function _sheet() {
  return SpreadsheetApp.openById(SHEET_ID).getSheetByName('Scores');
}

function _json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Roei runs this ONCE from the editor to authorize + set headers. */
function setup() {
  const sh = _sheet();
  sh.getRange('A1:C1').setValues([['שם', 'שלבים', 'תאריך']]).setFontWeight('bold');
  Logger.log('Leaderboard ready ✓');
}
