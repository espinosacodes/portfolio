"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

export default function Preloader() {
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 1200)
    return () => window.clearTimeout(timer)
  }, [])
  return <AnimatePresence>{visible && <motion.div className="portfolio-loader" exit={{ y: "-100%" }} transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}><motion.span initial={{ y: 40 }} animate={{ y: 0 }} transition={{ duration: 0.5 }}>ESPINOSA<span>/CODES</span></motion.span><p>Loading selected work</p></motion.div>}</AnimatePresence>
}
