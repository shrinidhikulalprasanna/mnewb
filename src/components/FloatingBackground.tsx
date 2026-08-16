"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Balloon {
  id: number;
  x: number; // percentage
  size: number;
  duration: number;
  delay: number;
  color: string;
  swayDuration: number;
}

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

const BALLOON_COLORS = [
  "from-rose-300/60 to-pink-400/50 border-rose-200/80 shadow-rose-300/40",
  "from-amber-200/60 to-yellow-300/50 border-amber-100/80 shadow-yellow-200/40",
  "from-purple-200/60 to-indigo-300/50 border-purple-100/80 shadow-purple-200/40",
  "from-red-200/60 to-rose-300/50 border-rose-100/80 shadow-rose-200/40",
  "from-orange-200/60 to-pink-300/50 border-orange-100/80 shadow-orange-200/40",
];

export default function FloatingBackground() {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    // Generate deterministic balloons for smooth client rendering
    const generatedBalloons: Balloon[] = Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      x: 5 + (i * 12) + (Math.random() * 5),
      size: 40 + (i % 3) * 12,
      duration: 18 + (i % 4) * 4,
      delay: (i * 2.5) % 12,
      color: BALLOON_COLORS[i % BALLOON_COLORS.length],
      swayDuration: 4 + (i % 3),
    }));
    setBalloons(generatedBalloons);

    // Generate twinkling stars
    const generatedStars: Star[] = Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      x: (i * 13) % 96 + 2,
      y: (i * 17) % 94 + 3,
      size: (i % 3 === 0) ? 14 : 10,
      delay: (i * 0.4) % 3,
      duration: 2 + (i % 3),
    }));
    setStars(generatedStars);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Warm ambient blurred glow orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-rose-200/40 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-32 w-[28rem] h-[28rem] bg-purple-200/35 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -left-24 w-80 h-80 bg-amber-100/50 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 right-10 w-96 h-96 bg-pink-200/35 rounded-full blur-3xl" />

      {/* Floating Star Twinkles */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute text-amber-300/70 select-none"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
          }}
          animate={{
            scale: [0.6, 1.2, 0.6],
            opacity: [0.3, 0.85, 0.3],
            rotate: [0, 90, 180],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut",
          }}
        >
          <svg width={star.size} height={star.size} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
          </svg>
        </motion.div>
      ))}

      {/* Floating Animated Balloons */}
      {balloons.map((b) => (
        <motion.div
          key={b.id}
          className="absolute bottom-[-120px] flex flex-col items-center select-none"
          style={{ left: `${b.x}%` }}
          animate={{
            y: ["0vh", "-125vh"],
            x: ["0px", "20px", "-15px", "0px"],
          }}
          transition={{
            y: {
              duration: b.duration,
              repeat: Infinity,
              delay: b.delay,
              ease: "linear",
            },
            x: {
              duration: b.swayDuration,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        >
          {/* Balloon Oval */}
          <div
            className={`rounded-[50%_50%_50%_50%/40%_40%_60%_60%] bg-gradient-to-br ${b.color} border shadow-lg backdrop-blur-xs relative flex items-center justify-center`}
            style={{
              width: `${b.size}px`,
              height: `${b.size * 1.25}px`,
            }}
          >
            {/* Balloon Light Highlight */}
            <div className="absolute top-2 left-2 w-2.5 h-4 bg-white/60 rounded-full rotate-[-25deg] blur-[0.5px]" />
          </div>
          {/* Balloon Knot */}
          <div className="w-1.5 h-1.5 bg-rose-400/80 rounded-xs -mt-0.5" />
          {/* Balloon String */}
          <svg width="2" height="35" className="opacity-40">
            <path d="M1,0 Q-2,18 1,35" stroke="#9E828C" strokeWidth="1" fill="none" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
