import React, { useRef, useMemo, useState, useCallback, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

// ─── Image pools ─────────────────────────────────────────────────────────────
const IMAGES = [
  "https://images.unsplash.com/photo-1504198458649-3128b932f49e?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1550614000-4b95d4ed798a?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=700&q=80",
];

const GALLERY_META = [
  { id: "parallax", num: "01", title: "3D PARALLAX", subtitle: "Scroll-driven infinite depth", accent: "#a855f7", bg: "#0d0010" },
  { id: "flow",     num: "02", title: "HORIZONTAL FLOW", subtitle: "Drag to explore the grid", accent: "#06b6d4", bg: "#00090d" },
  { id: "spotlight",num: "03", title: "SPOTLIGHT", subtitle: "Cinematic single reveals", accent: "#f97316", bg: "#0d0500" },
  { id: "mosaic",   num: "04", title: "MOSAIC", subtitle: "Exploding bento wall", accent: "#22c55e", bg: "#000d04" },
];

// ══════════════════════════════════════════════════════════════════════════════
// GALLERY 1 — 3D PARALLAX
// ══════════════════════════════════════════════════════════════════════════════
function ParallaxGallery() {
  const scrollWrapperRef = useRef(null);
  const containerRef = useRef(null);

  const cols = useMemo(() => {
    const c = [[], [], [], []];
    IMAGES.forEach((src, i) => c[i % 4].push(src));
    return c.map(col => [...col, ...col, ...col]);
  }, []);

  const { scrollYProgress } = useScroll({ target: containerRef, container: scrollWrapperRef, offset: ["start start", "end end"] });
  const sp = useSpring(scrollYProgress, { stiffness: 100, damping: 20, mass: 0.5 });

  const bW = useTransform(sp, [0, 0.15], ["88vw", "100vw"]);
  const bH = useTransform(sp, [0, 0.15], ["78vh", "100vh"]);
  const bR = useTransform(sp, [0, 0.15], ["40px", "0px"]);
  const bB = useTransform(sp, [0, 0.15], ["3px", "0px"]);
  const tO = useTransform(sp, [0, 0.1], [1, 0]);
  const tY = useTransform(sp, [0, 0.1], ["0%", "-30%"]);
  const rY = useTransform(sp, [0.15, 1], [-42, -6]);
  const rX = useTransform(sp, [0.15, 1], [22, 3]);
  const rZ = useTransform(sp, [0.15, 1], [13, 1]);
  const tZ = useTransform(sp, [0.15, 1], [-750, 0]);
  const y0 = useTransform(sp, [0.15, 1], ["0%", "-42%"]);
  const y1 = useTransform(sp, [0.15, 1], ["-38%", "12%"]);
  const y2 = useTransform(sp, [0.15, 1], ["0%", "-42%"]);
  const y3 = useTransform(sp, [0.15, 1], ["-28%", "18%"]);
  const ys = [y0, y1, y2, y3];

  return (
    <div ref={scrollWrapperRef} className="w-full h-full overflow-y-auto overflow-x-hidden" style={{ scrollbarWidth: "none" }}>
      <section ref={containerRef} className="relative w-full" style={{ height: "600vh" }}>
        <div className="sticky top-0 h-screen flex justify-center items-center overflow-hidden">
          <motion.div style={{ width: bW, height: bH, borderRadius: bR, borderWidth: bB, borderColor: "#2c2738", borderStyle: "solid" }}
            className="relative bg-black overflow-hidden flex items-center justify-center mx-auto">
            <motion.div style={{ opacity: tO, y: tY }} className="absolute z-30 text-center pointer-events-none select-none">
              <p className="text-xs font-black tracking-[0.4em] text-white/40 uppercase mb-3">SUBBA REDDY</p>
              <h2 className="text-7xl md:text-9xl font-black tracking-tighter uppercase text-white">3D</h2>
              <p className="text-sm text-white/40 mt-3 tracking-widest uppercase">Scroll to dive in ↓</p>
            </motion.div>
            <div className="absolute inset-0 z-20 pointer-events-none"
              style={{ boxShadow: "inset 0 120px 180px -50px #000, inset 0 -120px 180px -50px #000, inset 150px 0 180px -50px #000, inset -150px 0 180px -50px #000" }} />
            <div className="absolute inset-0 flex justify-center items-center pointer-events-none" style={{ perspective: "1000px" }}>
              <motion.div style={{ rotateX: rX, rotateY: rY, rotateZ: rZ, z: tZ, transformStyle: "preserve-3d" }}
                className="flex gap-5 justify-center items-center w-[130vw] h-[160vh] origin-center">
                {cols.map((col, ci) => (
                  <motion.div key={ci} style={{ y: ys[ci], width: "clamp(140px,20vw,300px)" }} className="flex flex-col gap-5 pointer-events-auto">
                    {col.map((src, i) => (
                      <div key={i} className="w-full flex-shrink-0 overflow-hidden" style={{ height: "clamp(160px,22vw,340px)" }}>
                        <img src={src} alt="" loading="lazy" className="w-full h-full object-cover opacity-75 hover:opacity-100 transition-opacity duration-500" />
                      </div>
                    ))}
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// GALLERY 2 — HORIZONTAL FLOW (drag-to-scroll masonry)
// ══════════════════════════════════════════════════════════════════════════════
function FlowGallery() {
  const trackRef = useRef(null);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const isDown = useRef(false);

  const rows = useMemo(() => {
    const r = [[], [], []];
    const all = [...IMAGES, ...IMAGES, ...IMAGES];
    all.forEach((src, i) => r[i % 3].push(src));
    return r;
  }, []);

  const onMouseDown = (e) => { isDown.current = true; startX.current = e.pageX - trackRef.current.offsetLeft; scrollLeft.current = trackRef.current.scrollLeft; trackRef.current.style.cursor = "grabbing"; };
  const onMouseUp = () => { isDown.current = false; trackRef.current.style.cursor = "grab"; };
  const onMouseMove = (e) => { if (!isDown.current) return; e.preventDefault(); const x = e.pageX - trackRef.current.offsetLeft; trackRef.current.scrollLeft = scrollLeft.current - (x - startX.current) * 1.5; };

  const heights = ["clamp(200px,28vh,380px)", "clamp(260px,36vh,480px)", "clamp(200px,28vh,380px)"];

  return (
    <div className="w-full h-full flex flex-col justify-center gap-4 overflow-hidden py-8">
      <div ref={trackRef} className="w-full overflow-x-auto flex flex-col gap-4 select-none"
        style={{ scrollbarWidth: "none", cursor: "grab" }}
        onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseLeave={onMouseUp} onMouseMove={onMouseMove}>
        {rows.map((row, ri) => (
          <motion.div key={ri} className="flex gap-4 px-8"
            animate={{ x: ri % 2 === 0 ? ["0%", "-5%"] : ["-5%", "0%"] }}
            transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "linear" }}>
            {[...row, ...row].map((src, i) => (
              <div key={i} className="flex-shrink-0 overflow-hidden rounded-2xl group" style={{ width: "clamp(200px,22vw,340px)", height: heights[ri] }}>
                <img src={src} alt="" loading="lazy" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
              </div>
            ))}
          </motion.div>
        ))}
      </div>
      <p className="text-center text-white/30 text-xs tracking-[0.3em] uppercase mt-2">← Drag to flow →</p>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// GALLERY 3 — SPOTLIGHT (cinematic single-image reveal)
// ══════════════════════════════════════════════════════════════════════════════
function SpotlightGallery() {
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);

  const go = useCallback((next) => {
    setDir(next > active ? 1 : -1);
    setActive((next + IMAGES.length) % IMAGES.length);
  }, [active]);

  useEffect(() => {
    const t = setInterval(() => go(active + 1), 4000);
    return () => clearInterval(t);
  }, [active, go]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden">
      {/* Counter */}
      <div className="absolute top-6 right-8 z-20 text-white/30 text-xs font-black tracking-[0.3em]">
        {String(active + 1).padStart(2, "0")} / {String(IMAGES.length).padStart(2, "0")}
      </div>

      {/* Main image */}
      <div className="relative w-full h-full flex items-center justify-center">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div key={active} custom={dir}
            initial={{ opacity: 0, x: dir * 120, scale: 0.92, filter: "blur(12px)" }}
            animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: dir * -120, scale: 0.92, filter: "blur(12px)" }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0 flex items-center justify-center">
            <div className="relative" style={{ width: "min(70vw, 860px)", height: "min(65vh, 560px)" }}>
              <img src={IMAGES[active]} alt="" className="w-full h-full object-cover rounded-3xl shadow-2xl" />
              {/* Cinematic bars */}
              <div className="absolute inset-0 rounded-3xl" style={{ boxShadow: "inset 0 0 80px 20px rgba(0,0,0,0.7)" }} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Thumbnail strip */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {IMAGES.map((src, i) => (
          <button key={i} onClick={() => go(i)}
            className="rounded-full overflow-hidden transition-all duration-300 flex-shrink-0"
            style={{ width: i === active ? 48 : 28, height: 28, opacity: i === active ? 1 : 0.4, border: i === active ? "2px solid #f97316" : "2px solid transparent" }}>
            <img src={src} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Arrow controls */}
      <button onClick={() => go(active - 1)} className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all duration-300">
        <i className="fa-solid fa-chevron-left" />
      </button>
      <button onClick={() => go(active + 1)} className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all duration-300">
        <i className="fa-solid fa-chevron-right" />
      </button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// GALLERY 4 — MOSAIC (bento grid, images expand on click)
// ══════════════════════════════════════════════════════════════════════════════
function MosaicGallery() {
  const [expanded, setExpanded] = useState(null);
  const grid = IMAGES.slice(0, 12);

  const spans = [
    "col-span-2 row-span-2", "col-span-1 row-span-1", "col-span-1 row-span-2",
    "col-span-1 row-span-1", "col-span-1 row-span-1", "col-span-2 row-span-1",
    "col-span-1 row-span-2", "col-span-1 row-span-1", "col-span-2 row-span-1",
    "col-span-1 row-span-1", "col-span-1 row-span-1", "col-span-2 row-span-2",
  ];

  return (
    <div className="w-full h-full overflow-y-auto flex items-start justify-center p-6" style={{ scrollbarWidth: "none" }}>
      <div className="w-full max-w-6xl grid gap-3 auto-rows-[minmax(100px,1fr)]"
        style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        {grid.map((src, i) => (
          <motion.div key={i} layoutId={`mosaic-${i}`}
            className={`${spans[i]} overflow-hidden rounded-2xl cursor-pointer relative group`}
            onClick={() => setExpanded(i)}
            whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
            <img src={src} alt="" loading="lazy" className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:opacity-90" style={{ minHeight: "100px" }} />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
              <i className="fa-solid fa-expand text-white/0 group-hover:text-white/80 text-2xl transition-all duration-300" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Expanded lightbox */}
      <AnimatePresence>
        {expanded !== null && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setExpanded(null)}>
            <motion.img layoutId={`mosaic-${expanded}`} src={grid[expanded]} alt=""
              className="max-w-[85vw] max-h-[85vh] object-contain rounded-3xl shadow-2xl"
              initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} />
            <button className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/40 transition-all">
              <i className="fa-solid fa-xmark" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// GALLERY HUB — Main page
// ══════════════════════════════════════════════════════════════════════════════
export default function Gallery() {
  const [active, setActive] = useState(null);

  const current = active !== null ? GALLERY_META[active] : null;

  const GalleryComponents = [ParallaxGallery, FlowGallery, SpotlightGallery, MosaicGallery];

  return (
    <div className="w-full h-screen bg-[#050505] text-white overflow-hidden font-sans relative">

      {/* ── Back button ── */}
      <AnimatePresence>
        {active === null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute top-6 left-6 z-50">
            <Link to="/" className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-black tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-300">
              <i className="fa-solid fa-arrow-left" /> Back
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Active gallery close ── */}
      <AnimatePresence>
        {active !== null && (
          <motion.button initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            onClick={() => setActive(null)}
            className="absolute top-6 left-6 z-50 flex items-center gap-2 px-5 py-2.5 rounded-full backdrop-blur-md border text-xs font-black tracking-[0.2em] uppercase transition-all duration-300 hover:scale-105"
            style={{ backgroundColor: `${current?.accent}22`, borderColor: `${current?.accent}66`, color: current?.accent }}>
            <i className="fa-solid fa-grid-2" /> ALL GALLERIES
          </motion.button>
        )}
      </AnimatePresence>

      {/* ══════════ HUB VIEW ══════════ */}
      <AnimatePresence mode="wait">
        {active === null && (
          <motion.div key="hub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }} className="w-full h-full flex flex-col">

            {/* Header */}
            <div className="pt-20 pb-8 px-10 flex items-end justify-between flex-shrink-0">
              <div>
                <p className="text-xs font-black tracking-[0.4em] text-white/30 uppercase mb-2">SUBBA REDDY</p>
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none">GALLERY</h1>
              </div>
              <p className="text-white/30 text-sm font-medium tracking-widest uppercase hidden md:block">Select an experience</p>
            </div>

            {/* 4 Gallery Cards */}
            <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-4 p-4 md:grid-cols-4 md:grid-rows-1 min-h-0">
              {GALLERY_META.map((g, i) => (
                <motion.button key={g.id} onClick={() => setActive(i)}
                  className="relative overflow-hidden rounded-3xl group text-left"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                  style={{ background: `linear-gradient(135deg, ${g.bg}, #0a0a0a)`, border: `1px solid ${g.accent}22` }}>

                  {/* Background image mosaic preview */}
                  <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-1 opacity-20 group-hover:opacity-35 transition-opacity duration-700">
                    {IMAGES.slice(i * 4, i * 4 + 4).map((src, j) => (
                      <img key={j} src={src} alt="" className="w-full h-full object-cover" />
                    ))}
                  </div>

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 rounded-3xl" style={{ background: `linear-gradient(to top, ${g.bg}ee 30%, transparent 100%)` }} />

                  {/* Glow on hover */}
                  <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ boxShadow: `inset 0 0 60px 0px ${g.accent}33` }} />

                  {/* Content */}
                  <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                    <span className="text-5xl font-black tracking-tighter opacity-20" style={{ color: g.accent }}>{g.num}</span>
                    <div>
                      <h3 className="text-lg md:text-xl font-black tracking-tight leading-tight mb-1 text-white">{g.title}</h3>
                      <p className="text-xs text-white/40 font-medium tracking-wide">{g.subtitle}</p>
                      <div className="mt-4 flex items-center gap-2">
                        <span className="text-xs font-black tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-0 group-hover:translate-x-1"
                          style={{ color: g.accent }}>EXPLORE →</span>
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════ INDIVIDUAL GALLERY VIEW ══════════ */}
      <AnimatePresence mode="wait">
        {active !== null && (
          <motion.div key={active} initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0" style={{ background: current?.bg }}>

            {/* Gallery title pill */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="absolute top-6 right-6 z-50 px-4 py-2 rounded-full text-xs font-black tracking-[0.2em] uppercase"
              style={{ backgroundColor: `${current?.accent}22`, border: `1px solid ${current?.accent}55`, color: current?.accent }}>
              {current?.title}
            </motion.div>

            {/* Dot indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex gap-2">
              {GALLERY_META.map((_, i) => (
                <button key={i} onClick={() => setActive(i)}
                  className="rounded-full transition-all duration-300"
                  style={{ width: i === active ? 24 : 8, height: 8, backgroundColor: i === active ? current?.accent : "rgba(255,255,255,0.2)" }} />
              ))}
            </div>

            {/* The gallery itself */}
            {React.createElement(GalleryComponents[active])}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
