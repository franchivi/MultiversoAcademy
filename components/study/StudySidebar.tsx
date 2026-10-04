"use client";

import { useState } from "react";
import Link from "next/link";
import { CourseModule } from "@/types/course";
import { CheckCircle2, Circle, BookOpen, Layers, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StudySidebarProps {
  courseId: string;
  modules: CourseModule[];
  currentTopicId: string;
  completedTopicIds: string[];
}

export function StudySidebar({
  courseId,
  modules,
  currentTopicId,
  completedTopicIds,
}: StudySidebarProps) {
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  // Find active topic title
  let currentTopicTitle = "Temario";
  let currentTopicNumber = "";
  let currentTopicIndex = 0;
  let totalTopics = 0;

  modules.forEach((mod) => {
    mod.topics.forEach((t) => {
      totalTopics++;
      if (t.id === currentTopicId) {
        currentTopicTitle = t.title;
        currentTopicIndex = totalTopics;
        currentTopicNumber = `Tema ${totalTopics}`;
      }
    });
  });

  return (
    <aside className="w-full lg:w-80 shrink-0 space-y-4">
      {/* Mobile Collapsible Header Bar */}
      <div className="lg:hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <button
          onClick={() => setIsMobileExpanded(!isMobileExpanded)}
          className="w-full p-4 flex items-center justify-between text-left gap-3 bg-gradient-to-r from-amber-500/5 to-transparent hover:bg-amber-500/10 transition-colors"
          aria-expanded={isMobileExpanded}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 mono">
                  {currentTopicNumber || "Temario"} ({currentTopicIndex}/{totalTopics})
                </span>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  {completedTopicIds.length} hechos
                </Badge>
              </div>
              <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate mt-0.5">
                {currentTopicTitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 shrink-0 pl-2">
            <span>{isMobileExpanded ? "Ocultar" : "Cambiar"}</span>
            {isMobileExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
        </button>

        {/* Mobile Dropdown Content */}
        {isMobileExpanded && (
          <div className="p-4 pt-1 border-t border-slate-100 dark:border-slate-800 max-h-[60vh] overflow-y-auto space-y-5 animate-in slide-in-from-top-2 duration-200">
            {modules.map((mod) => (
              <div key={mod.id} className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block px-2">
                  {mod.title}
                </span>

                <div className="space-y-1">
                  {mod.topics.map((t) => {
                    const isActive = t.id === currentTopicId;
                    const isDone = completedTopicIds.includes(t.id);

                    return (
                      <Link
                        key={t.id}
                        href={`/courses/${courseId}/study/${t.id}`}
                        onClick={() => setIsMobileExpanded(false)}
                        className={`flex items-start gap-2.5 p-2.5 rounded-xl text-xs font-medium transition-all ${
                          isActive
                            ? "bg-amber-500/10 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-500/30 font-semibold"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Circle
                              className={`w-4 h-4 ${
                                isActive
                                  ? "text-amber-500"
                                  : "text-slate-300 dark:text-slate-600"
                              }`}
                            />
                          )}
                        </div>
                        <div className="flex-1 line-clamp-2">
                          <span className="leading-snug">{t.title}</span>
                          <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                            <span>{t.estimatedMinutes} min</span>
                            <span>&bull;</span>
                            <span className={t.difficulty === "Avanzado" ? "text-amber-500" : "text-slate-400"}>
                              {t.difficulty}
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Desktop Persistent Sticky Sidebar */}
      <div className="hidden lg:block rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm sticky top-20">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Índice de Temas
            </h3>
          </div>
          <Badge variant="secondary" className="text-[10px]">
            {completedTopicIds.length} completados
          </Badge>
        </div>

        <div className="mt-4 space-y-6 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
          {modules.map((mod) => (
            <div key={mod.id} className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block px-2">
                {mod.title}
              </span>

              <div className="space-y-1">
                {mod.topics.map((t) => {
                  const isActive = t.id === currentTopicId;
                  const isDone = completedTopicIds.includes(t.id);

                  return (
                    <Link
                      key={t.id}
                      href={`/courses/${courseId}/study/${t.id}`}
                      className={`flex items-start gap-2.5 p-2.5 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? "bg-amber-500/10 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-500/30 shadow-xs font-semibold"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Circle
                            className={`w-4 h-4 ${
                              isActive
                                ? "text-amber-500"
                                : "text-slate-300 dark:text-slate-600"
                            }`}
                          />
                        )}
                      </div>
                      <div className="flex-1 line-clamp-2">
                        <span className="leading-snug">{t.title}</span>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                          <span>{t.estimatedMinutes} min</span>
                          <span>&bull;</span>
                          <span className={t.difficulty === "Avanzado" ? "text-amber-500" : "text-slate-400"}>
                            {t.difficulty}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
