"use client";

import { motion } from "framer-motion";
import { BookOpen, CheckCircle, ChevronRight, PlayCircle, Layers, Filter, GraduationCap, ClipboardList, Clock } from "lucide-react";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import AuthGuard from "@/components/AuthGuard";

const SUBJECTS = [
  { id: "civil", title: "Civil Law", type: "Civil Law", progress: 68, activeTopic: "Law of Torts", color: "blue", totalCases: 142, modules: 12 },
  { id: "common_islamic", title: "Common & Islamic Law", type: "Mixed", progress: 42, activeTopic: "Principles of Equity", color: "emerald", totalCases: 85, modules: 14 },
  { id: "intl_juris", title: "Int'l Law & Jurisprudence", type: "International", progress: 15, activeTopic: "Sources of Int'l Law", color: "indigo", totalCases: 58, modules: 10 },
  { id: "islamic", title: "Islamic / Sharia Law", type: "Islamic Law", progress: 0, activeTopic: "Sources of Sharia", color: "emerald", totalCases: 69, modules: 9 },
  { id: "private", title: "Private & Islamic Law", type: "Mixed", progress: 0, activeTopic: "Family Law", color: "purple", totalCases: 61, modules: 15 },
  { id: "public_intl", title: "Public & International Law", type: "Public Law", progress: 0, activeTopic: "Human Rights", color: "red", totalCases: 78, modules: 11 },
  { id: "constitution", title: "Nigerian Constitution", type: "Constitutional", progress: 10, activeTopic: "Chapter IV: Fundamental Rights", color: "amber", totalCases: 120, modules: 8 },
  { id: "legal_methods", title: "Legal Methods", type: "General", progress: 100, activeTopic: "Completed", color: "stone", totalCases: 25, modules: 4 },
];

const MOCK_EXAMS = [
  { id: "bar_part_1", title: "Law School Bar Part 1", type: "Bar Exam", duration: "3 Hours", questions: 100, difficulty: "Hard" },
  { id: "civil_lit", title: "Civil Litigation Mock", type: "Course Exam", duration: "2 Hours", questions: 50, difficulty: "Medium" },
  { id: "corp_practice", title: "Corporate Law Practice", type: "Course Exam", duration: "2 Hours", questions: 50, difficulty: "Hard" },
  { id: "jurisprudence", title: "Jurisprudence Test", type: "Assessment", duration: "1 Hour", questions: 30, difficulty: "Medium" }
];

const CATEGORIES = ["All", "Civil Law", "Islamic Law", "Public Law", "International", "Mixed", "Constitutional", "General"];

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export default function CourseHub() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [subjects, setSubjects] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For now we use the rich front-end SUBJECTS to fulfill the specific categories requested
    setSubjects(SUBJECTS);
    setLoading(false);
  }, []);

  const filteredSubjects = subjects.filter(s => {
    const tabMatch = activeTab === 'all' || activeTab === 'exam-prep' || (activeTab === 'active' && (s.progress || 0) > 0);
    const categoryMatch = selectedCategory === "All" || s.type === selectedCategory;
    return tabMatch && categoryMatch;
  });

  return (
    <AuthGuard>
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container px-4 h-16 max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">LexAfrica</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
            <Link href="/library" className="text-muted-foreground hover:text-foreground transition-colors">Case Library</Link>
            <Link href="/courses" className="text-blue-600">Courses</Link>
          </nav>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Study Hub</h1>
            <p className="text-muted-foreground mt-2 text-lg">Master the Nigerian curriculum and prepare for your Bar Exams.</p>
          </div>
          
          <div className="flex bg-neutral-200/50 dark:bg-neutral-800/50 p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'all' ? 'bg-white dark:bg-neutral-950 shadow-sm' : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'}`}
            >
              All Courses
            </button>
            <button 
              onClick={() => setActiveTab('active')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'active' ? 'bg-white dark:bg-neutral-950 shadow-sm' : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'}`}
            >
              In Progress
            </button>
            <button 
              onClick={() => setActiveTab('exam-prep')}
              className={`px-4 py-2 flex items-center gap-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'exam-prep' ? 'bg-blue-600 text-white shadow-sm' : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'}`}
            >
              <GraduationCap className="w-4 h-4" /> Exam Prep
            </button>
          </div>
        </div>

        {activeTab !== 'exam-prep' && (
          <div className="flex overflow-x-auto pb-4 mb-4 gap-2 no-scrollbar">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                  selectedCategory === cat 
                    ? 'bg-neutral-900 border-neutral-900 text-white dark:bg-white dark:border-white dark:text-neutral-900' 
                    : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {loading ? (
             <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
             </div>
        ) : activeTab === 'exam-prep' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {MOCK_EXAMS.map((exam, i) => (
              <motion.div 
                key={exam.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 flex flex-col md:flex-row gap-6 hover:shadow-lg transition-all group"
              >
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl flex items-center justify-center shrink-0">
                  <ClipboardList className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">{exam.type}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">{exam.difficulty}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{exam.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400 mb-6">
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {exam.duration}</span>
                    <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4" /> {exam.questions} Questions</span>
                  </div>
                  <button className="w-full md:w-auto px-6 py-2.5 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-lg font-medium hover:opacity-90 transition-opacity">
                    Start Mock Exam
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubjects.map((subject, i) => (
              <motion.div 
                key={subject.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:shadow-lg transition-all group cursor-pointer flex flex-col"
              >
                <div className={`h-24 bg-${subject.color || 'blue'}-600/10 dark:bg-${subject.color || 'blue'}-500/10 relative overflow-hidden flex items-center px-6`}>
                  <Layers className={`absolute -right-6 -bottom-6 w-32 h-32 text-${subject.color || 'blue'}-600/10 dark:text-${subject.color || 'blue'}-500/10 rotate-12 group-hover:rotate-6 transition-transform`} />
                  <div>
                    <span className={`text-xs font-bold uppercase tracking-wider text-${subject.color || 'blue'}-700 dark:text-${subject.color || 'blue'}-400 mb-1 block`}>{subject.type}</span>
                    <h3 className="text-xl font-bold tracking-tight">{subject.title}</h3>
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                     <div className="flex items-center gap-1.5 text-sm text-neutral-600 dark:text-neutral-400">
                       <BookOpen className="w-4 h-4" /> {subject.modules || 0} Modules
                     </div>
                     <div className="flex items-center gap-1.5 text-sm text-neutral-600 dark:text-neutral-400">
                       <CheckCircle className="w-4 h-4" /> {subject.totalCases || 0} Key Cases
                     </div>
                  </div>

                  {subject.progress > 0 ? (
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                         <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 line-clamp-1 flex-1">
                           <span className="text-muted-foreground mr-1">Current:</span> 
                           {subject.activeTopic || "Getting Started"}
                         </span>
                         <span className={`text-sm font-bold text-${subject.color || 'blue'}-600 dark:text-${subject.color || 'blue'}-400 ml-3`}>
                           {subject.progress}%
                         </span>
                      </div>
                      <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-2">
                        <div className={`bg-${subject.color || 'blue'}-600 h-2 rounded-full transition-all`} style={{ width: `${subject.progress}%` }}></div>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-6 flex-1 flex items-center text-sm text-neutral-500">
                      Not started yet. Ready to begin?
                    </div>
                  )}

                  <button className={`mt-auto w-full py-3 rounded-xl flex items-center justify-center gap-2 font-semibold transition-colors ${
                    (subject.progress || 0) > 0 
                    ? 'bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200'
                    : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white'
                  }`}>
                    {(subject.progress || 0) > 0 ? (
                      subject.progress === 100 ? <>Review Course <PlayCircle className="w-4 h-4" /></> : <>Resume Learning <PlayCircle className="w-4 h-4" /></>
                    ) : (
                      <>Start Course <ChevronRight className="w-4 h-4" /></>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
    </AuthGuard>
  );
}
