"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

interface OverlayProps {
    progress: MotionValue<number>;
}

export default function Overlay({ progress }: OverlayProps) {
    // Section 1: 0% - 20%
    const opacity1 = useTransform(progress, [0, 0.15, 0.25], [1, 1, 0]);
    const y1 = useTransform(progress, [0, 0.25], [0, -50]);

    // Section 2: 30% - 50%
    const opacity2 = useTransform(progress, [0.25, 0.35, 0.45, 0.55], [0, 1, 1, 0]);
    const y2 = useTransform(progress, [0.25, 0.4], [50, 0]);

    // Section 3: 60% - 80%
    const opacity3 = useTransform(progress, [0.55, 0.65, 0.8, 0.9], [0, 1, 1, 0]);
    const y3 = useTransform(progress, [0.55, 0.7], [50, 0]);

    return (
        <div className="relative w-full h-full max-w-7xl mx-auto">
            {/* Section 1 */}
            <motion.div
                style={{ opacity: opacity1, y: y1 }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
            >
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white drop-shadow-2xl">
                    SMIT PATIL.
                </h1>
                <p className="mt-4 text-xl md:text-2xl lg:text-3xl text-gray-300 font-light tracking-wide">
                    Creative Developer.
                </p>
            </motion.div>

            {/* Section 2 */}
            <motion.div
                style={{ opacity: opacity2, y: y2 }}
                className="absolute inset-y-0 left-4 md:left-12 lg:left-24 flex flex-col items-start justify-center max-w-2xl px-4"
            >
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white drop-shadow-xl">
                    I build digital <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500"> experiences.</span>
                </h2>
            </motion.div>

            {/* Section 3 */}
            <motion.div
                style={{ opacity: opacity3, y: y3 }}
                className="absolute inset-y-0 right-4 md:right-12 lg:right-24 flex flex-col items-end justify-center max-w-2xl text-right px-4"
            >
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white drop-shadow-xl">
                    Bridging design <br className="hidden md:block" />
                    <span className="text-[#8c8c8c]">and engineering.</span>
                </h2>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div 
                style={{ opacity: opacity1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
                <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-semibold">
                    Scroll to explore
                </span>
                <motion.div 
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    className="w-px h-12 bg-gradient-to-b from-gray-400 to-transparent"
                />
            </motion.div>
        </div>
    );
}
