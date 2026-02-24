"use client";

import React from "react";
import { Smartphone, Apple, PlayCircle, Download } from "lucide-react";
import { motion } from "framer-motion";

export default function AppDownload() {
  return (
    <section className="mt-12 overflow-hidden rounded-3xl bg-primary px-6 py-12 text-primary-foreground md:px-12">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
        >
          <span className="mb-4 inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wider">
            Coming Soon to Mobile
          </span>
          <h2 className="mb-6 text-3xl font-bold md:text-5xl">
            Take your legal studies <span className="text-white/70 italic">anywhere.</span>
          </h2>
          <p className="mb-8 text-lg text-white/80 max-w-md">
            LexAfrica is coming to iOS and Android. Get notified when we launch the most powerful law tutor in your pocket.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <button className="flex items-center gap-3 rounded-xl bg-white px-6 py-3 font-semibold text-primary transition-transform hover:scale-105">
              <Apple size={20} />
              <span>App Store</span>
            </button>
            <button className="flex items-center gap-3 rounded-xl border border-white/30 bg-white/10 px-6 py-3 font-semibold text-white transition-transform hover:scale-105">
              <PlayCircle size={20} />
              <span>Google Play</span>
            </button>
          </div>
        </motion.div>

        <motion.div 
          className="relative flex justify-center lg:justify-end"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="relative h-[400px] w-[200px] rounded-[40px] border-8 border-white/20 bg-black/40 p-4 shadow-2xl backdrop-blur-xl md:h-[500px] md:w-[250px]">
            <div className="absolute left-1/2 top-0 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-black"></div>
            <div className="mt-8 space-y-4 opacity-40">
              <div className="h-4 w-3/4 rounded-full bg-white/20"></div>
              <div className="h-40 w-full rounded-2xl bg-white/20"></div>
              <div className="h-4 w-full rounded-full bg-white/20"></div>
              <div className="h-4 w-5/6 rounded-full bg-white/20"></div>
            </div>
            {/* LEXA Floating Bubble in the mockup */}
            <div className="absolute bottom-12 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-white text-primary shadow-lg ring-4 ring-white/20">
              <Bot size={24} />
            </div>
          </div>
          {/* Decorative element */}
          <div className="absolute -z-10 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
        </motion.div>
      </div>
    </section>
  );
}

import { Bot } from "lucide-react";
