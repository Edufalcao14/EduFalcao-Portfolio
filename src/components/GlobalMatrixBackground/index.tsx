"use client";

import { usePathname } from "next/navigation";
import { ParticlesContainer } from "@/components/ParticlesContainer";

export const GlobalMatrixBackground = () => {
    const pathname = usePathname();

    // Home page has its own canvas inside the hero section (position: absolute)
    // so it scrolls away when the user scrolls past the hero.
    // All other pages get a subtle fixed version here.
    if (!pathname || pathname === "/") return null;

    const isProjectDetail = pathname.startsWith("/projects/") && pathname.split("/").length > 2;
    const opacity = isProjectDetail ? 0.15 : 0.45;

    return <ParticlesContainer opacityScale={opacity} positioning="fixed" />;
};

export default GlobalMatrixBackground;
