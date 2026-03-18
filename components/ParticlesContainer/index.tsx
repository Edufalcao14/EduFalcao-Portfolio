"use client";

import { useEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789{}[]()<>=>/\\!@#$%^&*;:";
const FONT_SIZE = 14;

interface Stream {
    x: number;
    y: number;
    speed: number;
    length: number;
    chars: string[];
    direction: 1 | -1;
}

const randomChar = () => CHARS[Math.floor(Math.random() * CHARS.length)];

interface ParticlesContainerProps {
    opacityScale?: number;
    positioning?: "absolute" | "fixed";
}

export const ParticlesContainer = ({ opacityScale = 1, positioning = "fixed" }: ParticlesContainerProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animId: number;
        let streams: Stream[] = [];

        const initStreams = () => {
            const parent = canvas.parentElement;
            canvas.width = positioning === "absolute" && parent ? parent.offsetWidth : window.innerWidth;
            canvas.height = positioning === "absolute" && parent ? parent.offsetHeight : window.innerHeight;
            const numRows = Math.floor(canvas.height / FONT_SIZE);
            streams = [];

            for (let i = 0; i < numRows; i++) {
                const direction: 1 | -1 = i % 2 === 0 ? 1 : -1;
                const startX =
                    direction === 1
                        ? -Math.floor(Math.random() * (canvas.width / FONT_SIZE))
                        : Math.floor(canvas.width / FONT_SIZE) + Math.floor(Math.random() * (canvas.width / FONT_SIZE));

                streams.push({
                    x: startX,
                    y: (i + 1) * FONT_SIZE,
                    speed: (0.2 + Math.random() * 0.5) * direction,
                    length: Math.floor(6 + Math.random() * 16),
                    chars: Array.from({ length: 30 }, randomChar),
                    direction,
                });
            }
        };

        initStreams();

        const onResize = () => initStreams();
        window.addEventListener("resize", onResize);
        if (positioning === "absolute" && canvas.parentElement) {
            const observer = new ResizeObserver(initStreams);
            observer.observe(canvas.parentElement);
        }

        let lastTime = 0;
        const FPS = 20;
        const INTERVAL = 1000 / FPS;

        const s = opacityScale;

        const draw = (timestamp: number) => {
            animId = requestAnimationFrame(draw);

            const delta = timestamp - lastTime;
            if (delta < INTERVAL) return;
            lastTime = timestamp - (delta % INTERVAL);

            ctx.fillStyle = "rgba(3, 7, 18, 0.14)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.font = `${FONT_SIZE}px 'JetBrains Mono', monospace`;

            streams.forEach((stream) => {
                const headCol = Math.floor(stream.x);

                for (let j = 0; j < stream.length; j++) {
                    const col = headCol - j * stream.direction;
                    const px = col * FONT_SIZE;
                    if (px < 0 || px > canvas.width) continue;

                    if (Math.random() < 0.03) {
                        stream.chars[j % stream.chars.length] = randomChar();
                    }

                    const ratio = 1 - j / stream.length;

                    if (j === 0) {
                        ctx.fillStyle = `rgba(200, 255, 210, ${0.45 * s})`;
                        ctx.shadowColor = "#34D399";
                        ctx.shadowBlur = 4 * s;
                    } else if (ratio > 0.55) {
                        ctx.fillStyle = `rgba(52, 211, 153, ${0.22 * s})`;
                        ctx.shadowBlur = 0;
                    } else {
                        ctx.fillStyle = `rgba(26, 102, 68, ${0.11 * s})`;
                        ctx.shadowBlur = 0;
                    }

                    ctx.fillText(stream.chars[j % stream.chars.length], px, stream.y);
                }

                ctx.shadowBlur = 0;
                stream.x += stream.speed;

                const tailPx = (Math.floor(stream.x) - stream.length * stream.direction) * FONT_SIZE;
                const offscreen =
                    stream.direction === 1 ? tailPx > canvas.width : tailPx < 0;

                if (offscreen) {
                    stream.length = Math.floor(6 + Math.random() * 16);
                    stream.speed = (0.2 + Math.random() * 0.5) * stream.direction;
                    stream.x =
                        stream.direction === 1
                            ? -Math.floor(Math.random() * 20)
                            : Math.floor(canvas.width / FONT_SIZE) + Math.floor(Math.random() * 20);
                }
            });
        };

        animId = requestAnimationFrame(draw);

        const showTimer = setTimeout(() => setVisible(true), 400);

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", onResize);
            clearTimeout(showTimer);
        };
    }, [opacityScale, positioning]);

    return (
        <canvas
            ref={canvasRef}
            className={`${positioning === "absolute" ? "absolute" : "fixed"} inset-0 w-full h-full pointer-events-none transition-opacity duration-700`}
            style={{ zIndex: -10, opacity: visible ? 1 : 0 }}
        />
    );
};

export default ParticlesContainer;
