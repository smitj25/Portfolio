"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";

const navLinks = [
  { name: "Experience", href: "#experience" },
  { name: "Education", href: "#education" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Connect", href: "#id-card" },
];

export default function Navbar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    
    // Hide navbar when scrolling down, show when scrolling up
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }

    // Add backdrop blur only when scrolled past the very top
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.nav
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: "-100%", opacity: 0 },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed top-6 left-0 right-0 z-50 flex justify-center px-3 sm:px-4"
    >
      <div
        className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-full border transition-colors duration-300 max-w-[calc(100vw-1.5rem)] overflow-x-auto scrollbar-hide ${
          isScrolled
            ? "bg-black/40 backdrop-blur-md border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
            : "bg-transparent border-transparent"
        }`}
      >
        {/* Logo/Home link */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="mr-2 sm:mr-6 px-2 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-widest text-white hover:bg-white/[0.08] transition-all duration-300 flex items-center gap-2 shrink-0"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#fa6c2a]" />
          Home
        </a>

        {/* Links */}
        <div className="flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleScroll(e, link.href)}
              className="px-2 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/[0.08] transition-all duration-300 whitespace-nowrap shrink-0"
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}
