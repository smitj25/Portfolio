"use client";

import Image from "next/image";

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
  return (
    <div className="relative w-full overflow-hidden bg-transparent py-4 z-30">
      {/* Subtle fade effect on the left and right edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-[#121212] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-[#121212] to-transparent z-10 pointer-events-none" />

      {/* The scrolling container */}
      <div className="flex w-fit group">
        {/* We create two identical blocks of logos that slide to the left */}
        {/* Hovering pauses the animation for a cool interaction */}
        {[0, 1].map((blockIdx) => (
          <div
            key={blockIdx}
            className="flex items-center gap-12 md:gap-24 px-6 md:px-12 animate-marquee group-hover:[animation-play-state:paused]"
          >
            {svgs.map((svg, i) => (
              <div 
                key={`${blockIdx}-${i}`} 
                className="relative w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 shrink-0 opacity-50 hover:opacity-100 transition-opacity duration-300 filter grayscale hover:grayscale-0 hover:drop-shadow-[0_0_15px_rgba(250,108,42,0.5)]"
              >
                <Image
                  src={`/tech-svg/${svg}`}
                  alt={svg.replace(".svg", "")}
                  fill
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
