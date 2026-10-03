"use client";

import Link from "next/link";
import { CourseModule } from "@/types/course";
import { CheckCircle2, Circle, BookOpen, Layers } from "lucide-react";
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
  return (
    <aside className="w-full lg:w-80 shrink-0 space-y-6">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm sticky top-20">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
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
                          ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 shadow-xs"
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
                                ? "text-indigo-600 dark:text-indigo-400"
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
