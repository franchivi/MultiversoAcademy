"use client";

import { StudyCallout } from "@/types/course";
import { Sparkles, HelpCircle, AlertOctagon, BrainCircuit } from "lucide-react";

export function CalloutBox({ callout }: { callout: StudyCallout }) {
  const configs = {
    key_point: {
      border: "border-indigo-200 dark:border-indigo-800/80",
      bg: "bg-indigo-50/70 dark:bg-indigo-950/30",
      titleColor: "text-indigo-900 dark:text-indigo-200",
      iconColor: "text-indigo-600 dark:text-indigo-400",
      icon: Sparkles,
      tag: "PUNTO CLAVE NOTEBOOKLM"
    },
    exam_faq: {
      border: "border-emerald-200 dark:border-emerald-800/80",
      bg: "bg-emerald-50/70 dark:bg-emerald-950/30",
      titleColor: "text-emerald-900 dark:text-emerald-200",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      icon: HelpCircle,
      tag: "PREGUNTA RECURRENTE DE EXAMEN"
    },
    trap_warning: {
      border: "border-rose-200 dark:border-rose-800/80",
      bg: "bg-rose-50/70 dark:bg-rose-950/30",
      titleColor: "text-rose-900 dark:text-rose-200",
      iconColor: "text-rose-600 dark:text-rose-400",
      icon: AlertOctagon,
      tag: "PREGUNTA TRAMPA / ALERTA OPOSITOR"
    },
    notebooklm_insight: {
      border: "border-violet-200 dark:border-violet-800/80",
      bg: "bg-violet-50/70 dark:bg-violet-950/30",
      titleColor: "text-violet-900 dark:text-violet-200",
      iconColor: "text-violet-600 dark:text-violet-400",
      icon: BrainCircuit,
      tag: "SÍNTESIS NOTEBOOKLM"
    }
  };

  const style = configs[callout.type] || configs.key_point;
  const Icon = style.icon;

  return (
    <div className={`my-6 rounded-xl border ${style.border} ${style.bg} p-5 transition-all shadow-sm`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${style.iconColor} shrink-0`} />
        <span className={`text-[11px] font-bold tracking-wider uppercase ${style.iconColor}`}>
          {style.tag}
        </span>
      </div>
      <h4 className={`text-base font-bold ${style.titleColor} mb-2 leading-snug`}>
        {callout.title}
      </h4>
      <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        {callout.content}
      </div>
    </div>
  );
}
