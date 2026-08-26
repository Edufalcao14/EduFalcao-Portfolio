"use client";

import { usePathname } from "next/navigation";
import { ParticlesContainer } from "@/components/ParticlesContainer";

export const GlobalMatrixBackground = () => {
    const pathname = usePathname();

    // Home page has its own canvas inside the hero section (position: absolute)
    // so it scrolls away when the user scrolls past the hero.
    // All other pages get a subtle fixed version here.
    if (!pathname || pathname === "/") return null;

    // A case page is the one screen where the rain has nothing to add and
    // something to cost: it sits behind screenshots and a recording of a real
    // product, and a fixed layer of drifting characters reads as interference
    // over them. Even at 0.15 it was visible through the dark ground.
    const isProjectDetail = pathname.startsWith("/projects/") && pathname.split("/").length > 2;
    if (isProjectDetail) return null;

    return <ParticlesContainer opacityScale={0.45} positioning="fixed" />;
};

export default GlobalMatrixBackground;
