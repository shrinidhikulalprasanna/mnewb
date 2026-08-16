"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Wind, RotateCcw, ChevronDown, Award } from "lucide-react";
import confetti from "canvas-confetti";
import { birthdayConfig } from "@/config/birthdayConfig";
import { sound } from "@/utils/audio";

interface CakeSectionProps {
  onAllCandlesBlown: () => void;
  onNextSection: () => void;
}

export default function CakeSection({ onAllCandlesBlown, onNextSection }: CakeSectionProps) {
  const candleCount = birthdayConfig.cake.candleCount || 3;
  const [blownCandles, setBlownCandles] = useState<boolean[]>(
    Array(candleCount).fill(false)
  );
  const [celebrated, setCelebrated] = useState(false);

  const allBlown = blownCandles.every(Boolean);

  const triggerConfettiExplosion = () => {
    sound.playConfettiFanfare();

    // Multi-angle festive fireworks confetti
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      colors: ["#FFE4E8", "#FFD1DC", "#FFDF70", "#EADCF8", "#F43F5E", "#F59E0B", "#FFFFFF"],
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  };

  const blowCandle = (index: number) => {
    if (blownCandles[index]) return;

    sound.playCandleBlow();
    const newBlown = [...blownCandles];
    newBlown[index] = true;
    setBlownCandles(newBlown);

    // If this was the last candle
    if (newBlown.every(Boolean)) {
      setCelebrated(true);
      triggerConfettiExplosion();
      onAllCandlesBlown();
    }
  };

  const blowAllCandles = () => {
    sound.playCandleBlow();
    setBlownCandles(Array(candleCount).fill(true));
    setCelebrated(true);
    triggerConfettiExplosion();
    onAllCandlesBlown();
  };

  const relightCandles = () => {
    sound.playTap();
    setBlownCandles(Array(candleCount).fill(false));
    setCelebrated(false);
  };

  return (
    <section
      id="cake-section"
      className="relative min-h-[95vh] flex flex-col items-center justify-center px-4 py-16 text-center"
    >
      <div className="max-w-lg w-full mx-auto flex flex-col items-center">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-2 mb-8"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100/90 border border-amber-200/80 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Interactive Birthday Cake</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-800 font-serif">
            {birthdayConfig.cake.title}
          </h2>

          <p className="text-neutral-600 text-sm sm:text-base max-w-sm mx-auto">
            {allBlown ? birthdayConfig.cake.blownMessage : birthdayConfig.cake.subtitle}
          </p>
        </motion.div>

        {/* 3-Tier Illustrated Animated Cake Container */}
        <div className="relative flex flex-col items-center justify-center my-6 select-none w-full max-w-[340px]">
          {/* Candles Stand on top of cake */}
          <div className="flex items-end justify-center gap-6 sm:gap-8 z-20 mb-[-6px]">
            {blownCandles.map((isBlown, idx) => (
              <div
                key={idx}
                onClick={() => blowCandle(idx)}
                className="relative flex flex-col items-center cursor-pointer group touch-manipulation"
                title={isBlown ? "Candle is blown out" : "Tap to blow out candle!"}
              >
                {/* Flame or Smoke */}
                <div className="h-10 flex items-end justify-center relative mb-1">
                  {!isBlown ? (
                    <div className="relative flex items-center justify-center animate-flame">
                      {/* Outer flame glow */}
                      <div className="w-4 h-7 bg-gradient-to-t from-orange-500 via-amber-400 to-yellow-100 rounded-[50%_50%_40%_40%/60%_60%_40%_40%] filter drop-shadow-[0_0_8px_rgba(251,191,36,0.9)]" />
                      {/* Inner bright wick core */}
                      <div className="absolute bottom-1 w-1.5 h-3 bg-white rounded-full opacity-90" />
                    </div>
                  ) : (
                    /* Smoke Wisp Animation */
                    <div className="relative flex flex-col items-center animate-smoke">
                      <div className="w-2.5 h-2.5 bg-neutral-400/60 rounded-full blur-[1px] -mb-1" />
                      <div className="w-3.5 h-3.5 bg-neutral-300/50 rounded-full blur-[1px] -mb-1" />
                      <div className="w-2 h-4 bg-neutral-300/40 rounded-full blur-[1px]" />
                    </div>
                  )}
                </div>

                {/* Candle Wick */}
                <div className="w-0.5 h-2 bg-neutral-700 rounded-t-xs" />

                {/* Candle Body */}
                <div
                  className={`w-4 h-14 rounded-t-sm shadow-md transition-all duration-200 ${
                    idx % 2 === 0
                      ? "bg-[repeating-linear-gradient(45deg,#F472B6,#F472B6_4px,#FFFFFF_4px,#FFFFFF_8px)]"
                      : "bg-[repeating-linear-gradient(45deg,#FBBF24,#FBBF24_4px,#FFFFFF_4px,#FFFFFF_8px)]"
                  } ${!isBlown ? "group-hover:scale-105" : "opacity-80"}`}
                >
                  {/* Candle Wax Highlight */}
                  <div className="w-1 h-full bg-white/40 ml-0.5" />
                </div>

                {/* Tap Prompt Badge on hover / active */}
                {!isBlown && (
                  <span className="absolute -bottom-6 text-[10px] font-medium text-rose-500 bg-white/90 px-1.5 py-0.5 rounded-full shadow-xs whitespace-nowrap opacity-0 group-hover:opacity-100 sm:opacity-80 transition-opacity">
                    Tap to blow 💨
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Tier 3 (Top Tier) */}
          <div className="relative w-36 h-14 bg-gradient-to-b from-rose-100 via-pink-100 to-rose-200 rounded-t-2xl border-t-2 border-white/80 shadow-md flex items-start justify-center z-10">
            {/* Frosting Swirls on top rim */}
            <div className="flex justify-around w-full px-2 -mt-2">
              <div className="w-4 h-4 rounded-full bg-white shadow-xs border border-rose-100" />
              <div className="w-4 h-4 rounded-full bg-white shadow-xs border border-rose-100" />
              <div className="w-4 h-4 rounded-full bg-white shadow-xs border border-rose-100" />
              <div className="w-4 h-4 rounded-full bg-white shadow-xs border border-rose-100" />
            </div>
            {/* Strawberry in the center */}
            <span className="absolute top-1 text-sm">🍓</span>
            {/* Dripping Icing */}
            <div className="absolute bottom-1 w-full flex justify-around px-3 opacity-60">
              <div className="w-2.5 h-3 bg-white rounded-b-full shadow-xs" />
              <div className="w-2 h-4 bg-white rounded-b-full shadow-xs" />
              <div className="w-3 h-2.5 bg-white rounded-b-full shadow-xs" />
            </div>
          </div>

          {/* Tier 2 (Middle Tier) */}
          <div className="relative w-52 h-16 bg-gradient-to-b from-purple-100 via-pink-100 to-purple-200 rounded-t-xl border-t-2 border-white/80 shadow-md flex flex-col justify-between items-center z-8">
            {/* Golden Sugar Pearls */}
            <div className="flex justify-around w-full px-4 pt-1">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-300 shadow-xs border border-amber-200" />
              <div className="w-2.5 h-2.5 rounded-full bg-rose-300 shadow-xs border border-rose-200" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-300 shadow-xs border border-amber-200" />
              <div className="w-2.5 h-2.5 rounded-full bg-rose-300 shadow-xs border border-rose-200" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-300 shadow-xs border border-amber-200" />
            </div>
            {/* Scallop Ribbon Accent */}
            <div className="w-full h-3 bg-white/70 flex items-center justify-around px-2 mb-1">
              <div className="w-3 h-1.5 rounded-full bg-pink-300/60" />
              <div className="w-3 h-1.5 rounded-full bg-pink-300/60" />
              <div className="w-3 h-1.5 rounded-full bg-pink-300/60" />
              <div className="w-3 h-1.5 rounded-full bg-pink-300/60" />
            </div>
          </div>

          {/* Tier 1 (Base Tier) */}
          <div className="relative w-68 h-20 bg-gradient-to-b from-amber-50 via-rose-100 to-pink-200 rounded-t-xl border-t-2 border-white/80 shadow-lg flex flex-col justify-between items-center z-6">
            {/* Cream Puffs & Strawberries on rim */}
            <div className="flex justify-between w-full px-3 -mt-2">
              <span className="text-xs">🍓</span>
              <div className="w-3.5 h-3.5 rounded-full bg-white shadow-xs" />
              <span className="text-xs">🍒</span>
              <div className="w-3.5 h-3.5 rounded-full bg-white shadow-xs" />
              <span className="text-xs">🍓</span>
            </div>

            {/* Decorative Gold Filigree Pattern */}
            <div className="text-center font-serif text-[11px] font-semibold text-rose-800/70 tracking-widest uppercase">
              ✨ Happy Birthday {birthdayConfig.recipientName} ✨
            </div>

            {/* Base Frosting Drips */}
            <div className="w-full flex justify-around px-2 pb-1">
              <div className="w-4 h-2 bg-white/80 rounded-b-full" />
              <div className="w-5 h-3 bg-white/80 rounded-b-full" />
              <div className="w-3 h-2 bg-white/80 rounded-b-full" />
              <div className="w-5 h-3.5 bg-white/80 rounded-b-full" />
              <div className="w-4 h-2 bg-white/80 rounded-b-full" />
            </div>
          </div>

          {/* Golden Stand / Plate */}
          <div className="relative w-76 h-5 bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-200 rounded-full shadow-xl border-b-2 border-amber-400/80 flex items-center justify-center">
            <div className="w-20 h-2 bg-amber-400/70 rounded-b-lg -mb-4 shadow-md" />
          </div>
        </div>

        {/* Wish Prompt Text */}
        {!allBlown && (
          <p className="text-xs sm:text-sm text-neutral-500 italic max-w-xs mt-4">
            &ldquo;{birthdayConfig.cake.wishPrompt}&rdquo;
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-6 w-full max-w-sm">
          {!allBlown ? (
            <button
              onClick={blowAllCandles}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-white font-semibold text-sm shadow-lg shadow-amber-200/50 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <Wind className="w-4 h-4 animate-pulse" />
              <span>Blow All Candles at Once 🎂💨</span>
            </button>
          ) : (
            <button
              onClick={relightCandles}
              className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-white/80 backdrop-blur-md border border-neutral-200 text-neutral-700 font-medium text-sm shadow-sm hover:bg-neutral-50 active:scale-95 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Relight Candles 🕯️</span>
            </button>
          )}
        </div>

        {/* Celebratory Wish Unlocked Card */}
        <AnimatePresence>
          {celebrated && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 15 }}
              className="mt-8 p-6 rounded-3xl glass-card-warm max-w-md w-full text-center border-2 border-rose-200/80 shadow-xl"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-300 to-yellow-200 text-amber-900 flex items-center justify-center mx-auto mb-3 shadow-md">
                <Award className="w-6 h-6 animate-bounce" />
              </div>

              <h3 className="text-xl font-bold text-rose-900 mb-1 font-serif">
                {birthdayConfig.cake.blownMessage}
              </h3>

              <p className="text-neutral-700 text-sm leading-relaxed mb-5">
                {birthdayConfig.cake.subMessage}
              </p>

              <button
                onClick={() => {
                  sound.playTap();
                  onNextSection();
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                <span>Unlock Memory Scratch Card</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
