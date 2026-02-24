"use client";

import { motion } from "framer-motion";
import {
  Search,
  BookOpen,
  Brain,
  Clock,
  ChevronRight,
  Award,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export default function Dashboard() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestCases = async () => {
      try {
        const response = await fetch(`${API_URL}/cases`);
        if (response.ok) {
          const data = await response.json();
          setCases(data || []);
        }
      } catch (error) {
        console.error("Dashboard failed to fetch cases:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestCases();
  }, []);
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 selection:bg-blue-600 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container px-4 h-16 max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">LexAfrica</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="/" className="text-blue-600">
              Dashboard
            </Link>
            <Link
              href="/library"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Case Library
            </Link>
            <Link
              href="/courses"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Courses
            </Link>
            <Link
              href="/prep"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Exam Prep
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <button className="relative w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center overflow-hidden border border-neutral-300 dark:border-neutral-700">
              {/* Placeholder user avatar */}
              <span className="text-sm font-medium">TA</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-7xl mx-auto px-4 py-8 md:py-12 flex flex-col gap-10">
        {/* Welcome Section */}
        <section className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-extrabold tracking-tight"
            >
              Good morning, Tunde{" "}
              <span className="text-xl inline-block origin-bottom-right hover:rotate-12 transition-transform cursor-pointer">
                👋
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground mt-2 text-lg"
            >
              Bar exam prep mode active. You're 32 days away from finals.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-blue-600 text-white rounded-2xl p-5 shadow-lg shadow-blue-600/20 flex items-center gap-4 w-full md:w-auto"
          >
            <div className="bg-white/20 p-3 rounded-xl border border-white/10">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-semibold text-lg">7 Day Streak!</p>
              <p className="text-blue-100 text-sm">Keep up the momentum</p>
            </div>
          </motion.div>
        </section>

        {/* Global Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative max-w-3xl w-full group"
        >
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-muted-foreground group-focus-within:text-blue-600 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search cases, AI summaries, statutes, or courses..."
            className="w-full h-16 pl-14 pr-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-lg placeholder:text-neutral-400"
          />
          <div className="absolute inset-y-0 right-3 flex items-center">
            <kbd className="hidden sm:inline-flex h-8 items-center gap-1 rounded bg-muted px-2.5 font-sans text-xs font-semibold text-muted-foreground border border-neutral-200 dark:border-neutral-800">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Active Courses */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-600" /> Currently Studying
                </h2>
                <Link
                  href="/courses"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center"
                >
                  View all <ChevronRight className="w-4 h-4 ml-0.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    title: "Contract Law",
                    progress: 68,
                    topic: "Offer and Acceptance",
                    color: "blue",
                  },
                  {
                    title: "Tort Law",
                    progress: 42,
                    topic: "Negligence Duty of Care",
                    color: "amber",
                  },
                ].map((course, i) => (
                  <motion.div
                    key={course.title}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 hover:border-blue-500/50 hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {course.title}
                        </h3>
                        <p className="text-muted-foreground text-sm flex items-center gap-1.5 mt-1">
                          <BookOpen className="w-3.5 h-3.5" /> {course.topic}
                        </p>
                      </div>
                      <span
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-${course.color}-100 text-${course.color}-700 dark:bg-${course.color}-900/30 dark:text-${course.color}-400 group-hover:bg-${course.color}-600 group-hover:text-white transition-colors`}
                      >
                        {course.progress}%
                      </span>
                    </div>

                    <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-2 mb-4 overflow-hidden">
                      <div
                        className={`bg-${course.color}-600 h-2 rounded-full transition-all group-hover:bg-${course.color}-500`}
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>

                    <button className="w-full py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-sm font-semibold hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
                      Resume standard
                    </button>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Recent Cases */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" /> Recent Cases & AI
                  Summaries
                </h2>
              </div>
              <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
                {loading ? (
                   <div className="p-8 flex justify-center">
                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                   </div>
                ) : cases.slice(0, 3).map((item, i) => (
                  <div
                    key={i}
                    className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer transition-colors ${i < 2 ? "border-b border-neutral-200 dark:border-neutral-800" : ""}`}
                  >
                    <div>
                      <h3 className="font-semibold text-lg text-blue-600">
                        {item.title} {item.year ? `[${item.year}]` : ''}
                      </h3>
                      <p className="text-muted-foreground mt-1 text-sm">
                        {item.court || "Court"}
                      </p>
                      <div className="flex gap-2 mt-3">
                        {(item.tags || ["Legal"]).map((tag: any) => (
                          <span
                            key={tag}
                            className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button className="shrink-0 flex items-center justify-center p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="flex flex-col gap-8">
            {/* Study Routine Calendar (Placeholder UI) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm"
            >
              <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                <Clock className="w-5 h-5 text-blue-600" /> Revision Planner
              </h2>

              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50 dark:bg-blue-900/10 dark:border-blue-900/30">
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
                    Today's Focus
                  </p>
                  <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">
                    Criminal Law Mock Test
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    2 hours • 60 MCQs, 2 Essays
                  </p>
                  <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors">
                    Start Test
                  </button>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 opacity-60">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Tomorrow
                  </p>
                  <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                    Review Flashcards
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Contract Law • Offer & Acceptance
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Community Leaderboard */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm"
            >
              <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                <Award className="w-5 h-5 text-amber-500" /> Community Top
                Contributors
              </h2>

              <div className="space-y-4">
                {[
                  { name: "Chioma N.", points: 1250, role: "UniLag Law" },
                  { name: "Amina Y.", points: 980, role: "ABU Zaria" },
                  { name: "You", points: 450, role: "UI Law", isUser: true },
                ].map((user, i) => (
                  <div
                    key={user.name}
                    className={`flex items-center justify-between p-3 rounded-xl ${user.isUser ? "bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 border" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 text-center font-bold ${i === 0 ? "text-amber-500" : i === 1 ? "text-neutral-400" : "text-amber-700"}`}
                      >
                        #{i + 1}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{user.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {user.role}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-sm text-blue-600">
                      {user.points} pts
                    </span>
                  </div>
                ))}
              </div>

              <button className="mt-6 w-full py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                Upload Notes
              </button>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
