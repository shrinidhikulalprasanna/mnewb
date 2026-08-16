"use client";

import React from "react";
import { Heart, ArrowUp, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import { birthdayConfig } from "@/config/birthdayConfig";
import { sound } from "@/utils/audio";

export default function Footer() {
  const scrollToTop = () => {
    sound.playTap();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleConfetti = () => {
    sound.playConfettiFanfare();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.85 },
      colors: ["#FFE4E8", "#FFD1DC", "#FFDF70", "#EADCF8", "#F43F5E"],
    });
  };

  return (
    <footer className="relative py-12 px-4 text-center border-t border-rose-100/80 bg-white/40 backdrop-blur-xs">
      <div className="max-w-md mx-auto space-y-4">
        {/* Confetti button */}
        <button
          onClick={handleConfetti}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100/90 border border-rose-200 text-rose-800 text-xs font-semibold shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>One More Confetti Blast! 🎉</span>
        </button>

        {/* Closing Note */}
        <p className="text-sm font-serif text-neutral-600 italic">
          &ldquo;May your day be filled with endless magic and sweet smiles.&rdquo;
        </p>

        {/* Back to top button */}
        <div>
          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-neutral-500 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>Back to top</span>
          </button>
        </div>

        {/* Copyright / Love Tag */}
        <div className="text-[11px] text-neutral-400 flex items-center justify-center gap-1 pt-2">
          <span>Made with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>for {birthdayConfig.recipientName}</span>
        </div>
      </div>
    </footer>
  );
}
