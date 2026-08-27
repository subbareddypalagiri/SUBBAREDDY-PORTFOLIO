import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CoverflowCarousel } from "./CoverflowCarousel";

const PORTFOLIO_SLIDES = [
  {
    id: "portfolio-room",
    title: "3D Room Portfolio",
    subtitle: "Immersive 3D Interactive Virtual Room Developer Showcase",
    badge: "Three.js 3D",
    color: "#9333ea",
    bgSoft: "rgba(147, 51, 234, 0.15)",
    glow: "rgba(147, 51, 234, 0.45)",
    src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    alt: "3D Room Portfolio Preview",
    url: "https://portpolio-room.vercel.app/",
    meta: [
      { label: "Category", value: "3D Interactive Web" },
      { label: "Tech Stack", value: "Three.js / React / WebGL" },
      { label: "Repository", value: "portpolio-room" },
    ],
  },
  {
    id: "era-portfolio",
    title: "Era Interactive Portfolio",
    subtitle: "High-End Brutalist & Dynamic Era Portfolio Experience",
    badge: "Awwwards Style",
    color: "#0284c7",
    bgSoft: "rgba(2, 132, 199, 0.15)",
    glow: "rgba(2, 132, 199, 0.45)",
    src: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80",
    alt: "Era Portfolio Preview",
    url: "https://era-portpolio.vercel.app/",
    meta: [
      { label: "Category", value: "Modern Brutalist" },
      { label: "Tech Stack", value: "React / GSAP / Tailwind" },
      { label: "Repository", value: "Era-portpolio" },
    ],
  },
  {
    id: "kinetic-portfolio",
    title: "Kinetic Studio Portfolio",
    subtitle: "Creative Developer Experience with Dynamic Spline 3D & Custom CMS",
    badge: "Active Version",
    color: "#eab308",
    bgSoft: "rgba(234, 179, 8, 0.15)",
    glow: "rgba(234, 179, 8, 0.45)",
    src: "/hero_avatar.png",
    alt: "Kinetic Portfolio Preview",
    url: "/",
    isLocal: true,
    meta: [
      { label: "Category", value: "Creative Kinetic UI" },
      { label: "Tech Stack", value: "React / Spline / Vite CMS" },
      { label: "Status", value: "Live Portfolio" },
    ],
  },
  {
    id: "syn-nex-showcase",
    title: "AI & Innovation Vault",
    subtitle: "Next-Gen Intelligent Web Extensions & AI Writing Assist Tools",
    badge: "AI Ecosystem",
    color: "#059669",
    bgSoft: "rgba(5, 150, 105, 0.15)",
    glow: "rgba(5, 150, 105, 0.45)",
    src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    alt: "Innovation Vault Preview",
    url: "https://github.com/subbareddypalagiri",
    meta: [
      { label: "Category", value: "Full Stack & AI" },
      { label: "Tech Stack", value: "Python / Gemini APIs / RAG" },
      { label: "Profile", value: "@subbareddypalagiri" },
    ],
  },
];

export default function Portfolios() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const activeSlide = PORTFOLIO_SLIDES[selectedIndex];

  return (
    <div 
      className="min-h-screen text-black flex flex-col justify-between py-8 px-4 md:px-12 relative overflow-hidden font-sans select-none"
      style={{
        background: `radial-gradient(ellipse at 50% 25%, ${activeSlide.bgSoft} 0%, #fafafa 75%)`,
        transition: "background 0.8s cubic-bezier(0.16, 1, 0.3, 1)"
      }}
    >
      
      {/* Dynamic Ambient Background Glows that change color per card */}
      <div 
        className="absolute top-[-25%] left-[-15%] w-[60vw] h-[60vw] rounded-full blur-[140px] pointer-events-none animate-pulse transition-all duration-700"
        style={{ backgroundColor: activeSlide.glow }}
      ></div>
      <div 
        className="absolute bottom-[-20%] right-[-15%] w-[60vw] h-[60vw] rounded-full blur-[150px] pointer-events-none animate-pulse transition-all duration-700" 
        style={{ backgroundColor: activeSlide.bgSoft, animationDelay: "2s" }}
      ></div>

      {/* Header Bar */}
      <header className="w-full flex items-center justify-between z-20">
        <Link
          to="/"
          className="text-black/80 hover:text-black transition-colors flex items-center gap-2.5 text-xs font-black tracking-[0.2em] uppercase bg-white/80 hover:bg-white px-5 py-2.5 rounded-full border border-black/10 backdrop-blur-md shadow-sm"
        >
          <i className="fa-solid fa-arrow-left"></i> Back to Main Site
        </Link>

        <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-neutral-500 tracking-widest uppercase bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-black/5">
          <i 
            className="fa-solid fa-layer-group transition-colors duration-500"
            style={{ color: activeSlide.color }}
          ></i>
          <span>Portfolio Vault (4 Editions)</span>
        </div>

        <Link
          to="/feedback"
          className="text-xs font-black tracking-widest uppercase px-5 py-2.5 rounded-full border-2 border-black text-black hover:bg-black hover:text-white transition-all shadow-sm bg-white/80 backdrop-blur-sm"
        >
          Feedback
        </Link>
      </header>

      {/* Main 3D Carousel Section */}
      <main className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center my-6 z-10">
        
        {/* Title */}
        <div className="text-center mb-2">
          <p 
            className="text-xs font-black tracking-[0.35em] uppercase mb-2 transition-colors duration-500"
            style={{ color: activeSlide.color }}
          >
            SELECT AN EXPERIENCE
          </p>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-black">
            MY PORTFOLIOS
          </h1>
        </div>

        {/* 3D Coverflow Component */}
        <CoverflowCarousel
          slides={PORTFOLIO_SLIDES}
          onSelect={setSelectedIndex}
          rotate={40}
          depth={0.65}
          cardWidth="clamp(260px, 24vw, 340px)"
          className="w-full"
        />

        {/* Interactive Action CTA */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          <a
            href={activeSlide.url}
            target={activeSlide.isLocal ? "_self" : "_blank"}
            rel="noreferrer"
            className="px-10 py-4 rounded-full text-white font-black text-xs tracking-[0.25em] uppercase hover:scale-105 transition-all duration-300 flex items-center gap-3"
            style={{
              backgroundColor: activeSlide.color,
              boxShadow: `0 15px 35px ${activeSlide.glow}`,
            }}
          >
            <span>{activeSlide.isLocal ? "VIEW THIS PORTFOLIO" : "OPEN REPOSITORY / DEMO"}</span>
            <i className="fa-solid fa-arrow-up-right-from-square text-sm"></i>
          </a>

          <a
            href="https://github.com/subbareddypalagiri"
            target="_blank"
            rel="noreferrer"
            className="px-8 py-4 rounded-full bg-white/90 hover:bg-white text-black border border-black/15 font-black text-xs tracking-[0.2em] uppercase transition-all duration-300 flex items-center gap-2.5 shadow-sm"
          >
            <i className="fa-brands fa-github text-sm"></i>
            <span>All GitHub Projects</span>
          </a>
        </div>
      </main>

      {/* Footer Instructions */}
      <footer className="text-center text-xs text-neutral-500 font-medium tracking-wider z-10">
        <p>💡 Tip: Click on any active card or the button above to launch its live repository / demo.</p>
      </footer>
    </div>
  );
}
