import React from 'react';
import { motion } from 'framer-motion';

/**
 * A recessed LCD-style readout, used for BALANCE / BET / WIN. `flashing`
 * pulses a gold glow to draw attention (used while WIN is counting up).
 */
export default function LcdDisplay({ label, value, flashing = false, accent = 'gold' }) {
  const accentColor = accent === 'crimson' ? 'text-casino-crimson' : 'text-casino-gold';
  const accentShadow = accent === 'crimson' ? 'shadow-glow-crimson' : 'shadow-glow-gold';

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="font-ui text-[10px] sm:text-xs tracking-[0.2em] text-casino-chrome/70 uppercase">{label}</span>
      <motion.div
        className={[
          'min-w-[110px] sm:min-w-[140px] px-3 sm:px-4 py-1.5 sm:py-2 rounded-md bg-black border border-black/80 shadow-inset-deep',
          flashing ? accentShadow : '',
        ].join(' ')}
        animate={flashing ? { opacity: [1, 0.75, 1] } : { opacity: 1 }}
        transition={flashing ? { duration: 0.35, repeat: Infinity } : {}}
      >
        <span className={`font-lcd text-xl sm:text-2xl tabular-nums tracking-wider ${accentColor}`}>
          ${typeof value === 'number' ? value.toLocaleString() : value}
        </span>
      </motion.div>
    </div>
  );
}
