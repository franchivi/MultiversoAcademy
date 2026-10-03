"use client";

import { useState } from "react";
import Link from "next/link";
import { Topic } from "@/types/course";
import { saveTopicCompletion } from "@/lib/storage";
import { CalloutBox } from "./CalloutBox";
import { GlossaryDrawer } from "./GlossaryDrawer";
import { ProtocolGuideModal } from "./ProtocolGuideModal";
import { AudioOverviewPlayer } from "./AudioOverviewPlayer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  BookOpen, 
  HelpCircle, 
  ShieldAlert, 
  Scale, 
  BrainCircuit, 
  ChevronRight, 
  ChevronLeft,
  Sparkles
} from "lucide-react";

interface StudyReaderProps {
  courseId: string;
  topic: Topic;
  moduleTitle: string;
  isCompletedInitially: boolean;
  prevTopicId?: string | null;
  nextTopicId?: string | null;
  notebooklmUrl?: string;
  audioOverviewUrl?: string;
}

export function StudyReader({
  courseId,
  topic,
  moduleTitle,
  isCompletedInitially,
  prevTopicId,
  nextTopicId,
  notebooklmUrl = "https://notebook.google.com/notebook/5ddbbb1e-33f8-40ac-a5a4-8cd23037d042",
  audioOverviewUrl = "/audio/claves_cuidador.m4a",
}: StudyReaderProps) {
  const [isCompleted, setIsCompleted] = useState(isCompletedInitially);
  const [showMindsetAlerts, setShowMindsetAlerts] = useState(true);

  const toggleComplete = () => {
    const newState = !isCompleted;
    setIsCompleted(newState);
    saveTopicCompletion(courseId, topic.id, newState);
  };

  return (
    <article className="flex-1 max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Top Header Breadcrumb & Status */}
      <div className="space-y-3 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mono">
            {moduleTitle}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {notebooklmUrl && (
              <a
                href={notebooklmUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/25 hover:bg-amber-500/20 transition-all hover:scale-[1.02]"
                title="Abrir cuaderno de fuentes oficial en Google NotebookLM"
              >
                <BrainCircuit className="w-3.5 h-3.5 text-amber-500" />
                <span>Abrir en NotebookLM</span>
                <span className="text-[10px]">↗</span>
              </a>
            )}
            <ProtocolGuideModal />
            <GlossaryDrawer glossary={topic.glossary} />
            <Button
              variant={isCompleted ? "secondary" : "outline"}
              size="sm"
              onClick={toggleComplete}
              className={`gap-1.5 text-xs transition-colors ${
                isCompleted
                  ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
                  : "border-slate-300 dark:border-slate-700 hover:border-emerald-500"
              }`}
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Tema Completado</span>
                </>
              ) : (
                <>
                  <Circle className="w-4 h-4 text-slate-400" />
                  <span>Marcar como Repasado</span>
                </>
              )}
            </Button>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
          {topic.title}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          {topic.description}
        </p>

        {/* Metadata Badges */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Badge variant="secondary" className="gap-1.5 py-1 px-3">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{topic.estimatedMinutes} minutos de lectura</span>
          </Badge>

          <Badge 
            variant={topic.difficulty === "Avanzado" ? "warning" : "indigo"} 
            className="py-1 px-3"
          >
            Dificultad: {topic.difficulty}
          </Badge>

          {topic.legalReferences?.map((ref, idx) => (
            <Badge key={idx} variant="outline" className="gap-1 py-1 px-2.5 text-[11px]">
              <Scale className="w-3 h-3 text-slate-400" />
              <span>{ref}</span>
            </Badge>
          ))}
        </div>

        {/* Audio Overview Podcast from NotebookLM */}
        {audioOverviewUrl && (
          <div className="pt-2">
            <AudioOverviewPlayer audioSrc={audioOverviewUrl} />
          </div>
        )}
      </div>

      {/* Summary Highlights / Resumen Ejecutivo NotebookLM */}
      <section className="rounded-2xl border border-indigo-100 dark:border-indigo-950 bg-gradient-to-br from-indigo-50/60 via-white to-slate-50 dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-900 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-indigo-600 text-white">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-base text-indigo-950 dark:text-indigo-200">
            Resumen Ejecutivo & Puntos Clave de Examen
          </h3>
        </div>
        <ul className="space-y-2.5">
          {topic.summaryPoints.map((pt, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
              <span>{pt}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Mindset de Opositor / Alerta de Preguntas Trampa */}
      {topic.mindsets && topic.mindsets.length > 0 && (
        <section className="rounded-2xl border border-rose-200/80 dark:border-rose-900/40 bg-rose-50/50 dark:bg-rose-950/20 p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              <h3 className="font-bold text-sm uppercase tracking-wider text-rose-900 dark:text-rose-200">
                Mentalidad de Examen &quot;Evita Trampas&quot;
              </h3>
            </div>
            <button
              onClick={() => setShowMindsetAlerts(!showMindsetAlerts)}
              className="text-xs text-rose-600 dark:text-rose-400 hover:underline font-medium"
            >
              {showMindsetAlerts ? "Ocultar" : "Mostrar"}
            </button>
          </div>

          {showMindsetAlerts && (
            <div className="space-y-2.5 pt-1">
              {topic.mindsets.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 text-xs sm:text-sm text-rose-950 dark:text-rose-200 leading-relaxed bg-white/70 dark:bg-slate-900/60 p-3 rounded-xl border border-rose-200/60 dark:border-rose-900/40"
                >
                  <span className="font-bold text-rose-600 text-xs mt-0.5">⚠️</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Main Core Content Sections with Callouts */}
      <section className="space-y-10 pt-2">
        {topic.sections.map((section) => (
          <div key={section.id} className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 pb-2 border-b border-slate-100 dark:border-slate-800">
              {section.title}
            </h2>
            
            <div className="study-prose text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line text-sm sm:text-base">
              {section.content}
            </div>

            {section.callouts && section.callouts.length > 0 && (
              <div className="space-y-4 pt-2">
                {section.callouts.map((callout) => (
                  <CalloutBox key={callout.id} callout={callout} />
                ))}
              </div>
            )}
          </div>
        ))}
      </section>

      {/* Bottom Completion & Navigation Bar */}
      <div className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-6">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60">
          <div>
            <h4 className="font-bold text-sm text-indigo-950 dark:text-indigo-200">
              ¿Listo para afianzar este tema?
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Haz un test con las preguntas oficiales de examen comentadas por NotebookLM.
            </p>
          </div>
          <Link href={`/courses/${courseId}/quiz?topicId=${topic.id}`}>
            <Button variant="glow" size="sm" className="gap-2 shrink-0">
              <HelpCircle className="w-4 h-4" />
              <span>Hacer Test del Tema</span>
            </Button>
          </Link>
        </div>

        {/* Previous / Next Topic Navigator */}
        <div className="flex items-center justify-between gap-4">
          {prevTopicId ? (
            <Link href={`/courses/${courseId}/study/${prevTopicId}`}>
              <Button variant="outline" size="sm" className="gap-2">
                <ChevronLeft className="w-4 h-4" />
                <span>Tema Anterior</span>
              </Button>
            </Link>
          ) : (
            <div />
          )}

          <Button
            variant={isCompleted ? "secondary" : "default"}
            size="sm"
            onClick={toggleComplete}
            className="gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCompleted ? "Completado ✓" : "Marcar como Completado"}</span>
          </Button>

          {nextTopicId ? (
            <Link href={`/courses/${courseId}/study/${nextTopicId}`}>
              <Button variant="outline" size="sm" className="gap-2">
                <span>Siguiente Tema</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          ) : (
            <Link href={`/courses/${courseId}/quiz`}>
              <Button variant="outline" size="sm" className="gap-2 text-indigo-600">
                <span>Ir al Banco de Test</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          )}
        </div>

      </div>

    </article>
  );
}
