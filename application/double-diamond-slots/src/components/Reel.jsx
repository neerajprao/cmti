import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SymbolIcon from './SymbolIcon';
import { DEFAULT_REEL_STRIPS, randomReelWindow } from '../lib/reels';

const TICK_MS = 70;

/**
 * A single reel cylinder. While `spinning` is true it cycles a blurred
 * random window of symbols. When `spinning` becomes false it snaps to the
 * `finalSymbol` and plays a "clunk" bounce.
 */
export default function Reel({ index, spinning, finalSymbol, stopDelay = 0 }) {
  const strip = DEFAULT_REEL_STRIPS[index % DEFAULT_REEL_STRIPS.length];
  const [windowSyms, setWindowSyms] = useState(() => randomReelWindow(strip));
  const [settled, setSettled] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (spinning) {
      setSettled(false);
      intervalRef.current = setInterval(() => {
        setWindowSyms(randomReelWindow(strip));
      }, TICK_MS);
      return () => clearInterval(intervalRef.current);
    } else {
      clearInterval(intervalRef.current);
      if (finalSymbol) {
        const t = setTimeout(() => {
          setWindowSyms([finalSymbol, finalSymbol, finalSymbol]);
          setSettled(true);
        }, stopDelay);
        return () => clearTimeout(t);
      }
    }
  }, [spinning, finalSymbol, stopDelay, strip]);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-md bg-gradient-to-b from-white via-[#fafafa] to-[#f0f0f0] shadow-inset-deep">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-black/25 to-transparent z-20" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-black/25 to-transparent z-20" />

      <div className="relative flex flex-col h-full">
        <ReelCell symbol={windowSyms[0]} spinning={spinning} variant="edge" />
        <ReelCell symbol={windowSyms[1]} spinning={spinning} variant="center" settled={settled} />
        <ReelCell symbol={windowSyms[2]} spinning={spinning} variant="edge" />
      </div>
    </div>
  );
}

function ReelCell({ symbol, spinning, variant, settled }) {
  return (
    <div
      className={[
        'flex-1 flex items-center justify-center relative',
        variant === 'center' ? '' : 'opacity-70',
      ].join(' ')}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={symbol + (spinning ? '-spin' : '-stop')}
          initial={spinning ? { y: -40, opacity: 0.4 } : { scale: 1.18 }}
          animate={
            spinning
              ? { y: 0, opacity: 1, filter: 'blur(6px)' }
              : variant === 'center' && settled
                ? { scale: [1.18, 0.9, 1.04, 1], filter: 'blur(0px)' }
                : { scale: 1, filter: 'blur(0px)' }
          }
          exit={spinning ? { y: 40, opacity: 0.4 } : { opacity: 0 }}
          transition={
            spinning
              ? { duration: TICK_MS / 1000, ease: 'linear' }
              : { duration: 0.42, ease: [0.34, 1.56, 0.64, 1] }
          }
          className="flex items-center justify-center"
        >
          <SymbolIcon symbol={symbol} size={variant === 'center' ? 72 : 52} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
