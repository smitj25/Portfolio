"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Project = {
  title: string;
  description: string;
  details: string[];
  tech: string[];
  date: string;
  github: string | null;
  live: string | null;
};

const projects: Project[] = [
  {
    title: "Agentic Code Assistant",
    description:
      "Built a RAG-based multi-turn coding assistant using LangGraph with context-aware code generation, debugging, and explanations. Uses ChromaDB for semantic retrieval to improve accuracy.",
    details: [
      "Designed a multi-agent LangGraph pipeline with dedicated nodes for code generation, debugging, and explanation",
      "Integrated ChromaDB as a vector store for semantic code retrieval across the user's codebase",
      "Implemented multi-turn conversation memory with context windowing for coherent sessions",
      "Built a streaming response system for real-time code output delivery",
    ],
    tech: ["LangGraph", "RAG", "ChromaDB", "Python"],
    date: "Mar 2026",
    github: "https://github.com/smitj25",
    live: null,
  },
  {
    title: "RAG-Based Resume Analyzer",
    description:
      "Developed a RAG-based resume analysis web app for recruiters. Generates job-fit scores using retrieval and matching techniques to streamline hiring.",
    details: [
      "Built a document ingestion pipeline that parses and chunks resumes into semantically meaningful segments",
      "Implemented vector-based matching between job descriptions and candidate profiles using embeddings",
      "Developed a scoring algorithm that evaluates job-fit across skills, experience, and domain relevance",
      "Created a FastAPI backend with a clean web interface for recruiters to upload and analyze resumes",
    ],
    tech: ["RAG", "LangChain", "FastAPI", "Python"],
    date: "Jan 2026",
    github: "https://github.com/smitj25",
    live: null,
  },
  {
    title: "PromptCraft — Prompt Optimizer",
    description:
      "An NLP-powered web app that analyzes and enhances user prompts for improved AI interactions. Features intent detection, prompt classification, readability analysis, and model-specific optimization for Gemini, ChatGPT, and Perplexity.",
    details: [
      "Built a full NLP pipeline with tokenization, lemmatization, stopword removal, and readability scoring",
      "Implemented intent detection to classify prompts as creative, academic, technical, or conversational",
      "Integrated Gemini API for semantic embeddings and model-specific prompt enhancement",
      "Developed before-and-after comparison UI with metrics including readability, length, and semantic similarity",
    ],
    tech: ["NLP", "Gemini API", "FastAPI", "Python"],
    date: "Oct 2025",
    github: "https://github.com/smitj25",
    live: null,
  },
  {
    title: "Multi-Modal Bot Detection",
    description:
      "Built a passive bot detection system using mouse dynamics, server logs, and honeypots. Implemented CNN + ensemble models for high-accuracy detection.",
    details: [
      "Collected and processed multi-modal behavioral data from mouse dynamics, keystroke patterns, and server logs",
      "Designed invisible honeypot traps to catch automated traffic without impacting user experience",
      "Trained CNN models on behavioral sequences and built an ensemble classifier for robust detection",
      "Achieved high-accuracy classification distinguishing human users from sophisticated bots",
    ],
    tech: ["CNN", "PyTorch", "Python", "Flask"],
    date: "Sep – Oct 2025",
    github: "https://github.com/smitj25",
    live: null,
  },
  {
    title: "Sound Generation — Neural Networks",
    description:
      "Developed VAE-based models for realistic audio generation with spectrogram preprocessing and KL divergence optimization. Published at National NTAI conference.",
    details: [
      "Designed a VAE architecture for structured audio generation from spectrogram representations",
      "Implemented preprocessing pipeline converting raw audio to mel-spectrograms for model input",
      "Optimized the model using KL divergence regularization for diverse yet realistic audio samples",
      "Published findings at the National NTAI conference on neural network-based sound synthesis",
    ],
    tech: ["VAE", "PyTorch", "TensorFlow", "Python"],
    date: "Feb – Apr 2025",
    github: "https://github.com/smitj25",
    live: null,
  },
  {
    title: "Book My Feast",
    description:
      "Built an Android app for restaurant discovery and table reservation. Features include real-time booking, restaurant search, and integrated Firebase backend with Google Maps.",
    details: [
      "Developed a full-featured Android application with restaurant discovery, filtering, and search",
      "Integrated Google Maps API for location-based restaurant discovery and navigation",
      "Built a real-time reservation system with Firebase Realtime Database for instant booking updates",
      "Implemented user authentication, reviews, and booking history using Firebase Auth and Firestore",
    ],
    tech: ["Android", "Firebase", "Google Maps", "Java"],
    date: "Oct – Nov 2024",
    github: "https://github.com/smitj25",
    live: null,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <section
      id="projects"
      className="relative min-h-screen bg-[#121212] py-28 md:py-36 px-4 md:px-12 lg:px-24 text-white z-20 overflow-hidden"
    >
      {/* Background accent glow */}
      <div
        className="pointer-events-none absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.03]"
        style={{
          background:
            "radial-gradient(circle, rgba(250,108,42,0.5) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-16 md:mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter">
            Projects.
          </h2>
          <p className="mt-4 text-lg md:text-xl text-gray-400 font-light max-w-xl">
            A collection of things I&apos;ve built, researched, and led.
          </p>
        </motion.div>

        {/* 3×2 Project Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6"
        >
          {projects.map((project, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              layoutId={`project-${project.title}`}
              onClick={() => setSelected(project)}
              className="group relative flex flex-col justify-between rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm p-6 md:p-7 transition-all duration-500 hover:border-white/[0.15] hover:bg-white/[0.06] hover:shadow-[0_8px_40px_rgba(250,108,42,0.06)] hover:-translate-y-1 cursor-pointer"
            >
              {/* Hover glow overlay */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#fa6c2a]/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <div className="relative z-10">
                {/* Date badge */}
                <span className="inline-block text-[11px] font-semibold tracking-widest uppercase text-[#fa6c2a]/70 mb-4 px-2.5 py-0.5 rounded-full border border-[#fa6c2a]/15 bg-[#fa6c2a]/[0.04]">
                  {project.date}
                </span>

                {/* Title */}
                <h3 className="text-lg md:text-xl font-bold text-gray-100 tracking-tight mb-2 group-hover:text-white transition-colors duration-300">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-400 leading-relaxed mb-5 line-clamp-3 group-hover:text-gray-300 transition-colors duration-300">
                  {project.description}
                </p>
              </div>

              <div className="relative z-10">
                {/* Tech Stack */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {project.tech.map((t, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-medium text-gray-400 px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] group-hover:border-white/[0.1] transition-colors duration-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex items-center gap-4">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-[#fa6c2a] transition-colors duration-300"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      GitHub
                    </a>
                  )}
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-[#fa6c2a] transition-colors duration-300"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      Live Demo
                    </a>
                  )}
                  {!project.github && !project.live && (
                    <span className="text-[11px] text-gray-600 italic">
                      Private / Internal
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ── Expanded Project Modal ── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
            onClick={() => setSelected(null)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            {/* Modal Card */}
            <motion.div
              layoutId={`project-${selected.title}`}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-white/[0.08] bg-[#141414] p-6 sm:p-8 md:p-10 shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
            >
              {/* Close button */}
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 w-8 h-8 flex items-center justify-center rounded-full bg-white/[0.05] border border-white/[0.08] text-gray-400 hover:text-white hover:bg-white/[0.1] transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Date badge */}
              <span className="inline-block text-[11px] font-semibold tracking-widest uppercase text-[#fa6c2a]/80 mb-4 px-3 py-1 rounded-full border border-[#fa6c2a]/20 bg-[#fa6c2a]/[0.05]">
                {selected.date}
              </span>

              {/* Title */}
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4 pr-10">
                {selected.title}
              </h3>

              {/* Full Description */}
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-6">
                {selected.description}
              </p>

              {/* Key Details */}
              <div className="mb-6">
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                  Key Highlights
                </h4>
                <ul className="space-y-3">
                  {selected.details.map((detail, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm text-gray-400"
                    >
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#fa6c2a]/60 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tech Stack */}
              <div className="mb-6">
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                  Tech Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selected.tech.map((t, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-medium text-gray-300 px-3 py-1.5 rounded-md bg-white/[0.05] border border-white/[0.08]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="flex items-center gap-4 pt-2 border-t border-white/[0.06]">
                {selected.github && (
                  <a
                    href={selected.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-[#fa6c2a] transition-colors duration-300 mt-4"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    View on GitHub
                  </a>
                )}
                {selected.live && (
                  <a
                    href={selected.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-[#fa6c2a] transition-colors duration-300 mt-4"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Live Demo
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
