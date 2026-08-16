"use client";

import React, { useState, useEffect } from "react";
import { Volume2, VolumeX, Sparkles, Cake, Gift, Dices, Mail, Heart } from "lucide-react";
import confetti from "canvas-confetti";
import { sound } from "@/utils/audio";
import { birthdayConfig } from "@/config/birthdayConfig";

interface FloatingNavBarProps {
  activeSection: string;
}

export default function FloatingNavBar({ activeSection }: FloatingNavBarProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (birthdayConfig.audio.customAudioUrl) {
      const audio = new Audio(birthdayConfig.audio.customAudioUrl);
      audio.loop = true;
      setAudioElement(audio);
    }
  }, []);

  const toggleMusic = () => {
    sound.playTap();
    if (isPlaying) {
      if (audioElement) {
        audioElement.pause();
      } else {
        sound.stopMelody();
      }
      setIsPlaying(false);
    } else {
      if (audioElement) {
        audioElement.play().catch(() => {});
      } else {
        sound.startMelody();
      }
      setIsPlaying(true);
    }
  };

  const triggerMiniConfetti = () => {
    sound.playConfettiFanfare();
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.1, x: 0.9 },
      colors: ["#FFE4E8", "#FFDF70", "#EADCF8", "#F472B6", "#FDE047"],
      disableForReducedMotion: true,
    });
  };

  const navItems = [
    { id: "hero-section", label: "Top", icon: Heart },
    { id: "cake-section", label: "Cake", icon: Cake },
    { id: "scratch-section", label: "Memory", icon: Gift },
    { id: "slot-section", label: "Vibes", icon: Dices },
    { id: "letter-section", label: "Letter", icon: Mail },
  ];

  const scrollTo = (id: string) => {
    sound.playTap();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-3 left-0 right-0 z-50 flex justify-between items-center px-4 max-w-2xl mx-auto pointer-events-none">
      {/* Quick Navigation Capsule */}
      <nav 
        aria-label="Celebration Navigation"
        className="pointer-events-auto flex items-center gap-1 sm:gap-1.5 p-1.5 rounded-full bg-white/75 backdrop-blur-md border border-white/60 shadow-lg shadow-rose-200/30"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow-sm scale-105"
                  : "text-neutral-600 hover:text-rose-600 hover:bg-rose-50/70"
              }`}
              title={item.label}
              aria-label={`Jump to ${item.label}`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Action Controls: Music Toggle & Confetti Cannon */}
      <div className="pointer-events-auto flex items-center gap-2">
        {/* Confetti Quick Trigger */}
        <button
          onClick={triggerMiniConfetti}
          className="p-2.5 rounded-full bg-white/80 backdrop-blur-md border border-amber-200/60 shadow-md shadow-amber-100/40 text-amber-600 hover:text-amber-700 hover:scale-110 active:scale-95 transition-all duration-200"
          title="Shoot confetti ✨"
          aria-label="Shoot Confetti"
        >
          <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
        </button>

        {/* Music Player Toggle */}
        <button
          onClick={toggleMusic}
          className={`flex items-center gap-2 px-3 py-2 rounded-full backdrop-blur-md border shadow-md transition-all duration-300 ${
            isPlaying
              ? "bg-rose-500/90 text-white border-rose-400 shadow-rose-300/40"
              : "bg-white/80 text-neutral-600 border-white/70 hover:text-rose-600 shadow-rose-100/30"
          }`}
          title={isPlaying ? "Mute music" : "Play birthday music"}
          aria-label={isPlaying ? "Mute birthday music" : "Play birthday music"}
        >
          {isPlaying ? (
            <>
              <Volume2 className="w-4 h-4 animate-bounce" />
              {/* Equalizer mini bars */}
              <div className="flex items-end gap-0.5 h-3">
                <span className="w-0.5 bg-white rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-full" />
                <span className="w-0.5 bg-white rounded-full animate-[pulse_0.9s_ease-in-out_infinite] h-2/3" />
                <span className="w-0.5 bg-white rounded-full animate-[pulse_0.5s_ease-in-out_infinite] h-4/5" />
              </div>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-neutral-400" />
              <span className="text-xs font-medium text-neutral-500 hidden sm:inline">Music</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
