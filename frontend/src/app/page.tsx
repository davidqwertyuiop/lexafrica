"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  BookOpen,
  Brain,
  Clock,
  ChevronRight,
  Award,
  Zap,
  Target,
  Layers
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import AppDownload from "@/components/AppDownload";
import { useAuth } from "@/components/AuthGuard";
import { supabase } from "@/lib/supabase";
import LexaChat from "@/components/LexaChat";
import OnboardingModal from "@/components/OnboardingModal";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export default function Dashboard() {
  const { user, loading: authLoading, signOut, session } = useAuth();
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const syncAndFetchProfile = async () => {
      if (!user || !session) return;

      try {
        const response = await fetch(`${API_URL}/auth/sync`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.access_token}`
          },
          body: JSON.stringify({
            email: user.email,
            full_name: user.user_metadata?.full_name,
            avatar_url: user.user_metadata?.avatar_url,
          }),
        });

        if (response.ok) {
          const profile = await response.json();
          setUserProfile(profile);
          // If role is default or missing, show onboarding
          if (!profile.role || profile.role === 'student') {
             // We can check if it was literally just created or just check role
             // For now, let's show onboarding if it's the first time they land and role is not confirmed
             // To avoid annoying them, maybe check a 'first_time' flag or just let them re-select once
             const hasSetRole = localStorage.getItem(`lexa_role_set_${user.id}`);
             if (!hasSetRole) {
               setShowOnboarding(true);
             }
          }
        }
      } catch (error) {
        console.error("Sync failed:", error);
      }
    };

    if (user && session) {
      syncAndFetchProfile();
    }
  }, [user, session]);

  const handleRoleSelection = async (role: string) => {
     if (!user || !session) return;
     
     try {
       const response = await fetch(`${API_URL}/auth/sync`, {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
           "Authorization": `Bearer ${session.access_token}`
         },
         body: JSON.stringify({
           email: user.email,
           full_name: user.user_metadata?.full_name,
           avatar_url: user.user_metadata?.avatar_url,
           role: role
         }),
       });

       if (response.ok) {
         const profile = await response.json();
         setUserProfile(profile);
         setShowOnboarding(false);
         localStorage.setItem(`lexa_role_set_${user.id}`, 'true');
       }
     } catch (error) {
       console.error("Role update failed:", error);
     }
  };

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

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
            <Link href="/" className="text-blue-600">Dashboard</Link>
            <Link href="/library" className="text-muted-foreground hover:text-foreground transition-colors">Case Library</Link>
            <a href="https://nigerian-constitution.com/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors font-bold">Nigerian Constitution</a>
            <Link href="/courses" className="text-muted-foreground hover:text-foreground transition-colors">Courses</Link>
            <Link href="/prep" className="text-muted-foreground hover:text-foreground transition-colors">Exam Prep</Link>
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <button onClick={signOut} className="text-sm font-medium text-muted-foreground hover:text-foreground">Log Out</button>
                <div className="relative w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden border border-blue-700 text-white font-bold">
                  {user.email?.[0].toUpperCase()}
                </div>
              </div>
            ) : (
              <button 
                onClick={handleSignIn}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
              >
                Login
              </button>
            )}
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
              className="text-3xl md:text-5xl font-extrabold tracking-tight"
            >
              {user ? `Welcome back, ${user.user_metadata?.full_name?.split(' ')[0] || 'Counsel'}` : "The Future of African Law."}
              <span className="text-xl inline-block ml-2 origin-bottom-right hover:rotate-12 transition-transform cursor-pointer">
                ⚖️
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground mt-3 text-lg max-w-2xl"
            >
              {user 
                ? "Your preparation journey continues. You have 32 days left until the Bar Finals." 
                : "Accessible, AI-powered legal education for the next generation of African lawyers. Login to start your journey."}
            </motion.p>
          </div>

          {user && (
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
                <p className="font-semibold text-lg">Active Session</p>
                <p className="text-blue-100 text-sm">End-to-end encrypted session</p>
              </div>
            </motion.div>
          )}
        </section>

        {!user && (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <Brain className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="font-bold text-lg mb-2">LEXA AI Assistant</h3>
              <p className="text-muted-foreground text-sm">Deep legal analysis and case summarization powered by Gemini 1.5.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <Layers className="w-8 h-8 text-amber-600 mb-4" />
              <h3 className="font-bold text-lg mb-2">Syllabus Mastery</h3>
              <p className="text-muted-foreground text-sm">Structured study paths for Contract, Tort, Criminal Law and more.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <Award className="w-8 h-8 text-emerald-600 mb-4" />
              <h3 className="font-bold text-lg mb-2">Exam Preparation</h3>
              <p className="text-muted-foreground text-sm">Specialized practice modules designed for the Nigerian Law School.</p>
            </div>
          </section>
        )}

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
            placeholder="Search cases, AI summaries, or statutes..."
            className="w-full h-16 pl-14 pr-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-lg placeholder:text-neutral-400"
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Recent Cases */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" /> Recent Jurisprudence
                </h2>
              </div>
              <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
                {loading ? (
                   <div className="p-8 flex justify-center">
                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                   </div>
                ) : cases.length > 0 ? (
                  cases.slice(0, 5).map((item, i) => (
                    <div
                      key={i}
                      className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer transition-colors ${i < cases.length - 1 ? "border-b border-neutral-200 dark:border-neutral-800" : ""}`}
                    >
                      <div>
                        <h3 className="font-semibold text-lg text-blue-600">
                          {item.title} {item.year ? `[${item.year}]` : ''}
                        </h3>
                        <p className="text-muted-foreground mt-1 text-sm">
                          {item.court || "Supreme Court of Nigeria"}
                        </p>
                        <div className="flex gap-2 mt-3">
                           <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400">
                             {item.topic || "Jurisprudence"}
                           </span>
                        </div>
                      </div>
                      <Link href={user ? `/library/` : `/`} className="shrink-0 flex items-center justify-center p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    No cases found.
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className="flex flex-col gap-8">
             <div className="bg-neutral-900 dark:bg-blue-600 text-white p-8 rounded-3xl relative overflow-hidden">
                <Target className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 rotate-12" />
                <h3 className="text-xl font-bold mb-2">NLS 2026 Readiness</h3>
                <p className="text-neutral-400 dark:text-blue-100 text-sm mb-6">Our algorithms predict exam trends based on Supreme Court precedents from the last 10 years.</p>
                <Link href="/prep" className="block w-full py-3 rounded-xl bg-white text-black dark:text-blue-600 text-center font-bold text-sm hover:bg-neutral-100 transition-colors">
                  Try Exam Genius
                </Link>
             </div>
          </div>
        </div>

        {/* App Download Section */}
        <AppDownload />
      </main>

      {/* Floating AI Assistant */}
      <LexaChat />

      {/* Role Selection Onboarding */}
      <AnimatePresence>
        {showOnboarding && (
          <OnboardingModal onSelect={handleRoleSelection} />
        )}
      </AnimatePresence>
    </div>
  );
}
