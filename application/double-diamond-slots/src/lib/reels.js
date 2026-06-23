import { SYMBOLS } from './paytable';

/**
 * Each reel is modeled as a physical strip of symbols. The DEFAULT_REEL_STRIPS
 * below approximate a classic Double-Diamond-style weighting: Diamond and 7
 * are rare (high value, low frequency), Cherry/BAR symbols are common —
 * this produces the long-run house edge implied by the paytable's Profit %
 * column, while every one of the 216 face-up combinations remains possible
 * and is resolved by the exact paytable lookup, not by the strip itself.
 */
export const DEFAULT_REEL_STRIPS = [
  ['Cherry', 'Single BAR', 'Double BAR', 'Cherry', 'Triple BAR', 'Single BAR', 'Double BAR', 'Cherry', '7', 'Single BAR', 'Triple BAR', 'Diamond', 'Cherry', 'Double BAR', 'Single BAR', 'Triple BAR', 'Cherry', 'Double BAR'],
  ['Single BAR', 'Cherry', 'Triple BAR', 'Double BAR', 'Cherry', 'Single BAR', 'Diamond', 'Cherry', 'Double BAR', 'Triple BAR', 'Single BAR', 'Cherry', '7', 'Double BAR', 'Single BAR', 'Cherry', 'Triple BAR', 'Double BAR'],
  ['Double BAR', 'Triple BAR', 'Cherry', 'Single BAR', 'Cherry', 'Double BAR', '7', 'Single BAR', 'Cherry', 'Triple BAR', 'Diamond', 'Single BAR', 'Double BAR', 'Cherry', 'Triple BAR', 'Single BAR', 'Cherry', 'Double BAR'],
];

function randomSymbolFromStrip(strip) {
  return strip[Math.floor(Math.random() * strip.length)];
}

/** Generate a random visible 3-symbol window for a reel, used for the
 * vertical scroll/blur effect while spinning (top/middle/bottom rows). */
export function randomReelWindow(strip) {
  return [randomSymbolFromStrip(strip), randomSymbolFromStrip(strip), randomSymbolFromStrip(strip)];
}

/**
 * Decide the final middle-row outcome for a spin: pick each reel's middle
 * symbol independently from its weighted strip. This reproduces the strip's
 * built-in house edge while still allowing every one of the 216 paytable
 * combinations to occur.
 */
export function spinReels(strips = DEFAULT_REEL_STRIPS) {
  return strips.map((strip) => randomSymbolFromStrip(strip));
}

/** True if reels 1 and 2 share a high-value symbol — used to trigger the
 * extended near-miss tension delay on reel 3. */
export function isNearMissSetup(r1, r2) {
  const highValue = new Set(['Diamond', '7']);
  return highValue.has(r1) && r1 === r2;
}

export { SYMBOLS };
