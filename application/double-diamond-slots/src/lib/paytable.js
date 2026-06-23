import * as XLSX from 'xlsx';
import { RAW_PAYTABLE } from '../data/paytableData';

// Canonical symbol list — order matters for reel strip construction.
export const SYMBOLS = ['Diamond', '7', 'Triple BAR', 'Double BAR', 'Single BAR', 'Cherry'];

/**
 * Build a Map keyed by "R1|R2|R3" -> { outcome, payout } for O(1) lookups.
 * payout is the dollar amount for a $1 base bet.
 */
function buildLookup(rows) {
  const map = new Map();
  for (const [r1, r2, r3, outcome, payout] of rows) {
    map.set(`${r1}|${r2}|${r3}`, { outcome, payout: Number(payout) });
  }
  return map;
}

// The default, verified, 216-row paytable baked in from the supplied .xlsx file.
export const DEFAULT_PAYTABLE = buildLookup(RAW_PAYTABLE);

/**
 * Parse an uploaded .xlsx File/Blob/ArrayBuffer into the same lookup structure.
 * Expected columns (header row required), matching the source file:
 *   Reel 1 | Reel 2 | Reel 3 | Outcome Type | Inital money paid ($) | Payout ($) | Profit % | Net Profit/Loss ($)
 * Only Reel 1-3, Outcome Type, and Payout ($) are actually used.
 */
export async function parsePaytableFile(file) {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const json = XLSX.utils.sheet_to_json(sheet, { defval: null });

  const rows = [];
  for (const record of json) {
    const r1 = normalizeSymbol(record['Reel 1']);
    const r2 = normalizeSymbol(record['Reel 2']);
    const r3 = normalizeSymbol(record['Reel 3']);
    const outcome = record['Outcome Type'];
    const payout = Number(record['Payout ($)']) || 0;
    if (!r1 || !r2 || !r3) continue;
    rows.push([r1, r2, r3, outcome, payout]);
  }

  if (rows.length === 0) {
    throw new Error('No valid rows found in uploaded paytable file.');
  }

  return buildLookup(rows);
}

function normalizeSymbol(value) {
  if (value === null || value === undefined) return null;
  if (value === 7 || value === '7') return '7';
  return String(value).trim();
}

/**
 * Look up the outcome for a final middle-row combination, scaled to the
 * player's actual bet. Base payouts in the table assume a $1 bet.
 */
export function getPayout(lookup, [r1, r2, r3], betAmount) {
  const entry = lookup.get(`${r1}|${r2}|${r3}`);
  if (!entry) {
    return { outcome: 'Loss', payout: 0, basePayout: 0 };
  }
  return {
    outcome: entry.outcome,
    basePayout: entry.payout,
    payout: entry.payout * betAmount,
  };
}

/** Tiers used for win-celebration intensity (count-up speed, confetti, etc). */
export function getWinTier(basePayout) {
  if (basePayout >= 1000) return 'jackpot';
  if (basePayout >= 100) return 'big';
  if (basePayout >= 20) return 'medium';
  if (basePayout > 0) return 'small';
  return 'none';
}

/** All unique non-loss outcomes for the paytable modal, sorted by payout descending. */
export function getPaytableEntries(lookup) {
  const seen = new Map();
  for (const [key, { outcome, payout }] of lookup.entries()) {
    if (payout <= 0) continue;
    const reels = key.split('|');
    if (!seen.has(outcome) || seen.get(outcome).payout < payout) {
      seen.set(outcome, { outcome, payout, example: reels });
    }
  }
  return Array.from(seen.values()).sort((a, b) => b.payout - a.payout);
}
