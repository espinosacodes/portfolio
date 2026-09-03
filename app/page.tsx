"use client"

import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowDownRight, ArrowUpRight, Github, MapPin, Sparkles } from "lucide-react"

const projects = [
  { name: "GhostDial", tag: "AI · Go", description: "An AI agent that calls phone menus so you never sit on hold to cancel a subscription again.", href: "https://github.com/espinosacodes/GhostDial", number: "01" },
  { name: "DreamJob", tag: "Agents · Automation", description: "A swipe-first job engine that finds roles and tailors every application with an AI agent.", href: "https://github.com/espinosacodes/dreamJob", number: "02" },
  { name: "Browser Sync", tag: "Security · Python", description: "Move browser logins and active sessions between machines with a private, local-first workflow.", href: "https://github.com/espinosacodes/browser-sync", number: "03" },
  { name: "Local LLM Longrun", tag: "Local AI · Devtools", description: "A persistent Claude Code-style coding agent for local Ollama models, built for long-running work.", href: "https://github.com/espinosacodes/local-llm-longrun", number: "04" },
  { name: "Catara Growth Engine", tag: "LangGraph · TypeScript", description: "A closed-loop AI sales agent connecting research, outreach, scheduling, and vector-powered memory.", href: "https://github.com/espinosacodes/catara-growth-engine", number: "05" },
  { name: "Cosmoscroll", tag: "Creative Dev · 3D", description: "An interactive journey through stars, galaxies, relativity, wormholes, and black holes.", href: "https://github.com/espinosacodes/cosmoscroll", number: "06" },
]

const stack = ["TypeScript", "Python", "Go", "React", "Next.js", "AI agents", "LangGraph", "Cloud"]

export default function Home() {
  const { scrollYProgress } = useScroll()
  const portraitY = useTransform(scrollYProgress, [0, 0.35], [0, 120])
  const titleX = useTransform(scrollYProgress, [0, 0.3], [0, -90])

  return (
    <main className="portfolio-shell">
      <header className="portfolio-nav">
        <a href="#top" className="wordmark" aria-label="Santiago Espinosa home">SE<span>/</span>26</a>
        <nav aria-label="Primary navigation"><a href="#work">Work</a><a href="#about">About</a><a href="https://github.com/espinosacodes" target="_blank" rel="noreferrer">GitHub</a></nav>
      </header>

      <section id="top" className="portfolio-hero">
        <div className="hero-kicker"><Sparkles size={16} /> Software engineer + AI engineer</div>
        <motion.h1 style={{ x: titleX }}>SANTIAGO<span>ESPINOSA</span></motion.h1>
        <motion.div className="portrait-frame" style={{ y: portraitY }}>
          <div className="portrait-index">001 / CO</div>
          <Image src="/pfp/santiago.jpg" alt="Santiago Espinosa" fill priority sizes="(max-width: 768px) 76vw, 36vw" />
          <div className="portrait-glow" />
        </motion.div>
        <p className="hero-intro">I build intelligent products, autonomous agents, and expressive digital experiences from Colombia to the world.</p>
        <a className="scroll-cue" href="#work"><span>Selected work</span><ArrowDownRight /></a>
        <div className="hero-coordinates"><MapPin size={14} /> In shell</div>
      </section>

      <section className="statement" id="about">
        <p className="section-label">[ Profile ]</p>
        <h2>ENGINEERING WITH<br />A <em>HUMAN</em> PULSE.</h2>
        <div className="statement-copy">
          <p>I turn ambitious ideas into real software. My work sits where AI systems, resilient engineering, and sharp product thinking meet.</p>
          <a href="https://github.com/espinosacodes" target="_blank" rel="noreferrer">63 followers · 80+ public projects <ArrowUpRight size={18} /></a>
        </div>
      </section>

      <section className="work-section" id="work">
        <div className="work-heading">
          <p className="section-label">[ Selected projects ]</p>
          <h2>BUILT TO<br /><span>SHIP.</span></h2>
          <p>A selection of agents, experiments, infrastructure, and interactive work from my open-source lab.</p>
        </div>
        <div className="project-list">
          {projects.map((project) => (
            <a key={project.name} className="project-row" href={project.href} target="_blank" rel="noreferrer">
              <span className="project-number">{project.number}</span>
              <div><p>{project.tag}</p><h3>{project.name}</h3></div>
              <p className="project-description">{project.description}</p>
              <span className="project-arrow"><ArrowUpRight /></span>
            </a>
          ))}
        </div>
      </section>

      <section className="stack-section">
        <p className="section-label">[ Toolkit ]</p>
        <div className="stack-marquee">{[...stack, ...stack].map((item, i) => <span key={`${item}-${i}`}>{item}<b>✦</b></span>)}</div>
      </section>

      <footer>
        <div className="footer-top"><p>Have a difficult idea?</p><a href="https://github.com/espinosacodes" target="_blank" rel="noreferrer">LET&apos;S BUILD IT <ArrowUpRight /></a></div>
        <div className="footer-bottom"><span>© 2026 Santiago Espinosa</span><span>Cali, Colombia</span><a href="https://github.com/espinosacodes" target="_blank" rel="noreferrer"><Github size={17} /> espinosacodes</a></div>
      </footer>
    </main>
  )
}
