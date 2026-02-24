"use client";

import { motion } from "framer-motion";
import { 
  Zap, 
  Target, 
  Layers, 
  Award, 
  Clock, 
  ChevronRight, 
  PlayCircle,
  Brain,
  FileText
} from "lucide-react";
import Link from 'next/link';
import { useState } from 'react';
import AuthGuard from "@/components/AuthGuard";

const PREP_MODULES = [
  { 
    id: "bar-1", 
    title: "Civil Litigation", 
    difficulty: "High", 
    estimatedTime: "45 mins",
    questions: 50,
    tags: ["Property", "Procedure"],
    description: "Master the intricacies of the High Court Rules and civil procedure in Nigerian courts."
  },
  { 
    id: "bar-2", 
    title: "Criminal Litigation", 
    difficulty: "Medium", 
    estimatedTime: "30 mins",
    questions: 30,
    tags: ["Penal Code", "ACJA"],
    description: "Deep dive into the Administration of Criminal Justice Act and prosecution protocols."
  },
  { 
    id: "bar-3", 
    title: "Corporate Law Practice", 
    difficulty: "High", 
    estimatedTime: "60 mins",
    questions: 40,
    tags: ["CAMA 2020", "CAMC"],
    description: "Complete guide to the Companies and Allied Matters Act 2020 and corporate governance."
  }
];

export default function ExamPrep() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <AuthGuard>
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container px-4 h-16 max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                <div className="bg-blue-600 p-1.5 rounded-lg">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight">LexAfrica</span>
              </Link>
            </div>
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
              <Link href="/library" className="text-muted-foreground hover:text-foreground transition-colors">Case Library</Link>
              <Link href="/courses" className="text-muted-foreground hover:text-foreground transition-colors">Courses</Link>
              <Link href="/prep" className="text-blue-600">Exam Prep</Link>
            </nav>
          </div>
        </header>

        <main className="container max-w-7xl mx-auto px-4 py-8 md:py-12">
          {/* Hero Banner */}
          <section className="relative rounded-3xl overflow-hidden mb-12 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 p-8 md:p-12">
            <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
              <Award className="w-64 h-64" />
            </div>
            
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/20 dark:bg-blue-600/10 border border-blue-600/30 text-blue-400 font-medium text-xs mb-6">
                <Zap className="w-3.5 h-3.5 fill-current" /> Nigerian Bar Exam 2026
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Precision Prep for the Next Generation of Lawyers.</h1>
              <p className="text-neutral-400 dark:text-neutral-500 text-lg mb-8">
                Adaptive practice tests, flashcards, and AI-predicted exam questions based on the latest NLS curriculum.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <button className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all shadow-lg shadow-blue-600/20">
                  Take Daily Quiz
                </button>
                <button className="px-6 py-3 rounded-xl border border-neutral-700 dark:border-neutral-200 hover:bg-neutral-800 dark:hover:bg-neutral-100 font-semibold transition-all">
                  Browse Syllabus
                </button>
              </div>
            </div>
          </section>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {[
              { icon: Target, label: "Success Rate", value: "84%", color: "blue" },
              { icon: Clock, label: "Study Time", value: "12h 30m", color: "amber" },
              { icon: Layers, label: "Modules Mastered", value: "8/15", color: "emerald" },
              { icon: FileText, label: "Mock Exams", value: "3 Completed", color: "purple" },
            ].map((stat, i) => (
              <div key={i} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6">
                <div className={`p-2.5 rounded-xl bg-${stat.color}-600/10 dark:bg-${stat.color}-500/10 w-fit mb-4`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
                <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                <p className="text-2xl font-bold mt-1 tracking-tight">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Module Grid */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Active Prep Modules</h2>
            <div className="flex gap-2">
               {["All", "Civil", "Criminal", "Corporate"].map(t => (
                 <button 
                  key={t}
                  onClick={() => setActiveTab(t.toLowerCase())}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === t.toLowerCase() ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900' : 'bg-white dark:bg-neutral-900 text-muted-foreground border border-neutral-200 dark:border-neutral-800'}`}
                 >
                   {t}
                 </button>
               ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PREP_MODULES.map((module, i) => (
              <motion.div 
                key={module.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 hover:shadow-xl transition-all cursor-pointer flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-2">
                    {module.tags.map(t => (
                      <span key={t} className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
                        {t}
                      </span>
                    ))}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${module.difficulty === 'High' ? 'text-red-500' : 'text-amber-500'}`}>
                    {module.difficulty} Priority
                  </span>
                </div>

                <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{module.title}</h3>
                <p className="text-muted-foreground text-sm mb-6 flex-1 line-clamp-2">
                  {module.description}
                </p>

                <div className="flex items-center justify-between py-4 border-y border-neutral-100 dark:border-neutral-800 mb-6 font-medium text-xs">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground" /> {module.estimatedTime}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-muted-foreground" /> {module.questions} MCQs
                  </div>
                </div>

                <button className="w-full py-3 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-600 dark:hover:bg-blue-600 dark:hover:text-white transition-all shadow-md">
                   Launch Practice <PlayCircle className="w-4 h-4 fill-current" />
                </button>
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
