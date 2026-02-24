"use client";

import { motion } from "framer-motion";
import { Search, Filter, BookOpen, ChevronRight, Bookmark } from "lucide-react";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import AuthGuard from "@/components/AuthGuard";

const MOCK_CASES = [
  { id: "1", title: "Donoghue v Stevenson", year: 1932, court: "House of Lords", tags: ["Tort", "Negligence"], excerpt: "Established the modern concept of negligence and the neighbour principle." },
  { id: "2", title: "Carlill v Carbolic Smoke Ball Co", year: 1893, court: "Court of Appeal", tags: ["Contract", "Offer"], excerpt: "Held that an advertisement containing certain terms to get a reward constituted a binding unilateral offer." },
  { id: "3", title: "Uwaifo v Uwaifo", year: 2013, court: "Supreme Court", tags: ["Family", "Property"], excerpt: "Clarified the equitable principles around family property and inheritance rights." },
  { id: "4", title: "Awolowo v Federal Minister of Internal Affairs", year: 1962, court: "High Court", tags: ["Constitutional", "Rights"], excerpt: "Landmark case on the right to legal representation of one's choice under the Nigerian Constitution." }
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export default function CaseLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCases = async () => {
    setLoading(true);
    try {
      let url = `${API_URL}/cases?`;
      if (searchQuery) url += `q=${encodeURIComponent(searchQuery)}&`;
      if (selectedTopics.length > 0) {
        url += `law_category=${encodeURIComponent(selectedTopics[0])}&`;
      }
      if (selectedDifficulty.length > 0) {
        url += `difficulty=${encodeURIComponent(selectedDifficulty[0])}&`;
      }
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setCases(data || []);
      } else {
        setCases(MOCK_CASES);
      }
    } catch (error) {
      console.error("Failed to fetch cases:", error);
      setCases(MOCK_CASES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchCases();
    }, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, selectedTopics, selectedDifficulty]);

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev => 
      prev.includes(topic) ? prev.filter(t => t !== topic) : [topic] // Toggle and keep only one for now based on API
    );
  };

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
            <Link href="/library" className="text-blue-600">Case Library</Link>
            <Link href="/courses" className="text-muted-foreground hover:text-foreground transition-colors">Courses</Link>
          </nav>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0 space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Filter className="w-4 h-4 text-blue-600" /> Filters
            </h3>
            
            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium mb-2 block text-muted-foreground uppercase tracking-wide">Area of Law</label>
                <div className="space-y-1.5">
                  {[
                    "Constitutional Law",
                    "Criminal Law",
                    "Law of Contract",
                    "Law of Tort",
                    "Land Law",
                    "Administrative Law",
                    "Family Law",
                    "Company Law",
                    "Commercial Law",
                    "Law of Evidence",
                    "Equity and Trusts",
                    "International Law",
                    "Islamic/Sharia Law",
                    "Legal Methods",
                    "Jurisprudence",
                  ].map(subj => (
                    <label key={subj} className="flex items-center gap-2 text-sm cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={selectedTopics.includes(subj)}
                        onChange={() => toggleTopic(subj)}
                        className="rounded border-neutral-300 text-blue-600 focus:ring-blue-600 accent-blue-600" 
                      />
                      <span className={selectedTopics.includes(subj) ? "text-blue-600 font-medium" : "text-neutral-700 dark:text-neutral-300"}>
                        {subj}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block text-muted-foreground uppercase tracking-wide">Difficulty</label>
                <div className="space-y-1.5">
                  {["Beginner", "Intermediate", "Advanced"].map(level => (
                    <label key={level} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={selectedDifficulty.includes(level)}
                        onChange={() => setSelectedDifficulty(prev => prev.includes(level) ? prev.filter(d => d !== level) : [...prev, level])}
                        className="rounded border-neutral-300 accent-blue-600"
                      />
                      <span className={`${level === 'Beginner' ? 'text-green-600' : level === 'Advanced' ? 'text-red-500' : 'text-amber-600'}`}>{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block text-muted-foreground uppercase tracking-wide">Jurisdiction</label>
                <div className="space-y-1.5">
                  {["Nigeria", "UK (Applied in Nigeria)", "International"].map(j => (
                    <label key={j} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" className="rounded border-neutral-300 accent-blue-600" />
                      <span className="text-neutral-700 dark:text-neutral-300">{j}</span>
                    </label>
                  ))}
                </div>
              </div>

              {(selectedTopics.length > 0 || selectedDifficulty.length > 0) && (
                <button
                  onClick={() => { setSelectedTopics([]); setSelectedDifficulty([]); }}
                  className="w-full text-sm text-blue-600 hover:underline text-left"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* Main Case List */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-extrabold tracking-tight">Case Law Library</h1>
            <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400 text-xs font-semibold px-2.5 py-1 rounded-full">
              {loading ? "..." : `${cases.length} Cases`}
            </span>
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-blue-600 transition-colors" />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword, case title, or judge..." 
              className="w-full h-14 pl-12 pr-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-base placeholder:text-neutral-400"
            />
          </div>

          <div className="space-y-4">
            {loading ? (
               <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
               </div>
            ) : cases.map((item, i) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 hover:border-blue-500/50 hover:shadow-md transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-start justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-bold text-blue-600 group-hover:underline">{item.title} {item.year ? `[${item.year}]` : ''}</h2>
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                      {item.court || 'Court'}
                    </span>
                  </div>
                  
                  <p className="text-neutral-700 dark:text-neutral-300 text-sm mb-4 leading-relaxed line-clamp-2">
                    <span className="font-semibold text-neutral-900 dark:text-white mr-1">AI Summary:</span> 
                    {item.summary || item.excerpt || 'No summary available.'}
                  </p>

                  <div className="flex gap-2">
                    {item.topic && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400">
                        {item.topic}
                      </span>
                    )}
                    {(item.tags || []).map((tag: any) => (
                      <span key={tag} className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400">
                        {tag}
                      </span>
                    ))}
                    {item.difficulty && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400">
                        {item.difficulty}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex sm:flex-col gap-2 shrink-0">
                  <button className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:border-blue-900 transition-colors tooltip" title="Save to Library">
                    <Bookmark className="w-5 h-5" />
                  </button>
                  <button className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 flex items-center justify-center transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </main>
    </div>
    </AuthGuard>
  );
}
