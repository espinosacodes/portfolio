"use client"

import Image, { type StaticImageData } from "next/image"
import dynamic from "next/dynamic"
import { useEffect, useRef, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import Lenis from "lenis"
import { ArrowDown, ArrowUpRight, Github, Menu, X } from "lucide-react"
import hero from "@/public/portfolio-v2/santiago-hero.png"
import dreamjobDiagram from "@/public/portfolio-v2/dreamjob-cloudcraft.png"
import cataraDiagram from "@/public/portfolio-v2/catara-cloudcraft.png"
import talktownDiagram from "@/public/portfolio-v2/talktown-cloudcraft.svg"
import talktown from "@/public/portfolio-v2/talktown.png"
import hackathon from "@/public/portfolio-v2/hackathon.png"
import freeticket from "@/public/portfolio-v2/freeticket.png"
import "./portfolio-v2.css"

const ExoskeletonScene = dynamic(() => import("@/components/exoskeleton-scene"), { ssr: false })

type Project = { title: string; date: string; description: string; image: StaticImageData; livePreview?: StaticImageData; href: string; live?: string; kind: string }
const projects: Project[] = [
  { title: "DreamJob", date: "August, 2026", description: "A phone-first job engine with a Go service, deterministic Rust core, Flutter client, and human-gated browser agent.", image: dreamjobDiagram, href: "https://github.com/espinosacodes/dreamJob", kind: "Architecture / Agent system" },
  { title: "Catara Growth Engine", date: "June, 2026", description: "A multi-tenant LangGraph sales system connecting RAG, channels, webhooks, rate controls, and meeting conversion.", image: cataraDiagram, href: "https://github.com/espinosacodes/catara-growth-engine", kind: "Architecture / AI platform" },
  { title: "TalkTown", date: "April, 2026", description: "An AI language-learning RPG on Vercel, orchestrating Gemini and Groq dialogue while DynamoDB preserves the player journey.", image: talktownDiagram, livePreview: talktown, href: "https://github.com/espinosacodes/TalkTown", live: "https://talk-town-five.vercel.app", kind: "Architecture / Live product" },
  { title: "Hackathon Reto 4", date: "June, 2026", description: "A shipped web experience built under hackathon constraints, from idea to a working public product.", image: hackathon, href: "https://github.com/espinosacodes/hackaton-reto4", live: "https://hackaton-reto4.vercel.app", kind: "Live product / JavaScript" },
  { title: "FreeTicket", date: "August, 2026", description: "A browser-based product with a public interface and a direct path from code to user experience.", image: freeticket, href: "https://github.com/espinosacodes/freeticket", live: "https://espinosacodes.github.io/freeticket/", kind: "Live product / JavaScript" },
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

function LiquidTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext("2d")
    if (!context) return
    let frame = 0
    let pointer = { x: innerWidth / 2, y: innerHeight / 2 }
    const trail = Array.from({ length: 14 }, () => ({ ...pointer }))
    const resize = () => {
      const dpr = Math.min(devicePixelRatio, 2)
      canvas.width = innerWidth * dpr
      canvas.height = innerHeight * dpr
      canvas.style.width = `${innerWidth}px`
      canvas.style.height = `${innerHeight}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const move = (event: PointerEvent) => { pointer = { x: event.clientX, y: event.clientY } }
    const draw = () => {
      context.clearRect(0, 0, innerWidth, innerHeight)
      trail[0].x += (pointer.x - trail[0].x) * .2
      trail[0].y += (pointer.y - trail[0].y) * .2
      for (let i = 1; i < trail.length; i++) {
        trail[i].x += (trail[i - 1].x - trail[i].x) * (.25 - i * .006)
        trail[i].y += (trail[i - 1].y - trail[i].y) * (.25 - i * .006)
      }
      context.globalCompositeOperation = "lighter"
      trail.forEach((point, i) => {
        const radius = 26 - i * 1.35
        const gradient = context.createRadialGradient(point.x, point.y, 0, point.x, point.y, radius)
        gradient.addColorStop(0, `rgba(255,26,77,${.12 - i * .005})`)
        gradient.addColorStop(1, "rgba(255,26,77,0)")
        context.fillStyle = gradient
        context.beginPath(); context.arc(point.x, point.y, radius, 0, Math.PI * 2); context.fill()
      })
      frame = requestAnimationFrame(draw)
    }
    resize(); draw()
    window.addEventListener("resize", resize)
    window.addEventListener("pointermove", move, { passive: true })
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); window.removeEventListener("pointermove", move) }
  }, [])
  return <canvas className="v2-liquid-trail" ref={canvasRef} aria-hidden="true" />
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
      <LiquidTrail />
      <div className="v2-tracklines" />
      <div className="v2-orbit v2-orbit-one" />
      <div className="v2-orbit v2-orbit-two" />
      <div className="v2-tech-ring v2-tech-ring-a" /><div className="v2-tech-ring v2-tech-ring-b" />
      <div className="v2-face">
        <Image className="v2-base-person" src={hero} alt="Santiago Espinosa" fill priority sizes="(max-width: 800px) 120vw, 74vw" />
        <div className="v2-exo-webgl" aria-label="Interactive three-dimensional engineering exoskeleton"><ExoskeletonScene locked={helmetLocked} /></div>
      </div>
      <button className={`v2-lock-control ${helmetLocked ? "is-locked" : ""}`} onClick={() => setHelmetLocked(value => !value)} aria-pressed={helmetLocked} data-cursor={helmetLocked ? "FREE" : "LOCK"}><span>{helmetLocked ? "RELEASE EXO" : "LOCK EXO"}</span><i /></button>
      <div className="v2-hero-status"><i /> INTERACTIVE SYSTEM ONLINE</div>
      <div className="v2-latest"><span>LATEST BUILD</span><a href="https://github.com/espinosacodes/dreamJob" target="_blank" rel="noreferrer" data-cursor="OPEN"><Image src={dreamjobDiagram} alt="DreamJob system architecture" fill sizes="150px" /><b>DreamJob</b></a></div>
      <a href="#projects" className="v2-down" aria-label="View projects"><ArrowDown /></a>
    </section>

    <section className="v2-opening" id="manifesto"><p>SOFTWARE ENGINEER<br />+ AI ENGINEER</p><h1>BUILD THE<br /><span>SYSTEM.</span><br />SHIP THE<br />EXPERIENCE.</h1><div><p>I design agents, infrastructure, and interfaces as one connected product.</p><p>Based in Colombia. Building for everywhere.</p></div></section>

    <section id="projects" className="v2-projects">
      {projects.map((project, index) => <article className={`v2-project p${index+1}`} key={project.title}>
        <div className="v2-project-date"><span>{project.title}</span><span>{project.date}</span></div>
        <a href={project.live || project.href} target="_blank" rel="noreferrer" className={`v2-project-image ${project.livePreview ? "has-preview" : ""}`} data-cursor={project.live ? "VISIT" : "CODE"}><Image className="v2-primary-visual" src={project.image} alt={`${project.title}: ${project.kind}`} fill sizes="(max-width: 800px) 94vw, 76vw" />{project.livePreview && <Image className="v2-live-preview" src={project.livePreview} alt={`${project.title} live homepage`} fill sizes="(max-width: 800px) 94vw, 76vw" />}</a>
        <div className="v2-project-copy"><p>{project.date}</p><h2>{project.title}</h2><p>{project.description}</p><span>{project.kind}</span><div><a href={project.href} target="_blank" rel="noreferrer">Repository <ArrowUpRight /></a>{project.live && <a href={project.live} target="_blank" rel="noreferrer">Live site <ArrowUpRight /></a>}</div></div>
      </article>)}
    </section>

    <section className="v2-quote"><p>It doesn&apos;t matter where<br />you start, it&apos;s how you<br /><strong>progress</strong> from there.</p><span className="v2-signature">espinosa codes</span></section>
    <footer className="v2-footer"><h2>KEEP<br />BUILDING.</h2><div><span>© 2026 Santiago Espinosa</span><a href="https://github.com/espinosacodes" target="_blank" rel="noreferrer"><Github /> GitHub</a><span>Cali, Colombia</span></div></footer>
  </main>
}
