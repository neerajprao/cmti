import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SymbolIcon from './SymbolIcon';
import { getPaytableEntries } from '../lib/paytable';

export default function PaytableModal({ open, onClose, lookup, bet }) {
  const entries = open ? getPaytableEntries(lookup) : [];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border-2 border-casino-gold/40 bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] shadow-glow-gold"
            initial={{ scale: 0.85, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 flex items-center justify-between px-6 py-4 bg-gradient-to-r from-casino-charcoal to-[#1a1a1a] border-b border-casino-gold/30">
              <h2 className="font-display text-2xl text-casino-gold tracking-wide">Paytable</h2>
              <button
                onClick={onClose}
                className="grid place-items-center w-9 h-9 rounded-full bg-white/10 text-white hover:bg-casino-crimson/80 active:scale-90 transition-all"
                aria-label="Close paytable"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-1.5">
              <p className="font-ui text-xs text-white/50 mb-3 uppercase tracking-wider">
                Center payline only · payouts shown for current bet of ${bet}
              </p>
              {entries.map((entry) => (
                <div
                  key={entry.outcome}
                  className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {entry.example.map((sym, i) => (
                      <div key={i} className="w-9 h-9 grid place-items-center rounded bg-white/95">
                        <SymbolIcon symbol={sym} size={26} />
                      </div>
                    ))}
                  </div>
                  <div className="flex-1 px-3">
                    <div className="font-ui text-sm text-white/90">{entry.outcome}</div>
                  </div>
                  <div className="font-lcd text-lg text-casino-gold font-bold tabular-nums">
                    ${(entry.payout * bet).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
