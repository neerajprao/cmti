import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import Reel from './Reel';
import LcdDisplay from './LcdDisplay';
import PaytableModal from './PaytableModal';
import WinCelebration from './WinCelebration';
import { useSlotGame } from '../hooks/useSlotGame';
import { useCountUp } from '../hooks/useCountUp';
import { parsePaytableFile } from '../lib/paytable';

export default function SlotMachine() {
  const game = useSlotGame();
  const fileInputRef = useRef(null);

  const winCountupDuration = game.winTier === 'jackpot' ? 2600 : game.winTier === 'big' ? 1700 : 900;
  const displayedWin = useCountUp(game.win, winCountupDuration, game.win + (game.lastResult?.outcome ?? ''));

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const lookup = await parsePaytableFile(file);
      game.loadPaytableFromLookup(lookup);
      game.setError(null);
    } catch (err) {
      game.setError('Could not parse that file. Expecting the Double Diamond payout .xlsx format.');
    } finally {
      e.target.value = '';
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-casino-black flex flex-col items-center justify-center px-3 py-8 overflow-hidden">
      <AmbientGlow celebrating={game.celebrating} winTier={game.winTier} />
      <WinCelebration active={game.celebrating} tier={game.winTier} />

      <Title />

      <MachineCabinet game={game} />

      <ControlPanel
        game={game}
        displayedWin={displayedWin}
        onOpenPaytable={() => game.setPaytableOpen(true)}
        onUploadClick={() => fileInputRef.current?.click()}
      />

      <input ref={fileInputRef} type="file" accept=".xlsx" className="hidden" onChange={handleFileUpload} />

      {game.error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 px-4 py-2 rounded-md bg-casino-crimson/15 border border-casino-crimson/50 text-casino-crimson font-ui text-sm"
        >
          {game.error}
        </motion.div>
      )}

      <PaytableModal open={game.paytableOpen} onClose={() => game.setPaytableOpen(false)} lookup={game.paytable} bet={game.bet} />

      <ResultBanner lastResult={game.lastResult} spinning={game.spinning} />
    </div>
  );
}

function Title() {
  return (
    <div className="relative z-10 mb-6 text-center">
      <h1 className="font-display font-black text-4xl sm:text-6xl tracking-wide bg-gradient-to-b from-casino-chrome via-white to-casino-chromeDark bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(255,255,255,0.15)]">
        DOUBLE <span className="text-casino-crimson [-webkit-text-fill-color:initial]">◆◆</span> DIAMOND
      </h1>
      <p className="font-ui text-xs sm:text-sm tracking-[0.3em] text-casino-chromeDark mt-1">CLASSIC 3-REEL SLOTS</p>
    </div>
  );
}

function AmbientGlow({ celebrating, winTier }) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-0"
      animate={{
        background: celebrating
          ? winTier === 'jackpot'
            ? 'radial-gradient(circle at 50% 40%, rgba(255,201,77,0.18), transparent 65%)'
            : 'radial-gradient(circle at 50% 40%, rgba(0,229,255,0.14), transparent 65%)'
          : 'radial-gradient(circle at 50% 40%, rgba(255,23,68,0.05), transparent 65%)',
      }}
      transition={{ duration: 0.6 }}
    />
  );
}

function MachineCabinet({ game }) {
  return (
    <div className="relative z-10 w-full max-w-xl">
      <div className="relative rounded-[28px] p-4 sm:p-6 bg-gradient-to-b from-[#3a3d42] via-[#1c1e21] to-[#0e0f11] shadow-chrome-edge border border-white/10">
        <div className="absolute inset-2 rounded-[22px] border border-casino-gold/20 pointer-events-none" />

        <div className="relative mb-4 flex items-center justify-center">
          <div className="px-5 py-1.5 rounded-full bg-gradient-to-r from-casino-crimson via-[#ff4d6d] to-casino-crimson shadow-glow-crimson">
            <span className="font-display font-bold text-white text-sm sm:text-base tracking-widest">JACKPOT $1000</span>
          </div>
        </div>

        <div className="relative rounded-xl bg-black p-3 sm:p-4 shadow-inset-deep">
          <div className="grid grid-cols-3 gap-2 sm:gap-3 h-44 sm:h-56">
            {[0, 1, 2].map((i) => (
              <Reel key={i} index={i} spinning={game.reelSpinning[i]} finalSymbol={game.finalSymbols[i]} stopDelay={0} />
            ))}
          </div>

          <div className="absolute left-3 right-3 sm:left-4 sm:right-4 top-1/2 -translate-y-1/2 h-[3px] bg-casino-crimson shadow-glow-crimson rounded-full z-30" />
          <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-casino-crimson shadow-glow-crimson z-30" />
          <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-casino-crimson shadow-glow-crimson z-30" />
        </div>

        <Rivets />
      </div>
    </div>
  );
}

function Rivets() {
  const positions = ['top-3 left-3', 'top-3 right-3', 'bottom-3 left-3', 'bottom-3 right-3'];
  return (
    <>
      {positions.map((pos) => (
        <div key={pos} className={`absolute ${pos} w-2.5 h-2.5 rounded-full bg-gradient-to-br from-casino-chrome to-casino-chromeDark shadow-inner`} />
      ))}
    </>
  );
}

function ControlPanel({ game, displayedWin, onOpenPaytable, onUploadClick }) {
  return (
    <div className="relative z-10 w-full max-w-xl mt-6">
      <div className="rounded-2xl bg-gradient-to-b from-[#1c1e21] to-[#0e0f11] border border-white/10 shadow-chrome-edge px-4 sm:px-6 py-5">
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-5">
          <LcdDisplay label="Balance" value={game.balance} />
          <LcdDisplay label="Bet" value={game.bet} />
          <LcdDisplay label="Win" value={displayedWin} flashing={game.win > 0} accent="crimson" />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <PanelButton onClick={game.cycleBet} disabled={game.spinning}>
            BET
          </PanelButton>
          <PanelButton onClick={game.betMax} disabled={game.spinning}>
            BET MAX
          </PanelButton>

          <SpinButton onClick={game.spin} disabled={game.spinning} />

          <PanelButton onClick={onOpenPaytable}>PAYTABLE</PanelButton>
          <PanelButton onClick={onUploadClick} title="Load a custom payout .xlsx">
            LOAD .XLSX
          </PanelButton>
        </div>
      </div>
    </div>
  );
}

function PanelButton({ children, onClick, disabled, title }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      title={title}
      whileTap={{ scale: 0.95 }}
      whileHover={!disabled ? { boxShadow: '0 0 14px rgba(255,255,255,0.25)' } : {}}
      className={[
        'font-ui font-semibold text-xs sm:text-sm tracking-wide px-3 sm:px-4 py-2.5 rounded-lg',
        'bg-gradient-to-b from-[#2a2c30] to-[#151618] border border-white/10 text-casino-chrome',
        disabled ? 'opacity-40 cursor-not-allowed' : 'hover:from-[#33363a] active:translate-y-px',
      ].join(' ')}
    >
      {children}
    </motion.button>
  );
}

function SpinButton({ onClick, disabled }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.92 }}
      animate={
        !disabled
          ? { boxShadow: ['0 0 18px rgba(255,23,68,0.5)', '0 0 32px rgba(255,23,68,0.85)', '0 0 18px rgba(255,23,68,0.5)'] }
          : { boxShadow: '0 0 0px rgba(255,23,68,0)' }
      }
      transition={!disabled ? { duration: 1.4, repeat: Infinity } : {}}
      className={[
        'relative font-display font-bold text-base sm:text-lg tracking-widest px-7 sm:px-9 py-3 rounded-full',
        'bg-gradient-to-b from-[#ff4d6d] to-casino-crimson text-white border-2 border-white/20',
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:from-[#ff6680]',
      ].join(' ')}
    >
      {disabled ? 'SPINNING…' : 'SPIN'}
    </motion.button>
  );
}

function ResultBanner({ lastResult, spinning }) {
  if (spinning || !lastResult) return null;
  const won = lastResult.payout > 0;

  return (
    <motion.div
      key={lastResult.outcome + lastResult.payout}
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', damping: 18, stiffness: 260 }}
      className={[
        'relative z-10 mt-5 px-5 py-2.5 rounded-full font-ui font-semibold text-sm tracking-wide',
        won ? 'bg-casino-gold/15 border border-casino-gold/50 text-casino-gold' : 'bg-white/5 border border-white/15 text-white/60',
      ].join(' ')}
    >
      {won ? `${lastResult.outcome} — $${lastResult.payout.toLocaleString()}!` : 'No win — spin again'}
    </motion.div>
  );
}
