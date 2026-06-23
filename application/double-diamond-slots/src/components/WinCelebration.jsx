import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const COIN_COLORS = ['#ffc94d', '#ffe28a', '#ffb300'];

/**
 * Full-screen particle overlay for big/jackpot wins. Renders falling
 * "coins" (simple gradient circles) with randomized fall paths, plus a
 * pulsing radial glow behind the machine.
 */
export default function WinCelebration({ active, tier }) {
  const count = tier === 'jackpot' ? 70 : tier === 'big' ? 40 : 0;

  const particles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.8,
      duration: 2.4 + Math.random() * 1.6,
      size: 14 + Math.random() * 16,
      color: COIN_COLORS[i % COIN_COLORS.length],
      rotateDir: Math.random() > 0.5 ? 1 : -1,
    }));
  }, [count, active]);

  if (!active || count === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      <AnimatePresence>
        {active && (
          <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {tier === 'jackpot' && (
              <motion.div
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,201,77,0.35),transparent_60%)]"
                animate={{ opacity: [0.4, 0.9, 0.4] }}
                transition={{ duration: 1.1, repeat: Infinity }}
              />
            )}
            {particles.map((p) => (
              <motion.div
                key={p.id}
                className="absolute rounded-full shadow-[0_0_8px_rgba(255,201,77,0.8)]"
                style={{
                  left: `${p.left}%`,
                  width: p.size,
                  height: p.size,
                  background: `radial-gradient(circle at 35% 30%, #fff8e1, ${p.color})`,
                  top: '-5%',
                }}
                initial={{ y: 0, rotate: 0, opacity: 0 }}
                animate={{ y: '110vh', rotate: 360 * p.rotateDir * 3, opacity: [0, 1, 1, 0.8, 0] }}
                transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
