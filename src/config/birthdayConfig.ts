export interface BirthdayConfig {
  recipientName: string;
  nickname?: string;
  age?: number | string;
  birthDate: string;
  hero: {
    badge: string;
    greeting: string;
    subtitle: string;
    scrollPrompt: string;
  };
  cake: {
    title: string;
    subtitle: string;
    candleCount: number;
    wishPrompt: string;
    blownMessage: string;
    subMessage: string;
  };
  scratchCard: {
    title: string;
    subtitle: string;
    overlayText: string;
    revealedPhoto: string;
    revealedDate: string;
    revealedTitle: string;
    revealedMessage: string;
    caption: string;
  };
  slotMachine: {
    title: string;
    subtitle: string;
    reel1Title: string;
    reel2Title: string;
    reel3Title: string;
    jokes: string[];
    compliments: string[];
    memories: string[];
  };
  letter: {
    title: string;
    subtitle: string;
    sealText: string;
    salutation: string;
    paragraphs: string[];
    closing: string;
    signature: string;
    date: string;
    psNote?: string;
  };
  wishes: {
    title: string;
    subtitle: string;
    initialWishes: Array<{ id: string; author: string; message: string; color: string; timestamp: string }>;
  };
  audio: {
    enableSynthMelody: boolean;
    customAudioUrl?: string;
    songTitle: string;
  };
  shareCard: {
    headline: string;
    subtext: string;
    hashtag: string;
  };
}

export const birthdayConfig: BirthdayConfig = {
  recipientName: "Vamsha",
  nickname: "Vamsha",
  age: 24,
  birthDate: "February 21",
  hero: {
    badge: "✨ Special Celebration Edition ✨",
    greeting: "Happy Birthday,",
    subtitle: "Today is all about celebrating the wonderful human you are. Another year more radiant, incredible, and genuinely unforgettable.",
    scrollPrompt: "Start the Celebration 🎈",
  },
  cake: {
    title: "Make a Birthday Wish",
    subtitle: "Tap the glowing candles to blow them out, or tap the button to blow all at once!",
    candleCount: 3,
    wishPrompt: "Close your eyes, take a deep breath, and make your biggest wish...",
    blownMessage: "🎉 WISH GRANTED! 🎉",
    subMessage: "May this year shower you with endless magic, peace, and unforgettable moments!",
  },
  scratchCard: {
    title: "Unwrap a Golden Memory",
    subtitle: "Swipe your finger or mouse over the glitter card to reveal a special keepsake!",
    overlayText: "✨ Scratch with Love ✨",
    revealedPhoto: "/images/sample-memory.jpg",
    revealedDate: "Unforgettable Moments",
    revealedTitle: "The Joy You Bring to Life ❤️",
    revealedMessage: "From spontaneous late-night laughs to the quiet moments when you simply made everything brighter — having you in our lives is the greatest blessing.",
    caption: "Treasured forever in our hearts",
  },
  slotMachine: {
    title: "Birthday Vibe Machine",
    subtitle: "Spin the reels to discover funny inside jokes, sweet compliments, and epic memories!",
    reel1Title: "Funny Quirk 😜",
    reel2Title: "Pure Vibe ✨",
    reel3Title: "Core Memory 🌟",
    jokes: [
      "Forever 5 mins late with iced coffee in hand ☕",
      "Chief snack officer & unapologetic foodie 🍕",
      "World-class meme sender at 1:00 AM 📱",
      "Has 68 open browser tabs & 0 regrets 💻",
      "Can effortlessly sleep through 9 alarms ⏰",
      "Always planning the next holiday vacation ✈️",
    ],
    compliments: [
      "Lights up every room effortlessly ✨",
      "Possesses the kindest, most generous heart 💖",
      "Top-tier music taste and golden vibes 🎧",
      "A fiercely loyal friend who always shows up 🌟",
      "Radiates warm sunshine energy wherever you go ☀️",
      "Smart, sharp, and naturally inspiring 💡",
    ],
    memories: [
      "That legendary road trip under the starry sky 🌌",
      "Laughing until our stomachs hurt in the kitchen 🥞",
      "Singing at the top of our lungs on the drive home 🎤",
      "Conquering big dreams together step by step 🏆",
      "Here is to another 365 days of wild adventures 🚀",
      "The cozy movie marathons with endless popcorn 🍿",
    ],
  },
  letter: {
    title: "A Heartfelt Letter For You",
    subtitle: "Tap the wax seal to unlock your personal birthday note.",
    sealText: "OPEN 💌",
    salutation: "Dearest Vamsha,",
    paragraphs: [
      "Happy, happy birthday! As you step into this exciting new year of your journey, I wanted to take a moment to celebrate everything that makes you so undeniably special.",
      "Your genuine kindness, infectious laugh, and the comforting energy you bring to everyone around you make the world a much brighter place.",
      "May this upcoming chapter bring you boundless joy, spontaneous adventures, gentle peaceful mornings, and all the love and success you so richly deserve.",
      "Keep dreaming boldly and shining brightly. The very best is yet to come!"
    ],
    closing: "With all my love & warmest wishes,",
    signature: "Your Favorite Person 💖",
    date: "February 21, 2026",
    psNote: "P.S. Don't forget to save some birthday cake for me! 🍰",
  },
  wishes: {
    title: "Birthday Wish Jar",
    subtitle: "Leave a sweet wish or pin your favorite memory to the board!",
    initialWishes: [
      {
        id: "1",
        author: "Alex M.",
        message: "Happy birthday superstar! May this year be your most adventurous one yet! 🚀🌟",
        color: "bg-rose-100/90 text-rose-900 border-rose-200",
        timestamp: "Just now",
      },
      {
        id: "2",
        author: "Maya & Sam",
        message: "Wishing you endless laughter, delicious cake, and all the happiness in the world! 🎂✨",
        color: "bg-amber-100/90 text-amber-900 border-amber-200",
        timestamp: "10 mins ago",
      },
      {
        id: "3",
        author: "Jordan K.",
        message: "So proud of all you accomplished this year. Keep glowing and inspiring us all! 💖🎉",
        color: "bg-purple-100/90 text-purple-900 border-purple-200",
        timestamp: "1 hour ago",
      },
    ],
  },
  audio: {
    enableSynthMelody: true,
    customAudioUrl: "",
    songTitle: "Lofi Birthday Melody 🎶",
  },
  shareCard: {
    headline: "Happy Birthday Vamsha! 🎉",
    subtext: "Celebrating an amazing year of memories, laughter, and sunshine.",
    hashtag: "#HappyBirthdayVamsha #CelebrateLife",
  },
};
