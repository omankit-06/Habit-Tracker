"use client"

import { useEffect, useRef, useState } from "react"
import { MeshGradient, PulsingBorder } from "@paper-design/shaders-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Check, Grid, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import TextType from "@/components/ui/TextType"

const QUOTES = [
  { quote: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
  { quote: "You do not rise to the level of your goals. You fall to the level of your systems.", author: "James Clear" },
  { quote: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
  { quote: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
  { quote: "Action cures fear. Focus creates momentum.", author: "Daily Mantra" }
]

const DYNAMIC_PHRASES = [
  "Spreadsheet.",
  "Discipline.",
  "Routine.",
  "Streak OS."
]

const PIE_DATA = [
  { name: "Completed", value: 42, color: "#06b6d4" },
  { name: "Pending", value: 14, color: "#f97316" },
  { name: "Missed", value: 6, color: "#ffffff" }
]

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [quoteIdx, setQuoteIdx] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIdx((prev) => (prev + 1) % QUOTES.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div ref={containerRef} className="min-h-screen bg-black relative text-white font-sans selection:bg-cyan-500/30 antialiased overflow-x-hidden">
      {/* SVG Filters */}
      <svg className="absolute inset-0 w-0 h-0 pointer-events-none">
        <defs>
          <filter id="glass-effect" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence baseFrequency="0.005" numOctaves="1" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.3" />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0.02
                      0 1 0 0 0.02
                      0 0 1 0 0.05
                      0 0 0 0.9 0"
              result="tint"
            />
          </filter>
          <filter id="gooey-filter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="gooey"
            />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
          <filter id="logo-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
          <filter id="text-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Mesh Gradients Background - Pure Original Palette */}
      <MeshGradient
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
        colors={["#000000", "#06b6d4", "#0891b2", "#164e63", "#f97316"]}
        speed={0.3}
      />
      <MeshGradient
        className="fixed inset-0 w-full h-full opacity-50 pointer-events-none z-0"
        colors={["#000000", "#ffffff", "#06b6d4", "#f97316"]}
        speed={0.2}
      />

      {/* 1. HEADER */}
      <header className="relative z-30 flex items-center justify-between p-4 sm:p-6 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center group cursor-pointer">
          <motion.div
            className="flex items-center gap-2.5"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {/* Clean Ascend SVG Logo Icon */}
            <motion.div
              className="w-7 h-7 flex items-center justify-center group-hover:drop-shadow-[0_0_12px_rgba(6,182,212,0.8)] transition-all duration-300"
              whileHover={{ rotate: [0, -4, 4, 0] }}
            >
              <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-white group-hover:text-cyan-300 transition-colors">
                <path d="M50 18 C51.5 18 53 19.5 54.5 22.5 L82 78 C83.5 81 82.5 83 80 83 L68 83 C66.5 83 65 81.5 64 79.5 L50 49 L36 79.5 C35 81.5 33.5 83 32 83 L20 83 C17.5 83 16.5 81 18 78 L45.5 22.5 C47 19.5 48.5 18 50 18 Z" fill="currentColor"/>
              </svg>
            </motion.div>
            <span className="text-white font-black tracking-widest text-xl sm:text-2xl drop-shadow-md">
              ASSCEND
            </span>
          </motion.div>
        </Link>

        {/* Navigation */}
        <nav className="hidden sm:flex items-center space-x-2">
          <a
            href="#features"
            className="text-white/80 hover:text-white hover:bg-white/10 text-xs font-medium px-3.5 py-2 rounded-full transition-all duration-200"
          >
            Features
          </a>
          <a
            href="#methodology"
            className="text-white/80 hover:text-white hover:bg-white/10 text-xs font-medium px-3.5 py-2 rounded-full transition-all duration-200"
          >
            Methodology
          </a>
          <a
            href="#analytics"
            className="text-white/80 hover:text-white hover:bg-white/10 text-xs font-medium px-3.5 py-2 rounded-full transition-all duration-200"
          >
            Analytics
          </a>
        </nav>

        {/* Login Button Group */}
        <div id="gooey-btn" className="relative flex items-center group" style={{ filter: "url(#gooey-filter)" }}>
          <Link
            href="/dashboard"
            className="absolute right-0 px-2.5 py-2 rounded-full bg-white text-black font-normal text-xs transition-all duration-300 hover:bg-white/90 cursor-pointer h-8 flex items-center justify-center -translate-x-10 group-hover:-translate-x-19 z-0"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-2 rounded-full bg-white text-black font-semibold text-xs transition-all duration-300 hover:bg-white/90 cursor-pointer h-8 flex items-center z-10"
          >
            Log In
          </Link>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <main className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-16 text-center">
        {/* Fixed Single Row Second Line with Inline-Block Width Buffer */}
        <motion.h1
          className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="whitespace-nowrap">The Life Operating System,</span> <br />
          <span className="text-cyan-400 drop-shadow-[0_0_20px_rgba(6,182,212,0.6)] whitespace-nowrap inline-flex items-center justify-center gap-1.5">
            <span>Reimagined as a</span>
            <span className="min-w-[140px] sm:min-w-[220px] md:min-w-[280px] text-left inline-block">
              <TextType
                text={DYNAMIC_PHRASES}
                typingSpeed={70}
                deletingSpeed={40}
                pauseDuration={2200}
                loop={true}
                cursorCharacter="|"
                cursorClassName="text-orange-400 font-bold ml-0.5 animate-pulse"
                textColors={["#06b6d4", "#f97316", "#38bdf8", "#34d399", "#fb923c"]}
              />
            </span>
          </span>
        </motion.h1>

        {/* Motivational Quotes Section - Compact Width */}
        <motion.div
          className="mx-auto mt-6 max-w-xl px-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="p-4 sm:p-5 rounded-2xl bg-black/80 border border-white/20 backdrop-blur-xl shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.p
                key={quoteIdx}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.3 }}
                className="text-cyan-300 font-mono text-xs sm:text-sm italic leading-relaxed"
              >
                &ldquo;{QUOTES[quoteIdx].quote}&rdquo; —{" "}
                <span className="font-bold text-white uppercase not-italic tracking-wider text-[11px] sm:text-xs">
                  {QUOTES[quoteIdx].author}
                </span>
              </motion.p>
            </AnimatePresence>
            <p className="mt-2.5 text-xs text-white/80 font-medium leading-relaxed border-t border-white/10 pt-2.5">
              A high-precision, AI-powered grid to track habits, routines, and analytics your way.
            </p>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          className="flex items-center justify-center mt-7"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              className="px-8 sm:px-10 py-3.5 h-auto rounded-full bg-gradient-to-r from-cyan-500 to-orange-500 hover:from-cyan-400 hover:to-orange-400 text-white font-bold text-xs sm:text-sm transition-all duration-300 cursor-pointer shadow-xl hover:shadow-cyan-500/30 gap-2 border-0"
              asChild
            >
              <Link href="/dashboard">
                Start Building Free <ArrowRight className="w-4 h-4 stroke-[3]" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* 3. INTERACTIVE PIE CHART ANALYTICS PREVIEW */}
        <section id="analytics" className="relative mx-auto max-w-4xl mt-16 text-left">
          <div className="absolute -inset-4 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative rounded-2xl border border-white/20 bg-black/60 backdrop-blur-xl shadow-2xl overflow-hidden">
            {/* Top Window Bar */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-mono text-white/90 font-semibold truncate">ASSCEND — Analytics Workspace</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono text-cyan-300 bg-cyan-500/20 px-2.5 py-1 rounded border border-cyan-400/30">
                <span>● Live Analytics</span>
              </div>
            </div>

            {/* Interactive Pie Chart & Stats Grid */}
            <div className="p-6 sm:p-8 bg-black/40">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Recharts Pie Chart */}
                <div className="h-64 sm:h-72 w-full flex items-center justify-center relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={PIE_DATA}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={95}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {PIE_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="#000" strokeWidth={3} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#09090b",
                          borderColor: "#27272a",
                          borderRadius: "8px",
                          color: "#fff",
                          fontSize: "12px",
                          fontFamily: "monospace"
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Center Stat */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-black text-white">68%</span>
                    <span className="text-[10px] font-mono text-white/70 uppercase tracking-wider">Completion Rate</span>
                  </div>
                </div>

                {/* Interactive Legend & Breakdown */}
                <div className="space-y-4 font-mono">
                  <div className="text-xs text-white/80 font-semibold uppercase tracking-wider mb-2">
                    All-Time Habit Progress
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-3.5 rounded-xl border border-white/10 bg-white/5 flex items-center justify-between hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50" />
                      <span className="text-xs sm:text-sm font-semibold text-white">Completed Habits</span>
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-cyan-300">42 (68%)</span>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-3.5 rounded-xl border border-white/10 bg-white/5 flex items-center justify-between hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-orange-400 shadow-sm shadow-orange-400/50" />
                      <span className="text-xs sm:text-sm font-semibold text-white">Pending Routines</span>
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-orange-300">14 (22%)</span>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-3.5 rounded-xl border border-white/10 bg-white/5 flex items-center justify-between hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-white shadow-sm shadow-white/50" />
                      <span className="text-xs sm:text-sm font-semibold text-white">Missed Tasks</span>
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-white/90">6 (10%)</span>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. DESIGNED FOR DEEP FOCUS */}
        <section id="features" className="mx-auto max-w-4xl pt-20 pb-16 text-left sm:text-center">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Designed for Deep Focus
          </h2>
          <p className="text-xs sm:text-sm text-white/70 mt-2 max-w-xl mx-auto">
            Experience the intersection of dense information architecture and high-performance minimalism.
          </p>

          {/* 2-Column Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 text-left">
            {/* Card 1: Nothing Predefined */}
            <motion.div
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl border border-white/15 bg-black/50 backdrop-blur-md flex flex-col justify-between space-y-6 hover:bg-black/70 transition-all"
            >
              <div>
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center mb-4 border border-cyan-400/30">
                  <Grid className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Nothing Predefined</h3>
                <p className="text-xs text-white/70 mt-1 leading-relaxed">
                  Build your exact workflow. Start from a blank slate or use AI to generate structure. Every cell is a building block.
                </p>
              </div>

              {/* Graphic snippet */}
              <div className="p-3.5 rounded-xl border border-white/10 bg-black/80 font-mono text-xs space-y-2">
                <div className="grid grid-cols-4 text-white/60 font-bold border-b border-white/10 pb-1.5">
                  <div>#</div>
                  <div>Task</div>
                  <div>Status</div>
                  <div>Priority</div>
                </div>
                <div className="grid grid-cols-4 text-white/80 items-center">
                  <div className="text-white/40">1</div>
                  <div className="text-white">Morning Workout</div>
                  <div className="text-white/50">◯</div>
                  <div><span className="px-1.5 py-0.5 rounded bg-orange-500/30 text-orange-300 font-bold text-[10px]">High</span></div>
                </div>
                <div className="grid grid-cols-4 text-white/80 items-center border-t border-white/10 pt-1.5">
                  <div className="text-white/40">2</div>
                  <div className="text-white">Review PRs</div>
                  <div className="text-cyan-400 font-bold">☑</div>
                  <div><span className="px-1.5 py-0.5 rounded bg-cyan-500/30 text-cyan-300 text-[10px]">Med</span></div>
                </div>
              </div>
            </motion.div>

            {/* Card 2: Intelligent Cells */}
            <motion.div
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl border border-white/15 bg-black/50 backdrop-blur-md flex flex-col justify-between space-y-6 hover:bg-black/70 transition-all"
            >
              <div>
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-300 flex items-center justify-center mb-4 border border-orange-400/30">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Intelligent Cells</h3>
                <p className="text-xs text-white/70 mt-1 leading-relaxed">
                  Type what you want to track, and our AI structurer auto-formats the column type instantly.
                </p>
              </div>

              {/* Graphic snippet */}
              <div className="p-4 rounded-xl border border-white/10 bg-black/80 font-mono text-xs space-y-3">
                <div className="text-white/50 text-[10px] uppercase font-bold tracking-wider">/Command</div>
                <div className="flex items-center gap-2 text-white bg-white/10 px-3 py-2 rounded-lg border border-white/10">
                  <span className="text-cyan-400 font-bold">+</span>
                  <span>Track daily water intake</span>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-orange-500 text-white font-bold text-[10px]">
                    + Progress Column
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 5. YOUR LIFE, QUANTIFIED */}
        <section id="methodology" className="mx-auto max-w-4xl py-16 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Left Content */}
            <div className="space-y-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-400/30 bg-cyan-500/10 text-cyan-300 font-mono text-xs font-bold tracking-wider uppercase">
                Sheet 2: Insights
              </span>

              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                Your Life, <br />
                Quantified.
              </h2>

              <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                Instantly visualize your grid data. Toggle between raw spreadsheet views and high-level analytical dashboards powered by your inputs.
              </p>

              <div className="space-y-2.5 pt-1 text-xs font-semibold text-white/90">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-cyan-400 stroke-[3]" />
                  <span>Custom Chart Configurations</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-cyan-400 stroke-[3]" />
                  <span>Real-time Habit Correlation</span>
                </div>
              </div>
            </div>

            {/* Right Side Bar Chart Graphic */}
            <div className="p-6 sm:p-8 rounded-2xl border border-white/15 bg-black/60 backdrop-blur-md flex items-end justify-center gap-4 h-60 sm:h-64 relative overflow-hidden">
              <div className="absolute inset-0 bg-cyan-500/10 blur-3xl pointer-events-none" />

              {/* Bars */}
              <div className="w-10 sm:w-12 bg-white/20 rounded-t h-[40%] transition-all hover:bg-white/30 cursor-pointer" />
              <div className="w-10 sm:w-12 bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t h-[70%] shadow-lg shadow-cyan-500/30 transition-all hover:h-[75%] cursor-pointer" />
              <div className="w-10 sm:w-12 bg-gradient-to-t from-orange-600 to-orange-400 rounded-t h-[85%] shadow-lg shadow-orange-500/30 transition-all hover:h-[90%] cursor-pointer" />
              <div className="w-10 sm:w-12 bg-white/20 rounded-t h-[30%] transition-all hover:bg-white/30 cursor-pointer" />
              <div className="w-10 sm:w-12 bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t h-[80%] shadow-lg shadow-cyan-500/30 transition-all hover:h-[85%] cursor-pointer" />
            </div>
          </div>
        </section>
      </main>

      {/* Floating Pulsing Border Widget */}
      <div className="fixed bottom-8 right-8 z-30 pointer-events-auto">
        <div className="relative w-20 h-20 flex items-center justify-center">
          <PulsingBorder
            colors={["#06b6d4", "#0891b2", "#f97316", "#00FF88", "#FFD700", "#FF6B35", "#ffffff"]}
            colorBack="#00000000"
            speed={1.5}
            roundness={1}
            thickness={0.1}
            softness={0.2}
            intensity={5}
            spots={5}
            spotSize={0.1}
            pulse={0.1}
            smoke={0.5}
            smokeSize={4}
            scale={0.65}
            rotation={0}
            frame={9161408.251009725}
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%"
            }}
          />

          {/* Rotating Text Around the Pulsing Border */}
          <motion.svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            animate={{ rotate: 360 }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear"
            }}
            style={{ transform: "scale(1.6)" }}
          >
            <defs>
              <path id="circle" d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
            </defs>
            <text className="text-sm fill-white/80 font-medium">
              <textPath href="#circle" startOffset="0%">
                ASSCEND • Routine Workspace • ASSCEND • Life OS •
              </textPath>
            </text>
          </motion.svg>
        </div>
      </div>

      {/* 6. FOOTER */}
      <footer className="relative z-20 border-t border-white/10 py-10 bg-black/80 backdrop-blur-md text-white/60 text-xs">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
          <Link href="/" className="flex items-center gap-2 text-white font-black tracking-wider text-base">
            <div className="w-5 h-5">
              <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-white">
                <path d="M50 18 C51.5 18 53 19.5 54.5 22.5 L82 78 C83.5 81 82.5 83 80 83 L68 83 C66.5 83 65 81.5 64 79.5 L50 49 L36 79.5 C35 81.5 33.5 83 32 83 L20 83 C17.5 83 16.5 81 18 78 L45.5 22.5 C47 19.5 48.5 18 50 18 Z" fill="currentColor"/>
              </svg>
            </div>
            ASSCEND
          </Link>
          <p>© 2026 ASSCEND Life Operating Systems. Built for high-performance humans.</p>
          <div className="flex gap-6 font-semibold">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Security</a>
            <a href="#" className="hover:text-white transition-colors">API Status</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
