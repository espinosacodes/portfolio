"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import Lenis from "lenis"
import { ArrowDown, ArrowUpRight, Github, Menu, X } from "lucide-react"
import normalHero from "@/public/portfolio-v2/santiago-hero.png"
import helmetHero from "@/public/portfolio-v2/santiago-helmet-overlay-v4.png"
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

type SprayPoint = { x: number; y: number; born: number; phase: number }
type SprayDrop = { x: number; y: number; vx: number; vy: number; born: number; life: number; radius: number }

function LiquidSpray() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")
    if (!canvas || !context || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const trail: SprayPoint[] = []
    const drops: SprayDrop[] = []
    let previous = { x: 0, y: 0, ready: false }
    let sequence = 0
    let frame = 0
    let width = 0
    let height = 0
    let dpr = 1
    const resize = () => {
      width = canvas.clientWidth
      height = canvas.clientHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const move = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect()
      const x = event.clientX - bounds.left
      const y = event.clientY - bounds.top
      if (x < 0 || y < 0 || x > bounds.width || y > bounds.height) { previous.ready = false; return }
      const now = performance.now()
      if (!previous.ready) { trail.length = 0; previous = { x, y, ready: true } }
      const dx = x - previous.x
      const dy = y - previous.y
      const distance = Math.hypot(dx, dy)
      const steps = Math.max(1, Math.min(8, Math.ceil(distance / 12)))
      for (let step = 1; step <= steps; step++) {
        const progress = step / steps
        sequence += 1
        trail.push({ x: previous.x + dx * progress, y: previous.y + dy * progress, born: now, phase: sequence * 1.73 })
      }
      if (distance > 5) {
        const speed = Math.min(distance, 42)
        const angle = Math.atan2(dy, dx)
        const normalX = -Math.sin(angle)
        const normalY = Math.cos(angle)
        const count = Math.min(5, Math.ceil(distance / 14))
        for (let index = 0; index < count; index++) {
          const side = index % 2 ? -1 : 1
          drops.push({
            x: x + normalX * side * (5 + index * 2),
            y: y + normalY * side * (5 + index * 2),
            vx: Math.cos(angle) * speed * .035 + normalX * side * (1.2 + index * .25),
            vy: Math.sin(angle) * speed * .035 + normalY * side * (1.2 + index * .25),
            born: now,
            life: 720 + index * 115,
            radius: 1.2 + index * .38,
          })
        }
      }
      if (trail.length > 110) trail.splice(0, trail.length - 110)
      if (drops.length > 130) drops.splice(0, drops.length - 130)
      previous = { x, y, ready: true }
    }
    const draw = (now: number) => {
      context.clearRect(0, 0, width, height)
      context.lineCap = "round"
      context.lineJoin = "round"
      context.globalCompositeOperation = "multiply"
      while (trail.length && now - trail[0].born > 1450) trail.shift()
      for (let index = 1; index < trail.length; index++) {
        const point = trail[index]
        const before = trail[index - 1]
        const age = Math.min(1, (now - point.born) / 1450)
        const dx = point.x - before.x
        const dy = point.y - before.y
        const length = Math.max(1, Math.hypot(dx, dy))
        const normalX = -dy / length
        const normalY = dx / length
        const zigzag = Math.sin(point.phase) * (7 + age * 13)
        const previousZigzag = Math.sin(before.phase) * (7 + age * 13)
        context.beginPath()
        context.moveTo(before.x + normalX * previousZigzag, before.y + normalY * previousZigzag)
        context.lineTo(point.x + normalX * zigzag, point.y + normalY * zigzag)
        context.strokeStyle = `rgba(255,26,77,${(1 - age) * .42})`
        context.lineWidth = .8 + (1 - age) * 2.2
        context.stroke()
        context.beginPath()
        context.moveTo(before.x - normalX * previousZigzag * .55, before.y - normalY * previousZigzag * .55)
        context.lineTo(point.x - normalX * zigzag * .55, point.y - normalY * zigzag * .55)
        context.strokeStyle = `rgba(37,41,31,${(1 - age) * .18})`
        context.lineWidth = .65 + (1 - age) * 1.15
        context.stroke()
      }
      for (let index = drops.length - 1; index >= 0; index--) {
        const drop = drops[index]
        const age = (now - drop.born) / drop.life
        if (age >= 1) { drops.splice(index, 1); continue }
        drop.x += drop.vx
        drop.y += drop.vy
        drop.vy += .012
        context.beginPath()
        context.arc(drop.x, drop.y, drop.radius * (1 - age * .35), 0, Math.PI * 2)
        context.fillStyle = `rgba(255,26,77,${(1 - age) * .38})`
        context.fill()
      }
      frame = requestAnimationFrame(draw)
    }
    resize()
    frame = requestAnimationFrame(draw)
    window.addEventListener("resize", resize)
    window.addEventListener("pointermove", move, { passive: true })
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); window.removeEventListener("pointermove", move) }
  }, [])
  return <canvas ref={canvasRef} className="v2-liquid-spray" aria-hidden="true" />
}

function HelmetPortrait({ locked }: { locked: boolean }) {
  return <div className={`v2-helmet-portrait ${locked ? "is-locked" : ""}`}>
    <Image className="v2-base-person" src={normalHero} alt="Santiago Espinosa" fill priority sizes="(max-width: 800px) 120vw, 64vw" />
    <svg className="v2-scan-shell" viewBox="0 0 1122 1402" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <g className="v2-scan-shell-main">
        <path d="M181 548C141 280 291 61 561 43c270 18 420 237 380 505" />
        <path d="M213 570c17 197 132 325 348 365 216-40 331-168 348-365" />
        <path d="M282 352c105-73 453-73 558 0l-27 273c-87 92-417 92-504 0z" />
        <path d="M561 43v83M561 935v78M181 548h95M846 548h95" />
      </g>
      <g className="v2-scan-shell-hot">
        <path d="M240 298c72-145 179-218 321-221M882 298C810 153 703 80 561 77" />
        <path d="M309 625c48 85 132 133 252 145 120-12 204-60 252-145" />
        <circle cx="181" cy="548" r="7" /><circle cx="941" cy="548" r="7" /><circle cx="561" cy="77" r="7" /><circle cx="561" cy="935" r="7" />
      </g>
    </svg>
    <div className="v2-helmet-reveal" aria-hidden="true">
      <div className="v2-helmet-media">
        <Image src={helmetHero} alt="" fill priority sizes="(max-width: 800px) 120vw, 64vw" />
        <div className="v2-helmet-fluid"><i /><i /><i /></div>
        <svg className="v2-helmet-hud" viewBox="0 0 1122 1402" preserveAspectRatio="xMidYMid meet">
          <path d="M214 433C237 207 368 83 561 78c193 5 324 129 347 355" />
          <path d="M229 654c40 196 163 308 332 312 169-4 292-116 332-312" />
          <path d="M192 511h106M824 511h106M561 50v95M561 909v96" />
          <circle cx="561" cy="514" r="405" />
          <circle cx="561" cy="514" r="8" className="v2-hud-node" />
        </svg>
        <div className="v2-helmet-data"><span>SE / H-01</span><span>LIQUID SHELL</span></div>
      </div>
    </div>
    <div className="v2-helmet-ripple" aria-hidden="true" />
  </div>
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [helmetLocked, setHelmetLocked] = useState(false)
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
    const portrait = section.querySelector<HTMLElement>(".v2-face")
    if (!portrait) return
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let lastPointerMove = Number.NEGATIVE_INFINITY
    let idleFrame = 0
    const setRevealPosition = (x: number, y: number) => {
      portrait.style.setProperty("--fx", `${x}px`)
      portrait.style.setProperty("--fy", `${y}px`)
    }
    const move = (event: PointerEvent) => {
      lastPointerMove = performance.now()
      section.classList.add("is-pointer-active")
      section.classList.remove("is-idle-flow")
      section.style.setProperty("--mx", `${event.clientX / window.innerWidth - .5}`)
      section.style.setProperty("--my", `${event.clientY / window.innerHeight - .5}`)
      section.style.setProperty("--px", `${event.clientX}px`)
      section.style.setProperty("--py", `${event.clientY}px`)
      const bounds = portrait.getBoundingClientRect()
      setRevealPosition(event.clientX - bounds.left, event.clientY - bounds.top)
    }
    const idleFlow = (time: number) => {
      if (time - lastPointerMove > 900) {
        const x = portrait.clientWidth * (.5 + Math.sin(time * .00042) * .2 + Math.sin(time * .00091) * .035)
        const y = portrait.clientHeight * (.4 + Math.cos(time * .00036) * .12 + Math.sin(time * .00073) * .035)
        setRevealPosition(x, y)
        section.classList.add("is-pointer-active", "is-idle-flow")
      }
      idleFrame = requestAnimationFrame(idleFlow)
    }
    section.classList.add("is-pointer-active")
    setRevealPosition(portrait.clientWidth * .5, portrait.clientHeight * .4)
    window.addEventListener("pointermove", move, { passive: true })
    if (!reducedMotion) idleFrame = requestAnimationFrame(idleFlow)
    return () => { cancelAnimationFrame(idleFrame); window.removeEventListener("pointermove", move) }
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
        <HelmetPortrait locked={helmetLocked} />
      </div>
      <LiquidSpray />
      <button className={`v2-lock-control ${helmetLocked ? "is-locked" : ""}`} onClick={() => setHelmetLocked(value => !value)} aria-pressed={helmetLocked} data-cursor={helmetLocked ? "FREE" : "LOCK"}><span>{helmetLocked ? "RELEASE HELMET" : "LOCK HELMET"}</span><i /></button>
      <div className="v2-hero-status"><i /> MOVE CURSOR TO REVEAL</div>
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
