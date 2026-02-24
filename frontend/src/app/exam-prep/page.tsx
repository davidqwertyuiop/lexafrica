"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, CheckCircle, XCircle, ChevronRight, Award, Clock, BarChart2, Zap } from "lucide-react";
import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";

const LAW_CATEGORIES = [
  "Constitutional Law", "Criminal Law", "Law of Contract", "Law of Tort",
  "Land Law", "Law of Evidence", "Family Law", "Company Law",
  "Administrative Law", "Equity and Trusts", "Jurisprudence", "Legal Methods",
];

// Sample questions - these will come from the database in production
const SAMPLE_QUESTIONS = [
  {
    id: 1,
    question: "Which section of the 1999 Nigerian Constitution guarantees the Right to Fair Hearing?",
    options: ["Section 33", "Section 35", "Section 36", "Section 38"],
    answer: "Section 36",
    explanation: "Section 36 CFRN 1999 guarantees the right to fair hearing, including the right to be informed of charges, to defend oneself, and to be presumed innocent until proven guilty.",
    category: "Constitutional Law",
    difficulty: "Easy",
  },
  {
    id: 2,
    question: "In Donoghue v Stevenson [1932], Lord Atkin established which foundational principle?",
    options: ["The felony-murder rule", "The neighbour principle in negligence", "The doctrine of frustration", "The parol evidence rule"],
    answer: "The neighbour principle in negligence",
    explanation: "Lord Atkin established the 'neighbour principle': that you must take reasonable care to avoid acts that you can reasonably foresee would injure your neighbour (persons closely and directly affected by your actions). This forms the basis of the modern law of negligence.",
    category: "Law of Tort",
    difficulty: "Easy",
  },
  {
    id: 3,
    question: "Under the Land Use Act 1978, who has the power to grant statutory rights of occupancy in urban areas?",
    options: ["Local Government Chairman", "President of Nigeria", "Governor of the State", "Minister of Works and Housing"],
    answer: "Governor of the State",
    explanation: "Section 5 of the Land Use Act 1978 vests the power to grant statutory rights of occupancy over land in urban areas in the Governor of each State, who holds all land in trust for all Nigerians.",
    category: "Land Law",
    difficulty: "Easy",
  },
  {
    id: 4,
    question: "What is the legal doctrine established in Carlill v Carbolic Smoke Ball Co [1893] regarding advertisements?",
    options: ["Advertisements are always invitations to treat", "Advertisements can be binding unilateral offers if sufficiently certain", "Advertisements must be in writing to be binding", "Advertisements require consideration to be binding"],
    answer: "Advertisements can be binding unilateral offers if sufficiently certain",
    explanation: "The Court of Appeal held that the advertisement promising £100 was sufficiently specific and showed genuine intention to be bound (backed by a £1,000 deposit in a bank). This established that advertisements can constitute unilateral offers capable of binding acceptance by performance.",
    category: "Law of Contract",
    difficulty: "Medium",
  },
  {
    id: 5,
    question: "The principle in Rylands v Fletcher [1868] imposes what type of liability?",
    options: ["Fault-based liability", "Strict liability", "Vicarious liability", "Statutory liability"],
    answer: "Strict liability",
    explanation: "Rylands v Fletcher established the rule of strict liability: a person who accumulates on their land something likely to do mischief if it escapes must keep it at their peril. There is no need to prove fault or negligence — the escape and resultant damage is sufficient.",
    category: "Law of Tort",
    difficulty: "Medium",
  },
];

export default function ExamPrep() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [mode, setMode] = useState<"browse" | "quiz">("browse");
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const filtered = selectedCategory === "All"
    ? SAMPLE_QUESTIONS
    : SAMPLE_QUESTIONS.filter(q => q.category === selectedCategory);

  const startQuiz = () => {
    setCurrentQ(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setShowExplanation(false);
    setMode("quiz");
  };

  const handleAnswer = (option: string) => {
    if (selected) return;
    setSelected(option);
    setShowExplanation(true);
    if (option === filtered[currentQ].answer) setScore(s => s + 1);
  };

  const next = () => {
    if (currentQ + 1 >= filtered.length) {
      setFinished(true);
    } else {
      setCurrentQ(q => q + 1);
      setSelected(null);
      setShowExplanation(false);
    }
  };

  const q = filtered[currentQ];

  return (
    <AuthGuard>
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 backdrop-blur">
          <div className="container px-4 h-16 max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">LexAfrica</span>
            </Link>
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
              <Link href="/library" className="text-muted-foreground hover:text-foreground transition-colors">Case Library</Link>
              <Link href="/courses" className="text-muted-foreground hover:text-foreground transition-colors">Courses</Link>
              <Link href="/exam-prep" className="text-blue-600">Exam Prep</Link>
            </nav>
          </div>
        </header>

        <main className="container max-w-5xl mx-auto px-4 py-10">
          {mode === "browse" ? (
            <>
              <div className="mb-8">
                <h1 className="text-4xl font-extrabold tracking-tight mb-2">Exam Preparation</h1>
                <p className="text-neutral-500 dark:text-neutral-400">Practice with Nigerian Bar exam-style questions across all areas of law.</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Questions", value: SAMPLE_QUESTIONS.length, icon: <BookOpen className="w-5 h-5" />, color: "text-blue-600" },
                  { label: "Categories", value: LAW_CATEGORIES.length, icon: <BarChart2 className="w-5 h-5" />, color: "text-purple-600" },
                  { label: "Avg. Time", value: "2 min", icon: <Clock className="w-5 h-5" />, color: "text-green-600" },
                  { label: "Your Best", value: "—", icon: <Award className="w-5 h-5" />, color: "text-amber-500" },
                ].map(stat => (
                  <div key={stat.label} className="bg-white dark:bg-neutral-900 rounded-2xl p-4 border border-neutral-200 dark:border-neutral-800 flex items-center gap-3">
                    <span className={stat.color}>{stat.icon}</span>
                    <div>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-xs text-neutral-500">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 mb-6">
                {["All", ...LAW_CATEGORIES.slice(0, 8)].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                      selectedCategory === cat
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 hover:border-blue-400"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Question Cards Preview */}
              <div className="space-y-3 mb-8">
                {filtered.map((q, i) => (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200 dark:border-neutral-800 flex items-start justify-between gap-4"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{q.question}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 border border-blue-100 dark:border-blue-900">{q.category}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                          q.difficulty === "Easy" ? "bg-green-50 text-green-600 border-green-100" :
                          q.difficulty === "Medium" ? "bg-amber-50 text-amber-600 border-amber-100" :
                          "bg-red-50 text-red-500 border-red-100"
                        }`}>{q.difficulty}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-neutral-400 shrink-0 mt-0.5" />
                  </motion.div>
                ))}
              </div>

              <button
                onClick={startQuiz}
                disabled={filtered.length === 0}
                className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50"
              >
                <Zap className="w-5 h-5" />
                Start Practice Quiz ({filtered.length} questions)
              </button>
            </>
          ) : finished ? (
            /* Results */
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-6">
                <Award className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-4xl font-extrabold mb-2">{score}/{filtered.length}</h2>
              <p className="text-neutral-500 mb-2">
                {score === filtered.length ? "Perfect score! Excellent work! 🎉" :
                 score >= filtered.length * 0.7 ? "Good performance! Keep studying! 📚" :
                 "Keep practicing — you'll get there! 💪"}
              </p>
              <p className="text-sm text-neutral-400 mb-8">{Math.round((score / filtered.length) * 100)}% correct</p>
              <div className="flex gap-4 justify-center">
                <button onClick={startQuiz} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all">
                  Try Again
                </button>
                <button onClick={() => setMode("browse")} className="px-6 py-3 border border-neutral-200 dark:border-neutral-700 rounded-xl font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all">
                  Back to Browse
                </button>
              </div>
            </motion.div>
          ) : (
            /* Quiz Mode */
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm text-neutral-500">Question {currentQ + 1} of {filtered.length}</span>
                <div className="h-2 flex-1 mx-4 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                  <motion.div
                    className="h-full bg-blue-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQ + 1) / filtered.length) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-blue-600">{score} pts</span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={currentQ} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 mb-4">
                    <div className="flex gap-2 mb-4">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 border border-blue-100 dark:border-blue-900">{q.category}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                        q.difficulty === "Easy" ? "bg-green-50 text-green-600 border-green-100" :
                        q.difficulty === "Medium" ? "bg-amber-50 text-amber-600 border-amber-100" :
                        "bg-red-50 text-red-500 border-red-100"
                      }`}>{q.difficulty}</span>
                    </div>
                    <h2 className="text-lg font-semibold leading-relaxed">{q.question}</h2>
                  </div>

                  <div className="space-y-3 mb-4">
                    {q.options.map((opt) => {
                      const isCorrect = opt === q.answer;
                      const isSelected = opt === selected;
                      return (
                        <button
                          key={opt}
                          onClick={() => handleAnswer(opt)}
                          disabled={!!selected}
                          className={`w-full text-left p-4 rounded-xl border transition-all text-sm font-medium flex items-center justify-between gap-3 ${
                            !selected ? "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-blue-400 hover:bg-blue-50/50" :
                            isCorrect ? "bg-green-50 dark:bg-green-900/20 border-green-400 text-green-700 dark:text-green-400" :
                            isSelected ? "bg-red-50 dark:bg-red-900/20 border-red-400 text-red-600 dark:text-red-400" :
                            "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 opacity-50"
                          }`}
                        >
                          <span>{opt}</span>
                          {selected && isCorrect && <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />}
                          {selected && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {showExplanation && (
                    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-4">
                      <p className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-1">Explanation</p>
                      <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">{q.explanation}</p>
                    </motion.div>
                  )}

                  {selected && (
                    <button onClick={next} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
                      {currentQ + 1 >= filtered.length ? "See Results" : "Next Question"}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}
