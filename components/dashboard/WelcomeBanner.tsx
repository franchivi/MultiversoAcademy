"use client";

import Image from "next/image";
import { Sparkles, Trophy, Flame, BrainCircuit, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface WelcomeBannerProps {
  completedTopicsCount: number;
  totalTopics: number;
  averageScore: number;
}

export function WelcomeBanner({ completedTopicsCount, totalTopics, averageScore }: WelcomeBannerProps) {
  const progressPercent = totalTopics > 0 ? Math.round((completedTopicsCount / totalTopics) * 100) : 0;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#090a0f] text-white p-6 sm:p-8 lg:p-10 shadow-2xl border border-white/[0.08]">
      {/* Multiverso ambient lighting halos */}
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 -mb-16 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        
        <div className="space-y-4 max-w-2xl">
          {/* Multiverso Kicker */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="mono text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              // Convocatoria 2026 · Metodología NotebookLM
            </span>
            <span className="mono text-xs text-slate-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
              Cuerpo General Administrativo
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight text-white leading-tight">
            Cada temario es un universo. <br />
            Nosotros lo <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">sintetizamos</span>.
          </h1>
          
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Preparación intensiva de alto rendimiento sin ruido ni paja legislativa. Esquemas nemotécnicos de NotebookLM, glosario esencial de artículos y baterías de test con retroalimentación jurídica explicada.
          </p>
        </div>

        {/* Brand Hologram and Progress Widget */}
        <div className="flex sm:flex-row lg:flex-col gap-3 shrink-0">
          
          <div className="flex items-center gap-3.5 bg-white/[0.04] backdrop-blur-md rounded-xl p-4 border border-white/[0.08] min-w-[200px]">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center text-amber-400 border border-amber-500/30 shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Progreso Global</p>
              <p className="text-lg font-bold text-white font-display">
                {progressPercent}% completado
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-white/[0.04] backdrop-blur-md rounded-xl p-4 border border-white/[0.08] min-w-[200px]">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30 shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Media en Tests</p>
              <p className="text-lg font-bold text-white font-display">
                {averageScore > 0 ? `${averageScore} / 10` : "Sin intentos aún"}
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
