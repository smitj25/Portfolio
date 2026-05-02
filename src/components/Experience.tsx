"use client";

import { motion } from "framer-motion";

const experienceData = [
  {
    role: "Generative AI Intern",
    company: "LTM",
    duration: "Jan 2026 – Present",
    description:
      "Integrating real-time Generative AI solutions into scalable production use cases. Designing, building, and deploying production-ready AI systems with high-quality deliverables.",
    contributions: [
      "Built and deployed end-to-end Gen AI pipelines for production workloads",
      "Designed scalable architectures using LangChain, vector databases, and retrieval-augmented generation",
      "Delivered high-quality AI-powered features integrated into existing product workflows",
    ],
    tech: ["GenAI", "LangChain", "Python", "RAG"],
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function Experience() {
  return (
    <section
      id="experience"
      className="relative min-h-[60vh] py-28 md:py-36 px-4 md:px-12 lg:px-24 text-white z-20 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-16 md:mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter">
            Experience.
          </h2>
          <p className="mt-4 text-lg md:text-xl text-gray-400 font-light max-w-xl">
            Where I&apos;ve applied my skills in real-world production
            environments.
          </p>
        </motion.div>

        {/* Experience Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="space-y-8"
        >
          {experienceData.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm p-6 sm:p-8 md:p-10 transition-all duration-500 hover:border-white/[0.12] hover:bg-white/[0.05]"
            >
              {/* Hover gradient overlay */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#fa6c2a]/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <div className="relative z-10">
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
                  <div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-100 tracking-tight">
                      {item.role}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-400 font-medium mt-1">
                      {item.company}
                    </p>
                  </div>
                  <span className="inline-block self-start text-xs font-semibold tracking-widest uppercase text-[#fa6c2a]/80 px-3 py-1 rounded-full border border-[#fa6c2a]/20 bg-[#fa6c2a]/[0.05] whitespace-nowrap">
                    {item.duration}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm md:text-base text-gray-300/80 leading-relaxed mb-6">
                  {item.description}
                </p>

                {/* Contributions */}
                <ul className="space-y-3 mb-6">
                  {item.contributions.map((point, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300"
                    >
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#fa6c2a]/60 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {item.tech.map((t, i) => (
                    <span
                      key={i}
                      className="text-[10px] sm:text-[11px] font-medium text-gray-400 px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] group-hover:border-white/[0.1] transition-colors duration-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
