import React, { useRef, useState, useCallback, useEffect, useLayoutEffect } from "react";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function CoverflowCarousel({
  slides,
  rotate = 42,
  depth = 0.65,
  perspective = 3,
  falloff = 0.56,
  fade = 0.15,
  cardWidth = "clamp(240px, 28vw, 360px)",
  gap = 0.08,
  loop = true,
  showCaption = true,
  showPagination = true,
  showNavigation = true,
  label = "Portfolio Cover carousel",
  className,
  cardClassName,
  onSelect,
}) {
  const count = slides.length;

  const frameRef = useRef(null);
  const cardRefs = useRef([]);
  const posRef = useRef(0);
  const targetRef = useRef(0);
  const widthRef = useRef(0);
  const rafRef = useRef(null);
  const dragRef = useRef(null);

  const [selected, setSelected] = useState(0);

  const indexAt = useCallback(
    (pos) => ((Math.round(pos) % count) + count) % count,
    [count]
  );

  const paint = useCallback(() => {
    const width = widthRef.current;
    if (!width) return;
    const pitch = width * (1 + gap);
    const pos = posRef.current;

    cardRefs.current.forEach((card, index) => {
      if (!card) return;

      let offset = index - pos;
      if (loop) {
        offset = ((offset % count) + count) % count;
        if (offset > count / 2) offset -= count;
      }

      const distance = Math.abs(offset);
      const ramp = Math.pow(distance, falloff);
      const tilt = Math.min(rotate * ramp, 82) * Math.sign(offset);

      card.style.transform =
        `translateX(calc(-50% + ${offset * pitch}px)) ` +
        `translateZ(${-depth * width * ramp}px) rotateY(${-tilt}deg)`;

      const edge = loop ? Math.min(1, Math.max(0, count / 2 - distance)) : 1;
      card.style.opacity = String(Math.max(0, 1 - fade * distance) * edge);
      card.style.zIndex = String(100 - Math.round(distance));
      
      const slide = slides[index];
      const color = slide?.color || "#eed81c";
      
      // Dynamic shine / shadow with slide's unique accent color
      if (distance < 0.5) {
        card.style.boxShadow = `0 25px 60px -10px ${color}66, 0 0 35px ${color}44`;
        card.style.borderColor = color;
      } else {
        card.style.boxShadow = "0 20px 40px -15px rgba(0, 0, 0, 0.4)";
        card.style.borderColor = "rgba(0, 0, 0, 0.1)";
      }
    });
  }, [count, depth, fade, falloff, gap, loop, rotate]);

  const settle = useCallback(
    (target) => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      targetRef.current = target;
      const nextIndex = indexAt(target);
      setSelected(nextIndex);
      if (onSelect) onSelect(nextIndex);

      const step = () => {
        const remaining = target - posRef.current;
        if (Math.abs(remaining) < 0.0004) {
          posRef.current = target;
          paint();
          rafRef.current = null;
          return;
        }
        posRef.current += remaining * 0.16;
        paint();
        rafRef.current = requestAnimationFrame(step);
      };
      rafRef.current = requestAnimationFrame(step);
    },
    [indexAt, paint, onSelect]
  );

  const clamp = useCallback(
    (pos) => (loop ? pos : Math.max(0, Math.min(count - 1, pos))),
    [count, loop]
  );

  const goTo = useCallback(
    (index) => {
      const target = loop
        ? index + Math.round((targetRef.current - index) / count) * count
        : index;
      settle(clamp(target));
    },
    [clamp, count, loop, settle]
  );

  const nudge = useCallback(
    (by) => settle(clamp(Math.round(targetRef.current) + by)),
    [clamp, settle]
  );

  const onPointerDown = (event) => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    targetRef.current = posRef.current;
    dragRef.current = {
      id: event.pointerId,
      x: event.clientX,
      startX: event.clientX,
      pos: posRef.current,
      v: 0,
      t: performance.now(),
      hasMoved: false,
    };
  };

  const onPointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;

    const pitch = widthRef.current * (1 + gap);
    if (!pitch) return;

    // Mark as dragged if moved more than 5px
    if (Math.abs(event.clientX - drag.startX) > 5) {
      drag.hasMoved = true;
    }

    const now = performance.now();
    const previous = posRef.current;
    posRef.current = clamp(drag.pos - (event.clientX - drag.x) / pitch);
    drag.v = ((posRef.current - previous) / Math.max(now - drag.t, 1)) * 1000;
    drag.t = now;

    const index = indexAt(posRef.current);
    if (index !== selected) {
      setSelected(index);
      if (onSelect) onSelect(index);
    }
    paint();
  };

  const endDrag = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;

    const wasTrueClick = !drag.hasMoved;
    dragRef.current = null;

    if (wasTrueClick) {
      // Genuine tap/click — open the centered slide's URL
      const centerIndex = indexAt(posRef.current);
      const slide = slides[centerIndex];
      if (slide?.url) {
        if (slide.isLocal) {
          window.location.href = slide.url;
        } else {
          window.open(slide.url, "_blank", "noopener,noreferrer");
        }
      }
      return;
    }

    const carried = Math.max(-2, Math.min(2, drag.v * 0.18));
    settle(clamp(Math.round(posRef.current + carried)));
  };

  useIsoLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const measure = () => {
      const card = cardRefs.current[0];
      if (!card) return;
      widthRef.current = card.offsetWidth;
      paint();
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [paint]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const active = slides[selected];

  return (
    <div
      className={cn("w-full select-none", className)}
      style={{ ["--cf-card"]: cardWidth }}
      role="region"
      aria-label={label}
    >
      <div className="relative">
        <div
          ref={frameRef}
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              nudge(-1);
            } else if (event.key === "ArrowRight") {
              event.preventDefault();
              nudge(1);
            }
          }}
          className="cursor-grab overflow-hidden py-12 outline-none focus:ring-1 focus:ring-yellow-400/50 active:cursor-grabbing"
          style={{
            perspective: `calc(var(--cf-card) * ${perspective})`,
            touchAction: "pan-y",
          }}
        >
          <div
            className="relative select-none"
            style={{
              height: "calc(var(--cf-card) * 1.25)",
              transformStyle: "preserve-3d",
            }}
          >
            {slides.map((slide, index) => {
              const isCenter = index === selected;
              return (
                <div
                  key={index}
                  ref={(node) => {
                    cardRefs.current[index] = node;
                  }}
                  onClick={() => {
                    if (isCenter && slide.url) {
                      if (slide.isLocal) {
                        window.location.href = slide.url;
                      } else {
                        window.open(slide.url, "_blank", "noopener,noreferrer");
                      }
                    } else {
                      goTo(index);
                    }
                  }}
                  className={cn(
                    "absolute left-1/2 top-0 overflow-hidden rounded-3xl bg-[#0f0f0f] border transition-colors duration-300 will-change-transform flex flex-col justify-between group cursor-pointer",
                    cardClassName
                  )}
                  style={{
                    width: "var(--cf-card)",
                    height: "calc(var(--cf-card) * 1.25)",
                  }}
                >
                  {/* Card Visual / Thumbnail */}
                  <div className="relative w-full h-[65%] overflow-hidden bg-black/80">
                    <img
                      src={slide.src}
                      alt={slide.alt}
                      draggable={false}
                      className="h-full w-full select-none object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent"></div>
                    
                    {/* Badge */}
                    <div
                      className="absolute top-4 right-4 bg-black/85 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest"
                      style={{ color: slide.color || "#eab308" }}
                    >
                      {slide.badge || `0${index + 1}`}
                    </div>

                    {/* Quick Click Hint Overlay on Center Card */}
                    {isCenter && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
                        <span 
                          className="px-4 py-2 rounded-full text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xl transform scale-95 group-hover:scale-100 transition-transform"
                          style={{ backgroundColor: slide.color || "#eab308" }}
                        >
                          <span>{slide.isLocal ? "View Site" : "Open Link"}</span>
                          <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Info */}
                  <div className="p-5 flex flex-col justify-between flex-1 bg-[#0f0f0f] backdrop-blur-md">
                    <div>
                      <h3
                        className="text-lg font-black tracking-tight text-white line-clamp-1 transition-colors"
                      >
                        {slide.title}
                      </h3>
                      <p className="text-xs text-neutral-400 font-medium mt-1 line-clamp-2">
                        {slide.subtitle}
                      </p>
                    </div>

                    {isCenter && (
                      <div className="mt-3 flex items-center justify-between pt-3 border-t border-white/10">
                        <span 
                          className="text-[11px] font-bold flex items-center gap-1.5"
                          style={{ color: slide.color || "#eab308" }}
                        >
                          <span 
                            className="w-1.5 h-1.5 rounded-full animate-ping"
                            style={{ backgroundColor: slide.color || "#eab308" }}
                          ></span>
                          CLICK TO OPEN
                        </span>
                        <i className="fa-solid fa-arrow-up-right-from-square text-xs text-neutral-400 group-hover:text-white"></i>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation Buttons */}
        {showNavigation && (
          <>
            <button
              type="button"
              aria-label="Previous portfolio"
              onClick={() => nudge(-1)}
              className="absolute left-4 md:left-8 top-1/2 z-[200] -translate-y-1/2 rounded-full bg-white/90 border border-black/15 p-4 text-black backdrop-blur-md transition-all hover:scale-110 hover:bg-black hover:text-white hover:border-black shadow-2xl"
            >
              <i className="fa-solid fa-chevron-left text-base"></i>
            </button>
            <button
              type="button"
              aria-label="Next portfolio"
              onClick={() => nudge(1)}
              className="absolute right-4 md:right-8 top-1/2 z-[200] -translate-y-1/2 rounded-full bg-white/90 border border-black/15 p-4 text-black backdrop-blur-md transition-all hover:scale-110 hover:bg-black hover:text-white hover:border-black shadow-2xl"
            >
              <i className="fa-solid fa-chevron-right text-base"></i>
            </button>
          </>
        )}
      </div>

      {/* Slide Meta details */}
      {showCaption && active && (
        <div
          key={selected}
          className="mt-6 flex flex-col items-center px-6 animate-[fadeIn_0.4s_ease-out]"
        >
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-black text-center uppercase">
            {active.title}
          </h2>
          {active.subtitle && (
            <p className="mt-2 text-sm md:text-base text-neutral-600 text-center max-w-lg font-medium">
              {active.subtitle}
            </p>
          )}

          {active.meta && active.meta.length > 0 && (
            <div className="mt-6 flex flex-wrap justify-center gap-3 max-w-xl">
              {active.meta.map((row, i) => (
                <div
                  key={i}
                  className="bg-black/5 border border-black/10 px-4 py-2 rounded-xl flex items-center gap-2 backdrop-blur-sm shadow-sm"
                >
                  <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest">
                    {row.label}:
                  </span>
                  <span className="text-xs font-black text-black">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pagination Dots */}
      {showPagination && (
        <div className="mt-8 flex items-center justify-center gap-2.5">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to portfolio ${index + 1}`}
              onClick={() => goTo(index)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                index === selected
                  ? "w-8 bg-black"
                  : "w-2 bg-black/20 hover:bg-black/40"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
