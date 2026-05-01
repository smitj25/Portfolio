"use client";

import ScrollyCanvas from "@/components/ScrollyCanvas";
import Overlay from "@/components/Overlay";
import IdCard from "@/components/IdCard";
import Experience from "@/components/Experience";
import Education from "@/components/Education";
import Skills from "@/components/Skills";
import SkillMarquee from "@/components/SkillMarquee";
import Projects from "@/components/Projects";

export default function Home() {
  return (
    <main className="bg-[#121212] text-white">
      {/* Scrollytelling Sequence */}
      <ScrollyCanvas renderOverlay={(progress) => <Overlay progress={progress} />} />

      {/* Content sections with unified background gradient system */}
      <div className="relative overflow-hidden">
        {/* Gradient blobs for depth and cohesion — distributed across all sections */}
        {/* Top-left: Experience area */}
        <div className="absolute top-[3%] left-0 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[160px] -translate-x-1/4 pointer-events-none" />
        {/* Top-right: Experience area */}
        <div className="absolute top-[5%] right-0 w-[400px] h-[400px] bg-[#fa6c2a]/[0.015] rounded-full blur-[180px] translate-x-1/4 pointer-events-none" />
        {/* Education area left */}
        <div className="absolute top-[18%] left-[5%] w-[400px] h-[400px] bg-white/[0.015] rounded-full blur-[170px] pointer-events-none" />
        {/* Skills area */}
        <div className="absolute top-[30%] right-[10%] w-[500px] h-[500px] bg-[#fa6c2a]/[0.01] rounded-full blur-[200px] pointer-events-none" />
        {/* Mid-left: Projects area */}
        <div className="absolute top-[50%] left-[5%] w-[450px] h-[450px] bg-white/[0.015] rounded-full blur-[170px] pointer-events-none" />
        {/* Mid-right: Projects area */}
        <div className="absolute top-[60%] right-0 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[160px] translate-x-1/3 pointer-events-none" />
        {/* Lower-left: ID card area */}
        <div className="absolute top-[85%] left-0 w-[400px] h-[400px] bg-[#fa6c2a]/[0.012] rounded-full blur-[180px] -translate-x-1/4 pointer-events-none" />
        {/* Bottom-center: Between projects and ID card */}
        <div className="absolute top-[75%] left-[40%] w-[350px] h-[350px] bg-white/[0.012] rounded-full blur-[150px] pointer-events-none" />
        {/* Bottom-right: ID card area — prevents flat black */}
        <div className="absolute bottom-[5%] right-0 w-[600px] h-[600px] bg-white/[0.025] rounded-full blur-[180px] translate-x-1/4 pointer-events-none" />
        {/* Bottom-right accent: subtle warmth */}
        <div className="absolute bottom-[10%] right-[10%] w-[350px] h-[350px] bg-[#fa6c2a]/[0.015] rounded-full blur-[160px] pointer-events-none" />

        {/* Experience */}
        <Experience />

        {/* Education Timeline */}
        <Education />

        {/* 3D Interactive Skills */}
        <Skills />
        
        {/* Infinite Logo Slider */}
        <SkillMarquee />

        {/* Projects Grid */}
        <Projects />

        {/* 3D Interactive ID Card */}
        <IdCard />
      </div>
    </main>
  );
}

