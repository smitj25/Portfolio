"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, MotionValue } from "framer-motion";

const FRAME_COUNT = 71;

function getFramePath(index: number, isMobile: boolean = false) {
    const paddedIndex = index.toString().padStart(2, "0");
    return isMobile 
        ? `/video/mobile/frame_${paddedIndex}.jpg?v=2`
        : `/video/frame_${paddedIndex}_delay-0.066s.png`;
}

interface ScrollyCanvasProps {
    renderOverlay?: (progress: MotionValue<number>) => React.ReactNode;
}

export default function ScrollyCanvas({ renderOverlay }: ScrollyCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const frameIndex = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1]);

    // Preload images
    useEffect(() => {
        const isMobile = window.innerWidth < 768;
        const loadedImages: HTMLImageElement[] = [];
        let loadedCount = 0;

        for (let i = 0; i < FRAME_COUNT; i++) {
            const img = new Image();
            img.src = getFramePath(i, isMobile);
            img.onload = () => {
                loadedCount++;
                if (loadedCount === FRAME_COUNT) {
                    setImages(loadedImages);
                }
            };
            loadedImages.push(img);
        }
    }, []);

    // Render canvas
    useEffect(() => {
        if (images.length === 0 || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;

        const render = () => {
            const currentFrameIndex = Math.min(
                FRAME_COUNT - 1,
                Math.max(0, Math.round(frameIndex.get()))
            );
            const img = images[currentFrameIndex];

            if (img) {
                // Object-fit: cover logic
                const canvasRatio = canvas.width / canvas.height;
                const imgRatio = img.width / img.height;

                let drawWidth = canvas.width;
                let drawHeight = canvas.height;
                let offsetX = 0;
                let offsetY = 0;

                if (canvasRatio > imgRatio) {
                    drawHeight = canvas.width / imgRatio;
                    offsetY = (canvas.height - drawHeight) / 2;
                } else {
                    drawWidth = canvas.height * imgRatio;
                    offsetX = (canvas.width - drawWidth) / 2;
                }

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => cancelAnimationFrame(animationFrameId);
    }, [images, frameIndex]);

    // Handle Resize
    useEffect(() => {
        const resizeCanvas = () => {
            if (canvasRef.current) {
                // Use visualViewport for accurate mobile dimensions
                const dpr = window.devicePixelRatio || 1;
                const vw = window.visualViewport?.width ?? document.documentElement.clientWidth;
                const vh = window.visualViewport?.height ?? window.innerHeight;
                canvasRef.current.width = vw * dpr;
                canvasRef.current.height = vh * dpr;

                const ctx = canvasRef.current.getContext("2d");
                // Do NOT scale the context here because render() uses canvas.width (physical pixels) directly.
                // if (ctx) ctx.scale(dpr, dpr);
            }
        };

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);
        // Also listen to visualViewport resize for mobile
        window.visualViewport?.addEventListener("resize", resizeCanvas);
        return () => {
            window.removeEventListener("resize", resizeCanvas);
            window.visualViewport?.removeEventListener("resize", resizeCanvas);
        };
    }, []);

    return (
        <div ref={containerRef} className="relative h-[250vh] w-full bg-[#121212]">
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                <canvas
                    ref={canvasRef}
                    className="block h-full w-full"
                    style={{ width: '100vw', height: '100vh' }}
                />
                {/* Render overlay children cleanly over the canvas within the sticky container */}
                <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
                    {renderOverlay && renderOverlay(scrollYProgress)}
                </div>
            </div>
        </div>
    );
}
