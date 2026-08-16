"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart, RotateCcw, ChevronDown, Image as ImageIcon } from "lucide-react";
import confetti from "canvas-confetti";
import Image from "next/image";
import { birthdayConfig } from "@/config/birthdayConfig";
import { sound } from "@/utils/audio";

interface ScratchCardSectionProps {
  onCardRevealed: () => void;
  onNextSection: () => void;
}

export default function ScratchCardSection({ onCardRevealed, onNextSection }: ScratchCardSectionProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [percentScratched, setPercentScratched] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [heartLikes, setHeartLikes] = useState(24);
  const [hasLiked, setHasLiked] = useState(false);

  // Initialize and paint foil layer onto canvas
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Reset composite operation
    ctx.globalCompositeOperation = "source-over";

    // Draw metallic rose-gold & champagne gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, "#E5A9B4");
    grad.addColorStop(0.3, "#FAD2E1");
    grad.addColorStop(0.6, "#E2AFD3");
    grad.addColorStop(0.85, "#F7D6E0");
    grad.addColorStop(1, "#DF9BA9");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Add glitter speckles
    for (let i = 0; i < 400; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? "rgba(255, 255, 255, 0.7)" : "rgba(251, 191, 36, 0.6)";
      ctx.beginPath();
      ctx.arc(
        Math.random() * width,
        Math.random() * height,
        Math.random() * 2 + 0.5,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    // Foil border
    ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
    ctx.lineWidth = 4;
    ctx.strokeRect(8, 8, width - 16, height - 16);

    // Overlay text
    ctx.font = "bold 16px 'Outfit', sans-serif";
    ctx.fillStyle = "#6B21A8";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(birthdayConfig.scratchCard.overlayText, width / 2, height / 2 - 12);

    ctx.font = "12px sans-serif";
    ctx.fillStyle = "#831843";
    ctx.fillText("✨ Rub with finger or mouse ✨", width / 2, height / 2 + 15);

    setIsRevealed(false);
    setPercentScratched(0);
  }, []);

  useEffect(() => {
    // Resize canvas to match container dimensions
    const updateSize = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (container && canvas) {
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        initCanvas();
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [initCanvas]);

  // Scratch action
  const scratchAt = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 26, 0, Math.PI * 2);
    ctx.fill();

    sound.playScratch();
    calculateProgress();
  };

  // Check how much is scratched
  const calculateProgress = () => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    try {
      const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let transparentPixels = 0;
      const step = 32; // sampling step for performance

      for (let i = 3; i < data.length; i += 4 * step) {
        if (data[i] === 0) {
          transparentPixels++;
        }
      }

      const totalSampled = data.length / (4 * step);
      const percent = Math.round((transparentPixels / totalSampled) * 100);
      setPercentScratched(percent);

      if (percent >= 45 && !isRevealed) {
        revealCard();
      }
    } catch {
      // Ignore if canvas access fails
    }
  };

  const revealCard = () => {
    setIsRevealed(true);
    setPercentScratched(100);

    // Fade out canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    sound.playConfettiFanfare();
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#FFE4E8", "#FFD1DC", "#FFDF70", "#EADCF8", "#F472B6"],
    });

    onCardRevealed();
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsScratching(true);
    scratchAt(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isScratching) return;
    scratchAt(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    setIsScratching(false);
  };

  const handleHeartClick = () => {
    sound.playTap();
    if (!hasLiked) {
      setHeartLikes((prev) => prev + 1);
      setHasLiked(true);
      confetti({
        particleCount: 25,
        spread: 40,
        origin: { y: 0.7 },
        colors: ["#FF2E93", "#FF69B4", "#FFC0CB"],
      });
    } else {
      setHeartLikes((prev) => prev - 1);
      setHasLiked(false);
    }
  };

  return (
    <section
      id="scratch-section"
      className="relative min-h-[95vh] flex flex-col items-center justify-center px-4 py-16 text-center"
    >
      <div className="max-w-md w-full mx-auto flex flex-col items-center">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-2 mb-6"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-100/90 border border-pink-200/80 text-pink-800 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-pink-600" />
            <span>Mystery Scratch Card</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-800 font-serif">
            {birthdayConfig.scratchCard.title}
          </h2>

          <p className="text-neutral-600 text-sm sm:text-base max-w-sm mx-auto">
            {birthdayConfig.scratchCard.subtitle}
          </p>
        </motion.div>

        {/* Scratch Progress Bar */}
        <div className="w-full max-w-xs flex items-center justify-between gap-3 mb-4 text-xs font-medium text-neutral-500">
          <span>Reveal Progress:</span>
          <div className="flex-1 h-2.5 bg-neutral-200/80 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-400 to-rose-500 transition-all duration-200 rounded-full"
              style={{ width: `${percentScratched}%` }}
            />
          </div>
          <span className="w-8 text-right font-bold text-rose-600">{percentScratched}%</span>
        </div>

        {/* Scratch Card Container */}
        <div
          ref={containerRef}
          className="relative w-full max-w-[340px] aspect-[4/5] rounded-3xl p-3 bg-white shadow-2xl shadow-rose-200/50 border border-rose-100/80 select-none overflow-hidden touch-none"
        >
          {/* Polaroid Style Memory Card Revealed Underneath */}
          <div className="w-full h-full rounded-2xl bg-[#FCFAF7] border border-neutral-100 p-3.5 flex flex-col justify-between shadow-inner">
            {/* Polaroid Photo Frame */}
            <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200/80 shadow-xs group">
              {birthdayConfig.scratchCard.revealedPhoto ? (
                <Image
                  src={birthdayConfig.scratchCard.revealedPhoto}
                  alt="Birthday memory"
                  fill
                  className="object-cover"
                  sizes="(max-width: 400px) 100vw, 340px"
                  priority
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-rose-50 text-rose-300">
                  <ImageIcon className="w-12 h-12 mb-2" />
                  <span className="text-xs">Your Favorite Memory Photo</span>
                </div>
              )}

              {/* Date Tag in corner */}
              <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold tracking-wide">
                {birthdayConfig.scratchCard.revealedDate}
              </div>
            </div>

            {/* Polaroid Handwritten Caption & Message */}
            <div className="text-left mt-3 space-y-1">
              <h3 className="font-serif font-bold text-neutral-800 text-base leading-tight">
                {birthdayConfig.scratchCard.revealedTitle}
              </h3>
              <p className="text-neutral-600 text-xs leading-relaxed font-sans line-clamp-3">
                {birthdayConfig.scratchCard.revealedMessage}
              </p>
            </div>

            {/* Bottom Actions: Love Counter */}
            <div className="flex items-center justify-between pt-2 border-t border-neutral-200/60 mt-2">
              <span className="text-[11px] font-serif italic text-neutral-400">
                {birthdayConfig.scratchCard.caption}
              </span>
              <button
                onClick={handleHeartClick}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                  hasLiked
                    ? "bg-rose-500 text-white shadow-xs scale-105"
                    : "bg-rose-50 text-rose-600 hover:bg-rose-100"
                }`}
                title="Send love"
              >
                <Heart className={`w-3.5 h-3.5 ${hasLiked ? "fill-white" : "fill-rose-500"}`} />
                <span>{heartLikes}</span>
              </button>
            </div>
          </div>

          {/* Canvas Scratch Foil Overlay */}
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className={`absolute inset-0 w-full h-full cursor-pointer transition-opacity duration-500 ${
              isRevealed ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={() => {
              sound.playTap();
              initCanvas();
            }}
            className="flex items-center gap-2 py-2.5 px-4 rounded-full bg-white/80 backdrop-blur-md border border-neutral-200 text-neutral-700 text-xs font-medium shadow-xs hover:bg-neutral-50 active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Scratch Again</span>
          </button>

          {!isRevealed && (
            <button
              onClick={revealCard}
              className="flex items-center gap-1.5 py-2.5 px-4 rounded-full bg-rose-100 border border-rose-200 text-rose-800 text-xs font-semibold shadow-xs hover:bg-rose-200 active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              <span>Instant Reveal</span>
            </button>
          )}
        </div>

        {/* Next Section Button */}
        <AnimatePresence>
          {isRevealed && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6"
            >
              <button
                onClick={() => {
                  sound.playTap();
                  onNextSection();
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                <span>Spin the Birthday Slot Machine</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
