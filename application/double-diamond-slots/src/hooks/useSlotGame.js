import { useCallback, useRef, useState } from 'react';
import { DEFAULT_PAYTABLE, getPayout, getWinTier } from '../lib/paytable';
import { spinReels, isNearMissSetup } from '../lib/reels';

const REEL_STOP_GAP = 550;
const NEAR_MISS_EXTRA_DELAY = 1500;
const STARTING_BALANCE = 1000;
const BET_OPTIONS = [1, 2, 3];

export function useSlotGame() {
  const [paytable, setPaytable] = useState(DEFAULT_PAYTABLE);
  const [balance, setBalance] = useState(STARTING_BALANCE);
  const [bet, setBet] = useState(1);
  const [spinning, setSpinning] = useState(false);
  const [reelSpinning, setReelSpinning] = useState([false, false, false]);
  const [finalSymbols, setFinalSymbols] = useState([null, null, null]);
  const [reelStopDelays, setReelStopDelays] = useState([0, 0, 0]);
  const [lastResult, setLastResult] = useState(null);
  const [win, setWin] = useState(0);
  const [celebrating, setCelebrating] = useState(false);
  const [paytableOpen, setPaytableOpen] = useState(false);
  const [error, setError] = useState(null);

  const spinTokenRef = useRef(0);
  const paytableRef = useRef(paytable);
  paytableRef.current = paytable;
  const betRef = useRef(bet);
  betRef.current = bet;

  const cycleBet = useCallback(() => {
    setBet((b) => {
      const idx = BET_OPTIONS.indexOf(b);
      return BET_OPTIONS[(idx + 1) % BET_OPTIONS.length];
    });
  }, []);

  const betMax = useCallback(() => {
    setBet(BET_OPTIONS[BET_OPTIONS.length - 1]);
  }, []);

  const loadPaytableFromLookup = useCallback((lookup) => {
    setPaytable(lookup);
  }, []);

  const resolveRound = useCallback((outcome) => {
    const result = getPayout(paytableRef.current, outcome, betRef.current);
    setLastResult(result);
    setSpinning(false);

    if (result.payout > 0) {
      setWin(result.payout);
      setBalance((b) => b + result.payout);
      const tier = getWinTier(result.basePayout);
      if (tier === 'big' || tier === 'jackpot') {
        setCelebrating(true);
        setTimeout(() => setCelebrating(false), 3200);
      }
    } else {
      setWin(0);
    }
  }, []);

  const spin = useCallback(() => {
    if (spinning) return;
    if (balance < bet) {
      setError('Not enough balance for this bet.');
      return;
    }

    const myToken = ++spinTokenRef.current;

    setError(null);
    setLastResult(null);
    setWin(0);
    setCelebrating(false);
    setBalance((b) => b - bet);
    setSpinning(true);
    setReelSpinning([true, true, true]);
    setFinalSymbols([null, null, null]);

    const outcome = spinReels();
    const [r1, r2] = outcome;

    const nearMiss = isNearMissSetup(r1, r2);
    const delays = [900, 900 + REEL_STOP_GAP, 900 + REEL_STOP_GAP * 2 + (nearMiss ? NEAR_MISS_EXTRA_DELAY : 0)];

    setReelStopDelays(delays);

    delays.forEach((delay, i) => {
      setTimeout(() => {
        if (spinTokenRef.current !== myToken) return;
        setReelSpinning((prev) => {
          const next = [...prev];
          next[i] = false;
          return next;
        });
        setFinalSymbols((prev) => {
          const next = [...prev];
          next[i] = outcome[i];
          return next;
        });

        if (i === 2) {
          setTimeout(() => {
            if (spinTokenRef.current !== myToken) return;
            resolveRound(outcome);
          }, 480);
        }
      }, delay);
    });
  }, [spinning, balance, bet, resolveRound]);

  const winTier = lastResult ? getWinTier(lastResult.basePayout) : 'none';

  return {
    balance,
    bet,
    betOptions: BET_OPTIONS,
    cycleBet,
    betMax,
    spinning,
    reelSpinning,
    finalSymbols,
    reelStopDelays,
    spin,
    lastResult,
    win,
    winTier,
    celebrating,
    paytableOpen,
    setPaytableOpen,
    paytable,
    loadPaytableFromLookup,
    error,
    setError,
  };
}
