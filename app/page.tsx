"use client"

import Image, { type StaticImageData } from "next/image"
import { useEffect, useRef, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { ArrowDown, ArrowUpRight, Github, Menu, X } from "lucide-react"
import hero from "@/public/portfolio-v2/santiago-hero.png"
import dreamjobDiagram from "@/public/portfolio-v2/dreamjob-architecture.svg"
import cataraDiagram from "@/public/portfolio-v2/catara-architecture.svg"
import talktown from "@/public/portfolio-v2/talktown.png"
import hackathon from "@/public/portfolio-v2/hackathon.png"
import freeticket from "@/public/portfolio-v2/freeticket.png"
import "./portfolio-v2.css"

type Project = { title: string; date: string; description: string; image: StaticImageData; href: string; live?: string; kind: string }
const projects: Project[] = [
  { title: "DreamJob", date: "August, 2026", description: "A phone-first job engine with a Go service, deterministic Rust core, Flutter client, and human-gated browser agent.", image: dreamjobDiagram, href: "https://github.com/espinosacodes/dreamJob", kind: "Architecture / Agent system" },
  { title: "Catara Growth Engine", date: "June, 2026", description: "A multi-tenant LangGraph sales system connecting RAG, channels, webhooks, rate controls, and meeting conversion.", image: cataraDiagram, href: "https://github.com/espinosacodes/catara-growth-engine", kind: "Architecture / AI platform" },
  { title: "TalkTown", date: "April, 2026", description: "A live social experience designed around conversation, presence, and a playful real-time interface.", image: talktown, href: "https://github.com/espinosacodes/TalkTown", live: "https://talk-town-five.vercel.app", kind: "Live product / TypeScript" },
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

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)
  const heroSection = useRef<HTMLElement>(null)
  useEffect(() => {
    const section = heroSection.current
    if (!section) return
    const move = (event: PointerEvent) => {
      section.style.setProperty("--mx", `${event.clientX / window.innerWidth - .5}`)
      section.style.setProperty("--my", `${event.clientY / window.innerHeight - .5}`)
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
      <motion.div className="v2-face" initial={{ y: 70, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, delay: .2, ease: [.2,.8,.2,1] }}><Image src={hero} alt="Santiago Espinosa" fill priority sizes="(max-width: 800px) 90vw, 58vw" /></motion.div>
      <div className="v2-latest"><span>LATEST BUILD</span><a href="https://github.com/espinosacodes/dreamJob" target="_blank" rel="noreferrer" data-cursor="OPEN"><Image src={dreamjobDiagram} alt="DreamJob system architecture" fill sizes="150px" /><b>DreamJob</b></a></div>
      <a href="#projects" className="v2-down" aria-label="View projects"><ArrowDown /></a>
    </section>

    <section className="v2-opening" id="manifesto"><p>SOFTWARE ENGINEER<br />+ AI ENGINEER</p><h1>BUILD THE<br /><span>SYSTEM.</span><br />SHIP THE<br />EXPERIENCE.</h1><div><p>I design agents, infrastructure, and interfaces as one connected product.</p><p>Based in Colombia. Building for everywhere.</p></div></section>

    <section id="projects" className="v2-projects">
      {projects.map((project, index) => <article className={`v2-project p${index+1}`} key={project.title}>
        <div className="v2-project-date"><span>{project.title}</span><span>{project.date}</span></div>
        <a href={project.live || project.href} target="_blank" rel="noreferrer" className="v2-project-image" data-cursor={project.live ? "VISIT" : "CODE"}><Image src={project.image} alt={`${project.title}: ${project.kind}`} fill sizes="(max-width: 800px) 94vw, 76vw" /></a>
        <div className="v2-project-copy"><p>{project.date}</p><h2>{project.title}</h2><p>{project.description}</p><span>{project.kind}</span><div><a href={project.href} target="_blank" rel="noreferrer">Repository <ArrowUpRight /></a>{project.live && <a href={project.live} target="_blank" rel="noreferrer">Live site <ArrowUpRight /></a>}</div></div>
      </article>)}
    </section>

    <section className="v2-quote"><p>It doesn&apos;t matter where<br />you start, it&apos;s how you<br /><strong>progress</strong> from there.</p><span className="v2-signature">espinosa codes</span></section>
    <footer className="v2-footer"><h2>KEEP<br />BUILDING.</h2><div><span>© 2026 Santiago Espinosa</span><a href="https://github.com/espinosacodes" target="_blank" rel="noreferrer"><Github /> GitHub</a><span>Cali, Colombia</span></div></footer>
  </main>
}
