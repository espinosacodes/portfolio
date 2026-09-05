"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import Lenis from "lenis"
import { ArrowDown, ArrowUpRight, Github, Menu, X } from "lucide-react"
import hero from "@/public/portfolio-v2/santiago-hero.png"
import "./portfolio-v2.css"

type Project = { title: string; date: string; description: string; href: string; live?: string; kind: string }
const projects: Project[] = [
  { title: "DreamJob", date: "August, 2026", description: "A phone-first job engine with a Go service, deterministic Rust core, Flutter client, and human-gated browser agent.", href: "https://github.com/espinosacodes/dreamJob", kind: "Architecture / Agent system" },
  { title: "Catara Growth Engine", date: "June, 2026", description: "A multi-tenant LangGraph sales system connecting RAG, channels, webhooks, rate controls, and meeting conversion.", href: "https://github.com/espinosacodes/catara-growth-engine", kind: "Architecture / AI platform" },
  { title: "TalkTown", date: "April, 2026", description: "An AI language-learning RPG on Vercel, orchestrating Gemini and Groq dialogue while DynamoDB preserves the player journey.", href: "https://github.com/espinosacodes/TalkTown", live: "https://talk-town-five.vercel.app", kind: "Architecture / Live product" },
  { title: "Hackathon Reto 4", date: "June, 2026", description: "A shipped web experience built under hackathon constraints, from idea to a working public product.", href: "https://github.com/espinosacodes/hackaton-reto4", live: "https://hackaton-reto4.vercel.app", kind: "Live product / JavaScript" },
  { title: "FreeTicket", date: "August, 2026", description: "A browser-based product with a public interface and a direct path from code to user experience.", href: "https://github.com/espinosacodes/freeticket", live: "https://espinosacodes.github.io/freeticket/", kind: "Live product / JavaScript" },
]

function CustomCursor() {
  const x = useMotionValue(-80), y = useMotionValue(-80)
  const sx = useSpring(x, { stiffness: 600, damping: 42 }), sy = useSpring(y, { stiffness: 600, damping: 42 })
  const [label, setLabel] = useState("")
  useEffect(() => {
    const move = (event: PointerEvent) => {
      const hit = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement | null
      const interactive = hit?.closest("[data-cursor]") as HTMLElement | null
      const next = interactive?.dataset.cursor || ""
      setLabel(next); x.set(event.clientX - (next ? 39 : 7)); y.set(event.clientY - (next ? 39 : 7))
    }
    window.addEventListener("pointermove", move)
    return () => window.removeEventListener("pointermove", move)
  }, [x, y])
  return <motion.div className={`v2-cursor ${label ? "is-active" : ""}`} style={{ x: sx, y: sy }}>{label}</motion.div>
}

function PortraitOverlay({ locked }: { locked: boolean }) {
  return <div className={`v2-portrait-overlay ${locked ? "is-locked" : ""}`} aria-hidden="true">
    <Image className="v2-overlay-person" src={hero} alt="" fill priority sizes="(max-width: 800px) 120vw, 62vw" />
    <div className="v2-overlay-grid" />
    <svg className="v2-anatomy" viewBox="0 0 1122 1402" preserveAspectRatio="xMidYMax meet">
      <g className="v2-anatomy-muted">
        <path d="M291 280C312 130 421 53 561 53s249 77 270 227" />
        <path d="M357 320c8-124 83-213 204-213s196 89 204 213" />
        <path d="M385 307c-24 104-13 248 31 324 35 61 92 107 145 107s110-46 145-107c44-76 55-220 31-324" />
        <path d="M420 708l-18 104M702 708l18 104M402 812c48 47 101 70 159 70s111-23 159-70" />
        <path d="M561 766v566M561 870c-164 7-283 62-365 159M561 870c164 7 283 62 365 159" />
        <path d="M561 934c-125 0-217 35-274 91M561 934c125 0 217 35 274 91" />
        <path d="M561 1003c-111 0-191 31-241 78M561 1003c111 0 191 31 241 78" />
        <path d="M561 1072c-94 0-163 27-207 68M561 1072c94 0 163 27 207 68" />
        <path d="M561 1141c-77 0-134 22-170 57M561 1141c77 0 134 22 170 57" />
      </g>
      <g className="v2-anatomy-hot">
        <path d="M322 298c72-20 151-28 239-28s167 8 239 28" />
        <path d="M365 344h161l35 43 35-43h161" />
        <path d="M391 450c94 35 246 35 340 0" />
        <path d="M561 387v183l-34 33h68l-34-33" />
        <path d="M483 650c48 23 108 23 156 0" />
        <path d="M561 766v566" />
      </g>
      <g className="v2-anatomy-nodes">
        <circle cx="357" cy="320" r="8" /><circle cx="765" cy="320" r="8" />
        <circle cx="561" cy="387" r="10" /><circle cx="561" cy="766" r="9" />
        <circle cx="402" cy="812" r="8" /><circle cx="720" cy="812" r="8" />
        <circle cx="561" cy="934" r="8" /><circle cx="561" cy="1072" r="8" />
      </g>
    </svg>
    <div className="v2-overlay-data"><span>SE / BIO-SCAN</span><span>PORTRAIT LAYER 02</span></div>
    <div className="v2-reveal-contour" />
  </div>
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scanLocked, setScanLocked] = useState(false)
  const heroSection = useRef<HTMLElement>(null)
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true })
    let frame = 0
    const loop = (time: number) => { lenis.raf(time); frame = requestAnimationFrame(loop) }
    frame = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(frame); lenis.destroy() }
  }, [])
  useEffect(() => {
    const section = heroSection.current
    if (!section) return
    const move = (event: PointerEvent) => {
      section.style.setProperty("--mx", `${event.clientX / window.innerWidth - .5}`)
      section.style.setProperty("--my", `${event.clientY / window.innerHeight - .5}`)
      section.style.setProperty("--px", `${event.clientX}px`)
      section.style.setProperty("--py", `${event.clientY}px`)
      const portrait = section.querySelector<HTMLElement>(".v2-face")
      if (portrait) {
        const bounds = portrait.getBoundingClientRect()
        portrait.style.setProperty("--fx", `${event.clientX - bounds.left}px`)
        portrait.style.setProperty("--fy", `${event.clientY - bounds.top}px`)
      }
    }
    window.addEventListener("pointermove", move, { passive: true })
    return () => window.removeEventListener("pointermove", move)
  }, [])
  return <main className="v2-site">
    <CustomCursor />
    <header className="v2-header">
      <a href="#home" className="v2-name">SANTIAGO<br /><b>ESPINOSA</b></a>
      <a href="#home" className="v2-monogram">SE<span>_</span></a>
      <div className="v2-actions"><a href="#projects" className="v2-project-button">PROJECTS <ArrowUpRight /></a><button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen ? <X /> : <Menu />}</button></div>
    </header>
    {menuOpen && <nav className="v2-menu"><a href="#projects" onClick={() => setMenuOpen(false)}>Projects</a><a href="#manifesto" onClick={() => setMenuOpen(false)}>About</a><a href="https://github.com/espinosacodes" target="_blank" rel="noreferrer">GitHub</a></nav>}

    <section id="home" className="v2-hero" ref={heroSection}>
      <div className="v2-tracklines" />
      <div className="v2-orbit v2-orbit-one" />
      <div className="v2-orbit v2-orbit-two" />
      <div className="v2-tech-ring v2-tech-ring-a" /><div className="v2-tech-ring v2-tech-ring-b" />
      <div className="v2-face">
        <Image className="v2-base-person" src={hero} alt="Santiago Espinosa" fill priority sizes="(max-width: 800px) 120vw, 62vw" />
        <PortraitOverlay locked={scanLocked} />
      </div>
      <button className={`v2-lock-control ${scanLocked ? "is-locked" : ""}`} onClick={() => setScanLocked(value => !value)} aria-pressed={scanLocked} data-cursor={scanLocked ? "FREE" : "LOCK"}><span>{scanLocked ? "RELEASE SCAN" : "LOCK SCAN"}</span><i /></button>
      <div className="v2-hero-status"><i /> INTERACTIVE SYSTEM ONLINE</div>
      <div className="v2-latest"><span>LATEST BUILD</span><a href="https://github.com/espinosacodes/dreamJob" target="_blank" rel="noreferrer" data-cursor="OPEN"><div className="v2-latest-placeholder"><span>ARCH</span><i /></div><b>DreamJob</b></a></div>
      <a href="#projects" className="v2-down" aria-label="View projects"><ArrowDown /></a>
    </section>

    <section className="v2-opening" id="manifesto"><p>SOFTWARE ENGINEER<br />+ AI ENGINEER</p><h1>BUILD THE<br /><span>SYSTEM.</span><br />SHIP THE<br />EXPERIENCE.</h1><div><p>I design agents, infrastructure, and interfaces as one connected product.</p><p>Based in Colombia. Building for everywhere.</p></div></section>

    <section id="projects" className="v2-projects">
      {projects.map((project, index) => <article className={`v2-project p${index+1}`} key={project.title}>
        <div className="v2-project-date"><span>{project.title}</span><span>{project.date}</span></div>
        <a href={project.live || project.href} target="_blank" rel="noreferrer" className="v2-project-image" data-cursor={project.live ? "VISIT" : "CODE"} aria-label={`Open ${project.title}`}>
          <div className="v2-project-placeholder">
            <span>{String(index + 1).padStart(2, "0")} / ARCHITECTURE</span>
            <strong>{project.title}</strong>
            <em>DIAGRAM PLACEHOLDER</em>
            <i />
          </div>
        </a>
        <div className="v2-project-copy"><p>{project.date}</p><h2>{project.title}</h2><p>{project.description}</p><span>{project.kind}</span><div><a href={project.href} target="_blank" rel="noreferrer">Repository <ArrowUpRight /></a>{project.live && <a href={project.live} target="_blank" rel="noreferrer">Live site <ArrowUpRight /></a>}</div></div>
      </article>)}
    </section>

    <section className="v2-quote"><p>It doesn&apos;t matter where<br />you start, it&apos;s how you<br /><strong>progress</strong> from there.</p><span className="v2-signature">espinosa codes</span></section>
    <footer className="v2-footer"><h2>KEEP<br />BUILDING.</h2><div><span>© 2026 Santiago Espinosa</span><a href="https://github.com/espinosacodes" target="_blank" rel="noreferrer"><Github /> GitHub</a><span>Cali, Colombia</span></div></footer>
  </main>
}
