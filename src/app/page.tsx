"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Table as TableIcon,
  CheckCircle2,
  Check,
  Grid,
  Zap,
  ChevronRight,
  BarChart3,
  Sliders,
  Database
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useState, useEffect } from "react";

const QUOTES = [
  { quote: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
  { quote: "You do not rise to the level of your goals. You fall to the level of your systems.", author: "James Clear" },
  { quote: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
  { quote: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
  { quote: "Action cures fear. Focus creates momentum.", author: "Daily Mantra" }
];

const PIE_DATA = [
  { name: "Completed", value: 42, color: "#10b981" },
  { name: "Pending", value: 14, color: "#06b6d4" },
  { name: "Missed", value: 6, color: "#f43f5e" }
];

export default function LandingPage() {
  const [quoteIdx, setQuoteIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIdx((prev) => (prev + 1) % QUOTES.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);
  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-emerald-500/20 antialiased overflow-x-hidden">
      
      {/* 1. HEADER */}
      <header className="sticky top-0 z-50 border-b border-zinc-900 bg-black/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link href="/" className="text-white font-black tracking-wider text-xl">
            ASCEND
          </Link>

          {/* Right Action */}
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-xs font-semibold text-zinc-400 hover:text-zinc-100 transition-colors">
              Log In
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* 2. HERO SECTION */}
        <section className="relative mx-auto max-w-5xl px-6 pt-16 sm:pt-24 pb-12 text-center">
          
          {/* Top Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/90 px-3.5 py-1 text-[11px] font-mono uppercase tracking-widest text-zinc-400 mb-8 shadow-xs"
          >
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>Daily Discipline & Routine Workspace</span>
          </motion.div>

          {/* Main Title - Smaller & Compact Font Size */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight max-w-3xl mx-auto"
          >
            The Life Operating System, <br />
            <span className="text-emerald-400">Reimagined as a Spreadsheet.</span>
          </motion.h1>

          {/* Subtitle - Always Showing Motivational Speech */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-4 max-w-xl text-xs sm:text-sm text-zinc-300 font-medium leading-relaxed"
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={quoteIdx}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.3 }}
                className="text-emerald-400/90 font-mono text-xs sm:text-sm"
              >
                &ldquo;{QUOTES[quoteIdx].quote}&rdquo; — <span className="font-bold text-white uppercase">{QUOTES[quoteIdx].author}</span>
              </motion.p>
            </AnimatePresence>
            <p className="mt-2 text-xs text-zinc-400">
              A high-precision, AI-powered grid to track habits, routines, and analytics your way.
            </p>
          </motion.div>

          {/* Single Primary Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-8 flex items-center justify-center"
          >
            <Button size="lg" className="h-12 px-8 rounded-md font-bold text-sm bg-emerald-400 hover:bg-emerald-300 text-black shadow-lg shadow-emerald-500/20 transition-all gap-2" asChild>
              <Link href="/dashboard">
                Start Building Free <ArrowRight className="w-4 h-4 stroke-[3]" />
              </Link>
            </Button>
          </motion.div>
        </section>

        {/* 3. INTERACTIVE PIE CHART ANALYTICS PREVIEW */}
        <section className="relative mx-auto max-w-5xl px-6 pb-24">
          <div className="absolute -inset-4 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="relative rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl overflow-hidden">
            {/* Top Window Bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900/80">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-mono text-zinc-300 font-semibold">ASCEND — All-Time Analytics Dashboard</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                <span>● Live Analytics</span>
              </div>
            </div>

            {/* Interactive Pie Chart & Stats Grid */}
            <div className="p-6 sm:p-8 bg-black">
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
                    <span className="text-2xl font-black text-white">68%</span>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Completion Rate</span>
                  </div>
                </div>

                {/* Interactive Legend & Breakdown */}
                <div className="space-y-4 font-mono">
                  <div className="text-xs text-zinc-400 font-semibold uppercase tracking-wider mb-2">
                    All-Time Habit Progress
                  </div>

                  <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/60 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                      <span className="text-xs font-semibold text-white">Completed Habits</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-400">42 (68%)</span>
                  </div>

                  <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/60 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-cyan-500 shadow-sm shadow-cyan-500/50" />
                      <span className="text-xs font-semibold text-white">Pending Routines</span>
                    </div>
                    <span className="text-xs font-bold text-cyan-400">14 (22%)</span>
                  </div>

                  <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/60 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
                      <span className="text-xs font-semibold text-white">Missed Tasks</span>
                    </div>
                    <span className="text-xs font-bold text-rose-400">6 (10%)</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* 4. DESIGNED FOR DEEP FOCUS */}
        <section id="features" className="mx-auto max-w-5xl px-6 py-16 border-t border-zinc-900 text-center">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Designed for Deep Focus
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-xl mx-auto">
            Experience the intersection of dense information architecture and high-performance minimalism.
          </p>

          {/* 2-Column Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 text-left">
            
            {/* Card 1: Nothing Predefined */}
            <div className="p-6 rounded-xl border border-zinc-800/80 bg-zinc-900/30 flex flex-col justify-between space-y-6">
              <div>
                <div className="w-8 h-8 rounded-md bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/20">
                  <Grid className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Nothing Predefined</h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Build your exact workflow. Start from a blank slate or use AI to generate structure. Every cell is a building block.
                </p>
              </div>

              {/* Graphic snippet */}
              <div className="p-3 rounded-lg border border-zinc-800 bg-black font-mono text-[11px] space-y-2">
                <div className="grid grid-cols-4 text-zinc-500 font-bold border-b border-zinc-800 pb-1.5">
                  <div>#</div>
                  <div>Task</div>
                  <div>Status</div>
                  <div>Priority</div>
                </div>
                <div className="grid grid-cols-4 text-zinc-300 items-center">
                  <div className="text-zinc-600">1</div>
                  <div className="text-white">Morning Workout</div>
                  <div className="text-zinc-500">◯</div>
                  <div><span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold text-[9px]">High</span></div>
                </div>
                <div className="grid grid-cols-4 text-zinc-300 items-center border-t border-zinc-800/60 pt-1.5">
                  <div className="text-zinc-600">2</div>
                  <div className="text-white">Review PRs</div>
                  <div className="text-emerald-400 font-bold">☑</div>
                  <div><span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[9px]">Med</span></div>
                </div>
              </div>
            </div>

            {/* Card 2: Intelligent Cells */}
            <div className="p-6 rounded-xl border border-zinc-800/80 bg-zinc-900/30 flex flex-col justify-between space-y-6">
              <div>
                <div className="w-8 h-8 rounded-md bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 border border-purple-500/20">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Intelligent Cells</h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Type what you want to track, and our AI structurer auto-formats the column type instantly.
                </p>
              </div>

              {/* Graphic snippet */}
              <div className="p-4 rounded-lg border border-zinc-800 bg-black font-mono text-[11px] space-y-3">
                <div className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">/Command</div>
                <div className="flex items-center gap-2 text-zinc-300 bg-zinc-900/80 px-3 py-2 rounded border border-zinc-800">
                  <span className="text-emerald-400 font-bold">+</span>
                  <span>Track daily water intake</span>
                </div>
                <div className="text-right">
                  <span className="px-2 py-1 rounded bg-emerald-500 text-black font-bold text-[10px]">
                    + Progress Column
                  </span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 5. YOUR LIFE, QUANTIFIED (BOTTOM FEATURE SECTION) */}
        <section id="methodology" className="mx-auto max-w-5xl px-6 py-20 border-t border-zinc-900">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold tracking-wider uppercase">
                Sheet 2: Insights
              </span>

              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                Your Life, <br />
                Quantified.
              </h2>

              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Instantly visualize your grid data. Toggle between raw spreadsheet views and high-level analytical dashboards powered by your inputs.
              </p>

              <div className="space-y-3 pt-2 text-xs font-semibold text-zinc-200">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                  <span>Custom Chart Configurations</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                  <span>Real-time Habit Correlation</span>
                </div>
              </div>
            </div>

            {/* Right Side Bar Chart Graphic */}
            <div className="p-8 rounded-xl border border-zinc-800 bg-zinc-950 flex items-end justify-center gap-4 h-64 relative overflow-hidden">
              <div className="absolute inset-0 bg-emerald-500/5 blur-3xl pointer-events-none" />
              
              {/* Bars */}
              <div className="w-12 bg-zinc-800 rounded-t h-[40%] transition-all" />
              <div className="w-12 bg-emerald-400 rounded-t h-[70%] shadow-lg shadow-emerald-500/30 transition-all" />
              <div className="w-12 bg-slate-300 rounded-t h-[85%] transition-all" />
              <div className="w-12 bg-zinc-800 rounded-t h-[30%] transition-all" />
              <div className="w-12 bg-emerald-400 rounded-t h-[80%] shadow-lg shadow-emerald-500/30 transition-all" />
            </div>

          </div>
        </section>
      </main>

      {/* 6. FOOTER */}
      <footer className="border-t border-zinc-900 py-10 bg-black text-zinc-500 text-xs">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
          
          {/* Left Logo */}
          <Link href="/" className="text-white font-black tracking-wider text-base">
            ASCEND
          </Link>

          {/* Center Copyright */}
          <p>© 2026 ASCEND Life Operating Systems. Built for high-performance humans.</p>

          {/* Right Links */}
          <div className="flex gap-6 font-semibold">
            <a href="#" className="hover:text-zinc-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">Security</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">API Status</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
