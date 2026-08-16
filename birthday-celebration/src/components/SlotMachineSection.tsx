"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Dices, ChevronDown, Check, BookmarkPlus } from "lucide-react";
import confetti from "canvas-confetti";
import { birthdayConfig } from "@/config/birthdayConfig";
import { sound } from "@/utils/audio";

interface SlotMachineSectionProps {
  onSlotSpun: () => void;
  onNextSection: () => void;
}

interface SavedCombo {
  id: string;
  joke: string;
  compliment: string;
  memory: string;
  time: string;
}

export default function SlotMachineSection({ onSlotSpun, onNextSection }: SlotMachineSectionProps) {
  const jokes = birthdayConfig.slotMachine.jokes;
  const compliments = birthdayConfig.slotMachine.compliments;
  const memories = birthdayConfig.slotMachine.memories;

  const [reel1Index, setReel1Index] = useState(0);
  const [reel2Index, setReel2Index] = useState(0);
  const [reel3Index, setReel3Index] = useState(0);

  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const [savedCombos, setSavedCombos] = useState<SavedCombo[]>([]);
  const [justSaved, setJustSaved] = useState(false);

  const spinReels = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setJustSaved(false);

    sound.playTap();

    let counter = 0;
    const interval = setInterval(() => {
      setReel1Index(Math.floor(Math.random() * jokes.length));
      setReel2Index(Math.floor(Math.random() * compliments.length));
      setReel3Index(Math.floor(Math.random() * memories.length));
      sound.playSlotTick();
      counter++;

      if (counter >= 18) {
        clearInterval(interval);
        finalizeSpin();
      }
    }, 90);
  };

  const finalizeSpin = () => {
    const final1 = Math.floor(Math.random() * jokes.length);
    const final2 = Math.floor(Math.random() * compliments.length);
    const final3 = Math.floor(Math.random() * memories.length);

    setReel1Index(final1);
    setReel2Index(final2);
    setReel3Index(final3);
    setIsSpinning(false);
    setHasSpun(true);

    sound.playSlotWin();
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.65 },
      colors: ["#FFDF70", "#FBBF24", "#F472B6", "#A78BFA"],
    });

    onSlotSpun();
  };

  const saveCurrentCombo = () => {
    if (justSaved) return;
    sound.playTap();
    const newCombo: SavedCombo = {
      id: Date.now().toString(),
      joke: jokes[reel1Index],
      compliment: compliments[reel2Index],
      memory: memories[reel3Index],
      time: "Just now",
    };
    setSavedCombos([newCombo, ...savedCombos]);
    setJustSaved(true);
  };

  return (
    <section
      id="slot-section"
      className="relative min-h-[95vh] flex flex-col items-center justify-center px-4 py-16 text-center"
    >
      <div className="max-w-lg w-full mx-auto flex flex-col items-center">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-2 mb-6"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-100/90 border border-purple-200/80 text-purple-800 text-xs font-semibold uppercase tracking-wider mb-2">
            <Dices className="w-3.5 h-3.5 text-purple-600" />
            <span>Interactive Game</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-800 font-serif">
            {birthdayConfig.slotMachine.title}
          </h2>

          <p className="text-neutral-600 text-sm sm:text-base max-w-sm mx-auto">
            {birthdayConfig.slotMachine.subtitle}
          </p>
        </motion.div>

        {/* Arcade Cabinet Slot Machine Frame */}
        <div className="relative w-full max-w-md bg-gradient-to-b from-purple-900 via-indigo-950 to-neutral-900 rounded-[2.5rem] p-5 sm:p-6 shadow-2xl border-4 border-amber-300/80 my-4 text-white">
          {/* Top Marquee Header */}
          <div className="flex items-center justify-between px-3 py-2 rounded-2xl bg-amber-400 text-neutral-950 font-extrabold text-xs sm:text-sm tracking-wider uppercase mb-4 shadow-inner">
            <span className="flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-amber-900 animate-spin" />
              LUCKY VIBE 777
            </span>
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
            </div>
          </div>

          {/* 3 Reels Display Container */}
          <div className="space-y-3">
            {/* Reel 1 */}
            <div className="relative rounded-2xl bg-neutral-900/90 border border-purple-400/40 p-3.5 overflow-hidden shadow-inner text-left">
              <div className="text-[10px] font-bold text-pink-300 tracking-wider uppercase mb-1 flex items-center justify-between">
                <span>{birthdayConfig.slotMachine.reel1Title}</span>
                <span className="text-pink-400/60 font-mono">#01</span>
              </div>
              <motion.p
                key={reel1Index}
                initial={{ y: isSpinning ? -20 : 0, opacity: isSpinning ? 0.4 : 1 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.15 }}
                className="text-xs sm:text-sm font-medium text-pink-50 min-h-[38px] flex items-center"
              >
                {jokes[reel1Index]}
              </motion.p>
            </div>

            {/* Reel 2 */}
            <div className="relative rounded-2xl bg-neutral-900/90 border border-amber-400/40 p-3.5 overflow-hidden shadow-inner text-left">
              <div className="text-[10px] font-bold text-amber-300 tracking-wider uppercase mb-1 flex items-center justify-between">
                <span>{birthdayConfig.slotMachine.reel2Title}</span>
                <span className="text-amber-400/60 font-mono">#02</span>
              </div>
              <motion.p
                key={reel2Index}
                initial={{ y: isSpinning ? -20 : 0, opacity: isSpinning ? 0.4 : 1 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.15 }}
                className="text-xs sm:text-sm font-medium text-amber-50 min-h-[38px] flex items-center"
              >
                {compliments[reel2Index]}
              </motion.p>
            </div>

            {/* Reel 3 */}
            <div className="relative rounded-2xl bg-neutral-900/90 border border-teal-400/40 p-3.5 overflow-hidden shadow-inner text-left">
              <div className="text-[10px] font-bold text-teal-300 tracking-wider uppercase mb-1 flex items-center justify-between">
                <span>{birthdayConfig.slotMachine.reel3Title}</span>
                <span className="text-teal-400/60 font-mono">#03</span>
              </div>
              <motion.p
                key={reel3Index}
                initial={{ y: isSpinning ? -20 : 0, opacity: isSpinning ? 0.4 : 1 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.15 }}
                className="text-xs sm:text-sm font-medium text-teal-50 min-h-[38px] flex items-center"
              >
                {memories[reel3Index]}
              </motion.p>
            </div>
          </div>

          {/* Spin Controller Lever & Button */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={spinReels}
              disabled={isSpinning}
              className={`w-full py-4 px-6 rounded-2xl font-extrabold text-base uppercase tracking-wider shadow-lg transition-all duration-200 cursor-pointer ${
                isSpinning
                  ? "bg-neutral-700 text-neutral-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-neutral-950 hover:brightness-110 active:scale-95 shadow-amber-500/30"
              }`}
            >
              {isSpinning ? "Spinning..." : "🎰 PULL LEVER / SPIN 🎰"}
            </button>
          </div>
        </div>

        {/* Save Combination to Favorites */}
        {hasSpun && (
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={saveCurrentCombo}
              className={`flex items-center gap-1.5 py-2 px-4 rounded-full text-xs font-semibold shadow-xs transition-all ${
                justSaved
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-white/80 backdrop-blur-md border border-neutral-200 text-neutral-700 hover:bg-neutral-50"
              }`}
            >
              {justSaved ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-600" />
                  <span>Saved to Highlights!</span>
                </>
              ) : (
                <>
                  <BookmarkPlus className="w-3.5 h-3.5 text-rose-500" />
                  <span>Pin this Combo 📌</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Saved Highlights Drawer */}
        {savedCombos.length > 0 && (
          <div className="w-full mt-6 p-4 rounded-2xl glass-card text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2 flex items-center gap-1.5">
              <span>Saved Highlights ({savedCombos.length})</span>
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1 text-xs">
              {savedCombos.map((combo) => (
                <div key={combo.id} className="p-2.5 rounded-xl bg-white/70 border border-rose-100 space-y-1">
                  <p className="text-rose-900 font-medium">{combo.compliment}</p>
                  <p className="text-neutral-500 text-[11px]">{combo.memory}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Section CTA */}
        <AnimatePresence>
          {hasSpun && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8"
            >
              <button
                onClick={() => {
                  sound.playTap();
                  onNextSection();
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                <span>Read Your Birthday Letter 💌</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
