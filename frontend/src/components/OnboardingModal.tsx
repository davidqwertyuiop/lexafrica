"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, GraduationCap, Briefcase, GraduationCap as LecturerIcon, ChevronRight, Check } from "lucide-react";

interface OnboardingModalProps {
  onSelect: (role: string) => void;
}

const ROLES = [
  { id: "student", title: "Law Student", icon: GraduationCap, description: "Undergraduate or NLS aspirant." },
  { id: "graduate", title: "Recent Graduate", icon: User, description: "Awaiting call or job hunting." },
  { id: "lawyer", title: "Legal Professional", icon: Briefcase, description: "Practicing advocate or solicitor." },
  { id: "lecturer", title: "Legal Educator", icon: LecturerIcon, description: "Sharing knowledge with next gen." },
];

export default function OnboardingModal({ onSelect }: OnboardingModalProps) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-xl bg-white dark:bg-neutral-900 rounded-[32px] overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800"
      >
        <div className="p-8 md:p-12">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold tracking-tight mb-2">Identify your role.</h2>
            <p className="text-muted-foreground">This helps LEXA tailor her legal research and study tools to your specific level of expertise.</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {ROLES.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelected(role.id)}
                className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left group ${
                  selected === role.id
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                    : "border-neutral-100 dark:border-neutral-800 hover:border-blue-200 dark:hover:border-blue-800"
                }`}
              >
                <div className={`p-3 rounded-xl transition-colors ${
                  selected === role.id ? "bg-blue-600 text-white" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 group-hover:text-blue-600"
                }`}>
                  <role.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className={`font-bold ${selected === role.id ? "text-blue-700 dark:text-blue-400" : ""}`}>{role.title}</h4>
                  <p className="text-sm text-muted-foreground">{role.description}</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  selected === role.id ? "border-blue-600 bg-blue-600 text-white" : "border-neutral-200 dark:border-neutral-700"
                }`}>
                  {selected === role.id && <Check className="w-4 h-4" />}
                </div>
              </button>
            ))}
          </div>

          <button
            disabled={!selected}
            onClick={() => selected && onSelect(selected)}
            className="w-full mt-8 h-14 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50 disabled:grayscale transition-all shadow-lg shadow-blue-600/20"
          >
            Enter LexAfrica
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
