"use client";

import React, { useState, useEffect } from "react";
import FloatingBackground from "@/components/FloatingBackground";
import FloatingNavBar from "@/components/FloatingNavBar";
import HeroSection from "@/components/HeroSection";
import CakeSection from "@/components/CakeSection";
import ScratchCardSection from "@/components/ScratchCardSection";
import SlotMachineSection from "@/components/SlotMachineSection";
import EnvelopeLetterSection from "@/components/EnvelopeLetterSection";
import Footer from "@/components/Footer";

export default function BirthdayPage() {
  const [activeSection, setActiveSection] = useState("hero-section");

  // Track active section on scroll
  useEffect(() => {
    const sections = [
      "hero-section",
      "cake-section",
      "scratch-section",
      "slot-section",
      "letter-section",
    ];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 250;
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="relative min-h-screen flex flex-col justify-between overflow-x-hidden selection:bg-rose-200">
      {/* Background Animated Atmosphere */}
      <FloatingBackground />

      {/* Floating Navigation & Audio Bar */}
      <FloatingNavBar activeSection={activeSection} />

      {/* Main Single Page Sections */}
      <div className="relative z-10 w-full flex flex-col space-y-12 sm:space-y-16">
        {/* Step 1: Hero & Greeting */}
        <HeroSection onStartClick={() => scrollTo("cake-section")} />

        {/* Step 2: Interactive 3-Tier Birthday Cake with Blowable Candles */}
        <CakeSection
          onAllCandlesBlown={() => {}}
          onNextSection={() => scrollTo("scratch-section")}
        />

        {/* Step 3: Mystery Memory Scratch Card */}
        <ScratchCardSection
          onCardRevealed={() => {}}
          onNextSection={() => scrollTo("slot-section")}
        />

        {/* Step 4: Compliment & Memory Slot Machine */}
        <SlotMachineSection
          onSlotSpun={() => {}}
          onNextSection={() => scrollTo("letter-section")}
        />

        {/* Step 5: Heartfelt Envelope Letter & Wish Jar */}
        <EnvelopeLetterSection />
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
