"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const svgs = [
  "react.svg",
  "nextjs.svg",
  "nodejs.svg",
  "ts.svg",
  "js.svg",
  "py.svg",
  "pyt.svg",
  "langc.svg",
  "fastapi.svg",
  "firebase.svg",
  "mongodb.svg",
  "chromadb.svg",
  "langgraph.svg",
];

export default function SkillMarquee() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let animationFrameId: number;

    const scroll = () => {
      if (!isPaused && scrollRef.current) {
        // Adjust scroll speed here
        scrollRef.current.scrollLeft += 1.5; 
        
        // When we have scrolled exactly past the first set of items
        // we reset scrollLeft back to 0 to create an infinite loop.
        // We divide by 2 because we rendered the list exactly 2 times.
        if (scrollRef.current.scrollLeft >= scrollRef.current.scrollWidth / 2) {
          scrollRef.current.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused]);

  return (
    <div className="relative w-full bg-transparent py-4 z-30">
      {/* Subtle fade effect on the left and right edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-[#121212] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-[#121212] to-transparent z-10 pointer-events-none" />

      {/* The scrolling container */}
      <div 
        ref={scrollRef}
        className="flex w-full overflow-x-auto scrollbar-hide select-none"
        style={{ WebkitOverflowScrolling: 'touch' }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <div className="flex w-max">
          {[0, 1].map((blockIdx) => (
            <div
              key={blockIdx}
              className="flex items-center gap-12 md:gap-24 px-6 md:px-12"
            >
              {svgs.map((svg, i) => (
                <div 
                  key={`${blockIdx}-${i}`} 
                  className="relative w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 shrink-0 opacity-50 hover:opacity-100 transition-opacity duration-300 filter grayscale hover:grayscale-0 hover:drop-shadow-[0_0_15px_rgba(250,108,42,0.5)] cursor-grab active:cursor-grabbing"
                >
                  <Image
                    src={`/tech-svg/${svg}`}
                    alt={svg.replace(".svg", "")}
                    fill
                    className="object-contain pointer-events-none"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
