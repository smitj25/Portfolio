"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    // Preload first 10 frames of the scrollytelling sequence
    const framesToPreload = 10;
    let framesLoaded = 0;
    let framesReady = false;

    for (let i = 0; i < framesToPreload; i++) {
      const img = new Image();
      const paddedIndex = i.toString().padStart(2, "0");
      img.src = isMobile 
        ? `/video/mobile/frame_${paddedIndex}.jpg?v=2`
        : `/video/frame_${paddedIndex}_delay-0.066s.png`;
      img.onload = () => {
        framesLoaded++;
        if (framesLoaded >= framesToPreload) {
          framesReady = true;
        }
      };
      img.onerror = () => {
        framesLoaded++;
        if (framesLoaded >= framesToPreload) {
          framesReady = true;
        }
      };
    }

    // Artificial loading sequence — runs in parallel with frame preloading
    const duration = 1800; // 1.8 seconds total
    const interval = 20; // Update every 20ms
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const currentProgress = Math.min(Math.round((currentStep / steps) * 100), 100);
      setProgress(currentProgress);

      if (currentStep >= steps) {
        clearInterval(timer);
        // Wait until both timer and frames are ready
        const checkReady = setInterval(() => {
          if (framesReady) {
            clearInterval(checkReady);
            setTimeout(() => {
              setIsLoading(false);
            }, 400); // Brief pause at 100% before animating out
          }
        }, 50);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ 
            y: "-100%", 
            transition: { 
              duration: 0.8, 
              ease: [0.76, 0, 0.24, 1] // Custom snappy ease curve
            } 
          }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0a0a] text-white"
        >
          <div className="flex flex-col items-center">
            {/* Counter */}
            <div className="text-6xl md:text-8xl font-black tabular-nums tracking-tighter">
              {progress}%
            </div>

            {/* Loading Bar */}
            <div className="w-48 md:w-64 h-1 bg-white/[0.1] rounded-full mt-8 overflow-hidden relative">
              <motion.div 
                className="absolute top-0 left-0 bottom-0 bg-[#fa6c2a]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
