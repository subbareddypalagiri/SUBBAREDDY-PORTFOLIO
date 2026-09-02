import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from '@studio-freight/lenis'
import Spline from '@splinetool/react-spline'
import SplitType from 'split-type'
import { Routes, Route, Link } from 'react-router-dom'
import Admin from './Admin.jsx'
import Feedback from './Feedback.jsx'
import Portfolios from './Portfolios.jsx'
import Gallery from './Gallery.jsx'
import { RevealText } from './components/ui/reveal-text'
import portfolioData from './data.json'

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const data = portfolioData;
  const colors = ['#22c55e', '#ef4444', '#a855f7', '#eed81c', '#3b82f6'];
  const [bgColor, setBgColor] = useState('#eed81c');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [myWorkBgColor, setMyWorkBgColor] = useState('#f8f9fa');
  const cursorRef = useRef(null);
  const navbarRef = useRef(null);
  const mainWrapperRef = useRef(null);

  useEffect(() => {
    let interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          gsap.to('.preloader', {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
            duration: 1.5,
            ease: 'power4.inOut',
            onComplete: () => setIsLoaded(true)
          });
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 1;
      });
    }, 40);
    return () => clearInterval(interval);
  }, []);

  useLayoutEffect(() => {
    // 1. Smooth Scrolling (Lenis) - PERFECTLY SYNCED WITH GSAP FOR ZERO LAG
    const lenis = new Lenis({
      lerp: 0.1, // Snappier, less floaty
      smoothWheel: true,
    });

    // Synchronize Lenis scrolling with GSAP's ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Use GSAP's ticker to run Lenis for perfect frame-sync
    const lenisTicker = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(lenisTicker);

    // Disable GSAP's lag smoothing to prevent stutter conflicts
    gsap.ticker.lagSmoothing(0);

    // 2. Custom Cursor
    const moveCursor = (e) => {
      gsap.to(cursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: 'power2.out'
      });
    };
    window.addEventListener('mousemove', moveCursor);

    // 3. Navbar Hide/Show
    let lastScroll = 0;
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > lastScroll && currentScroll > 100) {
        gsap.to(navbarRef.current, { y: -100, duration: 0.3 });
      } else {
        gsap.to(navbarRef.current, { y: 0, duration: 0.3 });
      }
      lastScroll = currentScroll;
    };
    window.addEventListener('scroll', handleScroll);

    // ==========================================
    // 4. THE MAGIC TRAVELING IMAGE (Hero -> Intro)
    // ==========================================
    // As you scroll from the top of the hero to the bottom of the hero,
    // the image physically moves DOWN by 100vh (canceling the scroll so it looks sticky)
    // and moves RIGHT to 75% to perfectly land on the second page!
    
    // First, fade out the hero text and color picker on scroll
    gsap.to(['.hero-title', '.color-picker'], {
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      },
      opacity: 0,
      scale: 0.9,
      ease: 'none'
    });

    // Horizontal Scrub Animation for the Intro Image
    // Optimized for Lenis smooth scrolling to remove the 'strange' floaty feeling
    gsap.fromTo('.intro-image', 
      { x: '20vw' }, // Starts slightly pushed towards the center
      {
        scrollTrigger: {
          trigger: '.intro-section',
          start: 'top 90%', // Starts animating when it just enters the screen
          end: 'center center', // Finishes perfectly in place
          scrub: true // 'true' locks it exactly to your mouse wheel, no weird floating delay!
        },
        x: 0, 
        ease: 'none'
      }
    );

    // Intro Text Mask Reveal
    gsap.fromTo('.intro-text-line', 
      { yPercent: 100 }, 
      { 
        yPercent: 0, 
        stagger: 0.15, 
        ease: 'power2.out', 
        duration: 1,
        scrollTrigger: {
          trigger: '.intro-section',
          start: 'top 60%',
        }
      }
    );

    // Intro Socials Fade Up
    gsap.fromTo('.intro-social',
      { y: 50, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        stagger: 0.1, 
        ease: 'power2.out', 
        duration: 0.8,
        scrollTrigger: {
          trigger: '.intro-section',
          start: 'top 50%',
        }
      }
    );

    // Testimonials Infinite Marquee
    gsap.to('.testimonial-row-left', { xPercent: -50, repeat: -1, duration: 25, ease: 'none' });
    gsap.to('.testimonial-row-right', { xPercent: 50, repeat: -1, duration: 25, ease: 'none' });

    // Bento Grid Stagger Entrance (Bulletproof fromTo)
    gsap.fromTo('.bento-item', 
      { y: 150, scale: 0.9, opacity: 0 },
      {
        scrollTrigger: { trigger: '.bento-grid', start: 'top 80%' },
        y: 0, scale: 1, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out'
      }
    );

    // Horizontal Pinned Services Section & Color Morphing
    const servicesWrapper = document.querySelector('.services-section');
    const servicesContainer = document.querySelector('.services-container');

    if (servicesWrapper && servicesContainer) {
      const scrollWidth = servicesContainer.scrollWidth - window.innerWidth;
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: servicesWrapper,
          start: 'top top',
          end: () => `+=${scrollWidth}`, // Pin duration matches the scroll width
          pin: true,
          scrub: 1,
        }
      });

      // 1. Horizontal sliding
      tl.to(servicesContainer, {
        x: () => -scrollWidth,
        ease: 'none',
        duration: 4
      }, 0);

      // 2. Dynamic Background Color Morphing
      tl.to(servicesWrapper, { backgroundColor: '#4ade80', duration: 1, ease: 'none' }, 0) // Green
        .to(servicesWrapper, { backgroundColor: '#eed81c', duration: 1, ease: 'none' }, 1) // Yellow
        .to(servicesWrapper, { backgroundColor: '#a855f7', duration: 1, ease: 'none' }, 2) // Purple
        .to(servicesWrapper, { backgroundColor: '#ef4444', duration: 1, ease: 'none' }, 3); // Red
    }

    // True 3D Physics for Horizontal Cards
    const serviceCards3D = document.querySelectorAll('.service-card');
    serviceCards3D.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -20; // 20 deg tilt
        const rotateY = ((x - centerX) / centerX) * 20;
        
        gsap.to(card, {
          rotateX: rotateX,
          rotateY: rotateY,
          transformPerspective: 1000,
          duration: 0.5,
          ease: 'power2.out'
        });
      });
      
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.7, ease: 'elastic.out(1, 0.3)' });
      });
    });

    const splitTexts = document.querySelectorAll('.split-text-standard');
    
    // Add the missing splitTexts animation for the new split texts
    splitTexts.forEach(text => {
      const split = new SplitType(text, { types: 'chars, words' });
      gsap.fromTo(split.chars, 
        { y: 100, opacity: 0, rotationZ: 10 },
        {
          scrollTrigger: { trigger: text, start: 'top 80%' },
          y: 0, opacity: 1, rotationZ: 0, duration: 1, stagger: 0.02, ease: 'power4.out'
        }
      );
    });

    const magnets = document.querySelectorAll('.magnetic');
    magnets.forEach(magnet => {
      magnet.addEventListener('mousemove', (e) => {
        const position = magnet.getBoundingClientRect();
        const x = e.clientX - position.left - position.width / 2;
        const y = e.clientY - position.top - position.height / 2;
        gsap.to(magnet, { x: x * 0.3, y: y * 0.3, duration: 0.5, ease: 'power2.out' });
        gsap.to(cursorRef.current, { scale: 3, mixBlendMode: 'difference', duration: 0.2 });
      });
      magnet.addEventListener('mouseleave', () => {
        gsap.to(magnet, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.3)' });
        gsap.to(cursorRef.current, { scale: 1, mixBlendMode: 'normal', duration: 0.2 });
      });
    });

    // Custom Canvas Particle Physics Engine
    const canvas = document.getElementById('canvas-physics');
    let physicsAnimation;
    let particles = [];
    const mouse = { x: null, y: null, radius: 150 };

    if (canvas) {
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const updateMouse = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; }
      window.addEventListener('mousemove', updateMouse);

      class Particle {
        constructor(x, y) {
          this.x = x;
          this.y = y;
          this.baseX = x;
          this.baseY = y;
          this.size = 2; // Perfect identical size
        }
        draw() {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'; // Subtle background color
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.closePath();
          ctx.fill();
        }
        update() {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius) {
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let force = (mouse.radius - distance) / mouse.radius;
            // Push dots away smoothly
            this.x -= forceDirectionX * force * 10;
            this.y -= forceDirectionY * force * 10;
            this.size = 2 + (force * 2); // Slightly grow near mouse
          } else {
            // Snap back to perfect grid
            if (this.x !== this.baseX) this.x -= (this.x - this.baseX) / 10;
            if (this.y !== this.baseY) this.y -= (this.y - this.baseY) / 10;
            this.size = 2;
          }
        }
      }
      
      const spacing = 45; // Perfect grid spacing
      const cols = Math.floor(canvas.width / spacing) + 2;
      const rows = Math.floor(canvas.height / spacing) + 2;
      
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          particles.push(new Particle(i * spacing, j * spacing));
        }
      }
      
      function animatePhysics() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
          particles[i].update();
          particles[i].draw();
        }
        physicsAnimation = requestAnimationFrame(animatePhysics);
      }
      animatePhysics();
    }

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('scroll', handleScroll);
      if (canvas) window.removeEventListener('mousemove', window.updateMouse);
      cancelAnimationFrame(physicsAnimation);
      gsap.ticker.remove(lenisTicker);
      ScrollTrigger.getAll().forEach(t => t.kill());
      lenis.destroy();
    };
  }, []);

  const isYellow = bgColor === '#eed81c';
  const textColor = isYellow ? 'text-black' : 'text-white';
  const buttonStyle = isYellow ? 'bg-white text-black hover:bg-black hover:text-white' : 'bg-black text-white hover:bg-white hover:text-black';

  return (
    <div className="min-h-screen relative overflow-hidden font-sans selection:bg-black selection:text-white" ref={mainWrapperRef}>
      
      {/* Dynamic Cursor */}
      <div className="hidden md:block w-4 h-4 rounded-full fixed pointer-events-none z-[9999] bg-black border border-white" ref={cursorRef} style={{ left: '-10px', top: '-10px' }}></div>

      {/* Ultra-Premium Agency Navbar */}
      <nav ref={navbarRef} className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-12 py-6 bg-white/20 backdrop-blur-2xl border-b border-white/20 transition-all duration-500">
        
        {/* Logo */}
        <div 
          className="text-3xl font-black tracking-tighter text-black hover:opacity-70 transition-opacity cursor-pointer select-none z-10 w-1/3" 
          onClick={() => document.getElementById('home').scrollIntoView({ behavior: 'smooth' })}
        >
          {data.profile.firstName}<span className="text-black/40">.web</span>
        </div>
        
        {/* Links (Centered) */}
        <ul className="hidden md:flex items-center justify-center gap-12 text-xs font-black tracking-[0.25em] uppercase text-black/80 w-1/3">
          <li><a href="#home" className="cursor-pointer hover:text-black transition-colors relative group">Home<span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-black rounded-full opacity-0 group-hover:opacity-100 transition-all group-hover:-translate-y-1"></span></a></li>
          <li><a href="#about" className="cursor-pointer hover:text-black transition-colors relative group">About<span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-black rounded-full opacity-0 group-hover:opacity-100 transition-all group-hover:-translate-y-1"></span></a></li>
          <li><a href="#portfolio" className="cursor-pointer hover:text-black transition-colors relative group">Portfolio<span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-black rounded-full opacity-0 group-hover:opacity-100 transition-all group-hover:-translate-y-1"></span></a></li>
          <li><a href="#contact" className="cursor-pointer hover:text-black transition-colors relative group">Contact<span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-black rounded-full opacity-0 group-hover:opacity-100 transition-all group-hover:-translate-y-1"></span></a></li>
        </ul>

        {/* CTA Buttons (Right aligned) */}
        <div className="w-1/3 flex justify-end items-center gap-3">
          <Link to="/portfolios" className="px-6 py-2.5 font-black text-xs tracking-[0.2em] uppercase rounded-full transition-all duration-500 border-2 border-black text-black hover:bg-black hover:text-white flex items-center gap-2 group">
            <span className="relative overflow-hidden flex items-center">
               <span className="group-hover:-translate-y-full transition-transform duration-500 flex">MY PORTFOLIOS</span>
               <span className="absolute top-full group-hover:-translate-y-full transition-transform duration-500 flex">MY PORTFOLIOS</span>
            </span>
            <i className="fa-solid fa-arrow-right opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500"></i>
          </Link>
          <Link to="/gallery" className="px-6 py-2.5 font-black text-xs tracking-[0.2em] uppercase rounded-full transition-all duration-500 border-2 border-black text-black hover:bg-black hover:text-white flex items-center gap-2 group">
            <span className="relative overflow-hidden flex items-center">
               <span className="group-hover:-translate-y-full transition-transform duration-500 flex">GALLERY</span>
               <span className="absolute top-full group-hover:-translate-y-full transition-transform duration-500 flex">GALLERY</span>
            </span>
            <i className="fa-solid fa-arrow-right opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500"></i>
          </Link>
          <Link to="/feedback" className="px-6 py-2.5 font-black text-xs tracking-[0.2em] uppercase rounded-full transition-all duration-500 border-2 border-black text-black hover:bg-black hover:text-white flex items-center gap-2 group">
            <span className="relative overflow-hidden flex items-center">
               <span className="group-hover:-translate-y-full transition-transform duration-500 flex">FEEDBACK</span>
               <span className="absolute top-full group-hover:-translate-y-full transition-transform duration-500 flex">FEEDBACK</span>
            </span>
            <i className="fa-solid fa-arrow-right opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500"></i>
          </Link>
        </div>
      </nav>

      {/* PAGE 1: HERO SECTION */}
      <section id="home" className="hero-section h-screen w-full flex items-center justify-center overflow-hidden transition-colors duration-500 relative" style={{ backgroundColor: bgColor }}>
        <div className="hero-title absolute select-none z-0 uppercase whitespace-nowrap pointer-events-auto"
          style={{ top: '50%', transform: 'translateY(-50%)', left: '50%', marginLeft: '-50vw', width: '100vw', display: 'flex', justifyContent: 'center' }}>
          <RevealText
            text="SUBBAREDDY"
            textColor="text-transparent"
            overlayColor={isYellow ? "text-black/50" : "text-white/40"}
            fontSize="text-[13vw]"
            letterDelay={0.06}
            overlayDelay={0.04}
            overlayDuration={0.35}
            springDuration={600}
            gap="1.2vw"
            textStroke={isYellow ? "2px rgba(0,0,0,0.25)" : "2px rgba(255,255,255,0.25)"}
            letterImages={[
              "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2070&q=80",
              "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2070&q=80",
              "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=2070&q=80",
              "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=2070&q=80",
              "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=2070&q=80",
              "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2070&q=80",
              "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?auto=format&fit=crop&w=2070&q=80",
              "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=2070&q=80",
              "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2070&q=80",
              "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?auto=format&fit=crop&w=2070&q=80",
            ]}
          />
        </div>

        <img 
          src={data.profile.avatarUrl} 
          alt="Hero Avatar" 
          className="absolute bottom-0 object-contain z-20 h-[80vh] will-change-transform transform-gpu" 
          style={{ left: '50%', transform: 'translateX(-50%)' }}
        />

        <div className="color-picker absolute bottom-10 bg-white/20 backdrop-blur-xl px-8 py-4 flex gap-6 rounded-full border border-white/40 shadow-2xl z-50">
          {colors.map((color) => (
            <button 
              key={color} 
              className={`w-8 h-8 rounded-full border-4 transition-all duration-300 hover:scale-150 ${color === bgColor ? 'border-white scale-125 shadow-[0_0_20px_rgba(255,255,255,0.8)]' : 'border-transparent'}`}
              style={{ backgroundColor: color }}
              onClick={() => setBgColor(color)}
            />
          ))}
        </div>
      </section>

      {/* PAGE 2: WHO I AM (SPLIT LAYOUT) */}
      <section id="about" className="intro-section h-screen w-full relative bg-white flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-yellow-400 rounded-full blur-3xl opacity-10 animate-pulse pointer-events-none" style={{ right: '0', left: 'auto', width: '50vw' }}></div>
        
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center gap-16">
          
          {/* Left Side: Animated Profile Picture */}
          <div className="flex-1 flex justify-center relative z-20 magnetic">
            <div className="w-96 h-96 bg-gray-200 rounded-full flex items-center justify-center relative overflow-hidden group">
              <img src={data.profile.avatarUrl} className="w-full h-full object-contain grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 scale-100 group-hover:scale-110 intro-image" alt="Profile" />
              <div className="absolute inset-0 border-4 border-black/10 rounded-full group-hover:border-black/50 transition-colors duration-500 pointer-events-none"></div>
            </div>
          </div>

          {/* Right Side: Text Content */}
          <div className="flex-1 flex flex-col items-start z-10">
            
            <div className="overflow-hidden mb-6">
              <p className="intro-text-line text-sm font-black tracking-[0.3em] uppercase text-gray-400">{data.profile.title}</p>
            </div>

            <h2 className="text-[6vw] font-black leading-[0.9] mb-8 tracking-tighter uppercase text-black">
              <div className="overflow-hidden"><div className="intro-text-line">HELLO, I'M</div></div>
              <div className="overflow-hidden"><div className="intro-text-line">{data.profile.firstName}</div></div>
              <div className="overflow-hidden"><div className="intro-text-line">{data.profile.lastName}</div></div>
            </h2>
            
            <div className="overflow-hidden mb-12">
              <p className="intro-text-line text-gray-600 max-w-md font-medium text-xl leading-relaxed">
                {data.profile.description}
              </p>
            </div>

            <div className="flex gap-8 text-3xl">
              {data.socials.map((social, i) => (
                <a key={i} href={social.link} target="_blank" rel="noreferrer" className={`intro-social ${social.icon} magnetic hover:${social.color} transition-colors cursor-pointer text-black`}></a>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* SKILLS & ACHIEVEMENTS SECTION (Replaced Testimonials) */}
      <section className="bg-white py-32 overflow-hidden flex flex-col gap-8 border-y border-gray-200">
        <h2 className="text-[8vw] font-black text-center mb-10 tracking-tighter uppercase split-text-standard text-black">SKILLS & ACHIEVEMENTS</h2>
        
        {/* Top Row: Technical Skills (Scrolls Left) */}
        <div className="flex w-max gap-8 testimonial-row-left">
          {data.skills.map((skill, i) => (
             <div key={i} className="w-[450px] bg-gray-50 p-10 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-center">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center text-white text-2xl font-black"><i className={skill.icon}></i></div>
                  <div><h4 className="font-black text-2xl">{skill.title}</h4><p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-1">{skill.desc}</p></div>
                </div>
             </div>
          ))}
        </div>
        {/* Bottom Row: Education & Open Source (Scrolls Right) */}
        <div className="flex w-max gap-8 testimonial-row-right" style={{ transform: 'translateX(-50%)' }}>
          {data.achievements.map((item, i) => (
             <div key={i} className="w-[450px] bg-[#eed81c] p-10 rounded-3xl border border-transparent shadow-sm flex flex-col justify-center">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-black text-2xl font-black"><i className={item.icon}></i></div>
                  <div><h4 className="font-black text-2xl">{item.title}</h4><p className="text-sm text-black/70 font-bold uppercase tracking-widest mt-1">{item.desc}</p></div>
                </div>
             </div>
          ))}
        </div>
      </section>

      <svg className="hidden">
        <filter id="gooey">
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="gooey" />
          <feBlend in="SourceGraphic" in2="gooey" />
        </filter>
      </svg>
      
      <canvas id="canvas-physics" className="fixed inset-0 pointer-events-none z-0 w-full h-full"></canvas>

      {/* MY WORK - BENTO GRID */}
      <section id="portfolio" className="text-black py-40 px-8 overflow-hidden relative z-10 transition-colors duration-700" style={{ backgroundColor: myWorkBgColor }}>
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-[12vw] font-black leading-none tracking-tighter mb-20 text-center split-text-standard text-black">
            MY WORK
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bento-grid">
            
            {data.projects.map((proj, i) => (
              <div 
                key={i}
                className={`${proj.colSpan} ${proj.rowSpan} bento-item bg-[#0a0a0a] p-12 rounded-[3rem] border border-white/10 shadow-2xl h-[600px] ${proj.rowSpan ? 'md:h-auto' : ''} flex flex-col justify-end group cursor-pointer transition-all duration-500 overflow-hidden relative`}
                onMouseEnter={(e) => {
                  setMyWorkBgColor(proj.color || proj.hexColor);
                  e.currentTarget.style.borderColor = proj.color || proj.hexColor;
                  e.currentTarget.style.boxShadow = `0 0 80px ${proj.color || proj.hexColor}33`;
                }}
                onMouseLeave={(e) => {
                  setMyWorkBgColor('#f8f9fa');
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div className="absolute top-12 left-12 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
                   <i className={`${proj.icon} text-8xl drop-shadow-lg transition-colors duration-500`} style={{ color: proj.color || proj.hexColor }}></i>
                </div>
                <div className="relative z-10">
                  <h3 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter text-white transition-colors duration-500" style={{ ':hover': { color: proj.color || proj.hexColor } }}>{proj.title}</h3>
                  <p className="text-gray-400 text-xl font-medium mb-8 max-w-lg">{proj.description}</p>
                  <a href={proj.link || '#'} target="_blank" rel="noreferrer" className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center transition-all duration-500 group-hover:border-transparent" style={{ backgroundColor: 'transparent' }} 
                       onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = proj.color || proj.hexColor; e.currentTarget.style.color = '#000'; }}
                       onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'inherit'; }}
                  >
                    <i className="fa-brands fa-github text-2xl"></i>
                  </a>
                </div>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* SERVICES (HORIZONTAL PINNED SCROLL) */}
      <section className="h-screen w-full relative overflow-hidden services-section bg-white flex items-center">
        
        {/* Background Marquee Text (Outline Typography) */}
        <div className="absolute inset-0 flex items-center overflow-hidden pointer-events-none z-0 mix-blend-difference">
          <h2 className="text-[40vw] font-black whitespace-nowrap animate-[scrollText_20s_linear_infinite]"
              style={{ WebkitTextStroke: '4px rgba(255,255,255,0.8)', color: 'transparent' }}>
            EXPERTISE • EXPERTISE • EXPERTISE •
          </h2>
        </div>

        {/* Horizontal Scrolling Container */}
        <div className="services-container flex w-max h-full items-center px-[32vw] gap-[8vw] relative z-10"
             onMouseEnter={() => {
                setCursorText('SCROLL');
                gsap.to(cursorRef.current, { scale: 4, duration: 0.3 });
             }}
             onMouseLeave={() => {
                setCursorText('');
                gsap.to(cursorRef.current, { scale: 1, duration: 0.3 });
             }}>
          
          {data.expertise.map((exp, i) => (
            <div key={i} className={`service-card w-[80vw] md:w-[35vw] h-[450px] bg-[#0a0a0a] rounded-[3rem] p-12 shadow-2xl border border-white/10 flex flex-col justify-center items-center text-center transform ${i % 2 === 0 ? '-rotate-3' : 'rotate-3'} group hover:shadow-[0_0_80px_rgba(255,255,255,0.15)] hover:border-white/30`}>
              <i className={`${exp.icon} text-5xl mb-6 text-white group-hover:scale-110 transition-transform duration-500`}></i>
              <h3 className="text-4xl font-black mb-6 leading-none tracking-tighter text-white">{exp.title}</h3>
              <p className="text-xl font-medium max-w-md leading-relaxed text-gray-400 group-hover:text-gray-300 transition-colors">{exp.description}</p>
            </div>
          ))}

        </div>
      </section>

      {/* Let's Talk Section */}
      <section id="contact" className="bg-white text-black py-40 px-8 border-t border-gray-200 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <h2 className="text-[12vw] font-black text-center mb-24 tracking-tighter split-text-standard relative z-10 text-black">
          LET'S TALK
        </h2>
        
        <div className="flex justify-center gap-12 mb-32 flex-wrap relative z-10">
          {data.socials.map((social, i) => (
            <a key={i} href={social.link} target="_blank" rel="noreferrer" className="magnetic w-32 h-32 rounded-full border-4 border-black flex items-center justify-center text-5xl hover:bg-black hover:text-white transition-colors cursor-pointer bg-white text-black">
              <i className={social.icon}></i>
            </a>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#eed81c] text-black text-center pt-40 pb-20 px-8 flex flex-col items-center relative overflow-hidden rounded-t-[5rem]">
        <h2 className="absolute top-20 text-[25vw] font-black leading-none opacity-10 tracking-tighter pointer-events-none z-0">
          {data.profile.firstName}
        </h2>
        <div className="relative z-10 mb-20">
          <img src={data.profile.avatarUrl} alt="Footer" className="h-[400px] object-contain drop-shadow-2xl hover:scale-110 transition-transform duration-700" />
        </div>
        
        <div className="flex gap-8 mb-32 z-10">
          <a href="mailto:subbareddy123sub@gmail.com" className="magnetic px-16 py-6 rounded-full border-4 border-black font-black text-2xl uppercase tracking-wider hover:bg-black hover:text-[#eed81c] transition-colors shadow-2xl inline-block">Email</a>
          <a href="#contact" className="magnetic px-16 py-6 rounded-full bg-black text-[#eed81c] font-black text-2xl uppercase tracking-wider hover:bg-transparent hover:text-black border-4 border-black transition-colors shadow-2xl inline-block">Message</a>
        </div>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/feedback" element={<Feedback />} />
      <Route path="/portfolios" element={<Portfolios />} />
      <Route path="/gallery" element={<Gallery />} />
    </Routes>
  );
}
