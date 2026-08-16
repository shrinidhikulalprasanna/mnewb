"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Mail, Heart, Download, Share2, Plus, Send, Check } from "lucide-react";
import { toPng } from "html-to-image";
import confetti from "canvas-confetti";
import { birthdayConfig } from "@/config/birthdayConfig";
import { sound } from "@/utils/audio";

interface WishNote {
  id: string;
  author: string;
  message: string;
  color: string;
  timestamp: string;
}

const STICKY_COLORS = [
  "bg-rose-100/90 text-rose-900 border-rose-200",
  "bg-amber-100/90 text-amber-900 border-amber-200",
  "bg-purple-100/90 text-purple-900 border-purple-200",
  "bg-emerald-100/90 text-emerald-900 border-emerald-200",
  "bg-sky-100/90 text-sky-900 border-sky-200",
];

export default function EnvelopeLetterSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const letterCardRef = useRef<HTMLDivElement | null>(null);

  // Wish Jar state
  const [wishes, setWishes] = useState<WishNote[]>(birthdayConfig.wishes.initialWishes);
  const [showAddWish, setShowAddWish] = useState(false);
  const [newAuthor, setNewAuthor] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [selectedColor, setSelectedColor] = useState(STICKY_COLORS[0]);

  useEffect(() => {
    // Load persisted wishes from localStorage if available
    try {
      const saved = localStorage.getItem("birthday_wishes");
      if (saved) {
        setWishes(JSON.parse(saved));
      }
    } catch {
      // Ignore localStorage error
    }
  }, []);

  const openEnvelope = () => {
    if (isOpen) return;
    sound.playEnvelopeOpen();
    setIsOpen(true);
    confetti({
      particleCount: 60,
      spread: 80,
      origin: { y: 0.5 },
      colors: ["#FFE4E8", "#FFD1DC", "#FFDF70", "#EADCF8"],
    });
  };

  const handleDownloadCard = async () => {
    if (!letterCardRef.current || isExporting) return;
    setIsExporting(true);
    sound.playTap();

    try {
      const dataUrl = await toPng(letterCardRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: "#FFFDF9",
      });

      // Try native share on mobile
      if (navigator.share && /mobile/i.test(navigator.userAgent)) {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], `happy-birthday-${birthdayConfig.recipientName.toLowerCase()}.png`, { type: "image/png" });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `Happy Birthday ${birthdayConfig.recipientName}!`,
            text: birthdayConfig.shareCard.subtext,
            files: [file],
          });
          setIsExporting(false);
          return;
        }
      }

      // Download file directly
      const link = document.createElement("a");
      link.download = `happy-birthday-${birthdayConfig.recipientName.toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (err) {
      console.error("Card download failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleAddWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newMessage.trim()) return;

    sound.playTap();
    const newNote: WishNote = {
      id: Date.now().toString(),
      author: newAuthor.trim(),
      message: newMessage.trim(),
      color: selectedColor,
      timestamp: "Just now",
    };

    const updated = [newNote, ...wishes];
    setWishes(updated);
    try {
      localStorage.setItem("birthday_wishes", JSON.stringify(updated));
    } catch {}

    setNewAuthor("");
    setNewMessage("");
    setShowAddWish(false);

    confetti({
      particleCount: 35,
      spread: 50,
      origin: { y: 0.8 },
      colors: ["#FFE4E8", "#FFD1DC", "#FFDF70"],
    });
  };

  return (
    <section
      id="letter-section"
      className="relative min-h-[95vh] flex flex-col items-center justify-center px-4 py-16 text-center"
    >
      <div className="max-w-xl w-full mx-auto flex flex-col items-center">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-2 mb-6"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-100/90 border border-rose-200/80 text-rose-800 text-xs font-semibold uppercase tracking-wider mb-2">
            <Mail className="w-3.5 h-3.5 text-rose-600" />
            <span>Heartfelt Letter</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-800 font-serif">
            {birthdayConfig.letter.title}
          </h2>

          <p className="text-neutral-600 text-sm sm:text-base max-w-sm mx-auto">
            {isOpen ? "A special message written just for you" : birthdayConfig.letter.subtitle}
          </p>
        </motion.div>

        {/* Interactive Envelope / Letter Presentation */}
        <div className="relative w-full max-w-lg my-4 flex flex-col items-center select-none">
          {!isOpen ? (
            /* Closed Wax-Sealed Envelope */
            <motion.div
              onClick={openEnvelope}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative w-full max-w-sm aspect-[16/11] rounded-3xl bg-gradient-to-br from-rose-100 via-pink-50 to-rose-200 p-1 shadow-2xl border-2 border-white/80 cursor-pointer flex flex-col items-center justify-center overflow-hidden group"
            >
              {/* Envelope Flap Lines */}
              <div className="absolute inset-0 border-[16px] border-transparent border-t-rose-200/70 border-r-rose-100/50 pointer-events-none" />
              
              {/* Letter Recipient Badge */}
              <div className="text-center font-serif text-sm text-neutral-600 mb-6 z-10">
                To the one and only <br />
                <span className="font-bold text-lg text-rose-900">{birthdayConfig.recipientName}</span>
              </div>

              {/* Glowing Wax Seal Button */}
              <div className="relative z-20 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-600 via-red-500 to-pink-500 border-2 border-amber-300 shadow-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                  <Heart className="w-8 h-8 fill-white/90 animate-pulse" />
                </div>
                <span className="mt-2 text-xs font-bold tracking-widest text-rose-800 uppercase bg-white/80 px-3 py-1 rounded-full shadow-xs">
                  {birthdayConfig.letter.sealText}
                </span>
              </div>
            </motion.div>
          ) : (
            /* Opened Parchment Letter Card */
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, type: "spring", damping: 20 }}
              className="w-full flex flex-col items-center"
            >
              {/* Letter Snapshot Container */}
              <div
                ref={letterCardRef}
                className="w-full rounded-3xl bg-[#FFFDF9] border-2 border-rose-200/80 p-6 sm:p-8 text-left shadow-2xl shadow-rose-200/40 relative overflow-hidden"
              >
                {/* Decorative Floral / Gold Corners */}
                <div className="absolute top-3 left-3 text-rose-300 text-xs select-none">✨</div>
                <div className="absolute top-3 right-3 text-rose-300 text-xs select-none">✨</div>
                <div className="absolute bottom-3 left-3 text-rose-300 text-xs select-none">✨</div>
                <div className="absolute bottom-3 right-3 text-rose-300 text-xs select-none">✨</div>

                {/* Letter Header Date */}
                <div className="text-right text-xs font-medium text-neutral-400 mb-4 font-serif">
                  {birthdayConfig.letter.date}
                </div>

                {/* Salutation */}
                <h3 className="text-xl sm:text-2xl font-bold text-rose-900 font-serif mb-4">
                  {birthdayConfig.letter.salutation}
                </h3>

                {/* Paragraphs */}
                <div className="space-y-3.5 text-neutral-700 text-sm sm:text-base leading-relaxed font-sans">
                  {birthdayConfig.letter.paragraphs.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>

                {/* Closing & Signature */}
                <div className="mt-8 pt-4 border-t border-rose-100 flex flex-col items-end text-right">
                  <span className="text-xs text-neutral-500 font-serif italic">
                    {birthdayConfig.letter.closing}
                  </span>
                  <span className="text-lg sm:text-xl font-bold text-rose-800 font-serif mt-1">
                    {birthdayConfig.letter.signature}
                  </span>
                </div>

                {/* P.S. Note */}
                {birthdayConfig.letter.psNote && (
                  <div className="mt-4 pt-3 border-t border-dashed border-rose-100 text-xs text-neutral-500 italic">
                    {birthdayConfig.letter.psNote}
                  </div>
                )}
              </div>

              {/* Action Buttons: Download / Share Card */}
              <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                <button
                  onClick={handleDownloadCard}
                  disabled={isExporting}
                  className="flex items-center gap-2 py-3 px-6 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                >
                  {isExporting ? (
                    <span>Generating Card...</span>
                  ) : exportSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Card Saved!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download Birthday Card 📸</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleDownloadCard}
                  className="flex items-center gap-2 py-3 px-5 rounded-full bg-white/80 backdrop-blur-md border border-neutral-200 text-neutral-700 font-medium text-sm shadow-xs hover:bg-neutral-50 active:scale-95 transition-all cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-rose-500" />
                  <span>Share Snippet</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Birthday Wish Jar / Guest Notes Sticky Board */}
        <div className="w-full mt-12 pt-8 border-t border-rose-100 text-left">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-neutral-800 font-serif">
                {birthdayConfig.wishes.title}
              </h3>
              <p className="text-xs text-neutral-500">
                {birthdayConfig.wishes.subtitle}
              </p>
            </div>

            <button
              onClick={() => {
                sound.playTap();
                setShowAddWish(!showAddWish);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-rose-500 text-white text-xs font-semibold shadow-xs hover:bg-rose-600 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Leave a Wish</span>
            </button>
          </div>

          {/* Add Wish Form Modal / Expandable */}
          <AnimatePresence>
            {showAddWish && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleAddWish}
                className="p-4 rounded-2xl bg-white border border-rose-200 shadow-md space-y-3 mb-6 overflow-hidden"
              >
                <div className="text-xs font-bold uppercase tracking-wider text-rose-800">
                  Write Your Birthday Message ✨
                </div>

                <input
                  type="text"
                  placeholder="Your Name (e.g. Grandma, Bestie Sam)"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                  required
                />

                <textarea
                  placeholder={`Write a sweet message, memory, or wish for ${birthdayConfig.recipientName}...`}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  rows={3}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none"
                  required
                />

                <div className="flex items-center justify-between">
                  {/* Sticky Color Picker */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-neutral-400 mr-1">Color:</span>
                    {STICKY_COLORS.map((c, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedColor(c)}
                        className={`w-6 h-6 rounded-full border-2 transition-all ${c.split(" ")[0]} ${
                          selectedColor === c ? "border-neutral-800 scale-110" : "border-transparent"
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500 text-white text-xs font-bold shadow-xs hover:bg-rose-600 transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Pin to Board</span>
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Sticky Notes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {wishes.map((wish) => (
              <motion.div
                key={wish.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-4 rounded-2xl border shadow-sm flex flex-col justify-between space-y-2 ${wish.color}`}
              >
                <p className="text-xs sm:text-sm leading-relaxed">&ldquo;{wish.message}&rdquo;</p>
                <div className="flex items-center justify-between text-[11px] font-semibold opacity-75 pt-1 border-t border-current/20">
                  <span>— {wish.author}</span>
                  <span className="font-normal">{wish.timestamp}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
