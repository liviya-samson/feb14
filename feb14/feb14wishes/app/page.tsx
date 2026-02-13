"use client";

import { useEffect, useState, useCallback } from "react";

const LOADING_MESSAGES = [
  "Calculating how much I love you...",
  "Error: Love overflow detected 💀",
  "Downloading 4 years of memories...",
  "Compressing all my feelings... failed (too many)",
  "Running boyfriend_duties.exe...",
  "Searching for someone better... 0 results found 😏",
  "Installing anniversary_surprise.apk...",
  "Buffering... just like my brain when I see you",
];

const CONFETTI_COLORS = [
  "#ff6b6b",
  "#ff8e8e",
  "#ffb3b3",
  "#ff4081",
  "#f50057",
  "#ff80ab",
  "#ffd54f",
  "#fff176",
  "#e040fb",
  "#ea80fc",
];
const HEART_EMOJIS = ["❤️", "💕", "💖", "💗", "💘", "💝", "🌹", "✨", "💫"];

function seeded(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

const HEARTS_DATA = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  emoji: HEART_EMOJIS[i % HEART_EMOJIS.length],
  delay: seeded(i * 4 + 1) * 10,
  left: seeded(i * 4 + 2) * 100,
  size: 14 + seeded(i * 4 + 3) * 18,
  duration: 7 + seeded(i * 4 + 4) * 8,
}));

const CONFETTI_DATA = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  delay: seeded(i * 5 + 100) * 2.5,
  left: seeded(i * 5 + 101) * 100,
  colorIdx: Math.floor(seeded(i * 5 + 102) * CONFETTI_COLORS.length),
  size: 5 + seeded(i * 5 + 103) * 7,
  duration: 2.5 + seeded(i * 5 + 104) * 3,
  heightRatio: 1 + seeded(i * 5 + 105),
  isRound: seeded(i * 5 + 106) > 0.5,
  rotation: seeded(i * 5 + 107) * 360,
}));

const PHOTOS = Array.from(
  { length: 20 },
  (_, i) => `/photos/photo${i + 1}.jpg`,
);
const VIDEO_SRC = "/photos/video.mp4";

const GLASS_CARD_STYLE: React.CSSProperties = {
  background:
    "linear-gradient(160deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
  boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
};

const LETTER_CARD_STYLE: React.CSSProperties = {
  background: "linear-gradient(160deg, rgba(40,0,15,0.85), rgba(20,0,10,0.95))",
  boxShadow:
    "0 0 60px rgba(255,0,80,0.08), inset 0 0 60px rgba(255,0,80,0.03), 0 20px 60px rgba(0,0,0,0.4)",
};

const NO_BUTTON_MESSAGES = [
  "No 😐",
  "Are you sure?",
  "Really?! 😳",
  "Think again!",
  "Can't click me 😜",
  "STOP trying 😤",
  "I'm too fast!",
  "Give up already 💀",
  "Okay fine... JK! 🏃",
];

function pickRandomPhoto(exclude: number) {
  let next: number;
  do {
    next = Math.floor(Math.random() * PHOTOS.length);
  } while (next === exclude);
  return next;
}

/* ── Photo Background (Steps 0–4) ── */
function PhotoBackground() {
  const [indexA, setIndexA] = useState(0);
  const [indexB, setIndexB] = useState(1);
  const [showA, setShowA] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowA((prev) => {
        if (prev) {
          setIndexB(pickRandomPhoto(indexA));
        } else {
          setIndexA(pickRandomPhoto(indexB));
        }
        return !prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [indexA, indexB]);

  return (
    <div className="fixed inset-0 z-0">
      {/* Slot A */}
      <img
        src={PHOTOS[indexA]}
        alt=""
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[1500ms] ease-in-out"
        style={{ opacity: showA ? 1 : 0 }}
      />
      {/* Slot B */}
      <img
        src={PHOTOS[indexB]}
        alt=""
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[1500ms] ease-in-out"
        style={{ opacity: showA ? 0 : 1 }}
      />
      {/* Dark overlay for readability */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,0,5,0.55) 0%, rgba(10,0,5,0.7) 50%, rgba(10,0,5,0.8) 100%)",
        }}
      />
    </div>
  );
}

/* ── Video Background (Step 5) ── */
function VideoBackground() {
  return (
    <div className="fixed inset-0 z-0">
      <video
        src={VIDEO_SRC}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,0,5,0.65) 0%, rgba(10,0,5,0.75) 50%, rgba(10,0,5,0.85) 100%)",
        }}
      />
    </div>
  );
}

function FloatingHeart({
  emoji,
  delay,
  left,
  size,
  duration,
}: {
  emoji: string;
  delay: number;
  left: number;
  size: number;
  duration: number;
}) {
  return (
    <span
      className="fixed pointer-events-none select-none"
      style={{
        left: `${left}%`,
        bottom: "-5%",
        fontSize: `${size}px`,
        animation: `floatUp ${duration}s ease-in ${delay}s infinite`,
        zIndex: 1,
        willChange: "transform",
      }}
    >
      {emoji}
    </span>
  );
}

function ConfettiPiece({
  delay,
  left,
  colorIdx,
  size,
  duration,
  heightRatio,
  isRound,
  rotation,
}: {
  delay: number;
  left: number;
  colorIdx: number;
  size: number;
  duration: number;
  heightRatio: number;
  isRound: boolean;
  rotation: number;
}) {
  return (
    <span
      className="fixed pointer-events-none"
      style={{
        left: `${left}%`,
        top: "-3%",
        width: `${size}px`,
        height: `${size * heightRatio}px`,
        backgroundColor: CONFETTI_COLORS[colorIdx],
        borderRadius: isRound ? "50%" : "2px",
        animation: `confettiFall ${duration}s ease-in ${delay}s forwards`,
        transform: `rotate(${rotation}deg)`,
        zIndex: 50,
      }}
    />
  );
}

function GlowOrb({
  color,
  size,
  top,
  left,
  opacity = 0.15,
}: {
  color: string;
  size: string;
  top: string;
  left: string;
  opacity?: number;
}) {
  return (
    <div
      className="fixed rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        top,
        left,
        opacity,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        transform: "translate(-50%, -50%)",
        filter: "blur(2px)",
        zIndex: 1,
      }}
    />
  );
}

function StepWrapper({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative z-10 w-full max-w-xl mx-auto px-6 sm:px-10 text-center ${className}`}
      style={{ animation: "slideInScale 0.7s cubic-bezier(0.16, 1, 0.3, 1)" }}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const [step, setStep] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [noPos, setNoPos] = useState({ x: 50, y: 75 });
  const [noAttempts, setNoAttempts] = useState(0);
  const [loadingIdx, setLoadingIdx] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [typedText, setTypedText] = useState("");

  useEffect(() => setMounted(true), []);

  const finalMessage =
    "Happy Valentine's Day & Happy 4th Anniversary, my love! 💖";
  useEffect(() => {
    if (step !== 5) return;
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(finalMessage.slice(0, i + 1));
      i++;
      if (i >= finalMessage.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [step]);

  useEffect(() => {
    if (step !== 3) return;
    const msgInterval = setInterval(() => {
      setLoadingIdx((prev) => {
        if (prev >= LOADING_MESSAGES.length - 1) {
          clearInterval(msgInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 1400);
    const progressInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => setStep(4), 600);
          return 100;
        }
        return prev + Math.random() * 7 + 2;
      });
    }, 350);
    return () => {
      clearInterval(msgInterval);
      clearInterval(progressInterval);
    };
  }, [step]);

  useEffect(() => {
    if (step === 5) {
      setTimeout(() => setShowConfetti(true), 400);
    }
  }, [step]);

  const moveNoButton = useCallback(() => {
    setNoAttempts((prev) => prev + 1);
    setNoPos({ x: 8 + Math.random() * 75, y: 15 + Math.random() * 65 });
  }, []);

  if (!mounted) return null;

  return (
    <main className="relative min-h-dvh flex flex-col items-center justify-center overflow-hidden">
      {/* ── Background: photos for steps 0-4, video for step 5 ── */}
      {step < 5 ? <PhotoBackground /> : <VideoBackground />}

      {/* ── Floating hearts ── */}
      {HEARTS_DATA.map((h) => (
        <FloatingHeart
          key={h.id}
          emoji={h.emoji}
          delay={h.delay}
          left={h.left}
          size={h.size}
          duration={h.duration}
        />
      ))}

      {/* ── Ambient glows ── */}
      <GlowOrb
        color="rgba(255,0,80,0.2)"
        size="min(500px, 80vw)"
        top="20%"
        left="60%"
      />
      <GlowOrb
        color="rgba(150,0,255,0.12)"
        size="min(400px, 70vw)"
        top="70%"
        left="30%"
      />

      {/* ── Confetti ── */}
      {showConfetti &&
        CONFETTI_DATA.map((c) => (
          <ConfettiPiece
            key={c.id}
            delay={c.delay}
            left={c.left}
            colorIdx={c.colorIdx}
            size={c.size}
            duration={c.duration}
            heightRatio={c.heightRatio}
            isRound={c.isRound}
            rotation={c.rotation}
          />
        ))}

      {/* ═══════ STEP 0: "We need to talk" ═══════ */}
      {step === 0 && (
        <StepWrapper>
          <div
            className="backdrop-blur-[20px] border border-white/8 rounded-3xl p-10 sm:p-14"
            style={GLASS_CARD_STYLE}
          >
            <div
              className="text-5xl sm:text-7xl mb-7 sm:mb-8"
              style={{ animation: "wiggle 2s ease-in-out infinite" }}
            >
              😶
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
              Hey...
            </h1>
            <p
              className="text-lg sm:text-2xl text-gray-400 mb-3 leading-relaxed"
              style={{ animation: "fadeInUp 0.8s ease-out 0.4s both" }}
            >
              We need to talk.
            </p>
            <p
              className="text-gray-500 text-sm sm:text-base mb-10 leading-relaxed"
              style={{ animation: "fadeInUp 0.8s ease-out 0.8s both" }}
            >
              It&apos;s been 4 years and I have something to say...
            </p>
            <button
              onClick={() => setStep(1)}
              className="relative overflow-hidden cursor-pointer transition-all duration-300 active:scale-[0.96] px-8 py-3.5 sm:px-10 sm:py-4 rounded-full text-white text-sm sm:text-lg font-medium"
              style={{
                animation: "fadeInUp 0.8s ease-out 1.2s both",
                background: "linear-gradient(135deg, #2a2a2a, #404040)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              Open Message 😰
            </button>
          </div>
        </StepWrapper>
      )}

      {/* ═══════ STEP 1: The twist ═══════ */}
      {step === 1 && (
        <StepWrapper>
          <div
            className="backdrop-blur-[20px] border border-white/8 rounded-3xl p-10 sm:p-14"
            style={GLASS_CARD_STYLE}
          >
            <div
              className="text-5xl sm:text-7xl mb-6 sm:mb-8"
              style={{ animation: "heartbeat 1.2s ease-in-out infinite" }}
            >
              🤭
            </div>
            <h1
              className="text-2xl sm:text-4xl font-bold mb-4 leading-snug"
              style={{
                background:
                  "linear-gradient(135deg, #ff6b6b, #ff8e8e, #f06292)",
                backgroundSize: "200% auto",
                animation: "gradientShift 3s ease infinite",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              ...about how AMAZING you are!
            </h1>
            <p
              className="text-lg sm:text-xl text-pink-200/70 mb-3 leading-relaxed"
              style={{ animation: "fadeInUp 0.6s ease-out 0.3s both" }}
            >
              Did I scare you? 😂
            </p>
            <p
              className="text-pink-300/40 text-sm sm:text-base mb-10 leading-relaxed"
              style={{ animation: "fadeInUp 0.6s ease-out 0.5s both" }}
            >
              4 years and I still haven&apos;t run out of ways to mess with you
            </p>
            <button
              onClick={() => setStep(2)}
              className="relative overflow-hidden cursor-pointer transition-all duration-300 active:scale-[0.96] px-8 py-3.5 sm:px-10 sm:py-4 rounded-full text-white text-sm sm:text-lg font-medium"
              style={{
                animation: "fadeInUp 0.6s ease-out 0.7s both",
                background: "linear-gradient(135deg, #e91e63, #f06292)",
                boxShadow: "0 4px 20px rgba(233,30,99,0.3)",
              }}
            >
              Okay okay, what else? 🙄
            </button>
          </div>
        </StepWrapper>
      )}

      {/* ═══════ STEP 2: Runaway "No" button ═══════ */}
      {step === 2 && (
        <div
          className="relative z-10 w-full min-h-dvh flex flex-col items-center justify-center px-6 sm:px-10"
          style={{
            animation: "slideInScale 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div className="text-center mb-10 sm:mb-14">
            <div
              className="text-5xl sm:text-7xl mb-6 sm:mb-8"
              style={{ animation: "pulse 2s ease-in-out infinite" }}
            >
              💘
            </div>
            <h1
              className="text-2xl sm:text-4xl font-bold text-pink-100 mb-3 leading-snug"
              style={{ animation: "fadeInUp 0.6s ease-out 0.2s both" }}
            >
              Quick question...
            </h1>
            <p
              className="text-lg sm:text-2xl text-pink-200/80 leading-relaxed"
              style={{ animation: "fadeInUp 0.6s ease-out 0.4s both" }}
            >
              Will you be my Valentine? (for the 4th time)
            </p>
          </div>
          <button
            onClick={() => setStep(3)}
            className="relative overflow-hidden cursor-pointer transition-all duration-300 active:scale-[0.96] px-10 py-4 sm:px-14 sm:py-5 rounded-full text-white text-lg sm:text-xl font-bold z-10"
            style={{
              animation: "fadeInUp 0.6s ease-out 0.6s both",
              background: "linear-gradient(135deg, #e91e63, #c2185b)",
              boxShadow:
                "0 0 40px rgba(233,30,99,0.4), 0 8px 30px rgba(233,30,99,0.3)",
            }}
          >
            Yes! 💖
          </button>
          <button
            onMouseEnter={moveNoButton}
            onTouchStart={(e) => {
              e.preventDefault();
              moveNoButton();
            }}
            onClick={moveNoButton}
            className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-gray-400 text-xs sm:text-sm font-medium z-10 whitespace-nowrap"
            style={{
              position: "absolute",
              left: `${noPos.x}%`,
              top: `${noPos.y}%`,
              transform: "translate(-50%, -50%)",
              background: "rgba(40,40,40,0.9)",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(8px)",
              transition:
                noAttempts === 0
                  ? "none"
                  : "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
            }}
          >
            {
              NO_BUTTON_MESSAGES[
                Math.min(noAttempts, NO_BUTTON_MESSAGES.length - 1)
              ]
            }
          </button>
          {noAttempts === 1 && (
            <p
              className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 text-pink-400/50 text-xs sm:text-sm text-center w-full px-4"
              style={{ animation: "fadeIn 0.5s ease-out" }}
            >
              Hint: The &quot;No&quot; button is broken on purpose 😉
            </p>
          )}
        </div>
      )}

      {/* ═══════ STEP 3: Funny loading ═══════ */}
      {step === 3 && (
        <StepWrapper>
          <div
            className="backdrop-blur-[20px] border border-white/8 rounded-3xl p-10 sm:p-14"
            style={GLASS_CARD_STYLE}
          >
            <div
              className="text-5xl sm:text-6xl mb-7 sm:mb-8"
              style={{ animation: "pulse 1.5s ease-in-out infinite" }}
            >
              ⏳
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-pink-100 mb-8 leading-relaxed">
              Preparing your surprise...
            </h2>
            <div className="w-full h-3 sm:h-3.5 rounded-full bg-white/5 mb-6 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(loadingProgress, 100)}%`,
                  background:
                    "linear-gradient(90deg, #e91e63, #f06292, #ff80ab, #e91e63)",
                  backgroundSize: "200% auto",
                  animation: "gradientShift 2s linear infinite",
                  boxShadow: "0 0 12px rgba(233, 30, 99, 0.4)",
                }}
              />
            </div>
            <p className="text-pink-200/70 text-sm sm:text-base min-h-12 flex items-center justify-center leading-relaxed">
              {LOADING_MESSAGES[loadingIdx]}
            </p>
            <p className="text-white/20 text-sm mt-4 font-mono">
              {Math.min(Math.round(loadingProgress), 100)}%
            </p>
          </div>
        </StepWrapper>
      )}

      {/* ═══════ STEP 4: Drumroll ═══════ */}
      {step === 4 && (
        <StepWrapper>
          <div
            className="backdrop-blur-[20px] border border-white/8 rounded-3xl p-10 sm:p-14"
            style={GLASS_CARD_STYLE}
          >
            <div
              className="text-6xl sm:text-8xl mb-6 sm:mb-8"
              style={{ animation: "wiggle 0.5s ease-in-out infinite" }}
            >
              🥁
            </div>
            <p className="text-2xl sm:text-3xl text-pink-200 mb-10 font-light leading-relaxed">
              Ready?
            </p>
            <button
              onClick={() => setStep(5)}
              className="relative overflow-hidden cursor-pointer transition-all duration-300 active:scale-[0.96] px-10 py-4 sm:px-14 sm:py-5 rounded-full text-white text-base sm:text-xl font-bold"
              style={{
                animation: "pulse 2s ease-in-out infinite",
                background: "linear-gradient(135deg, #e91e63, #c2185b)",
                boxShadow:
                  "0 0 50px rgba(233,30,99,0.5), 0 8px 30px rgba(233,30,99,0.3)",
              }}
            >
              Show Me! 🎉
            </button>
          </div>
        </StepWrapper>
      )}

      {/* ═══════ STEP 5: Grand Finale ═══════ */}
      {step === 5 && (
        <div
          className="relative z-10 w-full max-w-2xl mx-auto px-4 sm:px-8 py-10 sm:py-16 text-center"
          style={{
            animation: "slideInScale 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div
            className="text-6xl sm:text-8xl mb-4 sm:mb-6"
            style={{ animation: "heartbeat 1.5s ease-in-out infinite" }}
          >
            ❤️
          </div>

          <h1
            className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 min-h-16 sm:min-h-20 px-2"
            style={{
              animation: "glow 3s ease-in-out infinite",
              background:
                "linear-gradient(135deg, #ff6b6b, #ff8e8e, #ffb3b3, #ff6b6b)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {typedText}
            <span style={{ animation: "typing-cursor 0.8s step-end infinite" }}>
              |
            </span>
          </h1>

          <div
            className="inline-block mt-2 mb-6 sm:mb-8 px-5 py-2.5 sm:px-7 sm:py-3 rounded-full"
            style={{
              animation:
                "fadeInUp 0.8s ease-out 3.5s both, pulse 3s ease-in-out 4.5s infinite",
              background:
                "linear-gradient(135deg, rgba(255,0,80,0.2), rgba(255,100,150,0.1))",
              border: "1px solid rgba(255,100,150,0.2)",
              backdropFilter: "blur(12px)",
            }}
          >
            <span className="text-sm sm:text-xl font-light tracking-widest text-pink-200">
              {"✨"} 4 Years of Us {"✨"}
            </span>
          </div>

          <div
            className="backdrop-blur-xl border border-[rgba(255,50,80,0.15)] mt-6 sm:mt-8 p-8 sm:p-12 rounded-2xl sm:rounded-3xl text-left leading-relaxed"
            style={{
              ...LETTER_CARD_STYLE,
              animation: "fadeInUp 0.8s ease-out 4s both",
            }}
          >
            <p className="text-pink-100/90 text-base sm:text-lg mb-6 sm:mb-7 italic">
              My Dearest Love,
            </p>
            <p className="text-pink-100/70 text-sm sm:text-base mb-5 sm:mb-6 leading-7">
              Sorry for the scare earlier 😂 But honestly, after 4 years,
              messing with you is one of my favorite things to do.
            </p>
            <p className="text-pink-100/70 text-sm sm:text-base mb-5 sm:mb-6 leading-7">
              Four years of laughing at my terrible jokes, four years of putting
              up with my drama, four years of being the most amazing person I
              know. How did I get this lucky?
            </p>
            <p className="text-pink-100/70 text-sm sm:text-base mb-5 sm:mb-6 leading-7">
              You&apos;re not just my Valentine &mdash; you&apos;re my best
              friend, my biggest supporter, and the reason I smile like an idiot
              at my phone.
            </p>
            <p className="text-pink-100/70 text-sm sm:text-base mb-5 sm:mb-6 leading-7">
              Here&apos;s to year 4, and to forever more years of us being
              absolute weirdos together. I love you more than words (or this
              website) could ever express. 💕
            </p>
            <p className="text-pink-200 text-sm sm:text-lg text-right italic mt-8 sm:mt-10">
              Forever Yours Liviya....{"❤️"}
            </p>
          </div>

          <div
            className="mt-8 sm:mt-10 grid grid-cols-4 gap-2 sm:gap-4"
            style={{ animation: "fadeInUp 0.8s ease-out 5s both" }}
          >
            {[1, 2, 3, 4].map((year) => (
              <div
                key={year}
                className="flex flex-col items-center gap-1 py-3 sm:py-4 rounded-xl sm:rounded-2xl"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${5 + year * 0.15}s both`,
                  background:
                    year === 4
                      ? "linear-gradient(135deg, rgba(255,0,80,0.25), rgba(255,50,100,0.15))"
                      : "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
                  border:
                    year === 4
                      ? "1px solid rgba(255,50,100,0.3)"
                      : "1px solid rgba(255,255,255,0.06)",
                  boxShadow:
                    year === 4 ? "0 0 25px rgba(255,0,80,0.2)" : "none",
                }}
              >
                <span className="text-lg sm:text-2xl">
                  {year === 4 ? "💖" : "🩷"}
                </span>
                <span
                  className={`text-xs sm:text-sm font-medium ${year === 4 ? "text-pink-300" : "text-pink-400/50"}`}
                >
                  Year {year}
                </span>
              </div>
            ))}
          </div>

          <p
            className="mt-8 sm:mt-10 text-pink-300/40 text-xs sm:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase"
            style={{ animation: "fadeInUp 0.8s ease-out 6s both" }}
          >
            {"🌹"} Feb 14 {"•"} With All My Love {"🌹"}
          </p>
        </div>
      )}
    </main>
  );
}
