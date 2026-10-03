"use client";

import { CheckCircle2, FileQuestion, Award, Zap } from "lucide-react";

interface MetricCardsProps {
  completedTopicsCount: number;
  totalTopics: number;
  quizzesTakenCount: number;
  averageScore: number;
}

export function MetricCards({
  completedTopicsCount,
  totalTopics,
  quizzesTakenCount,
  averageScore,
}: MetricCardsProps) {
  const metrics = [
    {
      title: "Temas Completados",
      value: `${completedTopicsCount} de ${totalTopics}`,
      desc: totalTopics > 0 ? `${Math.round((completedTopicsCount / totalTopics) * 100)}% del temario base` : "0%",
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-800/40",
    },
    {
      title: "Tests Realizados",
      value: quizzesTakenCount.toString(),
      desc: "Simulacros y sesiones de práctica",
      icon: FileQuestion,
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200/60 dark:border-indigo-800/40",
    },
    {
      title: "Nota Media Oposición",
      value: averageScore > 0 ? `${averageScore.toFixed(1)} / 10` : "—",
      desc: averageScore >= 5 ? "Apto en simulacros" : "Objetivo mínimo: 5.0",
      icon: Award,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/40 border-amber-200/60 dark:border-amber-800/40",
    },
    {
      title: "Modo Alto Rendimiento",
      value: "Activo",
      desc: "Apuntes sin distracciones",
      icon: Zap,
      color: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-50 dark:bg-violet-950/40 border-violet-200/60 dark:border-violet-800/40",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m, idx) => {
        const Icon = m.icon;
        return (
          <div
            key={idx}
            className={`p-5 rounded-xl border ${m.bg} flex items-start justify-between transition-transform duration-200 hover:-translate-y-0.5`}
          >
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
                {m.title}
              </p>
              <h4 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                {m.value}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {m.desc}
              </p>
            </div>
            <div className={`p-2.5 rounded-lg bg-white dark:bg-slate-900 shadow-sm ${m.color}`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
