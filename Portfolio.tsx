import React, { useEffect, useRef, useState } from 'react';

const T = { black:'#060606', lime:'#C8FF00', white:'#F2F2F2', gray:'#111111', card:'#161616' };

// ─── CSS ───────────────────────────────────────────────────────────
const CSS = `
*,*::before,*::after{box-sizing:border-box}
html{scroll-behavior:smooth}
*{cursor:none!important}
body{margin:0;overflow-x:hidden}

#tc-dot{position:fixed;top:0;left:0;width:8px;height:8px;border-radius:50%;background:${T.lime};pointer-events:none;z-index:10001;will-change:transform;transition:opacity .2s,transform .1s}
#tc-ring{position:fixed;top:0;left:0;width:44px;height:44px;border-radius:50%;border:1.5px solid ${T.lime};pointer-events:none;z-index:10000;will-change:transform;display:flex;align-items:center;justify-content:center;font-family:'Bebas Neue',sans-serif;letter-spacing:.05em;transition:background .18s,border-color .18s,opacity .18s}
#tc-prog{position:fixed;top:0;left:0;height:2px;background:${T.lime};z-index:10000;box-shadow:0 0 8px ${T.lime}88;pointer-events:none;transition:none}

.tc-navlink{position:relative;text-decoration:none}
.tc-navlink::after{content:'';position:absolute;bottom:-3px;left:50%;right:50%;height:1px;background:currentColor;transition:left .3s ease,right .3s ease}
.tc-navlink:hover::after{left:0;right:0}

.tc-mag{transition:transform .45s cubic-bezier(.175,.885,.32,1.275)}
.tc-mag-inner{transition:transform .45s cubic-bezier(.175,.885,.32,1.275);display:inline-block}

.tc-outline{-webkit-text-stroke:2px ${T.white};color:transparent}
.tc-outline-lime{-webkit-text-stroke:2px ${T.lime};color:transparent}

@keyframes tc-tick{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
.tc-ticker{animation:tc-tick 28s linear infinite}

@keyframes tc-scroll-pulse{0%,100%{opacity:.4;transform:scaleY(0)}50%{opacity:1;transform:scaleY(1)}}
.tc-scroll-pulse{animation:tc-scroll-pulse 2s infinite ease-in-out;transform-origin:top}

/* 3D card base */
.tc-card-3d{will-change:transform,opacity;transform:perspective(1000px) rotateX(12deg) translateY(50px);opacity:0;transition:none}

/* Clip reveal */
.tc-clip-img{clip-path:inset(0 100% 0 0);will-change:clip-path;transition:none}

/* Service panel */
.tc-srv-panel{width:100vw;height:100%;flex-shrink:0;position:relative;overflow:hidden;display:flex;align-items:flex-end}

/* Char reveal */
.tc-char{will-change:opacity;display:inline;transition:none}

/* Form */
.tc-input{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);color:${T.white};padding:.9rem 1.2rem;font-family:'DM Sans',sans-serif;font-size:.875rem;outline:none;transition:border-color .3s;width:100%;border-radius:2px}
.tc-input:focus{border-color:${T.lime}}
.tc-input::placeholder{color:rgba(242,242,242,.3)}
.tc-select{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23C8FF00' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 1rem center}
option{background:${T.black}}

@media(max-width:768px){#tc-dot,#tc-ring{display:none!important}body{cursor:auto!important}
#tc-hero .tc-hero-sub{padding-left:1.5rem!important;padding-right:1.5rem!important;padding-bottom:5rem!important}
#tc-hero .tc-stats-bar{gap:1.5rem!important;padding:0.8rem 1.5rem!important;flex-wrap:wrap!important;justify-content:space-around!important}
#tc-hero .tc-stats-bar>div{flex:1 1 30%!important;text-align:center!important;justify-content:center!important}
#tc-hero .tc-scroll-ind{display:none!important}
.tc-section-pad{padding-left:1.5rem!important;padding-right:1.5rem!important;padding-top:4rem!important;padding-bottom:4rem!important}
.tc-nav-mob{padding:1rem 1.5rem!important}
.tc-nav-links-mob{display:none!important}
.tc-srv-mob{height:auto!important}
.tc-srv-mob>*{position:relative!important;height:auto!important}
.tc-srv-track-mob{width:100%!important;flex-direction:column!important;transform:none!important}
.tc-srv-panel-mob{width:100%!important;height:auto!important;min-height:100vh!important}
.tc-srv-panel-mob>div{padding:5rem 1.5rem 3rem!important;grid-template-columns:1fr!important;gap:2rem!important}
.tc-srv-panel-mob .tc-srv-side{display:none!important}
.tc-srv-dots-mob{display:none!important}
.tc-srv-label-mob{left:1.5rem!important;top:1.5rem!important}
.tc-srv-hint-mob{display:none!important}
.tc-srv-panel-mob .tc-srv-ghost{font-size:40vw!important;right:1rem!important}
.tc-form-mob{padding:1.5rem!important}
.tc-cta-mob{padding:4rem 1.5rem!important}
.tc-footer-mob{padding:3rem 1.5rem 1.5rem!important}
.tc-sobre-mob{grid-template-columns:1fr!important;gap:2.5rem!important;padding:4rem 1.5rem!important}
.tc-valores-mob{padding:4rem 1.5rem!important}
.tc-processo-mob{padding:4rem 1.5rem!important}
.tc-agendar-mob{grid-template-columns:1fr!important;gap:3rem!important;padding:4rem 1.5rem!important}
.tc-depo-mob{grid-template-columns:1fr!important;gap:2.5rem!important;padding:4rem 1.5rem!important}
.tc-depo-stats-mob{grid-template-columns:1fr 1fr!important}
.tc-hero-title{font-size:clamp(3.5rem,20vw,13rem)!important}
.tc-hero-tagline{font-size:clamp(0.85rem,4vw,2rem)!important}
}
`;

// ─── Char reveal helper — split text into spans, update by ref ──────
function buildCharSpans(text: string, container: HTMLElement) {
  container.innerHTML = text.split('').map((ch, i) =>
    `<span class="tc-char" data-i="${i}" style="opacity:0">${ch === ' ' ? '&nbsp;' : ch}</span>`
  ).join('');
}

function updateCharProgress(container: HTMLElement | null, progress: number) {
  if (!container) return;
  const spans = container.querySelectorAll<HTMLElement>('.tc-char');
  const total = spans.length;
  spans.forEach((s, i) => {
    s.style.opacity = String(Math.max(0, Math.min(1, (progress * total - i) * 3)));
  });
}

// ─── Simple reveal (IntersectionObserver for non-scroll-linked elements) ─
function Reveal({ children, delay=0, style={} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    el.style.transition = `opacity .8s ${delay}ms cubic-bezier(.16,1,.3,1), transform .8s ${delay}ms cubic-bezier(.16,1,.3,1)`;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.style.opacity='1'; el.style.transform='none'; io.disconnect(); }
    }, { threshold: .08 });
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);
  return <div ref={ref} style={style}>{children}</div>;
}

// ─── Portfolio ──────────────────────────────────────────────────────
export function Portfolio() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Cursor
  const dotRef   = useRef<HTMLDivElement>(null);
  const ringRef  = useRef<HTMLDivElement>(null);

  // Progress bar
  const progRef  = useRef<HTMLDivElement>(null);

  // Hero
  const heroImgRef  = useRef<HTMLDivElement>(null);
  const heroOvlRef  = useRef<HTMLDivElement>(null);
  const heroL1Ref   = useRef<HTMLSpanElement>(null);  // THALES (outline)
  const heroL2Ref   = useRef<HTMLSpanElement>(null);  // COELHO (solid)
  const heroSubRef  = useRef<HTMLDivElement>(null);
  const heroBtnsRef = useRef<HTMLDivElement>(null);
  const statN1Ref   = useRef<HTMLSpanElement>(null);
  const statN2Ref   = useRef<HTMLSpanElement>(null);
  const statN3Ref   = useRef<HTMLSpanElement>(null);

  // Ticker
  const tickerRef = useRef<HTMLDivElement>(null);

  // Sobre
  const sobreImgRef  = useRef<HTMLDivElement>(null);
  const sobreDescRef = useRef<HTMLParagraphElement>(null);
  const sobreDesc2Ref= useRef<HTMLParagraphElement>(null);

  // Valores
  const valorRefs = useRef<(HTMLDivElement|null)[]>([null,null,null,null]);

  // Services
  const srvContRef  = useRef<HTMLDivElement>(null);
  const srvTrackRef = useRef<HTMLDivElement>(null);
  const srvDotsRef  = useRef<HTMLDivElement>(null);

  // Agendar heading chars
  const agendarH1Ref = useRef<HTMLDivElement>(null);
  const agendarH2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    // Build char spans for char-reveal sections
    if (sobreDescRef.current) buildCharSpans('O corpo humano é a máquina mais perfeita que existe. Minha missão não é apenas fazer você suar — é ensinar você a dominar o próprio corpo com ciência, precisão e respeito.', sobreDescRef.current);
    if (sobreDesc2Ref.current) buildCharSpans('Cada protocolo é construído em cima da sua realidade. Não existe cópia, não existe fórmula genérica. Existe só o seu objetivo.', sobreDesc2Ref.current);
    if (agendarH1Ref.current) buildCharSpans('RESERVE', agendarH1Ref.current);
    if (agendarH2Ref.current) buildCharSpans('SUA VAGA.', agendarH2Ref.current);

    // Cursor state
    let mx=0, my=0, rx=0, ry=0;
    let clicking = false;
    let scrollY = 0, lastScrollY = 0, scrollVelocity = 0;

    const onMove  = (e: MouseEvent) => { mx=e.clientX; my=e.clientY; };
    const onDown  = () => { clicking=true; };
    const onUp    = () => { clicking=false; };
    const onScroll = () => {
      scrollVelocity = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      scrollY = window.scrollY;
      setScrolled(scrollY > 70);
    };

    let rafId = 0;
    const loop = () => {
      const sy  = window.scrollY;
      const winH = window.innerHeight;
      const winW = window.innerWidth;
      const maxSc = document.documentElement.scrollHeight - winH;

      // ── Progress bar ──────────────────────────────────────────
      if (progRef.current) progRef.current.style.width = `${(sy/maxSc)*100}%`;

      // ── Cursor ────────────────────────────────────────────────
      if (!isMobile) {
        rx += (mx-rx)*0.09; ry += (my-ry)*0.09;
        const dot  = dotRef.current;
        const ring = ringRef.current;

        // Detect element under cursor every frame — reliable & never stale
        const elUnder = document.elementFromPoint(mx, my) as HTMLElement | null;
        const isImg  = !!elUnder?.closest('.tc-img-h');
        const isSrv  = !!elUnder?.closest('.tc-srv-h');
        const isLink = !isImg && !isSrv && !!elUnder?.closest('a,button,.tc-mag');

        if (dot) {
          dot.style.transform = `translate(${mx-4}px,${my-4}px)`;
          // Dot hides when cursor is over an interactive element
          dot.style.opacity = (isLink || isImg || isSrv) ? '0' : '1';
          dot.style.transform = `translate(${mx-4}px,${my-4}px) scale(${clicking ? 0.5 : 1})`;
        }

        if (ring) {
          const sc = clicking ? 0.7
            : isLink ? 2.2
            : (isImg || isSrv) ? 1.8
            : 1;
          ring.style.transform   = `translate(${rx-22}px,${ry-22}px) scale(${sc})`;
          ring.style.opacity     = '1';
          // Fill: lime tint on interactive, transparent otherwise
          ring.style.background  = isLink ? `${T.lime}28`
            : isImg               ? `${T.lime}40`
            : 'transparent';
          ring.style.borderColor = T.lime;
          ring.style.borderWidth = isLink ? '2px' : '1.5px';
          ring.style.color       = T.lime;
          ring.style.fontSize    = isSrv ? '15px' : '8px';
          ring.textContent       = isImg ? 'VER' : isSrv ? '→' : '';
        }
      }

      // ── Hero split title ──────────────────────────────────────
      {
        const heroEl = document.getElementById('tc-hero');
        if (heroEl) {
          const heroH = heroEl.offsetHeight;
          const p = Math.max(0, Math.min(1, sy / (heroH * 0.75)));

          // THALES flies UP, COELHO flies DOWN
          if (heroL1Ref.current) {
            heroL1Ref.current.style.transform = `translateY(${p * -110}px)`;
            heroL1Ref.current.style.opacity   = String(Math.max(0, 1 - p * 1.8));
          }
          if (heroL2Ref.current) {
            heroL2Ref.current.style.transform = `translateY(${p * 110}px)`;
            heroL2Ref.current.style.opacity   = String(Math.max(0, 1 - p * 1.8));
          }

          // Image parallax
          if (heroImgRef.current) heroImgRef.current.style.transform = `translateY(${sy*0.42}px) scale(1.12)`;

          // Overlay darkens
          if (heroOvlRef.current) heroOvlRef.current.style.opacity = String(0.58 + p*0.3);

          // Sub + btns fade out quicker
          if (heroSubRef.current) {
            heroSubRef.current.style.opacity   = String(Math.max(0, 1 - p*2.5));
            heroSubRef.current.style.transform = `translateY(${p*-25}px)`;
          }
          if (heroBtnsRef.current) {
            heroBtnsRef.current.style.opacity   = String(Math.max(0, 1 - p*2.5));
            heroBtnsRef.current.style.transform = `translateY(${p*-20}px)`;
          }

          // Stats counting
          const sp = Math.min(1, sy / 300);
          if (statN1Ref.current) statN1Ref.current.textContent = `${Math.round(85*sp)}+`;
          if (statN2Ref.current) statN2Ref.current.textContent = `${Math.round(220*sp)}+`;
          if (statN3Ref.current) statN3Ref.current.textContent = `${Math.round(5*sp)}+`;
        }
      }

      // ── Ticker speed ──────────────────────────────────────────
      if (tickerRef.current) {
        const spd = Math.max(6, 28 - Math.abs(scrollVelocity)*2.5);
        tickerRef.current.style.animationDuration = `${spd}s`;
      }

      // ── Sobre: clip-path image reveal ────────────────────────
      if (sobreImgRef.current) {
        const rect = sobreImgRef.current.getBoundingClientRect();
        const p = Math.max(0, Math.min(1, (winH - rect.top) / (winH*0.65)));
        sobreImgRef.current.style.clipPath = `inset(0 ${(1-p)*100}% 0 0)`;
      }

      // ── Sobre: char reveal ────────────────────────────────────
      {
        const ref1 = sobreDescRef.current;
        const ref2 = sobreDesc2Ref.current;
        if (ref1) {
          const rect = ref1.getBoundingClientRect();
          const p = Math.max(0, Math.min(1, (winH - rect.top) / (winH*0.6)));
          updateCharProgress(ref1, p);
        }
        if (ref2) {
          const rect = ref2.getBoundingClientRect();
          const p = Math.max(0, Math.min(1, (winH - rect.top) / (winH*0.6)));
          updateCharProgress(ref2, p);
        }
      }

      // ── Valores: 3D perspective tilt ─────────────────────────
      valorRefs.current.forEach((card) => {
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const p = Math.max(0, Math.min(1, (winH - rect.top) / (winH*0.5)));
        card.style.transform = `perspective(900px) rotateX(${(1-p)*10}deg) translateY(${(1-p)*45}px)`;
        card.style.opacity   = String(Math.min(1, p*1.8));
      });

      // ── Valores bars ─────────────────────────────────────────
      document.querySelectorAll<HTMLElement>('.tc-val-bar').forEach(bar => {
        const rect = bar.getBoundingClientRect();
        const p = Math.max(0, Math.min(1, (winH - rect.top) / (winH*0.4)));
        bar.style.transform = `scaleX(${p})`;
      });

      // ── Services horizontal carousel ─────────────────────────
      if (!isMobile && srvContRef.current && srvTrackRef.current) {
        const rect = srvContRef.current.getBoundingClientRect();
        const scrollable = srvContRef.current.offsetHeight - winH;
        const p = Math.max(0, Math.min(1, -rect.top / scrollable));
        srvTrackRef.current.style.transform = `translateX(${-p*2*winW}px)`;

        // Dot indicators
        if (srvDotsRef.current) {
          const activePanel = Math.min(2, Math.round(p * 2));
          const dots = srvDotsRef.current.children;
          for (let j=0; j<dots.length; j++) {
            const d = dots[j] as HTMLElement;
            d.style.opacity = j===activePanel ? '1' : '0.3';
            d.style.width   = j===activePanel ? '28px' : '8px';
          }
        }
      }

      // ── Agendar: char reveal ──────────────────────────────────
      [agendarH1Ref, agendarH2Ref].forEach(r => {
        if (!r.current) return;
        const rect = r.current.getBoundingClientRect();
        const p = Math.max(0, Math.min(1, (winH - rect.top) / (winH*0.5)));
        updateCharProgress(r.current, p);
      });

      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener('scroll', onScroll, { passive:true });
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup',   onUp);
    rafId = requestAnimationFrame(loop);

    // Magnetic buttons
    const setupMag = () => {
      document.querySelectorAll<HTMLElement>('.tc-mag').forEach(btn => {
        const inner = btn.querySelector<HTMLElement>('.tc-mag-inner');
        const mv = (e: MouseEvent) => {
          const r   = btn.getBoundingClientRect();
          const dx  = e.clientX - r.left - r.width/2;
          const dy  = e.clientY - r.top  - r.height/2;
          const dist = Math.sqrt(dx*dx+dy*dy);
          if (dist < 100) {
            const f = (1-dist/100)*0.38;
            btn.style.transform = `translate(${dx*f}px,${dy*f}px)`;
            if (inner) inner.style.transform = `translate(${dx*f*.5}px,${dy*f*.5}px)`;
          }
        };
        const lv = () => { btn.style.transform=''; if(inner) inner.style.transform=''; };
        btn.addEventListener('mousemove', mv);
        btn.addEventListener('mouseleave', lv);
      });
    };
    setTimeout(setupMag, 500);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup',   onUp);
    };
  }, []);

  // ── JSX ──────────────────────────────────────────────────────────
  return (
    <div style={{ background:T.black, color:T.white, fontFamily:"'DM Sans',sans-serif", overflowX:'clip', cursor:'none', minHeight:'100vh' }}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div id="tc-dot"  ref={dotRef}  />
      <div id="tc-ring" ref={ringRef} />
      <div id="tc-prog" ref={progRef} />

      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav className="tc-nav-mob" style={{
        position:'fixed', top:0, left:0, right:0, zIndex:500,
        padding:'1.4rem 3rem',
        background: scrolled ? 'rgba(6,6,6,.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '0.5px solid rgba(255,255,255,.06)' : '0.5px solid transparent',
        transition: 'all .5s ease',
        display:'flex', alignItems:'center', justifyContent:'space-between',
      }}>
        <div style={{ position:'relative', display:'flex', flexDirection:'column' }}>
          <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'1.6rem', lineHeight:1, letterSpacing:'.04em' }}>THALES</span>
          <span style={{ fontWeight:300, fontSize:'.57rem', letterSpacing:'.2em', marginTop:2 }}>COELHO</span>
          <span style={{ position:'absolute', top:-4, right:-18, color:T.lime, fontSize:'.6rem', fontWeight:700 }}>PT</span>
        </div>

        <div className="tc-nav-links-mob" style={{ display:'flex', gap:'2.5rem', alignItems:'center' }}>
          {[['sobre','Sobre'],['valores','Valores'],['servicos','Serviços'],['agendar','Avaliação'],['depoimentos','Resultados']].map(([id,label]) => (
            <a key={id} href={`#${id}`} className="tc-navlink" style={{ fontSize:'.7rem', fontWeight:500, letterSpacing:'.14em', textTransform:'uppercase', color:'rgba(242,242,242,.65)' }}>{label}</a>
          ))}
        </div>

        <button className="tc-mag" style={{ background:T.lime, color:T.black, border:'none', padding:'.7rem 1.6rem', fontSize:'.7rem', fontWeight:700, letterSpacing:'.16em', textTransform:'uppercase', borderRadius:2, cursor:'none' }}>
          <span className="tc-mag-inner">Começar Agora</span>
        </button>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section id="tc-hero" style={{ position:'relative', height:'100dvh', overflow:'hidden', display:'flex', flexDirection:'column', justifyContent:'flex-end' }}>
        {/* BG */}
        <div ref={heroImgRef} style={{ position:'absolute', inset:'-10% 0 0 0', willChange:'transform' }}>
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&auto=format&fit=crop&q=85"
            alt="Thales Coelho treinamento"
            style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top', filter:'grayscale(25%)' }}
          />
        </div>
        <div ref={heroOvlRef} style={{ position:'absolute', inset:0, background:T.black, opacity:.58, zIndex:1 }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, #060606 0%, transparent 55%)', zIndex:2 }} />

        {/* Main title — centered, massive, split on scroll */}
        <div style={{ position:'absolute', inset:0, zIndex:3, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:0, pointerEvents:'none', userSelect:'none' }}>
          <span ref={heroL1Ref} className="tc-outline tc-hero-title" style={{
            fontFamily:"'Montserrat',sans-serif", fontWeight:900,
            fontSize:'clamp(5rem,16vw,13rem)', lineHeight:.88,
            letterSpacing:'-0.03em', willChange:'transform,opacity', display:'block',
          }}>THALES</span>

          <span ref={heroL2Ref} className="tc-hero-title" style={{
            fontFamily:"'Montserrat',sans-serif", fontWeight:900,
            fontSize:'clamp(5rem,16vw,13rem)', lineHeight:.88,
            letterSpacing:'-0.03em', color:T.white, willChange:'transform,opacity', display:'block',
          }}>COELHO</span>

          {/* Lime italic under */}
          <span className="tc-hero-tagline" style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300, fontStyle:'italic', fontSize:'clamp(1rem,2.5vw,2rem)', color:T.lime, marginTop:'1.2rem', letterSpacing:'.01em' }}>
            transforma corpos, transforma vidas.
          </span>
        </div>

        {/* Tag + Sub + Btns — bottom-left */}
        <div className="tc-hero-sub" style={{ position:'relative', zIndex:4, padding:'0 3rem 7rem', maxWidth:1400, width:'100%', margin:'0 auto' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1rem' }}>
            <div style={{ width:36, height:1, background:T.lime }} />
            <span style={{ color:T.lime, fontSize:'.62rem', letterSpacing:'.3em', fontWeight:500, textTransform:'uppercase' }}>Personal Trainer · Educação Física</span>
          </div>

          <div ref={heroSubRef} style={{ maxWidth:440, marginBottom:'1.5rem', willChange:'opacity,transform' }}>
            <p style={{ fontWeight:300, color:'rgba(242,242,242,.6)', fontSize:'1rem', lineHeight:1.75, margin:0 }}>
              Treinamento personalizado que respeita onde você está<br />e leva onde você quer chegar.
            </p>
          </div>

          <div ref={heroBtnsRef} style={{ display:'flex', gap:'1rem', willChange:'opacity,transform' }}>
            <button className="tc-mag" style={{ background:T.lime, color:T.black, border:'none', padding:'.95rem 2rem', fontSize:'.72rem', fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', borderRadius:2, cursor:'none' }}>
              <span className="tc-mag-inner">Agendar Avaliação</span>
            </button>
            <button className="tc-mag" style={{ background:'transparent', color:T.white, border:'1px solid rgba(255,255,255,.2)', padding:'.95rem 2rem', fontSize:'.72rem', fontWeight:500, letterSpacing:'.14em', textTransform:'uppercase', borderRadius:2, cursor:'none' }}>
              <span className="tc-mag-inner">Ver Serviços</span>
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="tc-scroll-ind" style={{ position:'absolute', bottom:'7rem', right:'3rem', zIndex:4, display:'flex', flexDirection:'column', alignItems:'center', gap:'.5rem' }}>
          <span style={{ fontSize:'.5rem', letterSpacing:'.3em', writingMode:'vertical-rl', textTransform:'uppercase', color:'rgba(255,255,255,.3)' }}>SCROLL</span>
          <div style={{ width:1, height:40, background:'rgba(255,255,255,.12)', overflow:'hidden', position:'relative' }}>
            <div className="tc-scroll-pulse" style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', background:T.lime }} />
          </div>
        </div>

        {/* Stats bar */}
        <div className="tc-stats-bar" style={{ position:'absolute', bottom:0, left:0, right:0, zIndex:5, background:'rgba(6,6,6,.8)', backdropFilter:'blur(12px)', borderTop:'.5px solid rgba(255,255,255,.06)', display:'flex', justifyContent:'center', gap:'5rem', padding:'1rem 3rem' }}>
          {[
            { nRef: statN1Ref, n:'0+', l:'Alunos Ativos' },
            { nRef: statN2Ref, n:'0+', l:'Transformações' },
            { nRef: statN3Ref, n:'0+', l:'Anos' },
          ].map(({ nRef, n, l }) => (
            <div key={l} style={{ display:'flex', alignItems:'baseline', gap:'.65rem' }}>
              <span ref={nRef} style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'2rem', color:T.white }}>{n}</span>
              <span style={{ fontSize:'.62rem', letterSpacing:'.14em', textTransform:'uppercase', color:'rgba(255,255,255,.45)' }}>{l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── TICKER ───────────────────────────────────────────── */}
      <div style={{ background:T.lime, height:48, overflow:'hidden', display:'flex', alignItems:'center', borderTop:'1px solid rgba(0,0,0,.12)', borderBottom:'1px solid rgba(0,0,0,.12)' }}>
        <div ref={tickerRef} className="tc-ticker" style={{ whiteSpace:'nowrap', display:'flex', fontFamily:"'Bebas Neue',sans-serif", fontSize:'1.45rem', color:T.black, letterSpacing:'.1em' }}>
          {[...Array(8)].map((_,i) => (
            <span key={i} style={{ marginRight:'2.5rem' }}>THALES COELHO · PERSONAL TRAINER · TRANSFORMAÇÃO REAL · TREINO ONLINE E PRESENCIAL · CREF 123456-G/SP ·</span>
          ))}
        </div>
      </div>

      {/* ── SOBRE ────────────────────────────────────────────── */}
      <section id="sobre" className="tc-sobre-mob" style={{ padding:'8rem 3rem', maxWidth:1400, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:'5rem', alignItems:'center' }}>
        {/* Image with clip-path reveal */}
        <div style={{ position:'relative' }}>
          <div style={{ position:'absolute', inset:0, border:`1px solid ${T.lime}`, transform:'translate(12px,12px)', borderRadius:2, zIndex:0 }} />
          <div ref={sobreImgRef} className="tc-clip-img tc-img-h" style={{ position:'relative', aspectRatio:'3/4', overflow:'hidden', borderRadius:2, zIndex:1, background:T.gray }}>
            <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=900&auto=format&fit=crop&q=85" alt="Thales Coelho" loading="lazy" style={{ width:'100%', height:'100%', objectFit:'cover', filter:'grayscale(10%)', display:'block' }} />
          </div>
          <div style={{ position:'absolute', left:-16, top:-36, fontFamily:"'Bebas Neue',sans-serif", fontSize:'8rem', color:`${T.lime}15`, lineHeight:1, pointerEvents:'none', userSelect:'none' }}>05</div>
        </div>

        {/* Text */}
        <div>
          <Reveal>
            <div style={{ display:'flex', alignItems:'center', gap:'.75rem', marginBottom:'1.5rem' }}>
              <div style={{ width:28, height:1, background:T.lime }} />
              <span style={{ color:T.lime, fontSize:'.7rem', letterSpacing:'.22em', fontWeight:500, textTransform:'uppercase' }}>Sobre Mim</span>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(2.8rem,5vw,4.8rem)', lineHeight:.9, margin:'0 0 2rem', letterSpacing:'-.01em' }}>
              FORMADO PARA<br /><span style={{ color:T.lime }}>TRANSFORMAR</span>
            </h2>
          </Reveal>

          <Reveal delay={140}>
            {/* Char-reveal paragraphs — content set by JS */}
            <p ref={sobreDescRef} style={{ fontWeight:300, color:'rgba(242,242,242,.65)', lineHeight:1.85, marginBottom:'1.2rem', fontSize:'1rem' }} />
            <p ref={sobreDesc2Ref} style={{ fontWeight:300, color:'rgba(242,242,242,.65)', lineHeight:1.85, marginBottom:'2.5rem', fontSize:'1rem' }} />
          </Reveal>

          <Reveal delay={200}>
            <ul style={{ listStyle:'none', padding:0, margin:'0 0 2.5rem', display:'flex', flexDirection:'column', gap:'.85rem' }}>
              {['Bacharel em Educação Física','Especialização em Treinamento Funcional','Personal Trainer certificado','220+ alunos transformados'].map(item => (
                <li key={item} style={{ display:'flex', alignItems:'center', gap:'.85rem', fontSize:'.9rem', fontWeight:500, letterSpacing:'.01em' }}>
                  <span style={{ color:T.lime }}>→</span> {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ── VALORES ──────────────────────────────────────────── */}
      <section id="valores" className="tc-valores-mob" style={{ background:T.gray, padding:'7rem 3rem' }}>
        <div style={{ maxWidth:1400, margin:'0 auto' }}>
          <Reveal>
            <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'.75rem' }}>
              <div style={{ width:28, height:1, background:T.lime }} />
              <span style={{ color:T.lime, fontSize:'.7rem', letterSpacing:'.22em', fontWeight:500, textTransform:'uppercase' }}>Princípios</span>
            </div>
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(3rem,6vw,5.5rem)', lineHeight:.88, margin:'0 0 4rem', letterSpacing:'-.01em' }}>
              O QUE GUIA<br />CADA DECISÃO
            </h2>
          </Reveal>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'1px', background:'rgba(255,255,255,.05)' }}>
            {[
              { n:'01', title:'CIÊNCIA',      desc:'Cada protocolo é construído sobre evidências científicas, nunca sobre modismos passageiros.', icon:'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
              { n:'02', title:'HONESTIDADE',  desc:'Resultados reais levam tempo. Você vai ouvir a verdade — não o que quer ouvir. Isso é respeito.', icon:'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
              { n:'03', title:'COMPROMISSO',  desc:'Cada aluno recebe presença total. Estou com você em cada rep, semana e obstáculo do caminho.', icon:'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
              { n:'04', title:'EVOLUÇÃO',     desc:'O progresso é constante e mensurável. A transformação não é um destino — é um hábito vitalício.', icon:'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
            ].map((v, i) => (
              <div
                key={v.n}
                ref={el => { valorRefs.current[i] = el; }}
                className="tc-card-3d"
                style={{ background:T.card, padding:'2.8rem 2.5rem', position:'relative', overflow:'hidden' }}
              >
                <div className="tc-val-bar" style={{ position:'absolute', bottom:0, left:0, right:0, height:2, background:T.lime, transformOrigin:'left', transform:'scaleX(0)' }} />
                <div style={{ position:'absolute', top:4, right:10, fontFamily:"'Bebas Neue',sans-serif", fontSize:'6rem', color:`${T.lime}0C`, lineHeight:1, userSelect:'none' }}>{v.n}</div>
                <div style={{ width:42, height:42, borderRadius:'50%', border:'1px solid rgba(255,255,255,.08)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1.5rem' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.lime} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={v.icon} /></svg>
                </div>
                <div style={{ color:T.lime, fontSize:'.62rem', letterSpacing:'.18em', fontWeight:600, textTransform:'uppercase', marginBottom:'.5rem' }}>{v.n}</div>
                <h3 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'1.8rem', margin:'0 0 .9rem', letterSpacing:'.02em' }}>{v.title}</h3>
                <p style={{ fontWeight:300, color:'rgba(242,242,242,.5)', fontSize:'.85rem', lineHeight:1.75, margin:0 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVIÇOS — HORIZONTAL SCROLL CAROUSEL ────────────── */}
      <div id="servicos" ref={srvContRef} className="tc-srv-mob" style={{ height:'300vh', position:'relative' }}>
        <div style={{ position:'sticky', top:0, height:'100vh', overflow:'hidden' }}>
          {/* Horizontal track — 3 × 100vw panels */}
          <div ref={srvTrackRef} className="tc-srv-track-mob" style={{ display:'flex', width:'300vw', height:'100%', willChange:'transform', transition:'none' }}>

            {/* Panel 01 — TREINO ONLINE */}
            <div className="tc-srv-panel tc-srv-panel-mob" style={{ background:T.black, borderRight:'.5px solid rgba(255,255,255,.06)' }}>
              {/* Giant ghost number */}
              <div className="tc-srv-ghost" style={{ position:'absolute', top:'50%', right:'4rem', transform:'translateY(-50%)', fontFamily:"'Bebas Neue',sans-serif", fontSize:'28vw', lineHeight:1, color:`${T.lime}08`, userSelect:'none', pointerEvents:'none' }}>01</div>
              {/* Diagonal lime accent */}
              <div style={{ position:'absolute', left:'42%', top:0, bottom:0, width:1, background:`linear-gradient(to bottom, transparent, ${T.lime}30, transparent)` }} />

              <div style={{ position:'relative', zIndex:2, padding:'0 3rem 4rem', width:'100%', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4rem', alignItems:'flex-end' }}>
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:'.75rem', marginBottom:'1.5rem' }}>
                    <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'1rem', color:T.lime }}>01</span>
                    <div style={{ flex:1, height:'.5px', background:'rgba(255,255,255,.15)' }} />
                    <span style={{ fontSize:'.6rem', letterSpacing:'.2em', color:'rgba(255,255,255,.4)', textTransform:'uppercase' }}>Remoto</span>
                  </div>
                  <h2 className="tc-srv-h" style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(4rem,8vw,8rem)', lineHeight:.88, margin:'0 0 2rem', letterSpacing:'-.01em' }}>
                    TREINO<br />ONLINE
                  </h2>
                  <p style={{ fontWeight:300, color:'rgba(242,242,242,.6)', fontSize:'1rem', lineHeight:1.75, maxWidth:400, margin:'0 0 2.5rem' }}>
                    Planilha 100% personalizada, revisada semanalmente com base no seu progresso. Suporte diário via WhatsApp — você nunca vai treinar sozinho.
                  </p>
                  <button className="tc-mag" style={{ background:T.lime, color:T.black, border:'none', padding:'.95rem 2.2rem', fontSize:'.72rem', fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', borderRadius:2, cursor:'none' }}>
                    <span className="tc-mag-inner">Saber Mais →</span>
                  </button>
                </div>
                <div className="tc-srv-side" style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
                  {[['Planilha personalizada','Montada com base no seu nível, histórico e objetivos'],['Revisão semanal','Ajustes contínuos para manter o progresso em curva ascendente'],['Suporte diário','WhatsApp aberto para dúvidas, motivação e correções em tempo real']].map(([title,desc]) => (
                    <div key={title} style={{ padding:'1.5rem', border:'.5px solid rgba(255,255,255,.08)', borderRadius:2 }}>
                      <div style={{ color:T.lime, fontSize:'.65rem', letterSpacing:'.18em', fontWeight:600, textTransform:'uppercase', marginBottom:'.4rem' }}>{title}</div>
                      <div style={{ fontWeight:300, color:'rgba(242,242,242,.5)', fontSize:'.82rem', lineHeight:1.6 }}>{desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Panel 02 — TREINO PRESENCIAL */}
            <div className="tc-srv-panel tc-srv-panel-mob" style={{ background:'#080808', borderRight:'.5px solid rgba(255,255,255,.06)' }}>
              <div className="tc-srv-ghost" style={{ position:'absolute', top:'50%', right:'4rem', transform:'translateY(-50%)', fontFamily:"'Bebas Neue',sans-serif", fontSize:'28vw', lineHeight:1, color:`${T.lime}08`, userSelect:'none', pointerEvents:'none' }}>02</div>

              {/* Image stripe */}
              <div className="tc-srv-side" style={{ position:'absolute', right:'38%', top:0, bottom:0, width:'28%', overflow:'hidden' }}>
                <img src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=900&auto=format&fit=crop&q=85" alt="Treino" style={{ width:'100%', height:'100%', objectFit:'cover', filter:'grayscale(40%)', opacity:.6 }} />
                <div style={{ position:'absolute', inset:0, background:`linear-gradient(to right, #080808, transparent 30%, transparent 70%, #080808)` }} />
              </div>

              <div style={{ position:'relative', zIndex:2, padding:'0 3rem 4rem', width:'100%', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4rem', alignItems:'flex-end' }}>
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:'.75rem', marginBottom:'1.5rem' }}>
                    <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'1rem', color:T.lime }}>02</span>
                    <div style={{ flex:1, height:'.5px', background:'rgba(255,255,255,.15)' }} />
                    <span style={{ fontSize:'.6rem', letterSpacing:'.2em', color:'rgba(255,255,255,.4)', textTransform:'uppercase' }}>Presencial</span>
                  </div>
                  <h2 className="tc-srv-h" style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(4rem,8vw,8rem)', lineHeight:.88, margin:'0 0 2rem', letterSpacing:'-.01em' }}>
                    TREINO<br />PRESENCIAL
                  </h2>
                  <p style={{ fontWeight:300, color:'rgba(242,242,242,.6)', fontSize:'1rem', lineHeight:1.75, maxWidth:400, margin:'0 0 2.5rem' }}>
                    Sessões individuais com execução supervisionada, correção biomecânica em tempo real e intensidade calibrada ao seu nível exato.
                  </p>
                  <button className="tc-mag" style={{ background:T.lime, color:T.black, border:'none', padding:'.95rem 2.2rem', fontSize:'.72rem', fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', borderRadius:2, cursor:'none' }}>
                    <span className="tc-mag-inner">Saber Mais →</span>
                  </button>
                </div>
                <div className="tc-srv-side" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                  {[['Correção ao vivo','Cada rep executada com técnica perfeita'],['Intensidade ideal','Carga e volume ajustados em tempo real'],['Foco total','Sessão 100% dedicada a você'],['Resultados rápidos','Menos tempo perdido, mais progresso real']].map(([title,desc]) => (
                    <div key={title} style={{ padding:'1.2rem', border:`.5px solid rgba(200,255,0,.15)`, borderRadius:2, background:`${T.lime}05` }}>
                      <div style={{ color:T.lime, fontSize:'.6rem', letterSpacing:'.15em', fontWeight:600, textTransform:'uppercase', marginBottom:'.3rem' }}>{title}</div>
                      <div style={{ fontWeight:300, color:'rgba(242,242,242,.5)', fontSize:'.78rem', lineHeight:1.55 }}>{desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Panel 03 — CONSULTORIA */}
            <div className="tc-srv-panel tc-srv-panel-mob" style={{ background:T.gray }}>
              <div className="tc-srv-ghost" style={{ position:'absolute', top:'50%', right:'4rem', transform:'translateY(-50%)', fontFamily:"'Bebas Neue',sans-serif", fontSize:'28vw', lineHeight:1, color:`${T.lime}08`, userSelect:'none', pointerEvents:'none' }}>03</div>

              <div style={{ position:'relative', zIndex:2, padding:'0 3rem 4rem', width:'100%', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4rem', alignItems:'flex-end' }}>
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:'.75rem', marginBottom:'1.5rem' }}>
                    <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'1rem', color:T.lime }}>03</span>
                    <div style={{ flex:1, height:'.5px', background:'rgba(255,255,255,.15)' }} />
                    <span style={{ fontSize:'.6rem', letterSpacing:'.2em', color:'rgba(255,255,255,.4)', textTransform:'uppercase' }}>Pacote</span>
                  </div>
                  <h2 className="tc-srv-h" style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(3rem,7vw,7rem)', lineHeight:.88, margin:'0 0 2rem', letterSpacing:'-.01em' }}>
                    CONSULTORIA<br />DE<br />EMAGRECIMENTO
                  </h2>
                  <p style={{ fontWeight:300, color:'rgba(242,242,242,.6)', fontSize:'1rem', lineHeight:1.75, maxWidth:400, margin:'0 0 2.5rem' }}>
                    Protocolo completo com rastreamento de métricas semanais, ajuste de treino e nutrição e acompanhamento contínuo baseado em dados reais.
                  </p>
                  <button className="tc-mag" style={{ background:T.lime, color:T.black, border:'none', padding:'.95rem 2.2rem', fontSize:'.72rem', fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', borderRadius:2, cursor:'none' }}>
                    <span className="tc-mag-inner">Saber Mais →</span>
                  </button>
                </div>

                {/* Metrics */}
                <div className="tc-srv-side" style={{ display:'flex', flexDirection:'column', gap:'1px', background:'rgba(255,255,255,.06)' }}>
                  {[['−12kg','resultado médio em 90 dias'],['98%','taxa de satisfação dos alunos'],['Semanal','check-in com revisão de dados'],['24h','tempo médio de resposta'],].map(([val,desc]) => (
                    <div key={val} style={{ background:T.card, padding:'1.4rem 2rem', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                      <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'2.2rem', color:T.lime }}>{val}</span>
                      <span style={{ fontWeight:300, color:'rgba(242,242,242,.45)', fontSize:'.8rem', textAlign:'right', maxWidth:200 }}>{desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Progress dots */}
          <div ref={srvDotsRef} className="tc-srv-dots-mob" style={{ position:'absolute', bottom:'2.5rem', left:'50%', transform:'translateX(-50%)', display:'flex', gap:'.5rem', alignItems:'center', zIndex:10 }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ height:4, borderRadius:2, background:T.lime, transition:'all .35s ease', opacity: i===0?1:.3, width: i===0?'28px':'8px' }} />
            ))}
          </div>

          {/* Section label */}
          <div className="tc-srv-label-mob" style={{ position:'absolute', top:'2.5rem', left:'3rem', zIndex:10 }}>
            <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'.85rem', letterSpacing:'.25em', color:'rgba(255,255,255,.25)', textTransform:'uppercase' }}>Serviços</span>
          </div>

          {/* Scroll hint */}
          <div className="tc-srv-hint-mob" style={{ position:'absolute', bottom:'2.5rem', right:'3rem', zIndex:10, display:'flex', alignItems:'center', gap:'.5rem' }}>
            <span style={{ fontSize:'.6rem', letterSpacing:'.2em', color:'rgba(255,255,255,.25)', textTransform:'uppercase' }}>Role para navegar</span>
            <div style={{ width:24, height:1, background:'rgba(255,255,255,.2)' }} />
          </div>
        </div>
      </div>

      {/* ── PROCESSO ─────────────────────────────────────────── */}
      <section className="tc-processo-mob" style={{ background:T.gray, padding:'7rem 3rem' }}>
        <div style={{ maxWidth:1400, margin:'0 auto' }}>
          <Reveal>
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(2.8rem,6vw,5rem)', lineHeight:.88, margin:'0 0 4rem', letterSpacing:'-.01em' }}>O PROCESSO</h2>
          </Reveal>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))', gap:'1px', background:'rgba(255,255,255,.05)' }}>
            {[
              { n:'01', title:'AVALIAÇÃO',    desc:'Análise completa do seu biotipo, histórico de saúde e objetivos reais.', icon:'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
              { n:'02', title:'PLANEJAMENTO', desc:'Protocolo 100% individualizado, com cargas e fases calculadas.', icon:'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
              { n:'03', title:'EXECUÇÃO',     desc:'Treinos com técnica precisa e intensidade calibrada ao seu nível.', icon:'M13 10V3L4 14h7v7l9-11h-7z' },
              { n:'04', title:'RESULTADOS',   desc:'Ajustes semanais baseados em dados reais de evolução contínua.', icon:'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
            ].map((s, i) => (
              <Reveal key={s.n} delay={i*80}>
                <div style={{ background:T.card, padding:'2.5rem', position:'relative', overflow:'hidden', height:'100%' }}>
                  <div style={{ position:'absolute', top:4, right:10, fontFamily:"'Bebas Neue',sans-serif", fontSize:'5.5rem', color:`${T.lime}0B`, lineHeight:1, userSelect:'none' }}>{s.n}</div>
                  <div style={{ width:42, height:42, borderRadius:'50%', border:'1px solid rgba(255,255,255,.08)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1.5rem' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.lime} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={s.icon} /></svg>
                  </div>
                  <h4 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'1.6rem', margin:'0 0 .7rem' }}>{s.title}</h4>
                  <p style={{ fontWeight:300, color:'rgba(242,242,242,.45)', fontSize:'.84rem', lineHeight:1.7, margin:0 }}>{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── AGENDAR ──────────────────────────────────────────── */}
      <section id="agendar" className="tc-agendar-mob" style={{ background:T.black, padding:'7rem 3rem', borderTop:'.5px solid rgba(255,255,255,.06)' }}>
        <div style={{ maxWidth:1400, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:'5rem', alignItems:'start' }}>
          <div>
            <Reveal>
              <div style={{ display:'flex', alignItems:'center', gap:'.75rem', marginBottom:'1.5rem' }}>
                <div style={{ width:28, height:1, background:T.lime }} />
                <span style={{ color:T.lime, fontSize:'.7rem', letterSpacing:'.22em', fontWeight:500, textTransform:'uppercase' }}>Avaliação Gratuita</span>
              </div>
            </Reveal>

            {/* Char-reveal heading */}
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(3.5rem,6vw,5.5rem)', lineHeight:.88, letterSpacing:'-.01em', marginBottom:'.3rem' }}>
              <div ref={agendarH1Ref} />
            </div>
            <div className="tc-outline-lime" style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(3.5rem,6vw,5.5rem)', lineHeight:.88, letterSpacing:'-.01em', marginBottom:'2rem' }}>
              <div ref={agendarH2Ref} />
            </div>

            <Reveal delay={100}>
              <p style={{ fontWeight:300, color:'rgba(242,242,242,.6)', lineHeight:1.8, fontSize:'1rem', maxWidth:400, marginBottom:'2rem' }}>
                Uma conversa de 30 minutos para entender sua rotina, seu histórico e seus objetivos. Sem compromisso. Só clareza.
              </p>
              <div style={{ display:'flex', flexDirection:'column', gap:'.7rem' }}>
                {['Avaliação 100% gratuita e sem compromisso','Resposta em até 24h via WhatsApp','Presencial (São Paulo) ou online'].map(item => (
                  <div key={item} style={{ display:'flex', alignItems:'center', gap:'.7rem', fontSize:'.85rem', color:'rgba(242,242,242,.55)', fontWeight:300 }}>
                    <div style={{ width:5, height:5, borderRadius:'50%', background:T.lime, flexShrink:0 }} />
                    {item}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={150}>
            <form className="tc-form-mob" onSubmit={e=>e.preventDefault()} style={{ display:'flex', flexDirection:'column', gap:'.9rem', background:T.card, padding:'2.5rem', border:'.5px solid rgba(255,255,255,.07)', borderRadius:2 }}>
              <div style={{ marginBottom:'.4rem' }}>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'1.45rem', marginBottom:'.2rem' }}>Preencha os dados</div>
                <div style={{ fontSize:'.75rem', color:'rgba(242,242,242,.35)', fontWeight:300 }}>Thales entrará em contato em até 24h.</div>
              </div>
              <input className="tc-input" type="text"  placeholder="Seu nome completo" />
              <input className="tc-input" type="tel"   placeholder="WhatsApp (com DDD)" />
              <select className="tc-input tc-select" defaultValue="">
                <option value="" disabled>Seu principal objetivo</option>
                <option>Emagrecimento</option>
                <option>Ganho de massa muscular</option>
                <option>Condicionamento físico</option>
                <option>Reabilitação e qualidade de vida</option>
                <option>Performance esportiva</option>
              </select>
              <textarea className="tc-input" placeholder="Alguma observação? (lesões, restrições, rotina...)" rows={3} style={{ resize:'vertical' }} />
              <button type="submit" className="tc-mag" style={{ background:T.lime, color:T.black, border:'none', padding:'1.1rem', fontSize:'.78rem', fontWeight:700, letterSpacing:'.18em', textTransform:'uppercase', borderRadius:2, cursor:'none', marginTop:'.3rem', display:'flex', alignItems:'center', justifyContent:'center', gap:'.75rem' }}>
                <span className="tc-mag-inner" style={{ display:'flex', alignItems:'center', gap:'.75rem' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={T.black}><path d="M12.031 0C5.38 0 0 5.383 0 12.033c0 2.651.687 5.234 1.996 7.514L.15 24l4.607-1.815a11.968 11.968 0 0 0 7.274 2.417c6.65 0 12.03-5.383 12.03-12.035C24.06 5.383 18.681 0 12.031 0zm5.405 16.537c-.296-.148-1.758-.87-2.03-.97-.272-.102-.47-.148-.667.148-.198.297-.768.97-.94 1.168-.173.198-.346.223-.643.074-.296-.148-1.254-.462-2.39-1.464-.883-.78-1.478-1.745-1.651-2.043-.173-.296-.018-.458.13-.606.134-.133.296-.346.445-.52.148-.173.198-.296.296-.494.099-.198.05-.371-.024-.52-.074-.148-.667-1.606-.914-2.198-.241-.578-.485-.5-.667-.51h-.568c-.198 0-.52.074-.79.371-.272.296-1.038 1.013-1.038 2.47 0 1.458 1.063 2.868 1.21 3.065.149.198 2.09 3.19 5.064 4.475 2.973 1.285 2.973.856 3.516.808.544-.05 1.758-.718 2.006-1.41.247-.692.247-1.285.173-1.41-.074-.124-.272-.198-.568-.346z"/></svg>
                  Reservar Minha Vaga →
                </span>
              </button>
              <p style={{ fontSize:'.68rem', color:'rgba(242,242,242,.25)', fontWeight:300, textAlign:'center', margin:0 }}>Seus dados são confidenciais e nunca serão compartilhados.</p>
            </form>
          </Reveal>
        </div>
      </section>

      {/* ── DEPOIMENTOS ──────────────────────────────────────── */}
      <section id="depoimentos" className="tc-depo-mob" style={{ background:T.gray, padding:'7rem 3rem' }}>
        <div style={{ maxWidth:1400, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:'4rem', alignItems:'center' }}>
          <Reveal>
            <div style={{ background:T.card, padding:'3.5rem', border:'.5px solid rgba(255,255,255,.06)', borderRadius:2, position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:'.5rem', left:'1.5rem', fontFamily:"'Bebas Neue',sans-serif", fontSize:'7rem', color:`${T.lime}15`, lineHeight:1, userSelect:'none' }}>"</div>
              <p style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(1.3rem,2.5vw,1.9rem)', fontStyle:'italic', lineHeight:1.3, marginBottom:'2rem', position:'relative' }}>
                Nunca achei que fosse gostar de treinar, mas o Thales mudou completamente minha mentalidade. O resultado estético foi consequência de um processo incrível.
              </p>
              <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
                <div className="tc-img-h" style={{ width:48, height:48, borderRadius:'50%', overflow:'hidden' }}>
                  <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80" alt="Ana" style={{ width:'100%', height:'100%', objectFit:'cover' }} loading="lazy" />
                </div>
                <div>
                  <div style={{ color:T.lime, fontWeight:700, fontSize:'.7rem', letterSpacing:'.18em', textTransform:'uppercase' }}>Ana Silva</div>
                  <div style={{ color:'rgba(242,242,242,.4)', fontSize:'.7rem', marginTop:2, fontWeight:300 }}>Consultoria Online · −12kg em 4 meses</div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="tc-depo-stats-mob" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1px', background:'rgba(255,255,255,.05)' }}>
              {[['−12kg','Ana em 4 meses'],['+200%','Energia diária'],['98%','Satisfação geral'],['3×','Mais força em 60 dias']].map(([stat,label]) => (
                <div key={stat} style={{ background:T.card, padding:'2.2rem 2rem', borderLeft:`2px solid ${T.lime}` }}>
                  <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(2.2rem,3.5vw,3rem)', color:T.white, lineHeight:1, marginBottom:'.4rem' }}>{stat}</div>
                  <div style={{ color:T.lime, fontSize:'.62rem', letterSpacing:'.14em', textTransform:'uppercase', fontWeight:600 }}>{label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="tc-cta-mob" style={{ background:T.lime, padding:'8rem 3rem', textAlign:'center' }}>
        <Reveal>
          <h2 style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:900, fontSize:'clamp(3.5rem,10vw,8rem)', lineHeight:.88, color:T.black, margin:'0 0 1.5rem', letterSpacing:'-.03em' }}>
            PRONTO PARA<br />MUDAR?
          </h2>
          <p style={{ fontWeight:300, color:'rgba(6,6,6,.6)', fontSize:'1.1rem', marginBottom:'3rem' }}>Avaliação gratuita. Sem compromisso. Apenas resultados.</p>
          <button className="tc-mag" style={{ background:T.black, color:T.white, border:'none', padding:'1.1rem 2.5rem', fontSize:'.8rem', fontWeight:700, letterSpacing:'.18em', textTransform:'uppercase', borderRadius:2, cursor:'none', display:'inline-flex', alignItems:'center', gap:'.75rem' }}>
            <span className="tc-mag-inner" style={{ display:'flex', alignItems:'center', gap:'.75rem' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill={T.lime}><path d="M12.031 0C5.38 0 0 5.383 0 12.033c0 2.651.687 5.234 1.996 7.514L.15 24l4.607-1.815a11.968 11.968 0 0 0 7.274 2.417c6.65 0 12.03-5.383 12.03-12.035C24.06 5.383 18.681 0 12.031 0zm5.405 16.537c-.296-.148-1.758-.87-2.03-.97-.272-.102-.47-.148-.667.148-.198.297-.768.97-.94 1.168-.173.198-.346.223-.643.074-.296-.148-1.254-.462-2.39-1.464-.883-.78-1.478-1.745-1.651-2.043-.173-.296-.018-.458.13-.606.134-.133.296-.346.445-.52.148-.173.198-.296.296-.494.099-.198.05-.371-.024-.52-.074-.148-.667-1.606-.914-2.198-.241-.578-.485-.5-.667-.51h-.568c-.198 0-.52.074-.79.371-.272.296-1.038 1.013-1.038 2.47 0 1.458 1.063 2.868 1.21 3.065.149.198 2.09 3.19 5.064 4.475 2.973 1.285 2.973.856 3.516.808.544-.05 1.758-.718 2.006-1.41.247-.692.247-1.285.173-1.41-.074-.124-.272-.198-.568-.346z"/></svg>
              Falar com Thales
            </span>
          </button>
        </Reveal>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer className="tc-footer-mob" style={{ background:T.black, padding:'5rem 3rem 2.5rem', borderTop:'.5px solid rgba(255,255,255,.06)' }}>
        <div style={{ maxWidth:1400, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'3rem', marginBottom:'3rem' }}>
          <div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'2.2rem', marginBottom:'.5rem' }}>THALES COELHO PT</div>
            <p style={{ color:'rgba(242,242,242,.3)', fontWeight:300, fontSize:'.85rem', lineHeight:1.7, maxWidth:260 }}>Elevando padrões. Transformando corpos. Construindo mentalidades inabaláveis.</p>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'.7rem' }}>
            {[['#sobre','Sobre'],['#valores','Valores'],['#servicos','Serviços'],['#agendar','Avaliação']].map(([href,label]) => (
              <a key={href} href={href} className="tc-navlink" style={{ color:'rgba(242,242,242,.4)', fontSize:'.75rem', fontWeight:500, letterSpacing:'.12em', textTransform:'uppercase', textDecoration:'none' }}>{label}</a>
            ))}
          </div>
          <div style={{ display:'flex', gap:'.75rem', alignItems:'flex-start' }}>
            {[
              'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 1.76-6.98 6.144-.058 1.28-.072 1.688-.072 4.948s.014 3.666.072 4.947c.2 4.358 2.618 5.922 6.98 6.143 1.28.058 1.689.072 4.947.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-1.761 6.979-6.143.059-1.281.073-1.687.073-4.947 0-3.26-.014-3.667-.072-4.948-.196-4.354-2.617-5.922-6.979-6.144-1.28-.058-1.689-.072-4.948-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
              'M12.031 0C5.38 0 0 5.383 0 12.033c0 2.651.687 5.234 1.996 7.514L.15 24l4.607-1.815a11.968 11.968 0 0 0 7.274 2.417c6.65 0 12.03-5.383 12.03-12.035C24.06 5.383 18.681 0 12.031 0zm5.405 16.537c-.296-.148-1.758-.87-2.03-.97-.272-.102-.47-.148-.667.148-.198.297-.768.97-.94 1.168-.173.198-.346.223-.643.074-.296-.148-1.254-.462-2.39-1.464-.883-.78-1.478-1.745-1.651-2.043-.173-.296-.018-.458.13-.606.134-.133.296-.346.445-.52.148-.173.198-.296.296-.494.099-.198.05-.371-.024-.52-.074-.148-.667-1.606-.914-2.198-.241-.578-.485-.5-.667-.51h-.568c-.198 0-.52.074-.79.371-.272.296-1.038 1.013-1.038 2.47 0 1.458 1.063 2.868 1.21 3.065.149.198 2.09 3.19 5.064 4.475 2.973 1.285 2.973.856 3.516.808.544-.05 1.758-.718 2.006-1.41.247-.692.247-1.285.173-1.41-.074-.124-.272-.198-.568-.346z',
              'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
            ].map((d, i) => (
              <a key={i} href="#" style={{ width:38, height:38, borderRadius:'50%', border:'1px solid rgba(255,255,255,.15)', display:'flex', alignItems:'center', justifyContent:'center', textDecoration:'none', transition:'all .2s' }}
                onMouseEnter={e => { const el=e.currentTarget as HTMLElement; el.style.borderColor=T.lime; el.style.background=`${T.lime}18`; }}
                onMouseLeave={e => { const el=e.currentTarget as HTMLElement; el.style.borderColor='rgba(255,255,255,.15)'; el.style.background='transparent'; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(242,242,242,.55)"><path d={d} /></svg>
              </a>
            ))}
          </div>
        </div>
        <div style={{ maxWidth:1400, margin:'0 auto', paddingTop:'1.5rem', borderTop:'.5px solid rgba(255,255,255,.05)', display:'flex', flexWrap:'wrap', justifyContent:'space-between', gap:'1rem', fontSize:'.7rem', color:'rgba(242,242,242,.2)', fontWeight:300 }}>
          <p style={{ margin:0 }}>© 2025 Thales Coelho. Todos os direitos reservados.</p>
          <div style={{ display:'flex', gap:'1.5rem' }}>
            <a href="#" style={{ color:'inherit', textDecoration:'none' }}>Termos</a>
            <a href="#" style={{ color:'inherit', textDecoration:'none' }}>Privacidade</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
