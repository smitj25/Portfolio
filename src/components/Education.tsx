"use client";

import { motion } from "framer-motion";

const educationData = [
  {
    degree: "B.Tech in AI & Data Science",
    institution: "NMIMS, Navi Mumbai",
    duration: "2022 – 2026",
    description:
      "Pursuing a comprehensive B.Tech in Artificial Intelligence & Data Science with a CGPA of 3.06/4.0 (Sem 7). Focused on machine learning, deep learning, NLP, and generative AI with hands-on project experience.",
  },
  {
    degree: "Higher Secondary Certificate (Class XII)",
    institution: "New Bombay City School",
    duration: "2022",
    description:
      "Completed HSC with 78.00%, building a strong foundation in science and mathematics that paved the way for a career in technology.",
  },
  {
    degree: "Secondary School Certificate (Class X)",
    institution: "Ryan International School",
    duration: "2020",
    description:
      "Scored 88.66% in SSC examinations, demonstrating consistent academic excellence and a strong aptitude for analytical problem-solving.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.25,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const dotVariants = {
  hidden: { scale: 0 },
  visible: {
    scale: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 20 },
  },
};

export default function Education() {
  return (
    <section
      id="education"
      className="relative min-h-screen bg-[#121212] py-28 md:py-36 px-4 md:px-12 lg:px-24 text-white z-20 overflow-hidden"
    >
      {/* Background accent glow */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-[0.04]"
        style={{
          background:
            "radial-gradient(circle, rgba(250,108,42,0.5) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-5xl mx-auto relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter">
            Education.
          </h2>
          <p className="mt-4 text-lg md:text-xl text-gray-400 font-light max-w-xl">
            My academic journey — from school to specializing in AI & Data
            Science.
          </p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="relative"
        >
          {/* Vertical connector line */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute left-6 md:left-8 top-0 bottom-0 w-[2px] origin-top"
            style={{
              background:
                "linear-gradient(180deg, rgba(250,108,42,0.6) 0%, rgba(250,108,42,0.3) 50%, transparent 100%)",
            }}
          />

          {educationData.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative pl-16 md:pl-20 pb-16 last:pb-0 group"
            >
              {/* Timeline dot */}
              <motion.div
                variants={dotVariants}
                className="absolute left-[14px] md:left-[22px] top-1 z-10"
              >
                <div className="w-5 h-5 rounded-full border-2 border-[#fa6c2a] bg-[#121212] flex items-center justify-center group-hover:border-[#fa6c2a] transition-colors duration-300">
                  <div className="w-2 h-2 rounded-full bg-[#fa6c2a] group-hover:bg-[#fa6c2a] transition-colors duration-300" />
                </div>
                {/* Glow pulse */}
                <div className="absolute inset-0 w-5 h-5 rounded-full bg-[#fa6c2a] opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-500" />
              </motion.div>

              {/* Card */}
              <div className="relative rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm p-6 md:p-8 transition-all duration-500 hover:border-white/[0.12] hover:bg-white/[0.05] group-hover:translate-x-1">
                {/* Duration badge */}
                <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#fa6c2a]/80 mb-3 px-3 py-1 rounded-full border border-[#fa6c2a]/20 bg-[#fa6c2a]/[0.05]">
                  {item.duration}
                </span>

                <h3 className="text-xl md:text-2xl font-bold text-gray-100 tracking-tight mb-1">
                  {item.degree}
                </h3>

                <p className="text-sm md:text-base text-gray-400 font-medium mb-4">
                  {item.institution}
                </p>

                <p className="text-sm md:text-base text-gray-300/80 leading-relaxed">
                  {item.description}
                </p>

                {/* Hover gradient overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[#fa6c2a]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
