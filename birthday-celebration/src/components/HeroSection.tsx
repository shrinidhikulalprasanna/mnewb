"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Heart, Gift, ChevronDown, PartyPopper } from "lucide-react";
import confetti from "canvas-confetti";
import { birthdayConfig } from "@/config/birthdayConfig";
import { sound } from "@/utils/audio";

interface HeroSectionProps {
  onStartClick: () => void;
}

export default function HeroSection({ onStartClick }: HeroSectionProps) {
  const triggerHeroBurst = () => {
    sound.playConfettiFanfare();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#FFE4E8", "#FFD1DC", "#FFDF70", "#EADCF8", "#F43F5E", "#F59E0B"],
    });
  };

  return (
    <section
      id="hero-section"
      className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-4 pt-16 pb-10"
    >
      <div className="max-w-xl w-full mx-auto flex flex-col items-center">
        {/* Special Edition Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100/80 border border-rose-200/90 text-rose-800 text-xs sm:text-sm font-semibold shadow-xs mb-6 backdrop-blur-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: "6s" }} />
          <span>{birthdayConfig.hero.badge}</span>
          <PartyPopper className="w-3.5 h-3.5 text-rose-500" />
        </motion.div>

        {/* Main Happy Birthday Greeting */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="space-y-1 sm:space-y-2 mb-4"
        >
          <p className="text-lg sm:text-2xl font-medium tracking-wide text-rose-900/80 font-serif">
            {birthdayConfig.hero.greeting}
          </p>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-neutral-900 leading-tight">
            <span className="bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600 bg-clip-text text-transparent drop-shadow-xs">
              {birthdayConfig.recipientName}
            </span>
            <span className="inline-block ml-2 sm:ml-3 animate-bounce">🎉</span>
          </h1>
        </motion.div>

        {/* Age & Date Pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="flex items-center gap-2 sm:gap-3 my-3"
        >
          {birthdayConfig.age && (
            <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100/90 border border-amber-200/80 text-amber-900 font-semibold text-xs sm:text-sm shadow-xs">
              <span className="text-amber-600">Turning</span>
              <span className="text-amber-800 font-bold">{birthdayConfig.age}</span>
              <span>✨</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-100/80 border border-purple-200/80 text-purple-900 font-medium text-xs sm:text-sm shadow-xs">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>{birthdayConfig.birthDate}</span>
          </div>
        </motion.div>

        {/* Subtitle / Personal note */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-neutral-600 text-sm sm:text-base md:text-lg max-w-md mx-auto leading-relaxed my-4"
        >
          {birthdayConfig.hero.subtitle}
        </motion.p>

        {/* Interactive Tap-for-Sparkle Mini Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full mt-6"
        >
          {/* Main Start Celebration CTA */}
          <button
            onClick={() => {
              sound.playTap();
              onStartClick();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white font-semibold text-base shadow-xl shadow-rose-300/50 hover:shadow-rose-400/60 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 group cursor-pointer"
          >
            <Gift className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            <span>{birthdayConfig.hero.scrollPrompt}</span>
            <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform duration-300" />
          </button>

          {/* Sparkle Burst Button */}
          <button
            onClick={triggerHeroBurst}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-white/80 backdrop-blur-md border border-rose-200/80 text-rose-700 font-medium text-sm shadow-md hover:bg-rose-50 hover:shadow-lg active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Tap for Sparkles ✨</span>
          </button>
        </motion.div>

        {/* Floating Decorative Elements */}
        <div className="mt-12 flex items-center justify-center gap-6 text-rose-300/80">
          <span className="text-2xl animate-bounce" style={{ animationDuration: "2.4s" }}>🎂</span>
          <span className="text-xl animate-bounce" style={{ animationDuration: "2.8s", animationDelay: "0.2s" }}>🎁</span>
          <span className="text-2xl animate-bounce" style={{ animationDuration: "2.2s", animationDelay: "0.4s" }}>💖</span>
          <span className="text-xl animate-bounce" style={{ animationDuration: "3.0s", animationDelay: "0.1s" }}>✨</span>
          <span className="text-2xl animate-bounce" style={{ animationDuration: "2.6s", animationDelay: "0.3s" }}>🥂</span>
        </div>
      </div>
    </section>
  );
}
