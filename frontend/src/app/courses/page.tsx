"use client";

import { motion } from "framer-motion";
import { BookOpen, CheckCircle, ChevronRight, PlayCircle, Layers, Filter } from "lucide-react";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import AuthGuard from "@/components/AuthGuard";

const SUBJECTS = [
  { id: "contract", title: "Contract Law", progress: 68, activeTopic: "Offer and Acceptance", color: "blue", totalCases: 42, modules: 12 },
  { id: "tort", title: "Tort Law", progress: 42, activeTopic: "Negligence Duty of Care", color: "amber", totalCases: 55, modules: 14 },
  { id: "criminal", title: "Criminal Law", progress: 15, activeTopic: "Mens Rea & Actus Reus", color: "red", totalCases: 38, modules: 10 },
  { id: "constitutional", title: "Constitutional Law", progress: 0, activeTopic: "Supremacy of the Constitution", color: "emerald", totalCases: 29, modules: 9 },
  { id: "property", title: "Property Law", progress: 0, activeTopic: "Land Tenure System", color: "purple", totalCases: 61, modules: 15 },
  { id: "evidence", title: "Law of Evidence", progress: 0, activeTopic: "Relevancy & Admissibility", color: "indigo", totalCases: 48, modules: 11 },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export default function CourseHub() {
  const [activeTab, setActiveTab] = useState("all");
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch(`${API_URL}/courses`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setSubjects(data);
          } else {
            setSubjects(SUBJECTS);
          }
        } else {
          setSubjects(SUBJECTS);
        }
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
        setSubjects(SUBJECTS);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Study Hub</h1>
            <p className="text-muted-foreground mt-2 text-lg">Master the Nigerian curriculum, one case at a time.</p>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === 'all' ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900' : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800'}`}
            >
              All Subjects
            </button>
            <button 
              onClick={() => setActiveTab('active')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === 'active' ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900' : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800'}`}
            >
              In Progress
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
             <div className="col-span-full flex justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
             </div>
          ) : subjects.filter(s => activeTab === 'all' || (s.progress || 0) > 0).map((subject, i) => (
            <motion.div 
              key={subject.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:shadow-lg transition-all group cursor-pointer flex flex-col"
            >
              {/* Card Header Colored Banner */}
              <div className={`h-24 bg-${subject.color || 'blue'}-600/10 dark:bg-${subject.color || 'blue'}-500/10 relative overflow-hidden flex items-center px-6`}>
                <Layers className={`absolute -right-6 -bottom-6 w-32 h-32 text-${subject.color || 'blue'}-600/10 dark:text-${subject.color || 'blue'}-500/10 rotate-12 group-hover:rotate-6 transition-transform`} />
                <h3 className="text-xl font-bold tracking-tight">{subject.title}</h3>
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
                    <>Resume Learning <PlayCircle className="w-4 h-4" /></>
                  ) : (
                    <>Start Course <ChevronRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
    </AuthGuard>
  );
}
