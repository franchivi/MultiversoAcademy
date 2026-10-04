"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getCourseById, getCourseQuestions } from "@/data/courses";
import { PracticeMode } from "@/components/quiz/PracticeMode";
import { SimulationMode } from "@/components/quiz/SimulationMode";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  Clock, 
  HelpCircle, 
  ArrowLeft, 
  Filter, 
  BookOpen 
} from "lucide-react";
import Link from "next/link";

interface QuizViewProps {
  courseId: string;
}

export function QuizView({ courseId }: QuizViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "simulation" ? "simulation" : "practice";
  const topicFilter = searchParams.get("topicId");

  const [mode, setMode] = useState<"practice" | "simulation">(initialMode);
  const course = getCourseById(courseId);
  const allQuestions = getCourseQuestions(courseId);

  // Filter if user came from a specific topic
  const questions = topicFilter
    ? allQuestions.filter((q) => q.topicId === topicFilter)
    : allQuestions;

  if (!course) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold">Curso no encontrado</h2>
        <Link href="/">
          <Button variant="default">Volver al Catálogo</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      
      {/* Top Breadcrumb & Mode Switcher */}
      <div className="space-y-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Link
            href={`/courses/${courseId}`}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-amber-500 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver al panel del curso</span>
          </Link>

          {/* Mode Switcher Tabs (Segmented Control on Mobile) */}
          <div className="grid grid-cols-2 sm:flex sm:items-center p-1 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 w-full sm:w-auto">
            <button
              onClick={() => setMode("practice")}
              className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-3.5 sm:py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === "practice"
                  ? "bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>Modo Práctica</span>
            </button>
            <button
              onClick={() => setMode("simulation")}
              className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-3.5 sm:py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === "simulation"
                  ? "bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>Modo Simulacro</span>
            </button>
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <Badge variant="indigo" className="text-[10px]">
              {course.title}
            </Badge>
            {topicFilter && (
              <Badge variant="secondary" className="text-[10px]">
                Filtrado por Tema
              </Badge>
            )}
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Banco de Preguntas Tipo Test
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
            {mode === "practice"
              ? "Responde a tu ritmo y consulta la retroalimentación jurídica inmediata extraída de NotebookLM."
              : "Simula las condiciones reales de examen con cronómetro y penalización de 0.33 puntos por fallo."}
          </p>
        </div>
      </div>

      {/* Mode Execution Area */}
      {questions.length === 0 ? (
        <div className="p-8 text-center border rounded-2xl bg-white dark:bg-slate-900 space-y-3">
          <p className="text-sm text-slate-500">No hay preguntas para este filtro.</p>
          <Link href={`/courses/${courseId}/quiz`}>
            <Button variant="outline" size="sm">Ver todas las preguntas</Button>
          </Link>
        </div>
      ) : mode === "practice" ? (
        <PracticeMode
          questions={questions}
          onFinish={() => router.push(`/courses/${courseId}`)}
        />
      ) : (
        <SimulationMode
          courseId={courseId}
          questions={questions}
          initialMinutes={130}
          onExit={() => router.push(`/courses/${courseId}`)}
        />
      )}

    </div>
  );
}
