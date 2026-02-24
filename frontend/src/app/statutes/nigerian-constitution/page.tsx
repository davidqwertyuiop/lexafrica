"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Book, ChevronLeft, Search, Scale } from "lucide-react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export default function ConstitutionPage() {
  const [constitution, setConstitution] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConstitution = async () => {
      try {
        // We'll fetch from the new statutes table (via a generic endpoint or specifically for constitution)
        // For now, let's assume /api/statutes endpoint exists or we use a search
        const response = await fetch(`${API_URL}/cases?topic=Constitutional Law`);
        if (response.ok) {
          const data = await response.json();
          // Find the one that looks like the Constitution
          const consti = data.find((d: any) => d.title.includes("Constitution"));
          setConstitution(consti);
        }
      } catch (error) {
        console.error("Failed to fetch constitution:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchConstitution();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container px-4 h-16 max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span className="font-bold">Dashboard</span>
          </Link>
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-blue-600" />
            <h1 className="text-sm font-bold uppercase tracking-widest">Laws of Nigeria</h1>
          </div>
          <div className="w-20"></div> {/* Spacer */}
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-neutral-900 rounded-[32px] border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xl"
        >
          <div className="p-8 md:p-12 border-b border-neutral-100 dark:border-neutral-800 bg-blue-600 text-white">
            <div className="mb-6 bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center">
              <Book className="w-8 h-8" />
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4">
              Constitution of the Federal Republic of Nigeria
            </h2>
            <p className="text-blue-100 text-lg max-w-2xl">
              The supreme law of Nigeria, providing the legal foundation for the existence of the Federal Republic.
            </p>
          </div>

          <div className="p-8 md:p-12">
            {loading ? (
              <div className="py-20 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : constitution ? (
              <article className="prose dark:prose-invert max-w-none">
                <div className="bg-neutral-50 dark:bg-neutral-800/50 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 mb-8 italic text-neutral-600 dark:text-neutral-400">
                  Note: This is an AI-optimized digest of the 1999 Constitution as amended. For official use, always refer to the Federal Government Gazette.
                </div>
                
                <h3 className="text-2xl font-bold mb-4">Preamble</h3>
                <p className="text-lg leading-relaxed mb-8">
                  WE THE PEOPLE of the Federal Republic of Nigeria... Having firmly and solemnly resolved, to live in unity and harmony as one indivisible and indissoluble sovereign nation under God.
                </p>

                <h3 className="text-2xl font-bold mb-4">Excerpts & Key Sections</h3>
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-neutral-100 dark:bg-neutral-800">
                    <h4 className="font-bold text-blue-600 mb-2">Section 1: Supremacy of Constitution</h4>
                    <p className="text-sm">This Constitution is supreme and its provisions shall have binding force on all authorities and persons throughout the Federal Republic of Nigeria.</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-neutral-100 dark:bg-neutral-800">
                    <h4 className="font-bold text-blue-600 mb-2">Section 2: The Federal Republic of Nigeria</h4>
                    <p className="text-sm">Nigeria is one indivisible and indissoluble sovereign state to be known by the name of the Federal Republic of Nigeria.</p>
                  </div>
                </div>

                <div className="mt-12 p-8 rounded-3xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                  <h4 className="font-bold mb-4 flex items-center gap-2">
                    <Search className="w-5 h-5 text-blue-600" />
                    Ask LEXA about this statute
                  </h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
                    Need an explanation of Section 4 or 6? Open the chat widget below and ask "Explain the separation of powers in the Nigerian Constitution".
                  </p>
                </div>
              </article>
            ) : (
              <div className="text-center py-20">
                <p className="text-muted-foreground">The Constitution text is being transcribed from the legislative scrolls...</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 text-blue-600 font-bold hover:underline"
                >
                  Retry Loading
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
