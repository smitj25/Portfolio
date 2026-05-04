"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState, useEffect } from "react";

const navLinks = [
  { name: "Home", href: "#" },
  { name: "Experience", href: "#experience" },
  { name: "Education", href: "#education" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Connect", href: "#id-card" },
];

export default function Navbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("#");

  // Track the active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      let current = "#";
      // Iterate backwards to find the first section that is on screen
      for (let i = navLinks.length - 1; i >= 0; i--) {
        const link = navLinks[i];
        if (link.href === "#") continue;
        const element = document.querySelector(link.href);
        if (element) {
          const rect = element.getBoundingClientRect();
          // If the top of the section is somewhat above the middle of the screen
          if (rect.top <= window.innerHeight / 2.5) {
            current = link.href;
            break;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial check
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    // Add backdrop blur only when scrolled past the very top
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (href === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-3 sm:px-4">
      <div
        className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-full border transition-colors duration-300 max-w-[calc(100vw-1.5rem)] overflow-x-auto scrollbar-hide ${
          isScrolled
            ? "bg-black/40 backdrop-blur-md border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
            : "bg-transparent border-transparent"
        }`}
      >
        {/* Links */}
        {navLinks.map((link) => {
          const isActive = activeSection === link.href;
          return (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={`relative px-2 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs uppercase tracking-widest transition-all duration-300 whitespace-nowrap shrink-0 flex items-center gap-2 ${
                link.name === "Home" ? "mr-2 sm:mr-4 font-bold" : "font-semibold"
              } ${
                isActive ? "text-white" : "text-gray-400 hover:text-white hover:bg-white/[0.08]"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNavDot"
                  className="w-1.5 h-1.5 rounded-full bg-[#fa6c2a]"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              {link.name}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
